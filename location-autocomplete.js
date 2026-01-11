/**
 * Location Autocomplete Module
 * Provides iNaturalist places autocomplete functionality with optional localStorage persistence
 */

function initLocationAutocomplete(
  inputElement,
  autocompleteElement,
  placeIdInput,
  options
) {
  const persistToStorage = options?.persistToStorage || false;
  const loadFromStorage = options?.loadFromStorage || false;
  const loadFromUrl = options?.loadFromUrl || false;
  const updateUrlOnSelect = options?.updateUrlOnSelect || false;
  const onSelect = options?.onSelect || null;
  const onClear = options?.onClear || null;
  const debounceMs = options?.debounceMs || 300;
  const minChars = options?.minChars || 2;
  const maxResults = options?.maxResults || 20;
  const suggestionClass = options?.suggestionClass || 'username-suggestion';
  const nameClass = options?.nameClass || 'username-name';
  const infoClass = options?.infoClass || 'username-info';

  let searchTimeout = null;
  let selectedPlace = null;

  // Place type mappings
  const placeTypes = {
    6: 'Street',
    7: 'Town',
    8: 'State',
    9: 'County',
    10: 'Local Admin',
    12: 'Country',
    13: 'Island',
    16: 'Suburb',
    19: 'Colloquial',
    20: 'Point of Interest',
    21: 'Region',
    22: 'Continent',
    24: 'Estate',
    25: 'Historical County',
    29: 'Drainage',
    100: 'Open Space',
    1001: 'Territory',
    1002: 'District',
    1003: 'Province',
    1004: 'Commune',
    1005: 'Municipality',
    1006: 'Prefecture',
    1007: 'Department',
    1008: 'Canton',
    1009: 'Parish',
    1010: 'Borough',
    1011: 'Ward',
    1013: 'Suburb'
  };

  function getPlaceTypeName(place) {
    if (place.place_type_name) return place.place_type_name;
    if (place.place_type && placeTypes[place.place_type]) {
      return placeTypes[place.place_type];
    }
    return '';
  }

  function updateUrl(placeId, placeName) {
    const url = new URL(window.location);
    if (placeId && placeName) {
      url.searchParams.set('place_id', placeId);
      url.searchParams.set('place', placeName);
    } else {
      url.searchParams.delete('place_id');
      url.searchParams.delete('place');
    }
    window.history.replaceState({}, '', url);
  }

  function clearStorage() {
    localStorage.removeItem('inatPlaceId');
    localStorage.removeItem('inatPlaceName');
  }

  function hideAutocomplete() {
    autocompleteElement.innerHTML = '';
    autocompleteElement.style.display = 'none';
  }

  function selectPlace(item) {
    const placeId = item.dataset.placeId;
    const placeName = item.dataset.placeName;
    const placeLocation = item.dataset.placeLocation;

    inputElement.value = placeName;
    if (placeIdInput) {
      placeIdInput.value = placeId;
    }

    selectedPlace = {
      id: placeId,
      name: placeName,
      location: placeLocation
    };

    if (persistToStorage) {
      localStorage.setItem('inatPlaceId', placeId);
      localStorage.setItem('inatPlaceName', placeName);
    }

    if (updateUrlOnSelect) {
      updateUrl(placeId, placeName);
    }

    if (onSelect) {
      onSelect(selectedPlace);
    }

    hideAutocomplete();
  }

  function renderSuggestions(places) {
    autocompleteElement.innerHTML = places
      .slice(0, maxResults)
      .map(function(place) {
        var placeTypeName = getPlaceTypeName(place);
        return `
          <div class="${suggestionClass}"
               data-place-id="${place.id}"
               data-place-name="${place.display_name || place.name}"
               data-place-location="${place.location || ''}">
            <span class="${nameClass}">${place.display_name || place.name}</span>
            ${placeTypeName ? `<span class="${infoClass}">${placeTypeName.toUpperCase()}</span>` : ''}
          </div>
        `;
      })
      .join('');

    autocompleteElement.style.display = 'block';

    autocompleteElement.querySelectorAll('.' + suggestionClass).forEach(function(item) {
      item.addEventListener('click', function() {
        selectPlace(item);
      });
    });
  }

  function search(query) {
    fetch(
      'https://api.inaturalist.org/v1/places/autocomplete?q=' +
      encodeURIComponent(query) +
      '&per_page=' + maxResults
    )
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        if (data.results && data.results.length > 0) {
          renderSuggestions(data.results);
        } else {
          hideAutocomplete();
        }
      })
      .catch(function(error) {
        console.error('Error fetching places:', error);
        hideAutocomplete();
      });
  }

  function handleInput(e) {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (placeIdInput) {
      placeIdInput.value = '';
    }
    selectedPlace = null;

    if (query.length < minChars) {
      hideAutocomplete();

      if (query.length === 0) {
        if (persistToStorage) {
          clearStorage();
        }
        if (updateUrlOnSelect) {
          updateUrl(null, null);
        }
        if (onClear) {
          onClear();
        }
      }
      return;
    }

    searchTimeout = setTimeout(function() {
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
    const urlPlaceId = urlParams.get('place_id');
    const urlPlaceName = urlParams.get('place');

    if (urlPlaceId && urlPlaceName) {
      inputElement.value = urlPlaceName;
      if (placeIdInput) {
        placeIdInput.value = urlPlaceId;
      }
      selectedPlace = { id: urlPlaceId, name: urlPlaceName };

      if (persistToStorage) {
        localStorage.setItem('inatPlaceId', urlPlaceId);
        localStorage.setItem('inatPlaceName', urlPlaceName);
      }
      return true;
    }
    return false;
  }

  function loadSavedPlace() {
    const savedPlaceId = localStorage.getItem('inatPlaceId');
    const savedPlaceName = localStorage.getItem('inatPlaceName');

    if (savedPlaceId && savedPlaceName) {
      inputElement.value = savedPlaceName;
      if (placeIdInput) {
        placeIdInput.value = savedPlaceId;
      }
      selectedPlace = { id: savedPlaceId, name: savedPlaceName };
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

  inputElement.addEventListener('input', handleInput);
  document.addEventListener('click', handleClickOutside);

  // Return public methods
  return {
    getSelectedPlace: function() {
      return selectedPlace;
    },
    getPlaceId: function() {
      return placeIdInput ? placeIdInput.value : (selectedPlace ? selectedPlace.id : null);
    },
    getPlaceName: function() {
      return inputElement.value.trim();
    },
    setPlace: function(placeId, placeName) {
      inputElement.value = placeName;
      if (placeIdInput) {
        placeIdInput.value = placeId;
      }
      selectedPlace = { id: placeId, name: placeName };

      if (persistToStorage) {
        localStorage.setItem('inatPlaceId', placeId);
        localStorage.setItem('inatPlaceName', placeName);
      }
    },
    clear: function() {
      inputElement.value = '';
      if (placeIdInput) {
        placeIdInput.value = '';
      }
      selectedPlace = null;
      hideAutocomplete();

      if (persistToStorage) {
        clearStorage();
      }
      if (updateUrlOnSelect) {
        updateUrl(null, null);
      }
      if (onClear) {
        onClear();
      }
    }
  };
}
