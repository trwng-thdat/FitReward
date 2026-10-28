/**
 * FitReward - Landing page
 * Scroll-reveal for sections, header shadow on scroll, and a dashboard shortcut for logged-in users.
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

  // Reveal once; re-animating on every scroll-by fights the reader
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  items.forEach(el => observer.observe(el));
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
});
