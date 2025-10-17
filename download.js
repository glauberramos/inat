document.addEventListener("DOMContentLoaded", function () {
  const downloadButton = document.getElementById("downloadButton");

  // Add event listener for download button
  if (downloadButton) {
    downloadButton.addEventListener("click", downloadSpeciesList);
  }

  function downloadSpeciesList() {
    const speciesCards = document.querySelectorAll(".species-card");
    if (speciesCards.length === 0) {
      alert("No species data available. Please perform a search first.");
      return;
    }

    const username = document.getElementById("usernameInput").value.trim();
    const placeName = document.getElementById("placeNameInput").value.trim();
    const currentDate = new Date().toLocaleDateString();

    // Get taxon name from the select dropdown or override input
    const taxonSelect = document.getElementById("taxonSelect");
    const taxonIdOverrideInput = document.getElementById(
      "taxonIdOverrideInput"
    );

    let taxonName;
    if (taxonIdOverrideInput && taxonIdOverrideInput.value.trim() !== "") {
      // Use custom taxon name from override input
      taxonName = taxonIdOverrideInput.value.trim();
    } else {
      // Use taxon name from select dropdown
      const selectedTaxonOption =
        taxonSelect.options[taxonSelect.selectedIndex];
      taxonName = selectedTaxonOption.text;
    }

    // Check if we have a project selected
    const projectName = localStorage.getItem("inatProject");
    const projectId = localStorage.getItem("inatProjectId");

    // Determine location type and name
    let locationType = "Location";
    let displayLocationName;
    let fileNameLocationName;

    if (projectName && projectId) {
      locationType = "Project";
      displayLocationName = projectName;
      fileNameLocationName = projectName
        .replace(/[^a-z0-9]/gi, "-")
        .toLowerCase();
    } else {
      displayLocationName = placeName || "THE WHOLE WORLD";
      fileNameLocationName = placeName
        ? placeName.replace(/[^a-z0-9]/gi, "-").toLowerCase()
        : "the-whole-world";
    }

    let spottedSpecies = [];
    let missingSpecies = [];

    speciesCards.forEach((card) => {
      const isObserved = card.classList.contains("observed");
      const speciesName = card.querySelector("h3").textContent;
      const scientificName = card.querySelector(".scientific-name").textContent;
      const observationCount = card.querySelector(".observations").textContent;

      const speciesInfo = `${speciesName} (${scientificName}) - ${observationCount}`;

      if (isObserved) {
        spottedSpecies.push(speciesInfo);
      } else {
        missingSpecies.push(speciesInfo);
      }
    });

    const content = generateSpeciesListText(
      username,
      displayLocationName,
      locationType,
      taxonName,
      currentDate,
      spottedSpecies,
      missingSpecies
    );

    // Create and download the file
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `species-list-${fileNameLocationName}-${taxonName
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}-${currentDate.replace(/\//g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function generateSpeciesListText(
    username,
    locationName,
    locationType,
    taxonName,
    date,
    spottedSpecies,
    missingSpecies
  ) {
    const totalSpecies = spottedSpecies.length + missingSpecies.length;
    const spottedCount = spottedSpecies.length;
    const missingCount = missingSpecies.length;
    const percentage =
      totalSpecies > 0 ? Math.round((spottedCount / totalSpecies) * 100) : 0;

    return `SPECIES LIST FOR ${locationName.toUpperCase()}
${locationType}: ${locationName}
Taxon Group: ${taxonName}
Generated for: ${username}
Date: ${date}

SUMMARY:
- Total species in this ${locationType.toLowerCase()}: ${totalSpecies}
- Species you've observed: ${spottedCount}
- Species you haven't observed: ${missingCount}
- Completion percentage: ${percentage}%

${"=".repeat(50)}

❌ SPECIES YOU HAVEN'T OBSERVED (${missingCount}):
${
  missingSpecies.length > 0
    ? missingSpecies
        .map((species, index) => `${index + 1}. ${species}`)
        .join("\n")
    : "All species observed!"
}

${"=".repeat(50)}

✅ SPECIES YOU'VE OBSERVED (${spottedCount}):
${
  spottedSpecies.length > 0
    ? spottedSpecies
        .map((species, index) => `${index + 1}. ${species}`)
        .join("\n")
    : "None yet!"
}

${"=".repeat(50)}

Happy observing! 🦋🌿🐦
`;
  }
});
