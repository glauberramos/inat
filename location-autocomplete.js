/**
 * Location Autocomplete Module
 * Provides iNaturalist places autocomplete functionality with optional localStorage persistence.
 * With `includeProjects: true` the same input also searches projects; the picked
 * project id goes into `options.projectIdInput` (a hidden input) instead of placeIdInput.
 */

// Place type mappings
const LOCATION_PLACE_TYPES = {
  6: "Street",
  7: "Town",
  8: "State",
  9: "County",
  10: "Local Admin",
  12: "Country",
  13: "Island",
  16: "Suburb",
  19: "Colloquial",
  20: "Point of Interest",
  21: "Region",
  22: "Continent",
  24: "Estate",
  25: "Historical County",
  29: "Drainage",
  100: "Open Space",
  1001: "Territory",
  1002: "District",
  1003: "Province",
  1004: "Commune",
  1005: "Municipality",
  1006: "Prefecture",
  1007: "Department",
  1008: "Canton",
  1009: "Parish",
  1010: "Borough",
  1011: "Ward",
  1013: "Suburb",
};

function getLocationPlaceTypeName(place) {
  if (place.place_type_name) return place.place_type_name;
  if (place.place_type && LOCATION_PLACE_TYPES[place.place_type]) {
    return LOCATION_PLACE_TYPES[place.place_type];
  }
  return "";
}

/**
 * Normalize raw API results into one suggestion list: places first, then
 * projects. Each item: { type: "place"|"project", id, name, label, location }.
 */
function buildLocationSuggestions(places, projects) {
  const placeItems = (places || []).map(function (place) {
    return {
      type: "place",
      id: place.id,
      name: place.display_name || place.name,
      label: getLocationPlaceTypeName(place),
      location: place.location || "",
    };
  });
  const projectItems = (projects || []).map(function (project) {
    return {
      type: "project",
      id: project.id,
      name: project.title,
      label: "Project",
      location: "",
    };
  });
  return placeItems.concat(projectItems);
}

function initLocationAutocomplete(inputElement, autocompleteElement, placeIdInput, options) {
  const persistToStorage = options?.persistToStorage || false;
  const loadFromStorage = options?.loadFromStorage || false;
  const loadFromUrl = options?.loadFromUrl || false;
  const updateUrlOnSelect = options?.updateUrlOnSelect || false;
  const onSelect = options?.onSelect || null;
  const onClear = options?.onClear || null;
  const debounceMs = options?.debounceMs || 300;
  const minChars = options?.minChars || 2;
  const maxResults = options?.maxResults || 20;
  const suggestionClass = options?.suggestionClass || "username-suggestion";
  const nameClass = options?.nameClass || "username-name";
  const infoClass = options?.infoClass || "username-info";
  const includeProjects = options?.includeProjects || false;
  const projectIdInput = options?.projectIdInput || null;

  let searchTimeout = null;
  let selectedPlace = null;

  function setIds(placeId, projectId) {
    if (placeIdInput) placeIdInput.value = placeId || "";
    if (projectIdInput) projectIdInput.value = projectId || "";
  }

  function updateUrl(selected) {
    const url = new URL(window.location);
    url.searchParams.delete("place_id");
    url.searchParams.delete("place");
    url.searchParams.delete("project_id");
    url.searchParams.delete("project");
    if (selected && selected.type === "project") {
      url.searchParams.set("project_id", selected.id);
      url.searchParams.set("project", selected.name);
    } else if (selected) {
      url.searchParams.set("place_id", selected.id);
      url.searchParams.set("place", selected.name);
    }
    window.history.replaceState({}, "", url);
  }

  function clearStorage() {
    localStorage.removeItem("inatPlaceId");
    localStorage.removeItem("inatPlaceName");
    localStorage.removeItem("inatProjectId");
    localStorage.removeItem("inatProjectName");
  }

  function saveToStorage(selected) {
    clearStorage();
    if (selected.type === "project") {
      localStorage.setItem("inatProjectId", selected.id);
      localStorage.setItem("inatProjectName", selected.name);
    } else {
      localStorage.setItem("inatPlaceId", selected.id);
      localStorage.setItem("inatPlaceName", selected.name);
    }
  }

  function hideAutocomplete() {
    autocompleteElement.innerHTML = "";
    autocompleteElement.style.display = "none";
  }

  function applySelection(selected) {
    inputElement.value = selected.name;
    if (selected.type === "project") {
      setIds("", selected.id);
    } else {
      setIds(selected.id, "");
    }
    selectedPlace = selected;
    if (persistToStorage) {
      saveToStorage(selected);
    }
  }

  function selectSuggestion(item) {
    applySelection({
      type: item.dataset.type || "place",
      id: item.dataset.placeId,
      name: item.dataset.placeName,
      location: item.dataset.placeLocation,
    });

    if (updateUrlOnSelect) {
      updateUrl(selectedPlace);
    }

    if (onSelect) {
      onSelect(selectedPlace);
    }

    hideAutocomplete();
  }

  function renderSuggestions(items) {
    autocompleteElement.innerHTML = items
      .slice(0, maxResults)
      .map(function (item) {
        return `
          <div class="${suggestionClass}"
               data-type="${item.type}"
               data-place-id="${item.id}"
               data-place-name="${escapeHtml(item.name)}"
               data-place-location="${item.location}">
            <span class="${nameClass}">${escapeHtml(item.name)}</span>
            ${item.label ? `<span class="${infoClass}">${item.label.toUpperCase()}</span>` : ""}
          </div>
        `;
      })
      .join("");

    autocompleteElement.style.display = "block";

    autocompleteElement.querySelectorAll("." + suggestionClass).forEach(function (item) {
      item.addEventListener("click", function () {
        selectSuggestion(item);
      });
    });
  }

  function fetchResults(path) {
    return fetch(API_BASE + path)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return data.results || [];
      });
  }

  function search(query) {
    const q = encodeURIComponent(query);
    // When projects are included, split the result budget between the two lists
    const perList = includeProjects ? Math.ceil(maxResults / 2) : maxResults;
    const requests = [fetchResults("/places/autocomplete?q=" + q + "&per_page=" + perList)];
    if (includeProjects) {
      requests.push(fetchResults("/projects?q=" + q + "&per_page=" + perList));
    }

    Promise.all(requests)
      .then(function (results) {
        const items = buildLocationSuggestions(results[0], results[1]);
        if (items.length > 0) {
          renderSuggestions(items);
        } else {
          hideAutocomplete();
        }
      })
      .catch(function (error) {
        console.error("Error fetching places:", error);
        hideAutocomplete();
      });
  }

  function handleInput(e) {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    setIds("", "");
    selectedPlace = null;

    if (query.length < minChars) {
      hideAutocomplete();

      if (query.length === 0) {
        if (persistToStorage) {
          clearStorage();
        }
        if (updateUrlOnSelect) {
          updateUrl(null);
        }
        if (onClear) {
          onClear();
        }
      }
      return;
    }

    searchTimeout = setTimeout(function () {
      search(query);
    }, debounceMs);
  }

  function handleClickOutside(e) {
    if (!inputElement.contains(e.target) && !autocompleteElement.contains(e.target)) {
      hideAutocomplete();
    }
  }

  function loadFromUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const urlPlaceId = urlParams.get("place_id");
    const urlPlaceName = urlParams.get("place");
    const urlProjectId = urlParams.get("project_id");
    const urlProjectName = urlParams.get("project");

    if (includeProjects && urlProjectId && urlProjectName) {
      applySelection({ type: "project", id: urlProjectId, name: urlProjectName });
      return true;
    }
    if (urlPlaceId && urlPlaceName) {
      applySelection({ type: "place", id: urlPlaceId, name: urlPlaceName });
      return true;
    }
    return false;
  }

  function loadSavedPlace() {
    const savedPlaceId = localStorage.getItem("inatPlaceId");
    const savedPlaceName = localStorage.getItem("inatPlaceName");
    const savedProjectId = localStorage.getItem("inatProjectId");
    const savedProjectName = localStorage.getItem("inatProjectName");

    if (includeProjects && savedProjectId && savedProjectName) {
      applySelection({ type: "project", id: savedProjectId, name: savedProjectName });
      return true;
    }
    if (savedPlaceId && savedPlaceName) {
      applySelection({ type: "place", id: savedPlaceId, name: savedPlaceName });
      return true;
    }
    return false;
  }

  // Initialize
  if (loadFromUrl) {
    loadFromUrlParams();
  }
  if (loadFromStorage && !selectedPlace) {
    loadSavedPlace();
  }

  inputElement.addEventListener("input", handleInput);
  document.addEventListener("click", handleClickOutside);

  // Return public methods
  return {
    getSelectedPlace: function () {
      return selectedPlace;
    },
    getPlaceId: function () {
      if (placeIdInput) return placeIdInput.value;
      return selectedPlace && selectedPlace.type !== "project" ? selectedPlace.id : null;
    },
    getProjectId: function () {
      if (projectIdInput) return projectIdInput.value;
      return selectedPlace && selectedPlace.type === "project" ? selectedPlace.id : null;
    },
    getPlaceName: function () {
      return inputElement.value.trim();
    },
    setPlace: function (placeId, placeName) {
      applySelection({ type: "place", id: placeId, name: placeName });
    },
    clear: function () {
      inputElement.value = "";
      setIds("", "");
      selectedPlace = null;
      hideAutocomplete();

      if (persistToStorage) {
        clearStorage();
      }
      if (updateUrlOnSelect) {
        updateUrl(null);
      }
      if (onClear) {
        onClear();
      }
    },
  };
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { buildLocationSuggestions, initLocationAutocomplete };
}
