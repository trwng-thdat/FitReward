/**
 * FitReward - Internationalization engine (Vietnamese / English)
 * Dictionaries live in assets/js/locales/*.js and must be loaded first.
 * Static markup is translated through data-i18n* attributes
 * (data-i18n-params='{"n":1}' fills placeholders); dynamic content calls t(key, params).
 */

const LANG_STORAGE_KEY = 'fitRewardLang';
const SUPPORTED_LANGS = ['vi', 'en'];

let currentLang = (() => {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  return SUPPORTED_LANGS.includes(saved) ? saved : 'vi';
})();

// Pages register re-render callbacks here so dynamic content follows the language
const languageChangeHandlers = [];

/**
 * Looks up a translation and fills {placeholders} from params.
 * Falls back to Vietnamese, then to the key itself.
 */
function t(key, params = {}) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.vi;
  const template = dict[key] ?? TRANSLATIONS.vi[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? params[name] : match));
}

/**
 * Formats a number with the separators of the active language (7.240 vs 7,240).
 */
function formatNumber(value) {
  return Number(value).toLocaleString(currentLang === 'vi' ? 'vi-VN' : 'en-US');
}

function readParams(el) {
  if (!el.dataset.i18nParams) return {};
  try {
    return JSON.parse(el.dataset.i18nParams);
  } catch (e) {
    return {};
  }
}

/**
 * Translates every element carrying a data-i18n* attribute inside root.
 */
function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n, readParams(el));
  });
  root.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml, readParams(el));
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
  });
  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.dataset.i18nTitle));
  });
  root.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
  });

  document.documentElement.lang = currentLang;
  document.title = t(document.body.dataset.titleKey || 'meta.title');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

function onLanguageChange(handler) {
  languageChangeHandlers.push(handler);
}

/**
 * Switches the UI language, persists the choice and re-renders dynamic content.
 */
function setLanguage(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) return;

  currentLang = lang;
  localStorage.setItem(LANG_STORAGE_KEY, lang);
  applyTranslations();
  languageChangeHandlers.forEach(handler => handler(lang));
}
