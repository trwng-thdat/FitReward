/**
 * FitReward - Shared UI helpers used by every page
 * Toast notifications (also across page navigations), "coming soon" links and page bootstrapping.
 */

const QUEUED_TOAST_KEY = 'fitRewardQueuedToast';

let toastTimer = null;
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast ${type}`;

  if (toastTimer) clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    // .is-hidden (not .hidden, which is display:none) so the exit can transition
    toast.className = `toast ${type} is-hidden`;
  }, 3200);
}

/**
 * Shows a toast on the next page (e.g. "Welcome back" after redirecting to the dashboard).
 * Stores the translation key so the message follows the language of the next page.
 */
function queueToast(key, params = {}, type = 'success') {
  sessionStorage.setItem(QUEUED_TOAST_KEY, JSON.stringify({ key, params, type }));
}

function flushQueuedToast() {
  const raw = sessionStorage.getItem(QUEUED_TOAST_KEY);
  if (!raw) return;
  sessionStorage.removeItem(QUEUED_TOAST_KEY);
  try {
    const { key, params, type } = JSON.parse(raw);
    showToast(t(key, params), type);
  } catch (e) {}
}

/**
 * Runs the shared startup for a page, then the page's own init.
 */
function bootPage(init) {
  document.addEventListener('DOMContentLoaded', () => {
    initFitRewardStorage();
    applyTranslations();

    // Placeholder links/buttons: data-soon="<toast key>" (data-legal-link uses the generic message)
    document.addEventListener('click', (event) => {
      const target = event.target.closest('[data-soon], [data-legal-link]');
      if (!target) return;
      event.preventDefault();
      showToast(t(target.dataset.soon || 'toast.comingSoon'), 'info');
    });

    if (init) init();
    flushQueuedToast();
  });
}
