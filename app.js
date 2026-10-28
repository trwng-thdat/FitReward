/**
 * FitReward - Application Controller & Fintech Dashboard Engine
 * Handles Landing / Auth / Dashboard views, LocalStorage Data Models, Real-time Dashboard Sync,
 * Navigation Tabs, Device Status, Rewards Redemption and Language switching (see i18n.js).
 */

// Simple Email Validation Regex conforming to standard email patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Map deviceId to schema property name
const DEVICE_KEY_MAP = {
  apple: 'appleHealth',
  google: 'googleHealthConnect',
  garmin: 'garminConnect',
  other: 'otherWearables'
};

// Transaction icons per category (dashboard feed)
const TX_ICONS = {
  walk: { bg: 'bg-blue', svg: '<polyline points="20 6 9 17 4 12"></polyline>' },
  workout: { bg: 'bg-purple', svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>' },
  challenge: { bg: 'bg-amber', svg: '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>' },
  reward: { bg: 'bg-amber', svg: '<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line>' }
};

// Translation keys for the seeded transactions (ids 1-3), used to migrate older untranslated data
const SEED_TX_KEYS = {
  1: { titleKey: 'tx.walk', timeKey: 'tx.walk.time' },
  2: { titleKey: 'tx.workout', timeKey: 'tx.workout.time' },
  3: { titleKey: 'tx.weekly', timeKey: 'tx.weekly.time' }
};

// =========================================================================
// 1. DATA MODELS & LOCALSTORAGE INITIALIZATION
// =========================================================================

/**
 * Initializes standard FitReward mock data in localStorage if not already present.
 */
function initFitRewardStorage() {
  if (!localStorage.getItem('fitRewardActivity')) {
    const defaultActivity = {
      todaySteps: 7240,
      dailyGoal: 7000,
      activeMinutes: 42,
      currentStreak: 6,
      weeklyChart: [
        { day: 'Mon', steps: 6100, height: 65 },
        { day: 'Tue', steps: 7400, height: 80 },
        { day: 'Wed', steps: 6800, height: 72 },
        { day: 'Thu', steps: 8200, height: 90 },
        { day: 'Fri', steps: 7100, height: 75 },
        { day: 'Sat', steps: 7900, height: 85 },
        { day: 'Sun', steps: 7240, height: 78, isToday: true }
      ]
    };
    localStorage.setItem('fitRewardActivity', JSON.stringify(defaultActivity));
  }

  if (!localStorage.getItem('fitRewardPoints')) {
    const defaultPoints = {
      balance: 850
    };
    localStorage.setItem('fitRewardPoints', JSON.stringify(defaultPoints));
  }

  if (!localStorage.getItem('fitRewardChallenges')) {
    const defaultChallenges = [
      {
        id: 'daily-steps',
        current: 7240,
        goal: 7000,
        pct: 100,
        rewardPoints: 100,
        status: 'Completed',
        claimed: false
      },
      {
        id: 'weekly-streak',
        current: 5,
        goal: 7,
        pct: 71,
        rewardPoints: 300,
        status: 'In Progress',
        claimed: false
      }
    ];
    localStorage.setItem('fitRewardChallenges', JSON.stringify(defaultChallenges));
  }

  // Transactions store translation keys instead of display text so they follow the active language
  const rawTransactions = localStorage.getItem('fitRewardTransactions');
  if (!rawTransactions) {
    const defaultTransactions = [
      { id: 1, titleKey: 'tx.walk', timeKey: 'tx.walk.time', points: 100, type: 'earn', category: 'walk' },
      { id: 2, titleKey: 'tx.workout', timeKey: 'tx.workout.time', points: 50, type: 'earn', category: 'workout' },
      { id: 3, titleKey: 'tx.weekly', timeKey: 'tx.weekly.time', points: 300, type: 'earn', category: 'challenge' }
    ];
    localStorage.setItem('fitRewardTransactions', JSON.stringify(defaultTransactions));
  } else {
    const txList = JSON.parse(rawTransactions);
    let migrated = false;
    txList.forEach(tx => {
      if (!tx.titleKey && SEED_TX_KEYS[tx.id]) {
        Object.assign(tx, SEED_TX_KEYS[tx.id]);
        migrated = true;
      }
    });
    if (migrated) localStorage.setItem('fitRewardTransactions', JSON.stringify(txList));
  }
}

function getTxTitle(tx) {
  if (!tx.titleKey) return tx.title;
  return t(tx.titleKey, { reward: tx.rewardId ? t(`reward.${tx.rewardId}.name`) : '' });
}

function getTxTime(tx) {
  return tx.timeKey ? t(tx.timeKey) : tx.time;
}

// =========================================================================
// 2. VIEW SWITCHER (LANDING vs AUTH VIEW vs AUTHENTICATED DASHBOARD SHELL)
// =========================================================================

/**
 * Shows exactly one of the three top-level views: 'landing', 'auth' or 'dashboard'.
 */
function setAppView(viewType) {
  const views = {
    landing: document.getElementById('landing-view'),
    auth: document.getElementById('auth-app-view'),
    dashboard: document.getElementById('app-dashboard-layout')
  };

  Object.keys(views).forEach(key => {
    if (views[key]) views[key].classList.toggle('hidden', key !== viewType);
  });

  currentView = viewType;
  window.scrollTo(0, 0);

  if (viewType === 'dashboard') {
    renderDashboard();
  }
}

// =========================================================================
// 3. AUTHENTICATION & ONBOARDING ROUTING
// =========================================================================

let currentView = 'landing';
let currentScreen = 'login';
let currentTab = 'dashboard';

function navigateTo(screenName) {
  if (screenName === 'landing') {
    setAppView('landing');
    return;
  }

  // If user requests dashboard, ensure authenticated view is displayed
  if (screenName === 'dashboard') {
    setAppView('dashboard');
    return;
  }

  // Otherwise, ensure split auth layout is active
  setAppView('auth');

  const screens = document.querySelectorAll('.auth-panel');
  screens.forEach(screen => screen.classList.remove('active'));

  clearFormErrors();

  const target = document.getElementById(`screen-${screenName}`);
  if (target) {
    target.classList.add('active');
    currentScreen = screenName;
  }

  if (screenName === 'connect-health') {
    renderUserDeviceStates();
  }

  updateFooterState(screenName);
}

function updateFooterState(screenName) {
  const footerContainer = document.getElementById('left-footer-links');
  const footerText = document.getElementById('footer-text');
  const footerActionBtn = document.getElementById('footer-action-btn');

  if (!footerContainer) return;

  if (screenName === 'register') {
    footerContainer.style.display = 'block';
    footerText.textContent = t('auth.footer.haveAccount');
    footerActionBtn.textContent = t('auth.footer.signIn');
  } else if (screenName === 'login') {
    footerContainer.style.display = 'block';
    footerText.textContent = t('auth.footer.noAccount');
    footerActionBtn.textContent = t('auth.footer.signUp');
  } else {
    footerContainer.style.display = 'none';
  }
}

function toggleAuthScreen() {
  if (currentScreen === 'login') {
    navigateTo('register');
  } else {
    navigateTo('login');
  }
}

function clearFormErrors() {
  const errorElements = document.querySelectorAll('.error-text');
  errorElements.forEach(el => el.textContent = '');

  const floatingBoxes = document.querySelectorAll('.floating-box');
  floatingBoxes.forEach(box => box.classList.remove('error'));
}

let toastTimer = null;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type}`;

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.className = 'toast hidden';
  }, 3200);
}

function togglePasswordVisibility(inputId, buttonEl) {
  const input = document.getElementById(inputId);
  if (!input) return;

  const isPassword = input.type === 'password';
  input.type = isPassword ? 'text' : 'password';

  if (isPassword) {
    buttonEl.innerHTML = `
      <svg class="eye-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
        <line x1="1" y1="1" x2="23" y2="23"></line>
      </svg>
    `;
    buttonEl.setAttribute('aria-label', t('aria.hidePassword'));
  } else {
    buttonEl.innerHTML = `
      <svg class="eye-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
    buttonEl.setAttribute('aria-label', t('aria.showPassword'));
  }
}

function showInputError(inputId, errorElId, message) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(errorElId);

  if (inputEl && inputEl.closest('.floating-box')) {
    inputEl.closest('.floating-box').classList.add('error');
  }
  if (errorEl) {
    errorEl.textContent = message;
  }
}

// =========================================================================
// 4. USER REGISTRATION & LOGIN HANDLERS
// =========================================================================

function handleRegister(event) {
  event.preventDefault();
  clearFormErrors();

  const nameInput = document.getElementById('reg-name');
  const emailInput = document.getElementById('reg-email');
  const passwordInput = document.getElementById('reg-password');

  const username = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  let hasError = false;

  if (!username) {
    showInputError('reg-name', 'reg-name-error', t('err.nameRequired'));
    hasError = true;
  }

  if (!email) {
    showInputError('reg-email', 'reg-email-error', t('err.emailRequired'));
    hasError = true;
  } else if (!EMAIL_REGEX.test(email)) {
    showInputError('reg-email', 'reg-email-error', t('err.emailInvalid'));
    hasError = true;
  }

  if (!password) {
    showInputError('reg-password', 'reg-password-error', t('err.passwordRequired'));
    hasError = true;
  } else if (password.length < 6) {
    showInputError('reg-password', 'reg-password-error', t('err.passwordShort'));
    hasError = true;
  }

  if (hasError) return;

  const existingUser = localStorage.getItem(email);
  if (existingUser) {
    showInputError('reg-email', 'reg-email-error', t('err.emailTaken'));
    return;
  }

  const userObject = {
    username: username,
    password: password,
    appleHealth: true,
    googleHealthConnect: true,
    garminConnect: true,
    otherWearables: false
  };

  try {
    localStorage.setItem(email, JSON.stringify(userObject));
    localStorage.setItem('currentEmail', email);

    showToast(t('toast.registerSuccess'), 'success');
    document.getElementById('register-form').reset();

    // Immediately open authenticated dashboard
    setAppView('dashboard');
  } catch (error) {
    showToast(t('toast.storageError'), 'error');
  }
}

function handleLogin(event) {
  event.preventDefault();
  clearFormErrors();

  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');

  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value;

  let hasError = false;

  if (!email) {
    showInputError('login-email', 'login-email-error', t('err.emailRequired'));
    hasError = true;
  } else if (!EMAIL_REGEX.test(email)) {
    showInputError('login-email', 'login-email-error', t('err.emailInvalid'));
    hasError = true;
  }

  if (!password) {
    showInputError('login-password', 'login-password-error', t('err.passwordRequired'));
    hasError = true;
  }

  if (hasError) return;

  const rawData = localStorage.getItem(email);

  if (!rawData) {
    showInputError('login-email', 'login-email-error', t('err.accountNotFound'));
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
    showInputError('login-password', 'login-password-error', t('err.passwordWrong'));
    showToast(t('err.passwordWrong'), 'error');
    return;
  }

  localStorage.setItem('currentEmail', email);
  showToast(t('toast.welcome', { name: storedUsername }), 'success');

  document.getElementById('login-form').reset();
  setAppView('dashboard');
}

function handleLogout() {
  localStorage.removeItem('currentEmail');
  showToast(t('toast.logout'), 'info');
  switchTab('dashboard');
  navigateTo('landing');
}

// =========================================================================
// 5. DEVICE CONNECTION LOGIC (PERSISTED PER USER)
// =========================================================================

function handleToggleDevice(deviceId, deviceTitle) {
  const currentEmail = localStorage.getItem('currentEmail') || 'demo@fitreward.vn';
  const rawData = localStorage.getItem(currentEmail);

  let userObject = {};
  try {
    userObject = rawData ? JSON.parse(rawData) : {};
  } catch (e) {
    userObject = {};
  }

  const propKey = DEVICE_KEY_MAP[deviceId] || deviceId;
  const isCurrentlyConnected = !!userObject[propKey];

  if (isCurrentlyConnected) {
    userObject[propKey] = false;
    showToast(t('toast.deviceDisconnected', { device: deviceTitle }), 'info');
  } else {
    userObject[propKey] = true;
    showToast(t('toast.deviceConnected', { device: deviceTitle }), 'success');
  }

  localStorage.setItem(currentEmail, JSON.stringify(userObject));
  renderUserDeviceStates();
  renderDashboard();
  if (currentTab === 'devices') switchTab('devices');
}

function renderUserDeviceStates() {
  const currentEmail = localStorage.getItem('currentEmail');
  if (!currentEmail) return;

  const rawData = localStorage.getItem(currentEmail);
  if (!rawData) return;

  let userObject = {};
  try {
    userObject = JSON.parse(rawData);
  } catch (e) {
    return;
  }

  Object.keys(DEVICE_KEY_MAP).forEach((deviceId) => {
    const propKey = DEVICE_KEY_MAP[deviceId];
    const isConnected = !!userObject[propKey];

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
// 6. DASHBOARD DATA RENDERING & REAL-TIME UPDATES
// =========================================================================

function renderDashboard() {
  // Ensure default storage structures exist
  initFitRewardStorage();

  const currentEmail = localStorage.getItem('currentEmail') || 'tim.cook@apple.com';
  let currentUser = { username: 'Tim Cook' };

  const rawUserData = localStorage.getItem(currentEmail);
  if (rawUserData) {
    try {
      currentUser = JSON.parse(rawUserData);
    } catch (e) {}
  }

  // 1. Top Header User Identity
  const userName = currentUser.username || 'Tim Cook';
  const nameEl = document.getElementById('topbar-user-name');
  const avatarEl = document.getElementById('topbar-avatar');

  if (nameEl) nameEl.textContent = userName;
  if (avatarEl) {
    const initials = userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    avatarEl.textContent = initials || 'TC';
  }

  // 2. Summary Cards Data
  const pointsData = JSON.parse(localStorage.getItem('fitRewardPoints') || '{"balance": 850}');
  const activityData = JSON.parse(localStorage.getItem('fitRewardActivity') || '{"todaySteps": 7240, "dailyGoal": 7000, "activeMinutes": 42, "currentStreak": 6}');

  const kpiPoints = document.getElementById('kpi-fitpoints');
  if (kpiPoints) {
    kpiPoints.innerHTML = `${formatNumber(pointsData.balance)} <span class="sc-unit">${t('unit.pts')}</span>`;
  }

  const kpiSteps = document.getElementById('kpi-steps');
  if (kpiSteps) {
    kpiSteps.innerHTML = `${formatNumber(activityData.todaySteps)} <span class="sc-goal">/ ${formatNumber(activityData.dailyGoal)}</span>`;
  }

  const kpiActiveMin = document.getElementById('kpi-active-min');
  if (kpiActiveMin) {
    kpiActiveMin.innerHTML = `${activityData.activeMinutes} <span class="sc-unit">${t('unit.min')}</span>`;
  }

  const kpiStreak = document.getElementById('kpi-streak');
  if (kpiStreak) {
    kpiStreak.innerHTML = `🔥 ${activityData.currentStreak} <span class="sc-unit">${t('unit.days')}</span>`;
  }

  // 3. Activity Overview
  const chartBars = document.getElementById('chart-bars');
  if (chartBars && Array.isArray(activityData.weeklyChart)) {
    chartBars.innerHTML = activityData.weeklyChart.map(bar => `
      <div class="bar-col ${bar.isToday ? 'today' : ''}">
        <div class="bar-fill ${bar.isToday ? 'highlight' : ''}" style="height: ${bar.height}%;">
          <div class="bar-tooltip">${t('chart.stepsTooltip', { steps: formatNumber(bar.steps) })}</div>
        </div>
        <span class="bar-day">${t(`day.${bar.day.toLowerCase()}`)}</span>
      </div>
    `).join('');
  }

  const todayStepsLabel = document.getElementById('chart-today-steps');
  const dailyGoalLabel = document.getElementById('chart-daily-goal');
  if (todayStepsLabel) todayStepsLabel.textContent = t('chart.todaySteps', { steps: formatNumber(activityData.todaySteps) });
  if (dailyGoalLabel) dailyGoalLabel.textContent = t('chart.goal', { goal: formatNumber(activityData.dailyGoal) });

  // 4. Today's Challenge progress
  const tcVal = document.getElementById('today-challenge-val');
  if (tcVal) {
    tcVal.textContent = t('challenge.progress', {
      current: formatNumber(activityData.todaySteps),
      goal: formatNumber(activityData.dailyGoal)
    });
  }

  // 5. FitPoints Activity feed (latest 3 transactions)
  const txContainer = document.getElementById('transactions-list-container');
  if (txContainer) {
    const txList = JSON.parse(localStorage.getItem('fitRewardTransactions') || '[]');
    txContainer.innerHTML = txList.slice(0, 3).map(tx => {
      const icon = TX_ICONS[tx.category] || TX_ICONS.walk;
      const isEarn = tx.points > 0;
      return `
        <div class="tx-row">
          <div class="tx-icon-box ${icon.bg}">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">${icon.svg}</svg>
          </div>
          <div class="tx-info">
            <div class="tx-title">${getTxTitle(tx)}</div>
            <div class="tx-time">${getTxTime(tx)}</div>
          </div>
          <div class="tx-points ${isEarn ? 'positive' : ''}" style="${isEarn ? '' : 'color: var(--color-danger);'}">
            ${isEarn ? '+' + formatNumber(tx.points) : formatNumber(tx.points)}
          </div>
        </div>
      `;
    }).join('');
  }

  // 6. Health Data sync badges on Dashboard
  const syncBadges = {
    'dash-device-apple': currentUser.appleHealth,
    'dash-device-google': currentUser.googleHealthConnect,
    'dash-device-garmin': currentUser.garminConnect
  };

  Object.keys(syncBadges).forEach(badgeId => {
    const badge = document.getElementById(badgeId);
    if (!badge) return;
    const isConn = syncBadges[badgeId] !== false;
    badge.textContent = isConn ? t('sync.connected') : t('sync.notConnected');
    badge.className = isConn ? 'sync-badge' : 'sync-badge pending';
  });
}

// Claim Daily Challenge Reward (+100 FitPoints)
function claimDailyReward() {
  const pointsData = JSON.parse(localStorage.getItem('fitRewardPoints') || '{"balance": 850}');
  pointsData.balance += 100;
  localStorage.setItem('fitRewardPoints', JSON.stringify(pointsData));

  // Append new transaction to history
  const txList = JSON.parse(localStorage.getItem('fitRewardTransactions') || '[]');
  txList.unshift({
    id: Date.now(),
    titleKey: 'tx.daily',
    timeKey: 'tx.daily.time',
    points: 100,
    type: 'earn',
    category: 'walk'
  });
  localStorage.setItem('fitRewardTransactions', JSON.stringify(txList));

  showToast(t('toast.claimed'), 'success');
  renderDashboard();
}

// Reward Redemption Action Flow (rewardId maps to the reward.<id>.name translation)
function handleRedeemReward(rewardId, cost) {
  const pointsData = JSON.parse(localStorage.getItem('fitRewardPoints') || '{"balance": 850}');
  const rewardName = t(`reward.${rewardId}.name`);

  if (pointsData.balance < cost) {
    showToast(t('toast.notEnoughPoints', {
      cost: formatNumber(cost),
      reward: rewardName,
      balance: formatNumber(pointsData.balance)
    }), 'error');
    return;
  }

  // Deduct points
  pointsData.balance -= cost;
  localStorage.setItem('fitRewardPoints', JSON.stringify(pointsData));

  // Add redemption log to transactions
  const txList = JSON.parse(localStorage.getItem('fitRewardTransactions') || '[]');
  txList.unshift({
    id: Date.now(),
    titleKey: 'tx.redeem',
    timeKey: 'tx.redeem.time',
    rewardId: rewardId,
    points: -cost,
    type: 'redeem',
    category: 'reward'
  });
  localStorage.setItem('fitRewardTransactions', JSON.stringify(txList));

  showToast(t('toast.redeemSuccess', { cost: formatNumber(cost), reward: rewardName }), 'success');
  renderDashboard();
  if (currentTab === 'rewards') switchTab('rewards');
}

// =========================================================================
// 7. SIDEBAR NAVIGATION & SUBPAGES
// =========================================================================

function switchTab(tabName) {
  currentTab = tabName;

  // Update sidebar active highlights
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const targetNav = document.getElementById(`nav-${tabName}`);
  if (targetNav) targetNav.classList.add('active');

  // Update mobile bottom nav
  document.querySelectorAll('.m-nav-item').forEach(btn => btn.classList.remove('active'));

  const dashContent = document.getElementById('dashboard-tab-content');
  const subpageContainer = document.getElementById('subpage-container');
  const pageTitle = document.getElementById('page-title');

  if (tabName === 'dashboard') {
    if (pageTitle) pageTitle.textContent = t('page.dashboard');
    if (dashContent) dashContent.classList.remove('hidden');
    if (subpageContainer) subpageContainer.classList.add('hidden');
    renderDashboard();
    return;
  }

  // Subpage rendering
  if (dashContent) dashContent.classList.add('hidden');
  if (subpageContainer) subpageContainer.classList.remove('hidden');

  let title = t(`page.${tabName}`);
  let html = '';

  if (tabName === 'activity') {
    const activityData = JSON.parse(localStorage.getItem('fitRewardActivity') || '{}');
    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">${t('sp.activity.title')}</h2>
            <p class="card-desc">${t('sp.activity.desc')}</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="showToast(t('toast.syncing'), 'info')">${t('sp.activity.syncNow')}</button>
        </div>
        <div class="summary-cards-grid">
          <div class="summary-card">
            <span class="sc-label">${t('sp.activity.today')}</span>
            <div class="sc-value text-blue">${t('sp.activity.steps', { steps: formatNumber(activityData.todaySteps || 7240) })}</div>
          </div>
          <div class="summary-card">
            <span class="sc-label">${t('sp.activity.distance')}</span>
            <div class="sc-value">${formatNumber(5.4)} km</div>
          </div>
          <div class="summary-card">
            <span class="sc-label">${t('sp.activity.calories')}</span>
            <div class="sc-value">340 kcal</div>
          </div>
          <div class="summary-card">
            <span class="sc-label">${t('sp.activity.activeTime')}</span>
            <div class="sc-value">${t('sp.activity.minutes', { minutes: activityData.activeMinutes || 42 })}</div>
          </div>
        </div>
      </div>
    `;
  } else if (tabName === 'rewards') {
    const pointsData = JSON.parse(localStorage.getItem('fitRewardPoints') || '{"balance":850}');
    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">${t('sp.rewards.title')}</h2>
            <p class="card-desc">${t('sp.rewards.balance')} <strong class="text-blue">${formatNumber(pointsData.balance)} ${t('unit.pts')}</strong></p>
          </div>
        </div>
        <div class="reward-cards-column">
          <div class="reward-item-row">
            <div class="reward-icon-box bg-green-soft">₫</div>
            <div class="reward-meta">
              <div class="reward-name">${t('reward.cashbackMomo.name')}</div>
              <div class="reward-cost">${t('reward.cashbackMomo.cost')}</div>
            </div>
            <button class="btn-reward-action" onclick="handleRedeemReward('cashbackMomo', 500)">${t('btn.redeem')}</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-green-soft">₫</div>
            <div class="reward-meta">
              <div class="reward-name">${t('reward.cashback50.name')}</div>
              <div class="reward-cost">${t('reward.cashback50.cost')}</div>
            </div>
            <button class="btn-reward-action" onclick="handleRedeemReward('cashback50', 1200)">${t('btn.redeem')}</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-blue-soft">🏋️</div>
            <div class="reward-meta">
              <div class="reward-name">${t('reward.gymDay.name')}</div>
              <div class="reward-cost">${t('reward.gymDay.cost')}</div>
            </div>
            <button class="btn-reward-action" onclick="handleRedeemReward('gymDay', 300)">${t('btn.redeem')}</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-purple-soft">🛡️</div>
            <div class="reward-meta">
              <div class="reward-name">${t('reward.insuranceBaoViet.name')}</div>
              <div class="reward-cost">${t('reward.insuranceBaoViet.cost')}</div>
            </div>
            <button class="btn-reward-action btn-outline-action" onclick="handleRedeemReward('insuranceBaoViet', 1000)">${t('btn.view')}</button>
          </div>
        </div>
      </div>
    `;
  } else if (tabName === 'challenges') {
    const activityData = JSON.parse(localStorage.getItem('fitRewardActivity') || '{"todaySteps": 7240, "dailyGoal": 7000}');
    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">${t('sp.challenges.title')}</h2>
            <p class="card-desc">${t('sp.challenges.desc')}</p>
          </div>
        </div>
        <div class="reward-cards-column">
          <div class="reward-item-row">
            <div class="reward-icon-box bg-green-soft">✓</div>
            <div class="reward-meta">
              <div class="reward-name">${t('sp.challenges.daily.name')}</div>
              <div class="reward-cost">${t('sp.challenges.daily.meta', { current: formatNumber(activityData.todaySteps), goal: formatNumber(activityData.dailyGoal) })}</div>
            </div>
            <button class="btn btn-sm btn-outline-success" onclick="claimDailyReward()">${t('sp.challenges.claim')}</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-blue-soft">🔥</div>
            <div class="reward-meta">
              <div class="reward-name">${t('sp.challenges.streak.name')}</div>
              <div class="reward-cost">${t('sp.challenges.streak.meta')}</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="showToast(t('toast.streakKeepGoing'), 'info')">${t('sp.challenges.continue')}</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-purple-soft">👥</div>
            <div class="reward-meta">
              <div class="reward-name">${t('sp.challenges.family.name')}</div>
              <div class="reward-cost">${t('sp.challenges.family.meta')}</div>
            </div>
            <button class="btn btn-sm btn-outline" onclick="showToast(t('toast.familyInvited'), 'success')">${t('sp.challenges.join')}</button>
          </div>
        </div>
      </div>
    `;
  } else if (tabName === 'history') {
    const txList = JSON.parse(localStorage.getItem('fitRewardTransactions') || '[]');
    const rowsHtml = txList.map(tx => `
      <div class="tx-row">
        <div class="tx-icon-box ${tx.type === 'redeem' ? 'bg-amber' : 'bg-blue'}">
          ${tx.type === 'redeem' ? '🎁' : '✓'}
        </div>
        <div class="tx-info">
          <div class="tx-title">${getTxTitle(tx)}</div>
          <div class="tx-time">${getTxTime(tx)}</div>
        </div>
        <div class="tx-points ${tx.points > 0 ? 'positive' : ''}" style="${tx.points < 0 ? 'color: var(--color-danger);' : ''}">
          ${tx.points > 0 ? '+' + formatNumber(tx.points) : formatNumber(tx.points)}
        </div>
      </div>
    `).join('');

    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">${t('sp.history.title')}</h2>
            <p class="card-desc">${t('sp.history.desc')}</p>
          </div>
        </div>
        <div class="transactions-list">
          ${rowsHtml || `<p>${t('sp.history.empty')}</p>`}
        </div>
      </div>
    `;
  } else if (tabName === 'devices') {
    const currentEmail = localStorage.getItem('currentEmail') || 'demo@fitreward.vn';
    const rawData = localStorage.getItem(currentEmail);
    let userObj = {};
    try { userObj = rawData ? JSON.parse(rawData) : {}; } catch(e){}

    const devices = [
      { id: 'apple', title: 'Apple Health', connected: userObj.appleHealth !== false, iconClass: 'apple-bg', icon: '' },
      { id: 'google', title: 'Google Health Connect', connected: userObj.googleHealthConnect !== false, iconClass: 'google-bg', icon: 'G' },
      { id: 'garmin', title: 'Garmin Connect', connected: userObj.garminConnect !== false, iconClass: 'garmin-bg', icon: '▲' }
    ];

    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">${t('sp.devices.title')}</h2>
            <p class="card-desc">${t('sp.devices.desc')}</p>
          </div>
        </div>
        <div class="health-options">
          ${devices.map(device => `
            <div class="device-item ${device.connected ? 'connected' : ''}">
              <div class="d-icon ${device.iconClass}">${device.icon}</div>
              <div class="d-text">
                <div class="d-title">${device.title}</div>
                <div class="d-meta">${device.connected ? t('device.status.connected') : t('device.status.notConnected')}</div>
              </div>
              <button class="btn-d-connect" onclick="handleToggleDevice('${device.id}', '${device.title}')">
                ${device.connected ? t('device.btn.connected') : t('device.btn.connect')}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (tabName === 'profile') {
    const currentEmail = localStorage.getItem('currentEmail') || 'tim.cook@apple.com';
    let userObj = { username: 'Tim Cook' };
    try { userObj = JSON.parse(localStorage.getItem(currentEmail)) || userObj; } catch(e){}

    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">${t('sp.profile.title')}</h2>
            <p class="card-desc">${t('sp.profile.desc')}</p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="handleLogout()">${t('sp.profile.logout')}</button>
        </div>
        <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
          <div class="user-avatar" style="width: 64px; height: 64px; font-size: 24px;">TC</div>
          <div>
            <h3 style="font-size: 18px; font-weight: 800;">${userObj.username || 'Tim Cook'}</h3>
            <p style="color: var(--color-text-muted); font-size: 13px;">${currentEmail}</p>
            <span class="card-badge-pill green" style="margin-top: 6px; display: inline-block;">${t('sp.profile.member')}</span>
          </div>
        </div>
      </div>
    `;
  } else {
    html = `
      <div class="subpage-card">
        <h2 class="card-title">${title}</h2>
        <p class="card-desc">${t('sp.placeholder')}</p>
      </div>
    `;
  }

  if (pageTitle) pageTitle.textContent = title;
  if (subpageContainer) subpageContainer.innerHTML = html;
}

// =========================================================================
// 8. LANGUAGE SWITCHING
// =========================================================================

/**
 * Switches the UI language, persists the choice and re-renders dynamic content.
 */
function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;

  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  applyTranslations();

  updateFooterState(currentScreen);
  clearFormErrors();
  renderUserDeviceStates();

  if (currentView === 'dashboard') {
    switchTab(currentTab);
  }
}

// =========================================================================
// 9. LIFECYCLE & DOMContentLoaded INITIALIZATION
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initFitRewardStorage();
  applyTranslations();

  // Check if a user is currently logged in via currentEmail
  const activeEmail = localStorage.getItem('currentEmail');

  if (activeEmail) {
    // If user is logged in, immediately open the authenticated fintech dashboard
    setAppView('dashboard');
    switchTab('dashboard');
  } else {
    // If not logged in, show the public landing page
    setAppView('landing');
  }

  // Interactive Carousel Slider Dots for Auth Right Panel
  const dots = document.querySelectorAll('.dot-dash');
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
});
