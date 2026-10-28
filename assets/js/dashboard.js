/**
 * FitReward - Fintech Dashboard Engine
 * Real-time dashboard rendering, sidebar tabs & sub pages, device status and rewards redemption.
 */

// Transaction icons per category (dashboard feed)
const TX_ICONS = {
  walk: { bg: 'bg-navy', svg: '<polyline points="20 6 9 17 4 12"></polyline>' },
  workout: { bg: 'bg-green', svg: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>' },
  challenge: { bg: 'bg-amber', svg: '<circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>' },
  reward: { bg: 'bg-amber', svg: '<polyline points="20 12 20 22 4 22 4 12"></polyline><rect x="2" y="7" width="20" height="5"></rect><line x1="12" y1="22" x2="12" y2="7"></line>' }
};

// How long the one-time entrance animation classes stay on the shell
const ENTRANCE_DURATION = 1200;

let currentTab = 'dashboard';

function getTxTitle(tx) {
  if (!tx.titleKey) return tx.title;
  return t(tx.titleKey, { reward: tx.rewardId ? t(`reward.${tx.rewardId}.name`) : '' });
}

function getTxTime(tx) {
  return tx.timeKey ? t(tx.timeKey) : tx.time;
}

function formatTxPoints(points) {
  return points > 0 ? '+' + formatNumber(points) : formatNumber(points);
}

function handleLogout() {
  clearCurrentEmail();
  sessionStorage.removeItem(ONBOARDING_STEP_KEY);
  queueToast('toast.logout', {}, 'info');
  goTo('landing');
}

// =========================================================================
// 1. DEVICE CONNECTIONS
// =========================================================================

function handleToggleDevice(deviceId, deviceTitle) {
  const isConnected = toggleUserDevice(deviceId);
  showToast(t(isConnected ? 'toast.deviceConnected' : 'toast.deviceDisconnected', { device: deviceTitle }), isConnected ? 'success' : 'info');
  renderDashboard();
  if (currentTab === 'devices') switchTab('devices');
}

// =========================================================================
// 2. DASHBOARD DATA RENDERING & REAL-TIME UPDATES
// =========================================================================

function renderDashboard() {
  const currentUser = getCurrentUser();

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
  const pointsData = getPoints();
  const activityData = getActivity();
  const goalPct = Math.min(100, Math.round((activityData.todaySteps / activityData.dailyGoal) * 100));
  const goalMet = activityData.todaySteps >= activityData.dailyGoal;
  const goalLabel = formatNumber(activityData.dailyGoal);

  const kpiPoints = document.getElementById('kpi-fitpoints');
  if (kpiPoints) {
    kpiPoints.innerHTML = `${formatNumber(pointsData.balance)} <span class="sc-unit">${t('unit.pts')}</span>`;
  }

  const kpiSteps = document.getElementById('kpi-steps');
  if (kpiSteps) {
    kpiSteps.innerHTML = `${formatNumber(activityData.todaySteps)} <span class="sc-goal">/ ${goalLabel}</span>`;
  }

  const kpiStepsFooter = document.getElementById('kpi-steps-footer');
  if (kpiStepsFooter) {
    kpiStepsFooter.className = `sc-footer ${goalMet ? 'goal-met' : 'goal-pending'}`;
    kpiStepsFooter.querySelector('span').textContent = goalMet ? t('kpi.goalMet') : t('kpi.goalProgress', { pct: goalPct });
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
    chartBars.innerHTML = activityData.weeklyChart.map((bar, index) => `
      <div class="bar-col ${bar.isToday ? 'today' : ''}">
        <div class="bar-fill ${bar.isToday ? 'highlight' : ''}" style="height: ${bar.height}%; --i: ${index};">
          <div class="bar-tooltip">${t('chart.stepsTooltip', { steps: formatNumber(bar.steps) })}</div>
        </div>
        <span class="bar-day">${t(`day.${bar.day.toLowerCase()}`)}</span>
      </div>
    `).join('');
  }

  const todayStepsLabel = document.getElementById('chart-today-steps');
  const dailyGoalLabel = document.getElementById('chart-daily-goal');
  const goalLine = document.getElementById('chart-goal-line');
  if (todayStepsLabel) todayStepsLabel.textContent = t('chart.todaySteps', { steps: formatNumber(activityData.todaySteps) });
  if (dailyGoalLabel) dailyGoalLabel.textContent = t('chart.goal', { goal: goalLabel });
  if (goalLine) goalLine.textContent = t('chart.goalLine', { goal: goalLabel });

  const reachedBadge = document.getElementById('chart-reached');
  if (reachedBadge) reachedBadge.classList.toggle('hidden', !goalMet);

  // 4. Today's Challenge progress (follows the goal chosen during onboarding)
  const challengeTitle = document.getElementById('challenge-title');
  if (challengeTitle) challengeTitle.textContent = t('challenge.daily.title', { goal: goalLabel });

  const challengeStatus = document.getElementById('challenge-status');
  if (challengeStatus) {
    challengeStatus.className = `status-badge-pill ${goalMet ? 'success' : 'pending'}`;
    challengeStatus.textContent = goalMet ? t('challenge.completed') : t('challenge.inProgress');
  }

  const tcVal = document.getElementById('today-challenge-val');
  if (tcVal) {
    tcVal.textContent = t('challenge.progress', {
      current: formatNumber(activityData.todaySteps),
      goal: goalLabel
    });
  }

  const tcPct = document.getElementById('today-challenge-pct');
  if (tcPct) tcPct.textContent = `${goalPct}%`;

  const tcBar = document.getElementById('today-challenge-bar');
  if (tcBar) tcBar.style.width = `${goalPct}%`;

  // 5. FitPoints Activity feed (latest 3 transactions)
  const txContainer = document.getElementById('transactions-list-container');
  if (txContainer) {
    txContainer.innerHTML = getTransactions().slice(0, 3).map(tx => {
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
            ${formatTxPoints(tx.points)}
          </div>
        </div>
      `;
    }).join('');
  }

  // 6. Health Data sync badges on Dashboard
  ['apple', 'google', 'garmin'].forEach(deviceId => {
    const badge = document.getElementById(`dash-device-${deviceId}`);
    if (!badge) return;
    const isConn = isDeviceConnected(currentUser, deviceId);
    badge.textContent = isConn ? t('sync.connected') : t('sync.notConnected');
    badge.className = isConn ? 'sync-badge' : 'sync-badge pending';
  });
}

// Claim Daily Challenge Reward (+100 FitPoints)
function claimDailyReward() {
  const pointsData = getPoints();
  pointsData.balance += 100;
  savePoints(pointsData);

  addTransaction({
    titleKey: 'tx.daily',
    timeKey: 'tx.daily.time',
    points: 100,
    type: 'earn',
    category: 'walk'
  });

  showToast(t('toast.claimed'), 'success');
  renderDashboard();
}

// Reward Redemption Action Flow (rewardId maps to the reward.<id>.name translation)
function handleRedeemReward(rewardId, cost) {
  const pointsData = getPoints();
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
  savePoints(pointsData);

  // Add redemption log to transactions
  addTransaction({
    titleKey: 'tx.redeem',
    timeKey: 'tx.redeem.time',
    rewardId: rewardId,
    points: -cost,
    type: 'redeem',
    category: 'reward'
  });

  showToast(t('toast.redeemSuccess', { cost: formatNumber(cost), reward: rewardName }), 'success');
  renderDashboard();
  if (currentTab === 'rewards') switchTab('rewards');
}

// =========================================================================
// 3. SIDEBAR NAVIGATION & SUBPAGES
// =========================================================================

function switchTab(tabName) {
  const tabChanged = tabName !== currentTab;
  currentTab = tabName;

  // Update sidebar active highlights
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
  const targetNav = document.getElementById(`nav-${tabName}`);
  if (targetNav) targetNav.classList.add('active');

  // Update mobile bottom nav
  document.querySelectorAll('.m-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

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
  if (subpageContainer) {
    subpageContainer.classList.remove('hidden');
    // Fade only when arriving from another tab, not when re-rendering in place
    subpageContainer.classList.toggle('is-switching', tabChanged);
  }

  let title = t(`page.${tabName}`);
  let html = '';

  if (tabName === 'activity') {
    const activityData = getActivity();
    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">${t('sp.activity.title')}</h2>
            <p class="card-desc">${t('sp.activity.desc')}</p>
          </div>
          <button class="btn btn-primary btn-sm" data-soon="toast.syncing">${t('sp.activity.syncNow')}</button>
        </div>
        <div class="summary-cards-grid">
          <div class="summary-card">
            <span class="sc-label">${t('sp.activity.today')}</span>
            <div class="sc-value text-accent">${t('sp.activity.steps', { steps: formatNumber(activityData.todaySteps || 7240) })}</div>
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
    const pointsData = getPoints();
    const catalog = [
      { id: 'cashbackMomo', cost: 500, icon: '₫', iconClass: 'bg-green-soft' },
      { id: 'cashback50', cost: 1200, icon: '₫', iconClass: 'bg-green-soft' },
      { id: 'gymDay', cost: 300, icon: '🏋️', iconClass: 'bg-navy-soft' },
      { id: 'insuranceBaoViet', cost: 1000, icon: '🛡️', iconClass: 'bg-amber-soft', outline: true }
    ];

    html = `
      <div class="subpage-card">
        <div class="subpage-header">
          <div>
            <h2 class="card-title">${t('sp.rewards.title')}</h2>
            <p class="card-desc">${t('sp.rewards.balance')} <strong class="text-accent">${formatNumber(pointsData.balance)} ${t('unit.pts')}</strong></p>
          </div>
        </div>
        <div class="reward-cards-column">
          ${catalog.map(reward => `
            <div class="reward-item-row">
              <div class="reward-icon-box ${reward.iconClass}">${reward.icon}</div>
              <div class="reward-meta">
                <div class="reward-name">${t(`reward.${reward.id}.name`)}</div>
                <div class="reward-cost">${t(`reward.${reward.id}.cost`)}</div>
              </div>
              <button class="btn-reward-action ${reward.outline ? 'btn-outline-action' : ''}" onclick="handleRedeemReward('${reward.id}', ${reward.cost})">
                ${reward.outline ? t('btn.view') : t('btn.redeem')}
              </button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } else if (tabName === 'challenges') {
    const activityData = getActivity();
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
              <div class="reward-name">${t('sp.challenges.daily.name', { goal: formatNumber(activityData.dailyGoal) })}</div>
              <div class="reward-cost">${t('sp.challenges.daily.meta', { current: formatNumber(activityData.todaySteps), goal: formatNumber(activityData.dailyGoal) })}</div>
            </div>
            <button class="btn btn-sm btn-outline-success" onclick="claimDailyReward()">${t('sp.challenges.claim')}</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-navy-soft">🔥</div>
            <div class="reward-meta">
              <div class="reward-name">${t('sp.challenges.streak.name')}</div>
              <div class="reward-cost">${t('sp.challenges.streak.meta')}</div>
            </div>
            <button class="btn btn-sm btn-primary" data-soon="toast.streakKeepGoing">${t('sp.challenges.continue')}</button>
          </div>
          <div class="reward-item-row">
            <div class="reward-icon-box bg-amber-soft">👥</div>
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
    const rowsHtml = getTransactions().map(tx => `
      <div class="tx-row">
        <div class="tx-icon-box ${tx.type === 'redeem' ? 'bg-amber' : 'bg-navy'}">
          ${tx.type === 'redeem' ? '🎁' : '✓'}
        </div>
        <div class="tx-info">
          <div class="tx-title">${getTxTitle(tx)}</div>
          <div class="tx-time">${getTxTime(tx)}</div>
        </div>
        <div class="tx-points ${tx.points > 0 ? 'positive' : ''}" style="${tx.points < 0 ? 'color: var(--color-danger);' : ''}">
          ${formatTxPoints(tx.points)}
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
    const userObj = getCurrentUser();
    const devices = [
      { id: 'apple', title: 'Apple Health', iconClass: 'apple-bg', icon: '' },
      { id: 'google', title: 'Google Health Connect', iconClass: 'google-bg', icon: 'G' },
      { id: 'garmin', title: 'Garmin Connect', iconClass: 'garmin-bg', icon: '▲' }
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
          ${devices.map(device => {
            const connected = isDeviceConnected(userObj, device.id);
            return `
              <div class="device-item ${connected ? 'connected' : ''}">
                <div class="d-icon ${device.iconClass}">${device.icon}</div>
                <div class="d-text">
                  <div class="d-title">${device.title}</div>
                  <div class="d-meta">${connected ? t('device.status.connected') : t('device.status.notConnected')}</div>
                </div>
                <button class="btn-d-connect" onclick="handleToggleDevice('${device.id}', '${device.title}')">
                  ${connected ? t('device.btn.connected') : t('device.btn.connect')}
                </button>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  } else if (tabName === 'profile') {
    const currentEmail = getCurrentEmail();
    const userObj = getCurrentUser();

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
// 4. LIFECYCLE
// =========================================================================

onLanguageChange(() => switchTab(currentTab));

bootPage(() => {
  // One-time entrance animation when the dashboard opens
  const shell = document.getElementById('app-dashboard-layout');
  shell.classList.add('is-entering');
  setTimeout(() => shell.classList.remove('is-entering'), ENTRANCE_DURATION);

  switchTab('dashboard');
});
