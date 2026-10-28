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

// Bump when the shape of the mock data changes; older data is reseeded once
const DATA_VERSION = 2;
const DATA_VERSION_KEY = 'fitRewardDataVersion';

// Map deviceId to schema property name
const DEVICE_KEY_MAP = {
  apple: 'appleHealth',
  google: 'googleHealthConnect',
  garmin: 'garminConnect',
  other: 'otherWearables'
};

// Shown when no account name is available (the site owner)
const DEFAULT_USERNAME = 'Nguyễn Ngọc Phương Anh';

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
  return (email && getUser(email)) || { username: DEFAULT_USERNAME };
}

/**
 * Merges changes into the logged-in user and returns the updated user.
 */
function updateCurrentUser(changes) {
  const email = getCurrentEmail();
  const user = { ...getCurrentUser(), ...changes };
  if (email) saveUser(email, user);
  return user;
}

function deleteCurrentUser() {
  const email = getCurrentEmail();
  if (email) localStorage.removeItem(email);
  clearCurrentEmail();
}

// Older accounts have no device flags at all; those count as connected
function isDeviceConnected(user, deviceId) {
  return user[DEVICE_KEY_MAP[deviceId]] !== false;
}

/**
 * Flips a device connection for the logged-in user and returns the new state.
 */
function toggleUserDevice(deviceId) {
  const user = getCurrentUser();
  const connected = !isDeviceConnected(user, deviceId);
  updateCurrentUser({ [DEVICE_KEY_MAP[deviceId]]: connected });
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

function defaultActivity() {
  return {
    todaySteps: 8420,
    calories: 412,
    activeMinutes: 45,
    dailyGoal: 10000,
    activeDayThreshold: 7000,
    streak: 5,
    streakTarget: 30,
    todayPoints: 60,
    dailyPointCap: 100,
    // Steps for the earlier days of this week, Monday first
    weekSteps: [7150, 9200, 8800, 7600, 6200, 10400]
  };
}

// Transactions store translation keys + raw params so they follow the active language
function defaultTransactions() {
  return [
    { id: 1, titleKey: 'tx.walk', params: { steps: 8420 }, timeKey: 'tx.time.today', timeParams: { min: 45 }, points: 50, statusKey: 'tx.status.onchain', category: 'walk' },
    { id: 2, titleKey: 'tx.run', params: { km: 5.2 }, timeKey: 'tx.time.todayAt', timeParams: { time: '06:10', min: 32 }, points: 10, statusKey: 'tx.status.onchain', category: 'run' },
    { id: 3, titleKey: 'tx.redeem', rewardId: 'cashMomo25', timeKey: 'tx.time.yesterdayAt', timeParams: { time: '20:15' }, points: -500, statusKey: 'tx.status.wallet', category: 'redeem' },
    { id: 4, titleKey: 'tx.walk', params: { steps: 7150 }, timeKey: 'tx.time.monday', timeParams: { min: 38 }, points: 50, statusKey: 'tx.status.onchain', category: 'walk' }
  ];
}

/**
 * Initializes standard FitReward mock data in localStorage if not already present.
 */
function initFitRewardStorage() {
  const outdated = Number(localStorage.getItem(DATA_VERSION_KEY)) !== DATA_VERSION;

  if (outdated || !localStorage.getItem('fitRewardActivity')) {
    localStorage.setItem('fitRewardActivity', JSON.stringify(defaultActivity()));
  }
  if (outdated || !localStorage.getItem('fitRewardPoints')) {
    localStorage.setItem('fitRewardPoints', JSON.stringify({ balance: 2450 }));
  }
  if (outdated || !localStorage.getItem('fitRewardTransactions')) {
    localStorage.setItem('fitRewardTransactions', JSON.stringify(defaultTransactions()));
  }
  localStorage.removeItem('fitRewardChallenges');
  localStorage.setItem(DATA_VERSION_KEY, String(DATA_VERSION));
}

function getActivity() {
  return { ...defaultActivity(), ...readJSON('fitRewardActivity', {}) };
}

function saveActivity(activity) {
  localStorage.setItem('fitRewardActivity', JSON.stringify(activity));
}

function getPoints() {
  return readJSON('fitRewardPoints', { balance: 2450 });
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
