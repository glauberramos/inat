document.addEventListener("DOMContentLoaded", function () {
  const placeNameInput = document.getElementById("placeNameInput");
  const placeIdInput = document.getElementById("placeIdInput");
  const usernameInput = document.getElementById("usernameInput");
  const taxonSelect = document.getElementById("taxonSelect");
  const searchButton = document.getElementById("searchButton");
  const speciesGrid = document.getElementById("speciesGrid");
  const loading = document.getElementById("loading");
  const observedCount = document.getElementById("observedCount");
  const totalCount = document.getElementById("totalCount");
  const percentObserved = document.getElementById("percentObserved");
  const progressBar = document.getElementById("progressBar");
  const showMissingCheckbox = document.getElementById("showMissingOnly");
  const showSpottedCheckbox = document.getElementById("showSpottedOnly");
  const advancedOptionsButton = document.getElementById(
    "advancedOptionsButton"
  );
  const advancedOptionsSection = document.getElementById(
    "advancedOptionsSection"
  );
  const taxonIdOverrideInput = document.getElementById("taxonIdOverrideInput");
  const wildCheckbox = document.getElementById("wildCheckbox");
  const includeAllPlacesCheckbox = document.getElementById(
    "includeAllPlacesCheckbox"
  );
  const researchGradeCheckbox = document.getElementById(
    "researchGradeCheckbox"
  );
  const threatenedCheckbox = document.getElementById("threatenedCheckbox");
  const verifiableCheckbox = document.getElementById("verifiableCheckbox");
  const languageSelect = document.getElementById("languageSelect");
  const downloadButton = document.getElementById("downloadButton");
  const locationName = document.getElementById("locationName");

  // Load saved username, place ID, taxon, and limit preference from localStorage
  const savedUsername = localStorage.getItem("inatUsername");
  const savedPlaceId = localStorage.getItem("inatPlaceId");
  const savedPlaceName = localStorage.getItem("inatPlaceName");
  const savedTaxon = localStorage.getItem("inatTaxonId");
  const savedLimit = localStorage.getItem("inatLimit");
  const savedProject = localStorage.getItem("inatProject");
  const savedProjectId = localStorage.getItem("inatProjectId");

  if (savedPlaceId) {
    placeIdInput.value = savedPlaceId;
  }

  if (savedPlaceName) {
    placeNameInput.value = savedPlaceName;
  }

  if (savedProject) {
    placeNameInput.value = savedProject;
  }

  if (
    savedTaxon &&
    [...taxonSelect.options].map((option) => option.value).indexOf(savedTaxon) >
      -1
  ) {
    taxonSelect.value = savedTaxon;
  }

  if (savedLimit) {
    const limitSelect = document.getElementById("limitSelect");
    if (limitSelect) {
      limitSelect.value = savedLimit;
    }
  }

  if (savedUsername) {
    usernameInput.value = savedUsername;
  }

  updateLocationName();

  // Save username when it changes
  usernameInput.addEventListener("change", () => {
    const username = usernameInput.value.trim();
    if (username) {
      localStorage.setItem("inatUsername", username);
    } else {
      localStorage.removeItem("inatUsername");
    }
  });

  // Save place name when it changes
  placeNameInput.addEventListener("change", () => {
    const placeName = placeNameInput.value.trim();

    if (placeName == "") {
      localStorage.removeItem("inatPlaceName");
      localStorage.removeItem("inatPlaceId");
      localStorage.removeItem("inatProject");
      localStorage.removeItem("inatProjectId");
      placeIdInput.value = "";
      placeNameInput.value = "";
      updateLocationName();
    }
  });

  // Save taxon name when it changes
  taxonIdOverrideInput.addEventListener("change", () => {
    const taxonName = taxonIdOverrideInput.value.trim();

    if (taxonName == "") {
      localStorage.removeItem("inatTaxonId");
      taxonIdOverrideInput.value = "";
    }
  });

  // Update grid class name when taxon changes
  taxonSelect.addEventListener("change", (selected) => {
    // Save the selected taxon to localStorage
    localStorage.setItem("inatTaxonId", taxonSelect.value);

    // Populate the taxonIdOverrideInput with the selected value, or clear if 'all'
    if (taxonIdOverrideInput) {
      if (taxonSelect.value === "all") {
        taxonIdOverrideInput.value = "";
      } else {
        taxonIdOverrideInput.value =
          taxonSelect.options[taxonSelect.selectedIndex].text;
      }
    }
  });

  // Add event listener for limit selection
  const limitSelect = document.getElementById("limitSelect");
  if (limitSelect) {
    limitSelect.addEventListener("change", function () {
      // Save the selected limit to localStorage
      localStorage.setItem("inatLimit", this.value);
    });
  }

  // Add event listeners for checkboxes
  showMissingCheckbox.addEventListener("change", () => {
    if (showMissingCheckbox.checked) {
      showSpottedCheckbox.checked = false;
    }
    filterSpecies();
  });

  showSpottedCheckbox.addEventListener("change", () => {
    if (showSpottedCheckbox.checked) {
      showMissingCheckbox.checked = false;
    }
    filterSpecies();
  });

  if (advancedOptionsButton && advancedOptionsSection) {
    advancedOptionsButton.addEventListener("click", function () {
      if (advancedOptionsSection.style.display === "none") {
        advancedOptionsSection.style.display = "block";
      } else {
        advancedOptionsSection.style.display = "none";
      }
    });
  }

  if (taxonIdOverrideInput) {
    taxonIdOverrideInput.addEventListener("input", function () {
      if (taxonSelect) {
        taxonSelect.value = "all";
      }
    });
  }

  // Allow Enter key to trigger search on username input
  usernameInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      searchEspecies();
    }
  });

  async function searchEspecies() {
    placeId = placeIdInput.value.trim();
    const username = usernameInput.value.trim();
    let taxonId = taxonSelect.value;

    // Check if we have a taxon ID from the search
    if (taxonIdOverrideInput && taxonIdOverrideInput.value.trim() !== "") {
      taxonId = localStorage.getItem("inatTaxonId");
    }

    showMissingCheckbox.checked = false;
    showSpottedCheckbox.checked = false;

    if (!username) {
      alert("Please enter username");
      return;
    }

    if (!placeId) {
      placeId = "any";
    }

    try {
      loading.style.display = "block";
      speciesGrid.innerHTML = "";
      updateStatus(0, 0); // Reset status

      // First, get the user's observations
      const userObservations = await getUserObservations(
        username,
        placeId,
        taxonId
      );

      // Then get the top species for the place
      const topSpecies = await getTopSpecies(placeId, taxonId);

      // Display the species
      displaySpecies(topSpecies, userObservations);
      updateLocationName();
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while fetching the data");
    } finally {
      loading.style.display = "none";
    }
  }

  searchButton.addEventListener("click", async () => {
    searchEspecies();
  });

  // Add event listener for the advanced search button
  const searchButtonAdvanced = document.getElementById("searchButtonAdvanced");
  if (searchButtonAdvanced) {
    searchButtonAdvanced.addEventListener("click", async () => {
      searchEspecies();
    });
  }

  async function getUserObservations(username, placeId, taxonId) {
    const taxonParam = taxonId === "all" ? "" : `&taxon_id=${taxonId}`;
    const captiveParam =
      wildCheckbox && wildCheckbox.checked ? "&captive=false" : "";
    const researchGrade =
      researchGradeCheckbox && researchGradeCheckbox.checked
        ? "&quality_grade=research"
        : "";
    const threatened =
      threatenedCheckbox && threatenedCheckbox.checked
        ? "&threatened=true"
        : "";
    const verifiable =
      verifiableCheckbox && verifiableCheckbox.checked
        ? "&verifiable=true"
        : "";

    // Get selected months
    const monthCheckboxes = document.querySelectorAll(
      ".month-checkbox:checked"
    );
    const selectedMonths = Array.from(monthCheckboxes).map((cb) => cb.value);
    const monthParam =
      selectedMonths.length > 0 ? `&month=${selectedMonths.join(",")}` : "";

    // Check if we have a project selected instead of a place
    const projectId = localStorage.getItem("inatProjectId");
    let allPlacesParam = "";

    if (projectId) {
      // If project is selected, use project filtering
      allPlacesParam =
        includeAllPlacesCheckbox && includeAllPlacesCheckbox.checked
          ? ""
          : `&project_id=${projectId}`;
    } else {
      // If place is selected, use place filtering
      allPlacesParam =
        includeAllPlacesCheckbox && includeAllPlacesCheckbox.checked
          ? ""
          : `&place_id=${placeId}`;
    }

    const url = `https://api.inaturalist.org/v1/observations/taxonomy?user_login=${username}${allPlacesParam}${taxonParam}${captiveParam}${researchGrade}${threatened}${verifiable}`;
    const response = await fetch(url);
    const data = await response.json();

    let allObservationIds = new Set(data.results.map((obs) => obs.id));

    return allObservationIds;
  }

  async function getTopSpecies(placeId, taxonId) {
    const taxonParam = taxonId === "all" ? "" : `&taxon_id=${taxonId}`;
    const captiveParam =
      wildCheckbox && wildCheckbox.checked ? "&captive=false" : "";
    const researchGrade =
      researchGradeCheckbox && researchGradeCheckbox.checked
        ? "&quality_grade=research"
        : "";
    const threatened =
      threatenedCheckbox && threatenedCheckbox.checked
        ? "&threatened=true"
        : "";
    const verifiable =
      verifiableCheckbox && verifiableCheckbox.checked
        ? "&verifiable=true"
        : "";
    const limit = document.getElementById("limitSelect").value;
    const selectedLanguage = languageSelect ? languageSelect.value : "en";
    const languageParam =
      selectedLanguage !== "en" ? `&locale=${selectedLanguage}` : "";

    // Get selected months
    const monthCheckboxes = document.querySelectorAll(
      ".month-checkbox:checked"
    );
    const selectedMonths = Array.from(monthCheckboxes).map((cb) => cb.value);
    const monthParam =
      selectedMonths.length > 0 ? `&month=${selectedMonths.join(",")}` : "";

    // Check if we have a project selected instead of a place
    const projectId = localStorage.getItem("inatProjectId");
    let locationParam = "";

    if (projectId) {
      // If project is selected, use project filtering
      locationParam = `&project_id=${projectId}`;
    } else {
      // If place is selected, use place filtering
      locationParam = `&place_id=${placeId}`;
    }

    if (limit === "5000") {
      const getSpeciesCounts = (page = 1) =>
        fetch(
          `https://api.inaturalist.org/v1/observations/species_counts?${locationParam.substring(
            1
          )}&per_page=500&page=${page}${taxonParam}${captiveParam}${researchGrade}${threatened}${verifiable}${languageParam}${monthParam}`
        )
          .then((response) => response.json())
          .then((data) => data.results);

      const speciesCountsPromises = [];
      for (let i = 1; i <= 10; i++) {
        speciesCountsPromises.push(getSpeciesCounts(i));
      }
      const speciesCounts = await Promise.all([...speciesCountsPromises]);

      return speciesCounts.flat();
    } else if (limit === "1000") {
      const results = [];

      // First call: get first 500 species
      const url1 = `https://api.inaturalist.org/v1/observations/species_counts?${locationParam.substring(
        1
      )}&per_page=500${taxonParam}${captiveParam}${researchGrade}${threatened}${verifiable}${languageParam}${monthParam}`;
      const response1 = await fetch(url1);
      const data1 = await response1.json();
      results.push(...data1.results);

      // Second call: get next 500 species (page 2)
      const url2 = `https://api.inaturalist.org/v1/observations/species_counts?${locationParam.substring(
        1
      )}&per_page=500&page=2${taxonParam}${captiveParam}${researchGrade}${threatened}${verifiable}${languageParam}${monthParam}`;
      const response2 = await fetch(url2);
      const data2 = await response2.json();
      results.push(...data2.results);

      return results;
    } else {
      // Regular single API call for other limits
      const url = `https://api.inaturalist.org/v1/observations/species_counts?${locationParam.substring(
        1
      )}&per_page=${limit}${taxonParam}${captiveParam}${researchGrade}${threatened}${verifiable}${languageParam}${monthParam}`;
      const response = await fetch(url);
      const data = await response.json();

      return data.results;
    }
  }

  function updateStatus(observed, total) {
    observedCount.textContent = observed;
    totalCount.textContent = total;
    const percent = total > 0 ? Math.round((observed / total) * 100) : 0;
    percentObserved.textContent = percent;
    progressBar.style.width = `${percent}%`;
    percentObserved.textContent = percent;
  }

  function displaySpecies(species, userObservations) {
    let observed = 0;
    const total = species.length;

    species.forEach((specimen) => {
      const isObserved = userObservations.has(specimen.taxon.id);
      if (isObserved) observed++;

      const card = createSpeciesCard(specimen, isObserved);
      speciesGrid.appendChild(card);
    });

    updateStatus(observed, total);
    document.querySelector(".checkbox-container").style.display = "inline-flex";

    // Enable download button after successful search
    if (downloadButton) {
      downloadButton.disabled = false;
    }
  }

  function createSpeciesCard(specimen, isObserved) {
    const card = document.createElement("div");
    card.className = `species-card ${isObserved ? "observed" : ""}`;

    // Create the iNaturalist URL for this species in the current place
    // Get selected months to include in URL
    const monthCheckboxes = document.querySelectorAll(
      ".month-checkbox:checked"
    );
    const selectedMonths = Array.from(monthCheckboxes).map((cb) => cb.value);
    const monthParam =
      selectedMonths.length > 0 ? `&month=${selectedMonths.join(",")}` : "";

    const inatUrl = `https://www.inaturalist.org/observations?place_id=${placeIdInput.value}&taxon_id=${specimen.taxon.id}${monthParam}`;

    // Create status labels container
    const statusContainer = document.createElement("div");
    statusContainer.className = "species-status";

    // Add status labels based on taxon properties
    if (specimen.taxon.conservation_status) {
      const threatenedLabel = document.createElement("span");
      threatenedLabel.className = "status-label status-threatened";
      threatenedLabel.textContent = "Threatened";
      statusContainer.appendChild(threatenedLabel);
    }

    if (
      specimen.taxon.establishment_means &&
      specimen.taxon.establishment_means.establishment_means == "introduced"
    ) {
      const introducedLabel = document.createElement("span");
      introducedLabel.className = "status-label status-introduced";
      introducedLabel.textContent = "Introduced";
      statusContainer.appendChild(introducedLabel);
    }

    if (
      specimen.taxon.establishment_means &&
      specimen.taxon.establishment_means.establishment_means == "endemic"
    ) {
      const endemicLabel = document.createElement("span");
      endemicLabel.className = "status-label status-endemic";
      endemicLabel.textContent = "Endemic";
      statusContainer.appendChild(endemicLabel);
    }

    const imageUrl =
      specimen.taxon.default_photo?.medium_url ||
      "https://via.placeholder.com/300x200?text=No+Image";

    card.innerHTML = `
      <a href="${inatUrl}" target="_blank" class="species-link">
        <img src="${imageUrl}" alt="${specimen.taxon.name}" />
        <div class="species-info">
          <h3>${
            specimen.taxon.preferred_common_name || specimen.taxon.name
          }</h3>
        <p class="scientific-name">${specimen.taxon.name}</p>
        <p class="observations">Observations: ${specimen.count}</p>
        </div>
      </a>
    `;

    // Insert status labels at the beginning of the card
    card.insertBefore(statusContainer, card.firstChild);

    return card;
  }

  function filterSpecies() {
    const cards = document.querySelectorAll(".species-card");
    const showMissing = showMissingCheckbox.checked;
    const showSpotted = showSpottedCheckbox.checked;

    cards.forEach((card) => {
      if (showMissing) {
        card.style.display = card.classList.contains("observed")
          ? "none"
          : "block";
      } else if (showSpotted) {
        card.style.display = card.classList.contains("observed")
          ? "block"
          : "none";
      } else {
        card.style.display = "block";
      }
    });
  }

  function updateLocationName() {
    const projectName = localStorage.getItem("inatProject");
    const placeName = placeNameInput.value.trim();

    if (projectName) {
      locationName.textContent = projectName;
    } else if (placeName) {
      locationName.textContent = placeName;
    } else {
      locationName.textContent = "The whole world";
    }
  }
});
