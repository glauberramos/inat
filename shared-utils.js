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

function getUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  return {
    username: urlParams.get("user"),
    placeId: urlParams.get("place_id"),
    placeName: urlParams.get("place"),
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
    element.classList.add("show");
  }
}

function hideError(elementOrId) {
  const element =
    typeof elementOrId === "string" ? document.getElementById(elementOrId) : elementOrId;
  if (element) {
    element.style.display = "none";
    element.classList.remove("show");
  }
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
// button to toggle the chat. Replaces the per-page inline boilerplate.
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

  let feedbackOpen = false;
  btn.addEventListener("click", () => {
    if (feedbackOpen) {
      $crisp.push(["do", "chat:close"]);
      $crisp.push(["do", "chat:hide"]);
      feedbackOpen = false;
    } else {
      $crisp.push(["do", "chat:show"]);
      $crisp.push(["do", "chat:open"]);
      feedbackOpen = true;
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
  module.exports = { escapeHtml, sleep };
}
