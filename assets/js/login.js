/**
 * FitReward - Login page
 * Sign in with email or phone number; "Remember me" decides where the session is kept.
 */

function handleLogin(event) {
  event.preventDefault();
  clearFormErrors();

  const identifier = document.getElementById('login-identifier').value.trim();
  const password = document.getElementById('login-password').value;
  const remember = document.getElementById('login-remember').checked;

  const isEmail = identifier.includes('@');
  const phone = isEmail ? '' : normalizePhone(identifier);

  let hasError = false;

  if (!identifier) {
    showInputError('login-identifier', t('err.identifierRequired'));
    hasError = true;
  } else if (isEmail ? !EMAIL_REGEX.test(identifier) : !PHONE_REGEX.test(phone)) {
    showInputError('login-identifier', t('err.identifierInvalid'));
    hasError = true;
  }

  if (!password) {
    showInputError('login-password', t('err.passwordRequired'));
    hasError = true;
  }

  if (hasError) return;

  const email = isEmail ? identifier.toLowerCase() : findEmailByPhone(phone);
  const rawData = email && localStorage.getItem(email);

  if (!rawData) {
    showInputError('login-identifier', t('err.accountNotFound'));
    showToast(t('toast.loginFailed'), 'error');
    return;
  }

  let storedPassword = '';
  let storedUsername = 'Tim Cook';

  try {
    const parsedData = JSON.parse(rawData);
    if (parsedData && typeof parsedData === 'object') {
      storedPassword = parsedData.password;
      storedUsername = parsedData.username || 'Tim Cook';
    }
  } catch (e) {
    const match = rawData.match(/^\[(.*)\]-\[(.*)\]$/);
    if (match) {
      storedPassword = match[1];
      storedUsername = match[2];
    }
  }

  if (password !== storedPassword) {
    showInputError('login-password', t('err.passwordWrong'));
    showToast(t('err.passwordWrong'), 'error');
    return;
  }

  setCurrentEmail(email, remember);
  sessionStorage.removeItem(ONBOARDING_STEP_KEY);
  queueToast('toast.welcome', { name: storedUsername });
  goTo('dashboard');
}

bootPage();
