// Reusable autocomplete functionality for iNaturalist tools

// ===== Generic Autocomplete =====

function createAutocomplete(config) {
  const {
    inputElement,
    containerElement,
    fetchUrl,
    formatResult,
    onSelect,
    minChars = 2,
    debounceMs = 300,
    maxResults = 10,
    onClear = null,
  } = config;

  let searchTimeout = null;

  inputElement.addEventListener("input", (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();

    if (query.length < minChars) {
      containerElement.innerHTML = "";
      containerElement.classList.remove("active");
      containerElement.style.display = "none";
      if (query.length === 0 && onClear) {
        onClear();
      }
      return;
    }

    searchTimeout = setTimeout(async () => {
      try {
        const url = typeof fetchUrl === "function" ? fetchUrl(query) : fetchUrl.replace("{query}", encodeURIComponent(query));
        const response = await fetch(url);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
          const results = data.results.slice(0, maxResults);
          containerElement.innerHTML = results.map(formatResult).join("");
          containerElement.classList.add("active");
          containerElement.style.display = "block";

          containerElement.querySelectorAll(".autocomplete-item").forEach((item, index) => {
            item.addEventListener("click", () => {
              onSelect(results[index], item);
              containerElement.innerHTML = "";
              containerElement.classList.remove("active");
              containerElement.style.display = "none";
            });
          });
        } else {
          containerElement.innerHTML = "";
          containerElement.classList.remove("active");
          containerElement.style.display = "none";
        }
      } catch (error) {
        console.error("Autocomplete error:", error);
        containerElement.innerHTML = "";
        containerElement.classList.remove("active");
        containerElement.style.display = "none";
      }
    }, debounceMs);
  });

  // Return cleanup function
  return {
    clear: () => {
      containerElement.innerHTML = "";
      containerElement.classList.remove("active");
      containerElement.style.display = "none";
    },
  };
}

// ===== Username Autocomplete =====

function initUsernameAutocomplete(inputElement, containerElement, onSelect) {
  return createAutocomplete({
    inputElement,
    containerElement,
    fetchUrl: (query) => `${API_BASE}/users/autocomplete?q=${encodeURIComponent(query)}&per_page=10`,
    formatResult: (user) => `
      <div class="autocomplete-item" data-login="${user.login}">
        <div class="autocomplete-name">${user.login}</div>
        <div class="autocomplete-login">${user.name || ""} · ${(user.observations_count || 0).toLocaleString()} observations</div>
      </div>
    `,
    onSelect: (user, item) => {
      inputElement.value = user.login;
      if (onSelect) onSelect(user);
    },
  });
}

// ===== Place Autocomplete =====

function initPlaceAutocomplete(inputElement, containerElement, onSelect, idInputElement = null) {
  return createAutocomplete({
    inputElement,
    containerElement,
    fetchUrl: (query) => `${API_BASE}/places/autocomplete?q=${encodeURIComponent(query)}&per_page=10`,
    formatResult: (place) => `
      <div class="autocomplete-item" data-id="${place.id}" data-name="${escapeHtml(place.display_name)}">
        <div class="autocomplete-name">${escapeHtml(place.display_name)}</div>
      </div>
    `,
    onSelect: (place, item) => {
      inputElement.value = place.display_name;
      if (idInputElement) idInputElement.value = place.id;
      if (onSelect) onSelect(place);
    },
    onClear: () => {
      if (idInputElement) idInputElement.value = "";
      if (onSelect) onSelect(null);
    },
  });
}

// ===== Taxon Autocomplete =====

function initTaxonAutocomplete(inputElement, containerElement, onSelect, idInputElement = null, rankFilter = null) {
  const defaultRankFilter = "kingdom,phylum,subphylum,class,subclass,order,suborder,family,subfamily,tribe,subtribe,genus,subgenus";
  const ranks = rankFilter || defaultRankFilter;

  return createAutocomplete({
    inputElement,
    containerElement,
    fetchUrl: (query) => `${API_BASE}/taxa/autocomplete?q=${encodeURIComponent(query)}&per_page=10&rank=${ranks}`,
    formatResult: (taxon) => `
      <div class="autocomplete-item" data-id="${taxon.id}" data-name="${escapeHtml(taxon.name)}">
        <div class="autocomplete-name">${escapeHtml(taxon.preferred_common_name || taxon.name)}</div>
        <div class="autocomplete-rank">${taxon.rank}${taxon.preferred_common_name ? ` - ${escapeHtml(taxon.name)}` : ""}</div>
      </div>
    `,
    onSelect: (taxon, item) => {
      inputElement.value = taxon.name;
      if (idInputElement) idInputElement.value = taxon.id;
      if (onSelect) onSelect(taxon);
    },
    onClear: () => {
      if (idInputElement) idInputElement.value = "";
      if (onSelect) onSelect(null);
    },
  });
}

// ===== Project Autocomplete =====

function initProjectAutocomplete(inputElement, containerElement, onSelect, idInputElement = null) {
  return createAutocomplete({
    inputElement,
    containerElement,
    fetchUrl: (query) => `${API_BASE}/projects/autocomplete?q=${encodeURIComponent(query)}&per_page=10`,
    formatResult: (project) => `
      <div class="autocomplete-item" data-id="${project.id}" data-name="${escapeHtml(project.title)}">
        <div class="autocomplete-name">${escapeHtml(project.title)}</div>
      </div>
    `,
    onSelect: (project, item) => {
      inputElement.value = project.title;
      if (idInputElement) idInputElement.value = project.id;
      if (onSelect) onSelect(project);
    },
    onClear: () => {
      if (idInputElement) idInputElement.value = "";
      if (onSelect) onSelect(null);
    },
  });
}

// ===== Hide all autocompletes on outside click =====

function initAutocompleteClickOutside(autocompleteConfigs) {
  document.addEventListener("click", (e) => {
    autocompleteConfigs.forEach(({ input, container }) => {
      if (!input.contains(e.target) && !container.contains(e.target)) {
        container.classList.remove("active");
        container.style.display = "none";
      }
    });
  });
}
