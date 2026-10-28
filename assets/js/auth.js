/**
 * FitReward - Shared helpers for the login and register pages
 * Field validation, inline errors and password visibility.
 */

// Simple Email Validation Regex conforming to standard email patterns
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Vietnamese mobile numbers, stored in the 0xxxxxxxxx form
const PHONE_REGEX = /^0\d{9}$/;

const MIN_PASSWORD_LENGTH = 8;

/**
 * Normalizes "0912 345 678", "+84 912 345 678" or "84912345678" to "0912345678".
 */
function normalizePhone(value) {
  let phone = value.replace(/[\s.()-]/g, '');
  if (phone.startsWith('+84')) phone = '0' + phone.slice(3);
  else if (phone.startsWith('84') && phone.length === 11) phone = '0' + phone.slice(2);
  return phone;
}

function clearFormErrors(root = document) {
  root.querySelectorAll('.error-text').forEach(el => el.textContent = '');

  const fields = root.querySelectorAll('.field.error');
  fields.forEach(field => field.classList.remove('error'));
  // Force a reflow so the shake replays when the same field fails again
  if (fields.length) void root.offsetWidth;
}

function showInputError(inputId, message) {
  const inputEl = document.getElementById(inputId);
  const errorEl = document.getElementById(`${inputId}-error`);

  if (inputEl && inputEl.closest('.field')) {
    inputEl.closest('.field').classList.add('error');
  }
  if (errorEl) {
    errorEl.textContent = message;
  }
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
  } else {
    buttonEl.innerHTML = `
      <svg class="eye-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    `;
  }

  // Keep the label in sync with later language switches
  buttonEl.dataset.i18nAriaLabel = isPassword ? 'aria.hidePassword' : 'aria.showPassword';
  buttonEl.setAttribute('aria-label', t(buttonEl.dataset.i18nAriaLabel));
}

// Error messages are rendered text, so drop them when the language changes
onLanguageChange(() => clearFormErrors());
