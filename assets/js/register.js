/**
 * FitReward - Register page (3-step onboarding)
 * Step 1: create account → Step 2: connect health data → Step 3: set a daily goal.
 * The current step is kept in sessionStorage so a refresh resumes where the user left off.
 */

const REGISTER_STEPS = 3;

function showStep(step) {
  document.querySelectorAll('.auth-panel').forEach(panel => {
    panel.classList.toggle('active', Number(panel.dataset.step) === step);
  });

  document.querySelectorAll('.auth-step').forEach(item => {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle('is-active', itemStep === step);
    item.classList.toggle('is-done', itemStep < step);
    if (itemStep === step) item.setAttribute('aria-current', 'step');
    else item.removeAttribute('aria-current');
  });

  if (step > 1) {
    sessionStorage.setItem(ONBOARDING_STEP_KEY, String(step));
  }

  if (step === 2) renderDeviceStates();

  clearFormErrors();
  window.scrollTo({ top: 0 });
}

// =========================================================================
// STEP 1: ACCOUNT
// =========================================================================

function updateRegisterSubmitState() {
  const terms = document.getElementById('reg-terms');
  const submit = document.getElementById('reg-submit');
  if (terms && submit) submit.disabled = !terms.checked;
}

function handleRegister(event) {
  event.preventDefault();
  clearFormErrors();

  const username = document.getElementById('reg-name').value.trim();
  const email = document.getElementById('reg-email').value.trim().toLowerCase();
  const phoneInput = document.getElementById('reg-phone').value.trim();
  const phone = normalizePhone(phoneInput);
  const password = document.getElementById('reg-password').value;
  const acceptedTerms = document.getElementById('reg-terms').checked;

  let hasError = false;

  if (!username) {
    showInputError('reg-name', t('err.nameRequired'));
    hasError = true;
  }

  if (!email) {
    showInputError('reg-email', t('err.emailRequired'));
    hasError = true;
  } else if (!EMAIL_REGEX.test(email)) {
    showInputError('reg-email', t('err.emailInvalid'));
    hasError = true;
  }

  if (!phoneInput) {
    showInputError('reg-phone', t('err.phoneRequired'));
    hasError = true;
  } else if (!PHONE_REGEX.test(phone)) {
    showInputError('reg-phone', t('err.phoneInvalid'));
    hasError = true;
  }

  if (!password) {
    showInputError('reg-password', t('err.passwordRequired'));
    hasError = true;
  } else if (password.length < MIN_PASSWORD_LENGTH) {
    showInputError('reg-password', t('err.passwordShort'));
    hasError = true;
  }

  if (!acceptedTerms) {
    showToast(t('err.termsRequired'), 'error');
    hasError = true;
  }

  if (hasError) return;

  if (localStorage.getItem(email)) {
    showInputError('reg-email', t('err.emailTaken'));
    return;
  }

  if (findEmailByPhone(phone)) {
    showInputError('reg-phone', t('err.phoneTaken'));
    return;
  }

  // Devices start disconnected; step 2 lets the user connect them
  const userObject = {
    username: username,
    phone: phone,
    password: password,
    appleHealth: false,
    googleHealthConnect: false,
    garminConnect: false,
    otherWearables: false
  };

  try {
    saveUser(email, userObject);
    setCurrentEmail(email, true);
    document.getElementById('register-form').reset();
    updateRegisterSubmitState();

    showToast(t('toast.registerSuccess'), 'success');
    showStep(2);
  } catch (error) {
    showToast(t('toast.storageError'), 'error');
  }
}

// =========================================================================
// STEP 2: HEALTH DATA
// =========================================================================

function handleToggleDevice(deviceId, deviceTitle) {
  const isConnected = toggleUserDevice(deviceId);
  showToast(t(isConnected ? 'toast.deviceConnected' : 'toast.deviceDisconnected', { device: deviceTitle }), isConnected ? 'success' : 'info');
  renderDeviceStates();
}

function renderDeviceStates() {
  const user = getCurrentUser();

  Object.keys(DEVICE_KEY_MAP).forEach((deviceId) => {
    const isConnected = isDeviceConnected(user, deviceId);

    const row = document.getElementById(`device-row-${deviceId}`);
    const statusEl = document.getElementById(`status-${deviceId}`);
    const btn = document.getElementById(`btn-device-${deviceId}`);

    if (row && statusEl && btn) {
      const statusKey = isConnected ? 'device.status.connected' : 'device.status.notConnected';
      const btnKey = isConnected ? 'device.btn.connected' : 'device.btn.connect';
      row.classList.toggle('connected', isConnected);
      statusEl.dataset.i18n = statusKey;
      statusEl.textContent = t(statusKey);
      btn.dataset.i18n = btnKey;
      btn.textContent = t(btnKey);
    }
  });
}

// =========================================================================
// STEP 3: DAILY GOAL
// =========================================================================

function handleSetGoal(event) {
  event.preventDefault();

  const selected = document.querySelector('input[name="daily-goal"]:checked');
  const goal = Number(selected ? selected.value : 7000);

  const activity = getActivity();
  activity.dailyGoal = goal;
  saveActivity(activity);

  const email = getCurrentEmail();
  const user = getUser(email);
  if (user) saveUser(email, { ...user, dailyGoal: goal });

  sessionStorage.removeItem(ONBOARDING_STEP_KEY);
  queueToast('toast.goalSaved', { goal: formatNumber(goal) });
  goTo('dashboard');
}

bootPage(() => {
  // Resume onboarding after a refresh, otherwise start at step 1
  const savedStep = Number(sessionStorage.getItem(ONBOARDING_STEP_KEY));
  const step = getCurrentEmail() && savedStep >= 2 && savedStep <= REGISTER_STEPS ? savedStep : 1;
  showStep(step);
  updateRegisterSubmitState();
});
