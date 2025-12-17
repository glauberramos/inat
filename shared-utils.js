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
  const element = typeof elementOrId === "string"
    ? document.getElementById(elementOrId)
    : elementOrId;
  if (element) {
    element.textContent = message;
    element.style.display = "block";
    element.classList.add("show");
  }
}

function hideError(elementOrId) {
  const element = typeof elementOrId === "string"
    ? document.getElementById(elementOrId)
    : elementOrId;
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

// ===== Feedback Button =====

function initFeedbackButton(buttonId = "feedbackBtn") {
  let feedbackOpen = false;
  const btn = document.getElementById(buttonId);
  if (btn && typeof $pipeback !== "undefined") {
    btn.addEventListener("click", () => {
      if (feedbackOpen) {
        $pipeback.close();
        feedbackOpen = false;
      } else {
        $pipeback.open();
        feedbackOpen = true;
      }
    });
  }
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

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
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
