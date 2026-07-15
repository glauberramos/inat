const js = require("@eslint/js");
const html = require("eslint-plugin-html");

// Globals shared across pages via plain <script> includes.
// constants.js / shared-utils.js / autocomplete.js / location-autocomplete.js
// declare these at top level; inline page scripts consume them.
const sharedGlobals = {
  // constants.js
  API_BASE: "readonly",
  ICONIC_TAXON_ICONS: "readonly",
  CONSERVATION_STATUS: "readonly",
  getConservationStatus: "readonly",
  getIconicTaxonIcon: "readonly",
  // shared-utils.js
  updateUrlWithUsername: "readonly",
  updateUrlWithPlace: "readonly",
  getUrlParams: "readonly",
  saveUsername: "readonly",
  getSavedUsername: "readonly",
  savePlace: "readonly",
  getSavedPlace: "readonly",
  saveLanguage: "readonly",
  getSavedLanguage: "readonly",
  showError: "readonly",
  hideError: "readonly",
  updateProgress: "readonly",
  initFeedbackButton: "readonly",
  registerServiceWorker: "readonly",
  fetchJSON: "readonly",
  escapeHtml: "readonly",
  sleep: "readonly",
  initUsername: "readonly",
  initPlace: "readonly",
  initLanguage: "readonly",
  // autocomplete.js / location-autocomplete.js
  createAutocomplete: "readonly",
  initUsernameAutocomplete: "readonly",
  initPlaceAutocomplete: "readonly",
  initTaxonAutocomplete: "readonly",
  initProjectAutocomplete: "readonly",
  initAutocompleteClickOutside: "readonly",
  initLocationAutocomplete: "readonly",
  // calendar-modal.js / download.js / widgets
  initCalendarModal: "readonly",
  INatWidget: "readonly",
  // third-party
  $crisp: "readonly",
  html2canvas: "readonly",
  plausible: "readonly",
};

const browserGlobals = {
  window: "readonly",
  document: "readonly",
  navigator: "readonly",
  localStorage: "readonly",
  sessionStorage: "readonly",
  fetch: "readonly",
  URL: "readonly",
  URLSearchParams: "readonly",
  Image: "readonly",
  history: "readonly",
  location: "readonly",
  alert: "readonly",
  confirm: "readonly",
  console: "readonly",
  setTimeout: "readonly",
  clearTimeout: "readonly",
  setInterval: "readonly",
  clearInterval: "readonly",
  requestAnimationFrame: "readonly",
  IntersectionObserver: "readonly",
  AbortController: "readonly",
  Blob: "readonly",
  FileReader: "readonly",
  crypto: "readonly",
  TextEncoder: "readonly",
  btoa: "readonly",
  atob: "readonly",
  self: "readonly",
  caches: "readonly",
  module: "writable",
};

module.exports = [
  {
    ignores: ["node_modules/**"],
  },
  {
    files: ["**/*.js", "**/*.html"],
    plugins: { html },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "script",
      globals: { ...browserGlobals, ...sharedGlobals },
    },
    rules: {
      ...js.configs.recommended.rules,
      // Shared helper files declare functions consumed by other <script> tags.
      "no-unused-vars": ["warn", { args: "none", varsIgnorePattern: "^_" }],
      "no-undef": "error",
      "no-empty": ["error", { allowEmptyCatch: true }],
    },
  },
  {
    files: ["tests/**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { require: "readonly", process: "readonly", __dirname: "readonly" },
    },
  },
];
