// Shared utilities for iNaturalist tools

// ===== URL Parameter Management =====

function updateUrlWithUsername(username) {
  const url = new URL(window.location);
  if (username) {
    url.searchParams.set("user", username);
  } else {
    url.searchParams.delete("user");
  }
  window.history.replaceState({}, "", url);
}

function updateUrlWithPlace(placeId, placeName) {
  const url = new URL(window.location);
  if (placeId && placeName) {
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("place", placeName);
  } else {
    url.searchParams.delete("place_id");
    url.searchParams.delete("place");
  }
  window.history.replaceState({}, "", url);
}

function updateUrlWithTaxon(taxonId, taxonName) {
  const url = new URL(window.location);
  if (taxonId && taxonName) {
    url.searchParams.set("taxon_id", taxonId);
    url.searchParams.set("taxon", taxonName);
  } else {
    url.searchParams.delete("taxon_id");
    url.searchParams.delete("taxon");
  }
  window.history.replaceState({}, "", url);
}

function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    username: urlParams.get("user"),
    placeId: urlParams.get("place_id"),
    placeName: urlParams.get("place"),
    taxonId: urlParams.get("taxon_id"),
    taxonName: urlParams.get("taxon"),
  };
}

// ===== localStorage Management =====

function saveUsername(username) {
  if (username) {
    localStorage.setItem("inatUsername", username);
  } else {
    localStorage.removeItem("inatUsername");
  }
}

function getSavedUsername() {
  return localStorage.getItem("inatUsername");
}

function savePlace(placeId, placeName) {
  if (placeId && placeName) {
    localStorage.setItem("inatPlaceId", placeId);
    localStorage.setItem("inatPlaceName", placeName);
  } else {
    localStorage.removeItem("inatPlaceId");
    localStorage.removeItem("inatPlaceName");
  }
}

function getSavedPlace() {
  return {
    id: localStorage.getItem("inatPlaceId"),
    name: localStorage.getItem("inatPlaceName"),
  };
}

function saveLanguage(language) {
  localStorage.setItem("inatLanguage", language);
}

function getSavedLanguage() {
  return localStorage.getItem("inatLanguage");
}

// ===== Error Handling =====

function showError(elementOrId, message) {
  const element =
    typeof elementOrId === "string" ? document.getElementById(elementOrId) : elementOrId;
  if (element) {
    element.textContent = message;
    element.style.display = "block";
    element.classList.remove("welcome-message");
    element.classList.add("show");
  }
}

function hideError(elementOrId) {
  const element =
    typeof elementOrId === "string" ? document.getElementById(elementOrId) : elementOrId;
  if (element) {
    element.style.display = "none";
    element.classList.remove("show", "welcome-message");
  }
}

// Reuses the page's error element for friendly empty states (e.g. brand-new
// users with zero observations), so they get a welcome instead of a red box.
// Styles are injected here because pages define their error boxes in per-page
// CSS; !important is needed to beat the ID selectors some pages use.
function showWelcome(elementOrId, message) {
  const element =
    typeof elementOrId === "string" ? document.getElementById(elementOrId) : elementOrId;
  if (!element) return;
  if (!document.getElementById("welcomeMessageStyles")) {
    const style = document.createElement("style");
    style.id = "welcomeMessageStyles";
    style.textContent = `
      .welcome-message.show {
        background: #f1f8e9 !important;
        color: #33691e !important;
        border: 1px solid #c5e1a5 !important;
      }
      html.dark-mode .welcome-message.show {
        background: #26331f !important;
        color: #c5e1a5 !important;
        border-color: #4a5d3a !important;
      }
    `;
    document.head.appendChild(style);
  }
  element.textContent = message;
  element.style.display = "block";
  element.classList.add("show", "welcome-message");
}

// ===== Progress Updates =====

function updateProgress(percent, text, currentCheck) {
  const progressBar = document.getElementById("progressBar");
  const progressText = document.getElementById("progressText");
  const currentCheckEl = document.getElementById("currentCheck");

  if (progressBar) progressBar.style.width = percent + "%";
  if (progressText) progressText.textContent = text;
  if (currentCheckEl) currentCheckEl.textContent = currentCheck || "";
}

// ===== Feedback Button (Crisp chat) =====

const CRISP_WEBSITE_ID = "69e5f089-9f10-41ef-a438-5d254be7b317";

// Loads Crisp, hides its default launcher, and wires the "Send feedback"
// button to open the chat. Replaces the per-page inline boilerplate.
function initFeedbackButton(buttonId = "feedbackBtn") {
  const btn = document.getElementById(buttonId);
  if (!btn) return;

  window.$crisp = window.$crisp || [];
  window.CRISP_WEBSITE_ID = CRISP_WEBSITE_ID;
  const s = document.createElement("script");
  s.src = "https://client.crisp.chat/l.js";
  s.async = 1;
  document.getElementsByTagName("head")[0].appendChild(s);

  $crisp.push(["do", "chat:hide"]);
  $crisp.push([
    "on",
    "chat:closed",
    function () {
      $crisp.push(["do", "chat:hide"]);
    },
  ]);

  // Crisp boots asynchronously; clicks made before it's ready sit in the
  // command queue for a few seconds, so show a spinner on the button until
  // the session is loaded and the queued chat:open actually fires.
  let crispReady = false;
  const spinnerStyle = document.createElement("style");
  spinnerStyle.textContent =
    ".feedback-spinner{display:inline-block;width:12px;height:12px;" +
    "border:2px solid rgba(255,255,255,0.4);border-top-color:#fff;" +
    "border-radius:50%;margin-right:6px;vertical-align:-2px;" +
    "animation:feedback-spin 0.7s linear infinite}" +
    "@keyframes feedback-spin{to{transform:rotate(360deg)}}";
  document.head.appendChild(spinnerStyle);

  function removeSpinner() {
    const spin = btn.querySelector(".feedback-spinner");
    if (spin) spin.remove();
  }

  $crisp.push([
    "on",
    "session:loaded",
    function () {
      crispReady = true;
      removeSpinner();
    },
  ]);

  btn.addEventListener("click", () => {
    $crisp.push(["do", "chat:show"]);
    $crisp.push(["do", "chat:open"]);
    if (!crispReady && !btn.querySelector(".feedback-spinner")) {
      const spin = document.createElement("span");
      spin.className = "feedback-spinner";
      btn.prepend(spin);
      // If Crisp never loads (offline, blocked), don't spin forever
      setTimeout(removeSpinner, 10000);
    }
  });
}

// ===== Service Worker =====

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js");
  }
}

// ===== API Helpers =====

async function fetchJSON(url) {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

// ===== HTML Helpers =====

// Escape a value for safe interpolation into HTML (element content or
// double-quoted attribute values). Pure string version so it also works
// outside the DOM (tests) and on non-string API values.
function escapeHtml(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// ===== Timing Helpers =====

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===== Date Range Helpers =====

// Presets offered by the date range filter. The offset is subtracted from
// today to get the start of the range; "all" applies no date filter and
// "custom" is driven by the two date inputs instead.
const DATE_RANGE_PRESETS = {
  all: {},
  "30d": { days: 30 },
  "3m": { months: 3 },
  "12m": { months: 12 },
  custom: {},
};

function isDateRangePreset(preset) {
  return Object.prototype.hasOwnProperty.call(DATE_RANGE_PRESETS, preset);
}

// Format a Date as the YYYY-MM-DD string the iNaturalist API expects for
// d1/d2. Uses local calendar fields — toISOString() would report the
// previous day for anyone behind UTC.
function formatDateParam(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Subtract whole months, clamping the day to the end of the target month so
// that 3 months before May 31 is Feb 28 rather than spilling into March.
function subtractMonths(date, months) {
  const result = new Date(date.getFullYear(), date.getMonth(), 1);
  result.setMonth(result.getMonth() - months);
  const lastDayOfMonth = new Date(result.getFullYear(), result.getMonth() + 1, 0).getDate();
  result.setDate(Math.min(date.getDate(), lastDayOfMonth));
  return result;
}

// Resolve the selected preset (or the custom from/to values) into the
// iNaturalist d1/d2 params. Either side may be null, meaning "unbounded".
function resolveDateRange(preset, customFrom, customTo, today = new Date()) {
  if (preset === "custom") {
    return { d1: customFrom || null, d2: customTo || null };
  }

  const offset = isDateRangePreset(preset) ? DATE_RANGE_PRESETS[preset] : null;
  if (!offset || (!offset.days && !offset.months)) {
    return { d1: null, d2: null };
  }

  const start = offset.days
    ? new Date(today.getFullYear(), today.getMonth(), today.getDate() - offset.days)
    : subtractMonths(today, offset.months);

  return { d1: formatDateParam(start), d2: formatDateParam(today) };
}

// Build the &d1=...&d2=... query fragment for a resolved range.
function buildDateRangeParams(range) {
  if (!range) return "";
  let params = "";
  if (range.d1) params += `&d1=${encodeURIComponent(range.d1)}`;
  if (range.d2) params += `&d2=${encodeURIComponent(range.d2)}`;
  return params;
}

// ===== Init helpers =====

// Initialize username from URL or localStorage
function initUsername(inputElement) {
  const { username: urlUsername } = getUrlParams();
  const savedUsername = getSavedUsername();

  if (urlUsername) {
    if (inputElement) inputElement.value = urlUsername;
    saveUsername(urlUsername);
    return urlUsername;
  } else if (savedUsername) {
    if (inputElement) inputElement.value = savedUsername;
    return savedUsername;
  }
  return null;
}

// Initialize place from URL or localStorage
function initPlace(inputElement, idInputElement) {
  const { placeId: urlPlaceId, placeName: urlPlaceName } = getUrlParams();
  const savedPlace = getSavedPlace();

  if (urlPlaceId && urlPlaceName) {
    if (inputElement) inputElement.value = urlPlaceName;
    if (idInputElement) idInputElement.value = urlPlaceId;
    savePlace(urlPlaceId, urlPlaceName);
    return { id: urlPlaceId, name: urlPlaceName };
  } else if (savedPlace.id && savedPlace.name) {
    if (inputElement) inputElement.value = savedPlace.name;
    if (idInputElement) idInputElement.value = savedPlace.id;
    return savedPlace;
  }
  return null;
}

// Initialize language select from localStorage
function initLanguage(selectElement) {
  const savedLanguage = getSavedLanguage();
  if (savedLanguage && selectElement) {
    selectElement.value = savedLanguage;
  }
  if (selectElement) {
    selectElement.addEventListener("change", () => {
      saveLanguage(selectElement.value);
    });
  }
  return savedLanguage;
}

// Allow unit tests (Node) to import the pure helpers; no-op in the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    escapeHtml,
    sleep,
    DATE_RANGE_PRESETS,
    isDateRangePreset,
    formatDateParam,
    subtractMonths,
    resolveDateRange,
    buildDateRangeParams,
  };
}
