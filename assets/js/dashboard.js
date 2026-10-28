/**
 * FitReward - Dashboard (Overview / Rewards / Challenges / Profile)
 * Each tab renders its page header and body from localStorage data;
 * the active tab is kept in the URL hash (dashboard.html#rewards).
 */

const TABS = ['overview', 'rewards', 'challenges', 'profile'];

// How long the one-time entrance animation classes stay on the shell
const ENTRANCE_DURATION = 1200;

// 1 FitPoint = 50đ
const POINT_VALUE_VND = 50;

// Active days needed per week to keep "Active member" status
const WEEKLY_ACTIVE_TARGET = 3;

const DEVICE_NAMES = {
  apple: 'Apple Health',
  google: 'Google Health Connect',
  garmin: 'Garmin Connect'
};

const REWARDS = [
  { id: 'cashMomo25', category: 'cashback', nameKey: 'reward.cashback.name', subKey: 'reward.sub.momo', value: 25000, cost: 500 },
  { id: 'cashZalo50', category: 'cashback', nameKey: 'reward.cashback.name', subKey: 'reward.sub.zalopay', value: 50000, cost: 1000 },
  { id: 'cash100', category: 'cashback', nameKey: 'reward.cashback.name', subKey: 'reward.sub.anyWallet', value: 100000, cost: 2000 },
  { id: 'coffee25', category: 'voucher', nameKey: 'reward.coffee.name', subKey: 'reward.sub.coffee', value: 25000, cost: 500 },
  { id: 'fnb50', category: 'voucher', nameKey: 'reward.fnb.name', subKey: 'reward.sub.fnb', value: 50000, cost: 1000 },
  { id: 'sport15', category: 'voucher', nameKey: 'reward.sport.name', subKey: 'reward.sub.sport', percent: 15, cost: 800 },
  // Unlocked by the 30-day health certificate (SBT)
  { id: 'insurance', category: 'insurance', nameKey: 'reward.insurance.name', subKey: 'reward.sub.insurance', locked: true }
];

const REWARD_FILTERS = ['all', 'cashback', 'voucher', 'insurance'];

const SUGGESTED_CHALLENGES = [
  { id: 'streak7', tagKey: 'ch.s1.tag', titleKey: 'ch.s1.title', points: 150 },
  { id: 'run10k', tagKey: 'ch.s2.tag', titleKey: 'ch.s2.title', points: 100 },
  { id: 'early30', tagKey: 'ch.s3.tag', titleKey: 'ch.s3.title', points: 80 }
];

// Mock family challenge: steps this week per member
const FAMILY_CHALLENGE = {
  goal: 50000,
  daysLeft: 4,
  members: [
    { key: 'you', steps: 12400 },
    { key: 'mom', steps: 10600 },
    { key: 'dad', steps: 8200 }
  ]
};

const ICON_PATHS = {
  pulse: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>',
  gift: '<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>',
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>',
  ticket: '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"></path><path d="M13 5v2"></path><path d="M13 17v2"></path><path d="M13 11v2"></path>',
  trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline>',
  users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>',
  flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path>',
  check: '<polyline points="20 6 9 17 4 12"></polyline>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line>'
};

let currentTab = 'overview';
let rewardFilter = 'all';
let selectedRewardId = 'cashMomo25';
let showAllActivity = false;

// =========================================================================
// 1. HELPERS
// =========================================================================

function icon(name, size = 18, strokeWidth = 2) {
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
}

// User-provided text (names, emails) is escaped before it goes into templates
function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

/**
 * Vietnamese names put the family name first: "Nguyễn Ngọc Phương Anh" → "Phương Anh".
 */
function greetingName(fullName) {
  const parts = fullName.trim().split(/\s+/);
  return parts.length >= 3 ? parts.slice(-2).join(' ') : fullName.trim();
}

function initials(fullName) {
  return greetingName(fullName).split(/\s+/).map(part => part[0]).join('').substring(0, 2).toUpperCase();
}

function maskPhone(phone) {
  return phone && phone.length >= 10 ? `${phone.slice(0, 2)}xx xxx ${phone.slice(-3)}` : '—';
}

function pointsLabel(points) {
  return t('unit.points', { n: formatNumber(points) });
}

function formatSignedPoints(points) {
  return points > 0 ? `+${formatNumber(points)}` : `−${formatNumber(Math.abs(points))}`;
}

function percent(value, total) {
  return Math.max(0, Math.min(100, Math.round((value / total) * 100)));
}

function formatParams(params = {}) {
  const formatted = {};
  Object.keys(params).forEach(key => {
    formatted[key] = typeof params[key] === 'number' ? formatNumber(params[key]) : params[key];
  });
  return formatted;
}

function findReward(id) {
  return REWARDS.find(reward => reward.id === id);
}

function rewardName(reward) {
  return t(reward.nameKey, { value: reward.value ? formatCurrency(reward.value) : '' });
}

function rewardValueLabel(reward) {
  return reward.percent ? t('rw.value.percent', { n: reward.percent }) : formatCurrency(reward.value);
}

function rewardIcon(reward) {
  if (reward.category === 'cashback') return { name: 'wallet', tone: 'mint' };
  if (reward.category === 'voucher') return { name: 'ticket', tone: 'mint' };
  return { name: 'shield', tone: 'navy-soft' };
}

function getTxTitle(tx) {
  if (!tx.titleKey) return tx.title || '';
  const reward = tx.rewardId && findReward(tx.rewardId);
  return t(tx.titleKey, { ...formatParams(tx.params), reward: reward ? rewardName(reward) : '' });
}

function getTxTime(tx) {
  return tx.timeKey ? t(tx.timeKey, formatParams(tx.timeParams)) : (tx.time || '');
}

function getDailyGoal(user, activity) {
  return user.dailyGoal || activity.dailyGoal;
}

function getSettings(user) {
  return { shareCert: true, personalized: true, dailyReminder: false, ...user.settings };
}

function getWallets(user) {
  return { momo: false, zalopay: false, ...user.wallets };
}

function deviceName(deviceId) {
  return deviceId === 'other' ? t('device.other') : DEVICE_NAMES[deviceId];
}

function syncTime() {
  return new Date().toLocaleTimeString(currentLang === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

/**
 * This week Monday → Sunday: earlier days come from activity.weekSteps, today from todaySteps.
 */
function getWeek(activity) {
  const todayIndex = (new Date().getDay() + 6) % 7;
  const dayKeys = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

  return dayKeys.map((dayKey, index) => {
    let state = 'future';
    if (index < todayIndex) {
      state = (activity.weekSteps[index] || 0) >= activity.activeDayThreshold ? 'done' : 'missed';
    } else if (index === todayIndex) {
      state = activity.todaySteps >= activity.activeDayThreshold ? 'today-done' : 'today';
    }
    return { label: t(`day.${dayKey}`), state };
  });
}

function referralLink() {
  const email = getCurrentEmail() || '';
  const code = email.split('@')[0].replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 10) || 'FITREWARD';
  return new URL(`register.html?ref=${code}`, window.location.href).href;
}

// =========================================================================
// 2. TAB: OVERVIEW
// =========================================================================

function renderOverview() {
  const user = getCurrentUser();
  const activity = getActivity();
  const balance = getPoints().balance;
  const goal = getDailyGoal(user, activity);
  const isActiveDay = activity.todaySteps >= activity.activeDayThreshold;
  const week = getWeek(activity);
  const activeDays = week.filter(day => day.state === 'done' || day.state === 'today-done').length;
  const weekReached = activeDays >= WEEKLY_ACTIVE_TARGET;
  const connectedDevice = Object.keys(DEVICE_KEY_MAP).find(deviceId => isDeviceConnected(user, deviceId));
  const name = greetingName(user.username || DEFAULT_USERNAME);
  const today = new Date().toLocaleDateString(currentLang === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  const head = `
    <div class="page-head-text">
      <span class="page-eyebrow">${today}</span>
      <h1 class="page-title">${t('ov.greeting', { name: escapeHtml(name) })}</h1>
    </div>
    <div class="page-head-actions">
      <button type="button" class="health-pill" onclick="switchTab('profile')">
        <span class="status-dot ${connectedDevice ? 'is-on' : ''}"></span>
        ${connectedDevice ? t('dash.deviceConnected', { device: deviceName(connectedDevice) }) : t('dash.noDevice')}
      </button>
      <button type="button" class="icon-btn" data-soon="toast.notification" title="${t('dash.notifications')}" aria-label="${t('dash.notifications')}">${icon('bell', 20)}</button>
      <button type="button" class="avatar" onclick="switchTab('profile')" aria-label="${t('nav.profile')}">${escapeHtml(initials(user.username || DEFAULT_USERNAME))}</button>
    </div>
  `;

  const txList = getTransactions();
  const visibleTx = showAllActivity ? txList : txList.slice(0, 4);
  const txRows = visibleTx.map(tx => `
    <li class="list-row">
      <span class="icon-box icon-box-mint">${icon(tx.category === 'redeem' ? 'gift' : 'pulse')}</span>
      <div class="list-main">
        <strong>${getTxTitle(tx)}</strong>
        <span>${getTxTime(tx)}</span>
      </div>
      <div class="list-side">
        <strong class="${tx.points > 0 ? 'text-positive' : ''}">${formatSignedPoints(tx.points)}</strong>
        <span>${tx.statusKey ? t(tx.statusKey) : ''}</span>
      </div>
    </li>
  `).join('');

  const suggestions = [
    { iconName: 'wallet', title: t('ov.suggest.cash', { value: formatCurrency(25000) }), sub: pointsLabel(500), action: "openReward('cashMomo25')" },
    { iconName: 'ticket', title: t('ov.suggest.coffee'), sub: pointsLabel(500), action: "openReward('coffee25')" },
    { iconName: 'trophy', title: t('ov.suggest.streak'), sub: t('ov.suggest.streakDesc'), action: "switchTab('challenges')" }
  ];

  const body = `
    <section class="ov-top">
      <article class="card">
        <div class="card-row">
          <span class="card-label">${t('ov.steps.title')}</span>
          <span class="chip chip-mint">${t('ov.steps.verified')}</span>
        </div>
        <div class="big-stat">
          <strong>${formatNumber(activity.todaySteps)}</strong>
          <span>/ ${formatNumber(goal)}</span>
        </div>
        <div class="progress"><span style="width: ${percent(activity.todaySteps, goal)}%"></span></div>
        <div class="stat-meta">
          <span>${t('ov.steps.kcal', { n: formatNumber(activity.calories) })}</span>
          <span>${t('ov.steps.minutes', { n: activity.activeMinutes })}</span>
        </div>
        <p class="stat-note ${isActiveDay ? 'is-ok' : ''}">
          ${isActiveDay ? icon('check', 16, 2.5) : ''}
          ${isActiveDay
            ? t('ov.steps.activeDay', { threshold: formatNumber(activity.activeDayThreshold) })
            : t('ov.steps.toActiveDay', { remaining: formatNumber(activity.activeDayThreshold - activity.todaySteps) })}
        </p>
      </article>

      <article class="card card-navy">
        <div class="card-row">
          <span class="card-label">${t('ov.points.title')}</span>
          <span class="card-hint">${t('ov.points.rate')}</span>
        </div>
        <div class="big-stat">
          <strong>${formatNumber(balance)}</strong>
          <span>${t('unit.pointsWord')}</span>
        </div>
        <p class="money">≈ ${formatCurrency(balance * POINT_VALUE_VND)}</p>
        <div class="card-row card-row-meta">
          <span>${t('ov.points.today', { n: activity.todayPoints })}</span>
          <span>${t('ov.points.cap', { n: activity.dailyPointCap })}</span>
        </div>
        <button type="button" class="pill-btn pill-btn-green pill-btn-block" onclick="switchTab('rewards')">${t('ov.points.cta')}</button>
      </article>

      <article class="card">
        <div class="card-row">
          <span class="card-label">${t('ov.streak.title')}</span>
          <span class="flame">${icon('flame', 20)}</span>
        </div>
        <div class="big-stat">
          <strong>${activity.streak}</strong>
          <span>${t('ov.streak.of', { n: activity.streakTarget })}</span>
        </div>
        <div class="progress progress-navy"><span style="width: ${percent(activity.streak, activity.streakTarget)}%"></span></div>
        <p class="card-text">${t('ov.streak.desc', { n: activity.streakTarget - activity.streak })}</p>
      </article>
    </section>

    <section class="card week-card">
      <div class="week-info">
        <h2 class="card-title">${t('ov.week.title')}</h2>
        <p class="card-text">${t('ov.week.desc', { n: WEEKLY_ACTIVE_TARGET })}</p>
        <p class="week-status ${weekReached ? 'is-ok' : ''}">
          ${t(weekReached ? 'ov.week.done' : 'ov.week.progress', { count: activeDays, target: WEEKLY_ACTIVE_TARGET })}
        </p>
      </div>
      <ol class="week-days">
        ${week.map(day => `
          <li class="week-day is-${day.state}">
            <span class="week-dot">${day.state === 'done' || day.state === 'today-done' ? icon('check', 16, 2.5) : ''}</span>
            <span class="week-label">${day.label}</span>
          </li>
        `).join('')}
      </ol>
    </section>

    <section class="ov-bottom">
      <article class="card">
        <div class="card-head">
          <h2 class="card-title">${t('ov.recent.title')}</h2>
          ${txList.length > 4 ? `<button type="button" class="link-btn" onclick="toggleAllActivity()">${t(showAllActivity ? 'ov.recent.less' : 'ov.recent.all')}</button>` : ''}
        </div>
        <ul class="list">${txRows}</ul>
      </article>

      <article class="card">
        <div class="card-head">
          <h2 class="card-title">${t('ov.suggest.title')}</h2>
          <button type="button" class="link-btn" onclick="switchTab('rewards')">${t('ov.suggest.all')}</button>
        </div>
        <div class="suggest-list">
          ${suggestions.map(item => `
            <button type="button" class="suggest-item" onclick="${item.action}">
              <span class="icon-box icon-box-navy">${icon(item.iconName)}</span>
              <span class="list-main">
                <strong>${item.title}</strong>
                <span>${item.sub}</span>
              </span>
            </button>
          `).join('')}
        </div>
      </article>
    </section>
  `;

  return { head, body };
}

function toggleAllActivity() {
  showAllActivity = !showAllActivity;
  render();
}

// =========================================================================
// 3. TAB: REWARDS
// =========================================================================

function renderRewards() {
  const user = getCurrentUser();
  const activity = getActivity();
  const balance = getPoints().balance;
  const visibleRewards = REWARDS.filter(reward => rewardFilter === 'all' || reward.category === rewardFilter);
  const selected = findReward(selectedRewardId);

  const head = `
    <div class="page-head-text">
      <h1 class="page-title">${t('rw.title')}</h1>
      <p class="page-subtitle">${t('rw.subtitle')}</p>
    </div>
    <div class="balance-pill">
      <span>${t('rw.balance')}</span>
      <strong>${pointsLabel(balance)}</strong>
      <em>≈ ${formatCurrency(balance * POINT_VALUE_VND)}</em>
    </div>
  `;

  const cards = visibleRewards.map(reward => {
    const rIcon = rewardIcon(reward);
    const missing = reward.cost - balance;
    const footer = reward.locked
      ? `<strong class="rw-cost is-muted">${t('rw.needSbt')}</strong><span>${t('rw.daysLeft', { n: activity.streakTarget - activity.streak })}</span>`
      : `<strong class="rw-cost">${pointsLabel(reward.cost)}</strong><span>${missing > 0 ? t('rw.missing', { n: formatNumber(missing) }) : t('rw.enough')}</span>`;

    return `
      <button type="button" class="rw-card ${reward.id === selectedRewardId ? 'is-selected' : ''} ${reward.locked ? 'is-locked' : ''}"
              onclick="selectReward('${reward.id}')" aria-pressed="${reward.id === selectedRewardId}">
        <span class="icon-box icon-box-${rIcon.tone}">${icon(rIcon.name)}</span>
        <strong class="rw-name">${rewardName(reward)}</strong>
        <span class="rw-sub">${t(reward.subKey)}</span>
        <span class="rw-footer">${footer}</span>
      </button>
    `;
  }).join('');

  let confirm = `<h2 class="card-title">${t('rw.confirm.title')}</h2><p class="card-text">${t('rw.confirm.empty')}</p>`;
  if (selected && !selected.locked) {
    const after = balance - selected.cost;
    const isCashback = selected.category === 'cashback';
    confirm = `
      <h2 class="card-title">${t('rw.confirm.title')}</h2>
      <div class="rw-selected">
        <strong>${rewardName(selected)}</strong>
        <span>${t(selected.subKey)}</span>
      </div>
      <dl class="rw-rows">
        <div><dt>${t('rw.confirm.value')}</dt><dd>${rewardValueLabel(selected)}</dd></div>
        <div><dt>${t('rw.confirm.cost')}</dt><dd>${pointsLabel(selected.cost)}</dd></div>
        <div class="rw-after">
          <dt>${t('rw.confirm.after')}</dt>
          <dd class="${after < 0 ? 'text-danger' : 'text-positive'}">${after < 0 ? t('rw.missing', { n: formatNumber(-after) }) : pointsLabel(after)}</dd>
        </div>
      </dl>
      ${isCashback ? `
        <div class="info-box ${user.ekycVerified ? 'is-done' : ''}">
          ${icon('user', 16)}
          <span>${t('rw.confirm.ekyc')}</span>
        </div>` : ''}
      <p class="rw-note">${t('rw.confirm.note')}</p>
      <button type="button" class="pill-btn pill-btn-navy pill-btn-block pill-btn-lg" onclick="confirmRedeem()" ${after < 0 ? 'disabled' : ''}>${t('rw.confirm.cta')}</button>
    `;
  }

  const body = `
    <div class="filter-chips" role="group">
      ${REWARD_FILTERS.map(filter => `
        <button type="button" class="filter-chip ${filter === rewardFilter ? 'is-active' : ''}" onclick="setRewardFilter('${filter}')" aria-pressed="${filter === rewardFilter}">
          ${t(`rw.filter.${filter}`)}
        </button>
      `).join('')}
    </div>
    <div class="rw-layout">
      <div class="rw-grid">${cards}</div>
      <aside class="card rw-confirm">${confirm}</aside>
    </div>
  `;

  return { head, body };
}

function setRewardFilter(filter) {
  rewardFilter = filter;
  render();
}

function selectReward(rewardId) {
  const reward = findReward(rewardId);
  if (!reward) return;
  if (reward.locked) {
    showToast(t('toast.sbtRequired'), 'info');
    return;
  }
  selectedRewardId = rewardId;
  render();
}

// Opens the rewards tab with a reward preselected (from the overview suggestions)
function openReward(rewardId) {
  selectedRewardId = rewardId;
  rewardFilter = 'all';
  switchTab('rewards');
}

function confirmRedeem() {
  const reward = findReward(selectedRewardId);
  if (!reward || reward.locked) return;

  const pointsData = getPoints();
  if (pointsData.balance < reward.cost) {
    showToast(t('toast.notEnoughPoints', { missing: formatNumber(reward.cost - pointsData.balance) }), 'error');
    return;
  }

  const isCashback = reward.category === 'cashback';
  if (isCashback && !getCurrentUser().ekycVerified) {
    showToast(t('toast.ekycRequired'), 'error');
    return;
  }

  pointsData.balance -= reward.cost;
  savePoints(pointsData);

  addTransaction({
    titleKey: 'tx.redeem',
    rewardId: reward.id,
    timeKey: 'tx.time.justNow',
    points: -reward.cost,
    statusKey: isCashback ? 'tx.status.wallet' : 'tx.status.voucher',
    category: 'redeem'
  });

  showToast(t('toast.redeemSuccess', { cost: formatNumber(reward.cost) }), 'success');
  render();
}

// =========================================================================
// 4. TAB: CHALLENGES
// =========================================================================

function renderChallenges() {
  const user = getCurrentUser();
  const activity = getActivity();
  const joined = user.joinedChallenges || [];
  const familyTotal = FAMILY_CHALLENGE.members.reduce((sum, member) => sum + member.steps, 0);
  const yourName = greetingName(user.username || DEFAULT_USERNAME);

  const memberName = (member) => (member.key === 'you' ? t('ch.family.you', { name: escapeHtml(yourName) }) : t(`ch.family.${member.key}`));
  const memberInitials = (member) => (member.key === 'you' ? escapeHtml(initials(user.username || DEFAULT_USERNAME)) : t(`ch.family.${member.key}`)[0]);

  const head = `
    <div class="page-head-text">
      <h1 class="page-title">${t('ch.title')}</h1>
      <p class="page-subtitle">${t('ch.subtitle')}</p>
    </div>
    <div class="page-head-actions">
      <button type="button" class="pill-btn pill-btn-navy" data-soon="toast.comingSoon">${icon('plus', 18)} ${t('ch.createFamily')}</button>
    </div>
  `;

  const body = `
    <h2 class="section-title">${t('ch.joined')}</h2>
    <div class="ch-grid-2">
      <article class="card">
        <div class="ch-head">
          <div>
            <span class="overline">${t('ch.personal.tag')}</span>
            <h3 class="ch-title">${t('ch.personal.title')}</h3>
          </div>
          <span class="icon-box icon-box-navy-soft">${icon('shield')}</span>
        </div>
        <p class="card-text">${t('ch.personal.desc')}</p>
        <div class="progress-labels">
          <strong>${t('ch.personal.day', { n: activity.streak })}</strong>
          <span>${t('ch.daysLeft', { n: activity.streakTarget - activity.streak })}</span>
        </div>
        <div class="progress"><span style="width: ${percent(activity.streak, activity.streakTarget)}%"></span></div>
        <p class="ch-reward">${t('ch.personal.reward')}</p>
      </article>

      <article class="card">
        <div class="ch-head">
          <div>
            <span class="overline">${t('ch.family.tag', { n: FAMILY_CHALLENGE.members.length })}</span>
            <h3 class="ch-title">${t('ch.family.title')}</h3>
          </div>
          <span class="icon-box icon-box-mint">${icon('users')}</span>
        </div>
        <div class="progress-labels">
          <strong>${t('ch.family.progress', { current: formatNumber(familyTotal), goal: formatNumber(FAMILY_CHALLENGE.goal) })}</strong>
          <span>${t('ch.daysLeft', { n: FAMILY_CHALLENGE.daysLeft })}</span>
        </div>
        <div class="progress"><span style="width: ${percent(familyTotal, FAMILY_CHALLENGE.goal)}%"></span></div>
        <ul class="member-list">
          ${FAMILY_CHALLENGE.members.map(member => `
            <li>
              <span class="member-avatar is-${member.key}">${memberInitials(member)}</span>
              <span class="member-name">${memberName(member)}</span>
              <strong>${formatNumber(member.steps)}</strong>
            </li>
          `).join('')}
        </ul>
      </article>
    </div>

    <h2 class="section-title">${t('ch.suggest')}</h2>
    <div class="ch-grid-3">
      ${SUGGESTED_CHALLENGES.map(challenge => {
        const isJoined = joined.includes(challenge.id);
        return `
          <article class="card ch-suggest">
            <span class="overline">${t(challenge.tagKey)}</span>
            <h3 class="ch-suggest-title">${t(challenge.titleKey)}</h3>
            <p class="ch-points">${t('ch.points', { n: challenge.points })}</p>
            <button type="button" class="pill-btn ${isJoined ? 'pill-btn-mint' : 'pill-btn-outline'} pill-btn-block"
                    onclick="joinChallenge('${challenge.id}')" ${isJoined ? 'disabled' : ''}>
              ${isJoined ? `${icon('check', 16, 2.5)} ${t('ch.joinedBtn')}` : t('ch.join')}
            </button>
          </article>
        `;
      }).join('')}
    </div>

    <section class="referral">
      <div>
        <h2>${t('ch.referral.title')}</h2>
        <p>${t('ch.referral.desc')}</p>
      </div>
      <div class="referral-actions">
        <input type="text" class="referral-input" id="referral-link" value="${escapeHtml(referralLink())}" readonly aria-label="${t('ch.referral.label')}" onfocus="this.select()">
        <button type="button" class="pill-btn pill-btn-green" onclick="copyReferral()">${t('ch.referral.copy')}</button>
      </div>
    </section>
  `;

  return { head, body };
}

function joinChallenge(challengeId) {
  const user = getCurrentUser();
  const joined = user.joinedChallenges || [];
  if (joined.includes(challengeId)) return;
  updateCurrentUser({ joinedChallenges: [...joined, challengeId] });
  showToast(t('toast.challengeJoined'), 'success');
  render();
}

function copyReferral() {
  const input = document.getElementById('referral-link');
  const done = () => showToast(t('toast.linkCopied'), 'success');

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(input.value).then(done).catch(() => {
      input.select();
      document.execCommand('copy');
      done();
    });
  } else {
    input.select();
    document.execCommand('copy');
    done();
  }
}

// =========================================================================
// 5. TAB: PROFILE
// =========================================================================

function renderProfile() {
  const user = getCurrentUser();
  const email = getCurrentEmail() || '';
  const activity = getActivity();
  const balance = getPoints().balance;
  const settings = getSettings(user);
  const wallets = getWallets(user);
  const fullName = user.username || DEFAULT_USERNAME;
  const time = syncTime();

  const head = `
    <div class="page-head-text">
      <h1 class="page-title">${t('pf.title')}</h1>
    </div>
  `;

  const walletRow = (walletId) => {
    const linked = wallets[walletId];
    return `
      <li class="list-row">
        <span class="icon-box icon-box-mint">${icon('wallet')}</span>
        <div class="list-main">
          <strong>${t(`pf.wallet.${walletId}`)}</strong>
          <span>${linked ? t('pf.wallet.linked', { phone: escapeHtml(maskPhone(user.phone)) }) : t('pf.wallet.unlinked')}</span>
        </div>
        <button type="button" class="pill-btn ${linked ? 'pill-btn-outline' : 'pill-btn-navy'} pill-btn-sm" onclick="toggleWallet('${walletId}')">
          ${linked ? t('pf.wallet.unlink') : t('pf.wallet.link')}
        </button>
      </li>
    `;
  };

  const deviceRow = (deviceId) => {
    const connected = isDeviceConnected(user, deviceId);
    return `
      <li class="list-row">
        <span class="icon-box icon-box-mint">${icon('heart')}</span>
        <div class="list-main">
          <strong>${deviceName(deviceId)}</strong>
          <span>${connected ? t('pf.health.synced', { time }) : t('device.status.notConnected')}</span>
        </div>
        <button type="button" class="pill-btn ${connected ? 'pill-btn-outline' : 'pill-btn-navy'} pill-btn-sm" onclick="handleToggleDevice('${deviceId}')">
          ${connected ? t('pf.health.disconnect') : t('device.btn.connect')}
        </button>
      </li>
    `;
  };

  const settingRow = (key, titleKey, descKey) => `
    <li class="setting-row">
      <div class="list-main">
        <strong>${t(titleKey)}</strong>
        <span>${t(descKey)}</span>
      </div>
      <button type="button" class="switch ${settings[key] ? 'is-on' : ''}" role="switch" aria-checked="${settings[key]}"
              aria-label="${t(titleKey)}" onclick="toggleSetting('${key}', this)"><span></span></button>
    </li>
  `;

  const body = `
    <section class="card pf-header">
      <span class="avatar avatar-xl">${escapeHtml(initials(fullName))}</span>
      <div class="pf-identity">
        <h2>${escapeHtml(fullName)}</h2>
        <p>${escapeHtml(email)} · ${escapeHtml(maskPhone(user.phone))}</p>
        <span class="chip chip-gray">${t('pf.plan.free')}</span>
      </div>
      <div class="pf-stats">
        <div><strong>${formatNumber(balance)}</strong><span>${t('pf.stat.points')}</span></div>
        <div><strong>${t('pf.stat.streakValue', { n: activity.streak })}</strong><span>${t('pf.stat.streak')}</span></div>
        <div><strong>${formatNumber(getDailyGoal(user, activity))}</strong><span>${t('pf.stat.goal')}</span></div>
      </div>
      <button type="button" class="pill-btn pill-btn-outline" data-soon="toast.comingSoon">${t('pf.edit')}</button>
    </section>

    <div class="pf-grid">
      <div class="pf-col">
        <article class="card">
          <div class="card-head">
            <h2 class="card-title">${t('pf.ekyc.title')}</h2>
            <span class="chip ${user.ekycVerified ? 'chip-mint' : 'chip-amber'}">${t(user.ekycVerified ? 'pf.ekyc.done' : 'pf.ekyc.pending')}</span>
          </div>
          <p class="card-text">${t(user.ekycVerified ? 'pf.ekyc.doneDesc' : 'pf.ekyc.desc')}</p>
          ${user.ekycVerified ? '' : `<button type="button" class="pill-btn pill-btn-navy" onclick="verifyEkyc()">${t('pf.ekyc.cta')}</button>`}
        </article>

        <article class="card">
          <h2 class="card-title">${t('pf.wallets.title')}</h2>
          <ul class="list">${walletRow('momo')}${walletRow('zalopay')}</ul>
        </article>

        <article class="card card-navy plus-banner">
          <h2 class="card-title">FitReward Plus</h2>
          <p>${t('pf.plus.desc')}</p>
          <button type="button" class="pill-btn pill-btn-green" data-soon="toast.comingSoon">${t('pf.plus.cta')}</button>
        </article>
      </div>

      <div class="pf-col">
        <article class="card">
          <h2 class="card-title">${t('pf.health.title')}</h2>
          <ul class="list">${Object.keys(DEVICE_KEY_MAP).map(deviceRow).join('')}</ul>
        </article>

        <article class="card">
          <div class="card-head">
            <h2 class="card-title">${t('pf.sbt.title')}</h2>
            <span class="chip chip-gray">${t('pf.sbt.none')}</span>
          </div>
          <p class="card-text">${t('pf.sbt.desc')}</p>
          <div class="progress-labels">
            <strong>${t('pf.sbt.progress', { n: activity.streak, target: activity.streakTarget })}</strong>
            <button type="button" class="link-btn" onclick="switchTab('challenges')">${t('pf.sbt.link')}</button>
          </div>
          <div class="progress"><span style="width: ${percent(activity.streak, activity.streakTarget)}%"></span></div>
        </article>

        <article class="card">
          <h2 class="card-title">${t('pf.privacy.title')}</h2>
          <ul class="list">
            ${settingRow('shareCert', 'pf.privacy.share.title', 'pf.privacy.share.desc')}
            ${settingRow('personalized', 'pf.privacy.personal.title', 'pf.privacy.personal.desc')}
            ${settingRow('dailyReminder', 'pf.privacy.reminder.title', 'pf.privacy.reminder.desc')}
            <li class="setting-row">
              <div class="list-main">
                <strong>${t('pf.language.title')}</strong>
                <span>${t('pf.language.desc')}</span>
              </div>
              <div class="lang-switch" role="group" aria-label="${t('lang.label')}">
                <button type="button" class="lang-btn" data-lang="vi" onclick="setLanguage('vi')">VI</button>
                <button type="button" class="lang-btn" data-lang="en" onclick="setLanguage('en')">EN</button>
              </div>
            </li>
          </ul>
        </article>
      </div>
    </div>

    <section class="card pf-data">
      <div>
        <h2 class="card-title">${t('pf.data.title')}</h2>
        <p class="card-text">${t('pf.data.desc')}</p>
      </div>
      <div class="pf-data-actions">
        <button type="button" class="pill-btn pill-btn-outline" data-soon="toast.comingSoon">${t('pf.data.consent')}</button>
        <button type="button" class="pill-btn pill-btn-danger" onclick="handleDeleteAccount()">${t('pf.data.delete')}</button>
        <button type="button" class="pill-btn pill-btn-outline mobile-only" onclick="handleLogout()">${t('nav.logout')}</button>
      </div>
    </section>
  `;

  return { head, body };
}

function verifyEkyc() {
  updateCurrentUser({ ekycVerified: true });
  showToast(t('toast.ekycVerified'), 'success');
  render();
}

function toggleWallet(walletId) {
  const wallets = getWallets(getCurrentUser());
  wallets[walletId] = !wallets[walletId];
  updateCurrentUser({ wallets });
  showToast(t(wallets[walletId] ? 'toast.walletLinked' : 'toast.walletUnlinked', { wallet: t(`pf.wallet.${walletId}`) }), wallets[walletId] ? 'success' : 'info');
  render();
}

function handleToggleDevice(deviceId) {
  const isConnected = toggleUserDevice(deviceId);
  showToast(t(isConnected ? 'toast.deviceConnected' : 'toast.deviceDisconnected', { device: deviceName(deviceId) }), isConnected ? 'success' : 'info');
  render();
}

// Updates the switch in place so its knob can slide instead of being re-rendered
function toggleSetting(key, switchEl) {
  const settings = getSettings(getCurrentUser());
  settings[key] = !settings[key];
  updateCurrentUser({ settings });
  switchEl.classList.toggle('is-on', settings[key]);
  switchEl.setAttribute('aria-checked', String(settings[key]));
}

function handleDeleteAccount() {
  if (!window.confirm(t('pf.data.deleteConfirm'))) return;
  deleteCurrentUser();
  sessionStorage.removeItem(ONBOARDING_STEP_KEY);
  queueToast('toast.accountDeleted', {}, 'info');
  goTo('landing');
}

function handleLogout() {
  clearCurrentEmail();
  sessionStorage.removeItem(ONBOARDING_STEP_KEY);
  queueToast('toast.logout', {}, 'info');
  goTo('landing');
}

// =========================================================================
// 6. TAB SWITCHING & RENDERING
// =========================================================================

const TAB_RENDERERS = {
  overview: renderOverview,
  rewards: renderRewards,
  challenges: renderChallenges,
  profile: renderProfile
};

function render() {
  const { head, body } = TAB_RENDERERS[currentTab]();
  document.getElementById('page-head').innerHTML = head;
  document.getElementById('view').innerHTML = body;
  document.title = `${t(`nav.${currentTab}`)} · FitReward`;
  syncLanguageButtons();
}

function switchTab(tabName) {
  if (!TABS.includes(tabName)) tabName = 'overview';
  const tabChanged = tabName !== currentTab;
  currentTab = tabName;

  document.querySelectorAll('.nav-item[data-tab], .m-nav-item').forEach(btn => {
    const isActive = btn.dataset.tab === tabName;
    btn.classList.toggle('active', isActive);
    if (isActive) btn.setAttribute('aria-current', 'page');
    else btn.removeAttribute('aria-current');
  });

  // The profile page has its own Plus card
  document.getElementById('sidebar-plus').classList.toggle('hidden', tabName === 'profile');

  // Fade only when arriving from another tab, not when re-rendering in place
  document.getElementById('view').classList.toggle('is-switching', tabChanged);
  document.getElementById('page-head').classList.toggle('is-switching', tabChanged);

  render();

  if (tabChanged) window.scrollTo({ top: 0 });
  history.replaceState(null, '', `#${tabName}`);
}

// =========================================================================
// 7. LIFECYCLE
// =========================================================================

onLanguageChange(() => render());

bootPage(() => {
  // One-time entrance animation when the dashboard opens
  const shell = document.getElementById('app-dashboard-layout');
  shell.classList.add('is-entering');
  setTimeout(() => shell.classList.remove('is-entering'), ENTRANCE_DURATION);

  const initialTab = window.location.hash.slice(1);
  currentTab = TABS.includes(initialTab) ? initialTab : 'overview';
  switchTab(currentTab);
});
