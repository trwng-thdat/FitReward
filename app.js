/**
 * FitReward - Application Controller & Fintech Dashboard Engine
 * Handles Authentication, LocalStorage Data Models, Real-time Dashboard Sync,
 * Navigation Tabs, Device Status, and Rewards Redemption.
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
      activeMinutesChange: '+12% vs last week',
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
      balance: 850,
      weeklyEarnings: '+150 this week'
    };
    localStorage.setItem('fitRewardPoints', JSON.stringify(defaultPoints));
  }

  if (!localStorage.getItem('fitRewardChallenges')) {
    const defaultChallenges = [
      {
        id: 'daily-steps',
        title: 'Walk 7,000 steps',
        subtitle: 'Complete your daily step milestone to earn FitPoints.',
        current: 7240,
        goal: 7000,
        pct: 100,
        rewardPoints: 100,
        status: 'Completed',
        claimed: false
      },
      {
        id: 'weekly-streak',
        title: '7-Day Walking Challenge',
        subtitle: 'Maintain a 7-day active walking streak.',
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

  if (!localStorage.getItem('fitRewardTransactions')) {
    const defaultTransactions = [
      { id: 1, title: 'Walking — 7,000 steps', time: 'Today, 18:30 • Verified Sensor', points: 100, type: 'earn', category: 'walk' },
      { id: 2, title: 'Workout — 30 minutes', time: 'Yesterday, 07:15 • Heart Rate Log', points: 50, type: 'earn', category: 'workout' },
      { id: 3, title: 'Weekly Challenge', time: '3 days ago • Milestone Streak', points: 300, type: 'earn', category: 'challenge' }
    ];
    localStorage.setItem('fitRewardTransactions', JSON.stringify(defaultTransactions));
  }
}

// =========================================================================
// 2. VIEW SWITCHER (AUTH VIEW vs AUTHENTICATED DASHBOARD SHELL)
// =========================================================================

/**
 * Toggles visibility between the split-screen authentication view and the authenticated dashboard shell.
 */
function setAppView(viewType) {
  const authLayout = document.getElementById('auth-app-view');
  const dashboardLayout = document.getElementById('app-dashboard-layout');

  if (viewType === 'dashboard') {
    if (authLayout) {
      authLayout.classList.add('hidden');
      authLayout.style.display = 'none';
    }
    if (dashboardLayout) {
      dashboardLayout.classList.remove('hidden');
      dashboardLayout.style.display = 'flex';
    }
    renderDashboard();
  } else {
    if (dashboardLayout) {
      dashboardLayout.classList.add('hidden');
      dashboardLayout.style.display = 'none';
    }
    if (authLayout) {
      authLayout.classList.remove('hidden');
      authLayout.style.display = 'flex';
    }
  }
}

// =========================================================================
// 3. AUTHENTICATION & ONBOARDING ROUTING
// =========================================================================

let currentScreen = 'welcome';

function navigateTo(screenName) {
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
    footerText.textContent = 'Have an account?';
    footerActionBtn.textContent = 'Sign in';
  } else if (screenName === 'login') {
    footerContainer.style.display = 'block';
    footerText.textContent = "Don't have an account?";
    footerActionBtn.textContent = 'Sign up';
  } else if (screenName === 'welcome') {
    footerContainer.style.display = 'block';
    footerText.textContent = 'Already have an account?';
    footerActionBtn.textContent = 'Sign in';
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
    buttonEl.setAttribute('aria-label', 'Ẩn mật khẩu');
  } else {
    buttonEl.innerHTML = `
      <svg class="eye-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
    buttonEl.setAttribute('aria-label', 'Hiển thị mật khẩu');
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
    showInputError('reg-name', 'reg-name-error', 'Vui lòng nhập họ và tên của bạn');
    hasError = true;
  }

  if (!email) {
    showInputError('reg-email', 'reg-email-error', 'Vui lòng nhập địa chỉ email');
    hasError = true;
  } else if (!EMAIL_REGEX.test(email)) {
    showInputError('reg-email', 'reg-email-error', 'Email không đúng định dạng (vd: user@example.com)');
    hasError = true;
  }

  if (!password) {
    showInputError('reg-password', 'reg-password-error', 'Vui lòng nhập mật khẩu');
    hasError = true;
  } else if (password.length < 6) {
    showInputError('reg-password', 'reg-password-error', 'Mật khẩu phải từ 6 ký tự trở lên');
    hasError = true;
  }

  if (hasError) return;

  const existingUser = localStorage.getItem(email);
  if (existingUser) {
    showInputError('reg-email', 'reg-email-error', 'Email này đã được sử dụng!');
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

    showToast('Đăng ký tài khoản thành công!', 'success');
    document.getElementById('register-form').reset();

    // Immediately open authenticated dashboard
    setAppView('dashboard');
  } catch (error) {
    showToast('Lỗi khi lưu trữ dữ liệu cục bộ.', 'error');
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
    showInputError('login-email', 'login-email-error', 'Vui lòng nhập email');
    hasError = true;
  } else if (!EMAIL_REGEX.test(email)) {
    showInputError('login-email', 'login-email-error', 'Email không đúng định dạng');
    hasError = true;
  }

  if (!password) {
    showInputError('login-password', 'login-password-error', 'Vui lòng nhập mật khẩu');
    hasError = true;
  }

  if (hasError) return;

  const rawData = localStorage.getItem(email);

  if (!rawData) {
    showInputError('login-email', 'login-email-error', 'Tài khoản không tồn tại trên hệ thống!');
    showToast('Tài khoản hoặc mật khẩu không đúng!', 'error');
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
    showInputError('login-password', 'login-password-error', 'Mật khẩu không chính xác!');
    showToast('Mật khẩu không chính xác!', 'error');
    return;
  }

  localStorage.setItem('currentEmail', email);
  showToast(`Xin chào, ${storedUsername}!`, 'success');

  document.getElementById('login-form').reset();
  setAppView('dashboard');
}

function handleLogout() {
  localStorage.removeItem('currentEmail');
  showToast('Đã đăng xuất thành công.', 'info');
  navigateTo('welcome');
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
    showToast(`Đã ngắt kết nối với ${deviceTitle}.`, 'info');
  } else {
    userObject[propKey] = true;
    showToast(`Kết nối thành công với ${deviceTitle}!`, 'success');
  }

  localStorage.setItem(currentEmail, JSON.stringify(userObject));
  renderUserDeviceStates();
  renderDashboard();
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
      if (isConnected) {
        row.classList.add('connected');
        statusEl.textContent = 'Đã kết nối';
        btn.textContent = 'Connected';
      } else {
        row.classList.remove('connected');
        statusEl.textContent = 'Chưa kết nối';
        btn.textContent = 'Connect';
      }
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
    kpiPoints.innerHTML = `${pointsData.balance.toLocaleString()} <span class="sc-unit">PTS</span>`;
  }

  const kpiSteps = document.getElementById('kpi-steps');
  if (kpiSteps) {
    kpiSteps.innerHTML = `${activityData.todaySteps.toLocaleString()} <span class="sc-goal">/ ${activityData.dailyGoal.toLocaleString()}</span>`;
  }

  const kpiActiveMin = document.getElementById('kpi-active-min');
  if (kpiActiveMin) {
    kpiActiveMin.innerHTML = `${activityData.activeMinutes} <span class="sc-unit">min</span>`;
  }

  const kpiStreak = document.getElementById('kpi-streak');
  if (kpiStreak) {
    kpiStreak.innerHTML = `🔥 ${activityData.currentStreak} <span class="sc-unit">days</span>`;
  }

  // 3. Activity Overview
  const todayStepsLabel = document.getElementById('chart-today-steps');
  const dailyGoalLabel = document.getElementById('chart-daily-goal');
  if (todayStepsLabel) todayStepsLabel.textContent = `${activityData.todaySteps.toLocaleString()} steps today`;
  if (dailyGoalLabel) dailyGoalLabel.textContent = `Goal: ${activityData.dailyGoal.toLocaleString()} steps`;

  // 4. Today's Challenge progress
  const tcVal = document.getElementById('today-challenge-val');
  if (tcVal) tcVal.textContent = `${activityData.todaySteps.toLocaleString()} / ${activityData.dailyGoal.toLocaleString()} steps`;

  // 5. Health Data sync badges on Dashboard
  const appleBadge = document.getElementById('dash-device-apple');
  const googleBadge = document.getElementById('dash-device-google');
  const garminBadge = document.getElementById('dash-device-garmin');

  if (appleBadge) {
    const isConn = currentUser.appleHealth !== false;
    appleBadge.textContent = isConn ? '✓ Connected' : 'Not Connected';
    appleBadge.className = isConn ? 'sync-badge' : 'sync-badge pending';
  }
  if (googleBadge) {
    const isConn = currentUser.googleHealthConnect !== false;
    googleBadge.textContent = isConn ? '✓ Connected' : 'Not Connected';
    googleBadge.className = isConn ? 'sync-badge' : 'sync-badge pending';
  }
  if (garminBadge) {
    const isConn = currentUser.garminConnect !== false;
    garminBadge.textContent = isConn ? '✓ Connected' : 'Not Connected';
    garminBadge.className = isConn ? 'sync-badge' : 'sync-badge pending';
  }
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
    title: 'Daily Challenge — 7,000 steps',
    time: 'Just now • Verified Sensor',
    points: 100,
    type: 'earn',
    category: 'walk'
  });
  localStorage.setItem('fitRewardTransactions', JSON.stringify(txList));

  showToast('Đã nhận thưởng +100 FitPoints cho hôm nay!', 'success');
  renderDashboard();
}

// Reward Redemption Action Flow
function handleRedeemReward(rewardType, cost, title) {
  const pointsData = JSON.parse(localStorage.getItem('fitRewardPoints') || '{"balance": 850}');

  if (pointsData.balance < cost) {
    showToast(`Bạn cần tối thiểu ${cost} FitPoints để đổi ${title}. (Hiện có: ${pointsData.balance} PTS)`, 'error');
    return;
  }

  // Deduct points
  pointsData.balance -= cost;
  localStorage.setItem('fitRewardPoints', JSON.stringify(pointsData));

  // Add redemption log to transactions
  const txList = JSON.parse(localStorage.getItem('fitRewardTransactions') || '[]');
  txList.unshift({
    id: Date.now(),
    title: `Đổi quà: ${title}`,
    time: 'Vừa xong • Đã duyệt hoàn tiền',
    points: -cost,
    type: 'redeem',
    category: 'reward'
  });
  localStorage.setItem('fitRewardTransactions', JSON.stringify(txList));

  showToast(`Đổi quà thành công! Đã quy đổi ${cost} FitPoints cho ${title}.`, 'success');
  renderDashboard();
}

// =========================================================================
// 7. SIDEBAR NAVIGATION & SUBPAGES
// =========================================================================

function switchTab(tabName) {
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
    if (pageTitle) pageTitle.textContent = 'Dashboard';
    if (dashContent) dashContent.classList.remove('hidden');
    if (subpageContainer) subpageContainer.classList.add('hidden');
    renderDashboard();
    return;
  }

  // Subpage rendering
  if (dashContent) dashContent.classList.add('hidden');
  if (subpageContainer) subpageContainer.classList.remove('hidden');

  let title = 'Section';
  let html = '';

  if (tabName === 'activity') {
    title = 'Activity Details';
    const activityData = JSON.parse(localStorage.getItem('fitRewardActivity') || '{}');
    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">Chi Tiết Hoạt Động & Bước Chân</h2>
            <p class="card-desc">Dữ liệu đồng bộ trực tiếp từ Apple Health & Garmin</p>
          </div>
          <button class="btn btn-primary btn-sm" onclick="showToast('Đang quét cảm biến thiết bị...', 'info')">Đồng bộ ngay</button>
        </div>
        <div class="summary-cards-grid">
          <div class="summary-card">
            <span class="sc-label">Hôm nay</span>
            <div class="sc-value text-blue">${activityData.todaySteps?.toLocaleString() || 7240} bước</div>
          </div>
          <div class="summary-card">
            <span class="sc-label">Cự ly ước tính</span>
            <div class="sc-value">5.4 km</div>
          </div>
          <div class="summary-card">
            <span class="sc-label">Calo tiêu hao</span>
            <div class="sc-value">340 kcal</div>
          </div>
          <div class="summary-card">
            <span class="sc-label">Thời gian vận động</span>
            <div class="sc-value">42 phút</div>
          </div>
        </div>
      </div>
    `;
  } else if (tabName === 'rewards') {
    title = 'Rewards Catalog';
    const pointsData = JSON.parse(localStorage.getItem('fitRewardPoints') || '{"balance":850}');
    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">Kho Phần Thưởng FitReward</h2>
            <p class="card-desc">Số dư khả dụng: <strong class="text-blue">${pointsData.balance} PTS</strong></p>
          </div>
        </div>
        <div class="reward-cards-column">
          <div class="reward-item-row">
            <div class="reward-icon-box bg-green-soft">₫</div>
            <div class="reward-meta">
              <div class="reward-name">₫20,000 Cashback Ví MoMo</div>
              <div class="reward-cost">500 FitPoints • Rút tiền tức thì</div>
            </div>
            <button class="btn-reward-action" onclick="handleRedeemReward('cashback', 500, '₫20,000 Cashback MoMo')">Redeem</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-green-soft">₫</div>
            <div class="reward-meta">
              <div class="reward-name">₫50,000 Cashback Chuyển Khoản VietQR</div>
              <div class="reward-cost">1,200 FitPoints • Ngân hàng liên kết</div>
            </div>
            <button class="btn-reward-action" onclick="handleRedeemReward('cashback50', 1200, '₫50,000 VietQR')">Redeem</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-blue-soft">🏋️</div>
            <div class="reward-meta">
              <div class="reward-name">Vé Tập Gym 1 Ngày (California / CityGym)</div>
              <div class="reward-cost">300 FitPoints • Mã QR tại quầy</div>
            </div>
            <button class="btn-reward-action" onclick="handleRedeemReward('gym', 300, 'Vé Gym 1 Ngày')">Redeem</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-purple-soft">🛡️</div>
            <div class="reward-meta">
              <div class="reward-name">Voucher Giảm 10% Phí Bảo Hiểm Bảo Việt</div>
              <div class="reward-cost">1,000 FitPoints • Hợp đồng mới hoặc tái tục</div>
            </div>
            <button class="btn-reward-action btn-outline-action" onclick="handleRedeemReward('insurance', 1000, 'Voucher Bảo Hiểm Bảo Việt')">View</button>
          </div>
        </div>
      </div>
    `;
  } else if (tabName === 'challenges') {
    title = 'Challenges & Goals';
    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">Thử Thách Thể Chất FitReward</h2>
            <p class="card-desc">Hoàn thành thử thách để nhận FitPoints và duy trì chuỗi Streak</p>
          </div>
        </div>
        <div class="reward-cards-column">
          <div class="reward-item-row">
            <div class="reward-icon-box bg-green-soft">✓</div>
            <div class="reward-meta">
              <div class="reward-name">Mục Tiêu Ngày: Đi bộ 7,000 bước</div>
              <div class="reward-cost">Đã đạt 7,240 / 7,000 bước • Thưởng +100 FitPoints</div>
            </div>
            <button class="btn btn-sm btn-outline-success" onclick="claimDailyReward()">Nhận Thưởng</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-blue-soft">🔥</div>
            <div class="reward-meta">
              <div class="reward-name">Thử Thách 7 Ngày Liên Tục (Streak Master)</div>
              <div class="reward-cost">Tiến độ: 5 / 7 ngày • Thưởng +300 FitPoints</div>
            </div>
            <button class="btn btn-sm btn-primary" onclick="showToast('Tiếp tục duy trì bước chân hôm nay để chạm mốc 7 ngày!', 'info')">Tiếp Tục</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-purple-soft">👥</div>
            <div class="reward-meta">
              <div class="reward-name">Thử Thách Gia Đình: 50,000 Bước / Tuần</div>
              <div class="reward-cost">Tham gia cùng các thành viên • Thưởng +500 FitPoints</div>
            </div>
            <button class="btn btn-sm btn-outline" onclick="showToast('Đã mời các thành viên gia đình tham gia!', 'success')">Tham Gia</button>
          </div>
        </div>
      </div>
    `;
  } else if (tabName === 'history') {
    title = 'Reward History';
    const txList = JSON.parse(localStorage.getItem('fitRewardTransactions') || '[]');
    const rowsHtml = txList.map(tx => `
      <div class="tx-row">
        <div class="tx-icon-box ${tx.type === 'redeem' ? 'bg-amber' : 'bg-blue'}">
          ${tx.type === 'redeem' ? '🎁' : '✓'}
        </div>
        <div class="tx-info">
          <div class="tx-title">${tx.title}</div>
          <div class="tx-time">${tx.time}</div>
        </div>
        <div class="tx-points ${tx.points > 0 ? 'positive' : ''}" style="${tx.points < 0 ? 'color: var(--color-danger);' : ''}">
          ${tx.points > 0 ? '+' + tx.points : tx.points}
        </div>
      </div>
    `).join('');

    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">Lịch Sử Nhận & Đổi Thưởng</h2>
            <p class="card-desc">Sổ cái ghi nhận điểm FitPoints minh bạch</p>
          </div>
        </div>
        <div class="transactions-list">
          ${rowsHtml || '<p>Chưa có giao dịch nào.</p>'}
        </div>
      </div>
    `;
  } else if (tabName === 'devices') {
    title = 'Manage Devices';
    const currentEmail = localStorage.getItem('currentEmail') || 'demo@fitreward.vn';
    const rawData = localStorage.getItem(currentEmail);
    let userObj = {};
    try { userObj = rawData ? JSON.parse(rawData) : {}; } catch(e){}

    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">Quản Lý Kết Nối Thiết Bị</h2>
            <p class="card-desc">Liên kết các cảm biến bước chân để tự động tính điểm</p>
          </div>
        </div>
        <div class="health-options">
          <div class="device-item ${userObj.appleHealth !== false ? 'connected' : ''}">
            <div class="d-icon apple-bg"></div>
            <div class="d-text">
              <div class="d-title">Apple Health</div>
              <div class="d-meta">${userObj.appleHealth !== false ? 'Đã kết nối' : 'Chưa kết nối'}</div>
            </div>
            <button class="btn-d-connect" onclick="handleToggleDevice('apple', 'Apple Health')">
              ${userObj.appleHealth !== false ? 'Connected' : 'Connect'}
            </button>
          </div>

          <div class="device-item ${userObj.googleHealthConnect !== false ? 'connected' : ''}">
            <div class="d-icon google-bg">G</div>
            <div class="d-text">
              <div class="d-title">Google Health Connect</div>
              <div class="d-meta">${userObj.googleHealthConnect !== false ? 'Đã kết nối' : 'Chưa kết nối'}</div>
            </div>
            <button class="btn-d-connect" onclick="handleToggleDevice('google', 'Google Health Connect')">
              ${userObj.googleHealthConnect !== false ? 'Connected' : 'Connect'}
            </button>
          </div>

          <div class="device-item ${userObj.garminConnect !== false ? 'connected' : ''}">
            <div class="d-icon garmin-bg">▲</div>
            <div class="d-text">
              <div class="d-title">Garmin Connect</div>
              <div class="d-meta">${userObj.garminConnect !== false ? 'Đã kết nối' : 'Chưa kết nối'}</div>
            </div>
            <button class="btn-d-connect" onclick="handleToggleDevice('garmin', 'Garmin Connect')">
              ${userObj.garminConnect !== false ? 'Connected' : 'Connect'}
            </button>
          </div>
        </div>
      </div>
    `;
  } else if (tabName === 'profile') {
    title = 'User Profile';
    const currentEmail = localStorage.getItem('currentEmail') || 'tim.cook@apple.com';
    let userObj = { username: 'Tim Cook' };
    try { userObj = JSON.parse(localStorage.getItem(currentEmail)) || userObj; } catch(e){}

    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">Hồ Sơ Người Dùng</h2>
            <p class="card-desc">Thông tin tài khoản FitReward cá nhân</p>
          </div>
          <button class="btn btn-outline btn-sm" onclick="handleLogout()">Đăng Xuất</button>
        </div>
        <div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px;">
          <div class="user-avatar" style="width: 64px; height: 64px; font-size: 24px;">TC</div>
          <div>
            <h3 style="font-size: 18px; font-weight: 800;">${userObj.username || 'Tim Cook'}</h3>
            <p style="color: var(--color-text-muted); font-size: 13px;">${currentEmail}</p>
            <span class="card-badge-pill green" style="margin-top: 6px; display: inline-block;">FitReward Plus Member</span>
          </div>
        </div>
      </div>
    `;
  } else {
    title = tabName.charAt(0).toUpperCase() + tabName.slice(1);
    html = `
      <div class="subpage-card">
        <h2 class="card-title">${title}</h2>
        <p class="card-desc">Nội dung đang được cập nhật trong phiên bản tiếp theo.</p>
      </div>
    `;
  }

  if (pageTitle) pageTitle.textContent = title;
  if (subpageContainer) subpageContainer.innerHTML = html;
}

// =========================================================================
// 8. LIFECYCLE & DOMContentLoaded INITIALIZATION
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initFitRewardStorage();

  // Check if a user is currently logged in via currentEmail
  const activeEmail = localStorage.getItem('currentEmail');

  if (activeEmail) {
    // If user is logged in, immediately open the authenticated fintech dashboard
    setAppView('dashboard');
  } else {
    // If not logged in, show the clean split-screen welcome page
    setAppView('auth');
    navigateTo('welcome');
  }

  // Interactive Carousel Slider Dots for Auth Left Panel
  const dots = document.querySelectorAll('.dot-dash');
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      dots.forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
  });
});
