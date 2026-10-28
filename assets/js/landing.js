/**
 * FitReward - Landing page
 * Scroll reveal, header shadow, count-up numbers, a "live" step counter in the hero,
 * pointer tilt on the hero card, and a dashboard shortcut for logged-in users.
 */

const REVEAL_SELECTOR = [
  '.lp-stats-grid > div',
  '.lp-section .lp-eyebrow',
  '.lp-section .lp-h2',
  '.lp-section .lp-lead',
  '.lp-section .lp-card',
  '.lp-section .lp-plan',
  '.lp-final-cta .lp-btn'
].join(',');

const STEP_GOAL = 10000;
const LIVE_STEPS_CAP = 9600;
const LIVE_TICK_MS = 2800;

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// =========================================================================
// 1. COUNT-UP NUMBERS (data-count-to, optional data-count-key / -format / -on="view")
// =========================================================================

function renderCount(el, value) {
  el.dataset.countCurrent = String(value);
  const formatted = el.dataset.countFormat === 'currency' ? formatCurrency(value) : formatNumber(value);
  el.textContent = el.dataset.countKey ? t(el.dataset.countKey, { n: formatted }) : formatted;
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function countUp(el, { duration = 1400, delay = 0 } = {}) {
  const target = Number(el.dataset.countTo);
  if (prefersReducedMotion) {
    renderCount(el, target);
    return Promise.resolve();
  }

  renderCount(el, 0);
  return new Promise(resolve => {
    setTimeout(() => {
      const start = performance.now();
      const frame = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        renderCount(el, Math.round(target * easeOutCubic(progress)));
        if (progress < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    }, delay);
  });
}

function initCountUps() {
  const onLoad = document.querySelectorAll('[data-count-to]:not([data-count-on="view"])');
  const onView = document.querySelectorAll('[data-count-to][data-count-on="view"]');

  // Hero numbers start once the card has faded in
  const heroCounts = [...onLoad].map(el => countUp(el, { delay: 350 }));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        countUp(entry.target, { duration: 1200 });
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    onView.forEach(el => {
      if (!prefersReducedMotion) renderCount(el, 0);
      observer.observe(el);
    });
  } else {
    onView.forEach(el => renderCount(el, Number(el.dataset.countTo)));
  }

  return Promise.all(heroCounts);
}

// Re-render the counted numbers in the new language at their current value
onLanguageChange(() => {
  document.querySelectorAll('[data-count-to]').forEach(el => {
    renderCount(el, Number(el.dataset.countCurrent ?? el.dataset.countTo));
  });
});

// =========================================================================
// 2. LIVE STEP COUNTER IN THE HERO CARD
// =========================================================================

function setStepProgress(steps) {
  const bar = document.getElementById('lp-live-progress');
  if (bar) bar.style.setProperty('--p', Math.min(steps / STEP_GOAL, 1).toFixed(3));
}

/**
 * After the count-up, steps keep trickling in as if the phone were syncing.
 * Pauses while the hero is off screen or the tab is hidden.
 */
function startLiveSteps() {
  const stepsEl = document.getElementById('lp-live-steps');
  if (!stepsEl || prefersReducedMotion) return;

  let heroVisible = true;
  const hero = document.querySelector('.lp-hero');
  if (hero && 'IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; }).observe(hero);
  }

  const timer = setInterval(() => {
    if (document.hidden || !heroVisible) return;

    const current = Number(stepsEl.dataset.countCurrent || stepsEl.dataset.countTo);
    const next = current + 7 + Math.floor(Math.random() * 17);
    if (next > LIVE_STEPS_CAP) {
      clearInterval(timer);
      return;
    }

    renderCount(stepsEl, next);
    setStepProgress(next);
    stepsEl.animate(
      [{ transform: 'translateY(-3px)', color: '#15803d' }, { transform: 'none', color: '#0f1f3d' }],
      { duration: 450, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }
    );
  }, LIVE_TICK_MS);
}

// =========================================================================
// 3. POINTER TILT ON THE HERO CARD (desktop pointers only)
// =========================================================================

function initHeroTilt() {
  const area = document.querySelector('.lp-hero-visual');
  const target = document.querySelector('.lp-tilt');
  if (!area || !target || prefersReducedMotion) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let frameId = null;
  let lastTime = 0;

  // Ease toward the pointer so the card settles smoothly instead of snapping.
  // Time-based (not per-frame) so it feels the same at 30, 60 or 120 fps.
  const step = (now) => {
    const dt = lastTime ? Math.min(now - lastTime, 100) : 16;
    lastTime = now;
    const ease = 1 - Math.exp(-dt / 90);
    currentX += (targetX - currentX) * ease;
    currentY += (targetY - currentY) * ease;
    target.style.transform = `perspective(1000px) rotateX(${(-currentY * 5).toFixed(2)}deg) rotateY(${(currentX * 6).toFixed(2)}deg)`;

    if (Math.abs(targetX - currentX) > 0.001 || Math.abs(targetY - currentY) > 0.001) {
      frameId = requestAnimationFrame(step);
    } else {
      frameId = null;
      lastTime = 0;
    }
  };

  const schedule = () => {
    if (!frameId) frameId = requestAnimationFrame(step);
  };

  area.addEventListener('pointermove', (event) => {
    const rect = area.getBoundingClientRect();
    targetX = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    targetY = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    schedule();
  });

  area.addEventListener('pointerleave', () => {
    targetX = 0;
    targetY = 0;
    schedule();
  });
}

// =========================================================================
// 4. SCROLL REVEAL & HEADER
// =========================================================================

function initScrollReveal() {
  const items = document.querySelectorAll(REVEAL_SELECTOR);
  if (!('IntersectionObserver' in window)) return;

  // Stagger siblings that enter together (cards in a grid, items in the stats strip)
  items.forEach(el => {
    const siblings = [...el.parentElement.children].filter(child => child.matches(REVEAL_SELECTOR));
    el.style.setProperty('--reveal-i', Math.max(siblings.indexOf(el), 0));
    el.classList.add('reveal');
  });
  document.documentElement.classList.add('js-reveal');

  // Headings start fully clipped (zero visible area), which the observer never reports
  // as intersecting, so they are triggered by their parent block instead
  const targetsByTrigger = new Map();
  items.forEach(el => {
    const trigger = el.matches('.lp-h2') ? el.parentElement : el;
    if (!targetsByTrigger.has(trigger)) targetsByTrigger.set(trigger, []);
    targetsByTrigger.get(trigger).push(el);
  });

  // Reveal once; re-animating on every scroll-by fights the reader
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      targetsByTrigger.get(entry.target).forEach(el => el.classList.add('is-visible'));
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  targetsByTrigger.forEach((targets, trigger) => observer.observe(trigger));
}

function initHeaderShadow() {
  const header = document.querySelector('.lp-header');
  if (!header) return;
  const update = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

function updateAccountLink() {
  const loginLink = document.getElementById('lp-login-link');
  if (!loginLink || !getCurrentEmail()) return;
  loginLink.href = PAGES.dashboard;
  loginLink.dataset.i18n = 'lp.nav.dashboard';
  loginLink.textContent = t('lp.nav.dashboard');
}

bootPage(() => {
  updateAccountLink();
  initHeaderShadow();
  initScrollReveal();
  initHeroTilt();
  setStepProgress(Number(document.getElementById('lp-live-steps')?.dataset.countTo || 0));
  initCountUps().then(startLiveSteps);
});
