/**
 * FitReward - Session & LocalStorage data models
 * Loaded in <head> on every page so the page guards can redirect before first paint.
 */

const PAGES = {
  landing: 'index.html',
  login: 'login.html',
  register: 'register.html',
  dashboard: 'dashboard.html'
};

const ONBOARDING_STEP_KEY = 'fitRewardOnboardingStep';

// Map deviceId to schema property name
const DEVICE_KEY_MAP = {
  apple: 'appleHealth',
  google: 'googleHealthConnect',
  garmin: 'garminConnect',
  other: 'otherWearables'
};

// Translation keys for the seeded transactions (ids 1-3), used to migrate older untranslated data
const SEED_TX_KEYS = {
  1: { titleKey: 'tx.walk', timeKey: 'tx.walk.time' },
  2: { titleKey: 'tx.workout', timeKey: 'tx.workout.time' },
  3: { titleKey: 'tx.weekly', timeKey: 'tx.weekly.time' }
};

// =========================================================================
// 1. SESSION (remembered logins in localStorage, one-off logins in sessionStorage)
// =========================================================================

function getCurrentEmail() {
  return localStorage.getItem('currentEmail') || sessionStorage.getItem('currentEmail');
}

function setCurrentEmail(email, remember = true) {
  clearCurrentEmail();
  (remember ? localStorage : sessionStorage).setItem('currentEmail', email);
}

function clearCurrentEmail() {
  localStorage.removeItem('currentEmail');
  sessionStorage.removeItem('currentEmail');
}

function goTo(page) {
  window.location.href = PAGES[page];
}

// Page guards (called inline from <head>)
function requireSession() {
  if (!getCurrentEmail()) window.location.replace(PAGES.login);
}

function redirectIfLoggedIn() {
  if (getCurrentEmail() && !sessionStorage.getItem(ONBOARDING_STEP_KEY)) {
    window.location.replace(PAGES.dashboard);
  }
}

// =========================================================================
// 2. USERS (stored under their email key, as before)
// =========================================================================

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function getUser(email) {
  const user = readJSON(email, null);
  return user && typeof user === 'object' ? user : null;
}

function saveUser(email, user) {
  localStorage.setItem(email, JSON.stringify(user));
}

function getCurrentUser() {
  const email = getCurrentEmail();
  return (email && getUser(email)) || { username: 'Tim Cook' };
}

// Older accounts have no device flags at all; those count as connected
function isDeviceConnected(user, deviceId) {
  return user[DEVICE_KEY_MAP[deviceId]] !== false;
}

/**
 * Flips a device connection for the logged-in user and returns the new state.
 */
function toggleUserDevice(deviceId) {
  const email = getCurrentEmail() || 'demo@fitreward.vn';
  const user = getUser(email) || {};
  const connected = !isDeviceConnected(user, deviceId);
  user[DEVICE_KEY_MAP[deviceId]] = connected;
  saveUser(email, user);
  return connected;
}

/**
 * Finds the email key of the user whose stored phone matches (phones are stored as 0xxxxxxxxx).
 */
function findEmailByPhone(phone) {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key.includes('@')) continue;
    const user = getUser(key);
    if (user && user.phone === phone) return key;
  }
  return null;
}

// =========================================================================
// 3. FITREWARD MOCK DATA
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
    localStorage.setItem('fitRewardPoints', JSON.stringify({ balance: 850 }));
  }

  // Transactions store translation keys instead of display text so they follow the active language
  const txList = readJSON('fitRewardTransactions', null);
  if (!txList) {
    const defaultTransactions = [
      { id: 1, titleKey: 'tx.walk', timeKey: 'tx.walk.time', points: 100, type: 'earn', category: 'walk' },
      { id: 2, titleKey: 'tx.workout', timeKey: 'tx.workout.time', points: 50, type: 'earn', category: 'workout' },
      { id: 3, titleKey: 'tx.weekly', timeKey: 'tx.weekly.time', points: 300, type: 'earn', category: 'challenge' }
    ];
    localStorage.setItem('fitRewardTransactions', JSON.stringify(defaultTransactions));
  } else {
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

function getActivity() {
  return readJSON('fitRewardActivity', { todaySteps: 7240, dailyGoal: 7000, activeMinutes: 42, currentStreak: 6, weeklyChart: [] });
}

function saveActivity(activity) {
  localStorage.setItem('fitRewardActivity', JSON.stringify(activity));
}

function getPoints() {
  return readJSON('fitRewardPoints', { balance: 850 });
}

function savePoints(points) {
  localStorage.setItem('fitRewardPoints', JSON.stringify(points));
}

function getTransactions() {
  return readJSON('fitRewardTransactions', []);
}

function addTransaction(tx) {
  const txList = getTransactions();
  txList.unshift({ id: Date.now(), ...tx });
  localStorage.setItem('fitRewardTransactions', JSON.stringify(txList));
}
