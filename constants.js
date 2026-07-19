// Shared constants for iNaturalist tools
const API_BASE = "https://api.inaturalist.org/v1";

const ICONIC_TAXON_ICONS = {
  Plantae: "🌿",
  Insecta: "🦋",
  Aves: "🐦",
  Fungi: "🍄",
  Mammalia: "🦌",
  Reptilia: "🦎",
  Amphibia: "🐸",
  Actinopterygii: "🐟",
  Mollusca: "🐌",
  Arachnida: "🕷️",
  Animalia: "🐾",
  Protozoa: "🦠",
  Chromista: "🟤",
};

const CONSERVATION_STATUS = {
  cr: { color: "#8b0000", badge: "CR", class: "status-cr" },
  critically_endangered: { color: "#8b0000", badge: "CR", class: "status-cr" },
  en: { color: "#d12f19", badge: "EN", class: "status-en" },
  endangered: { color: "#d12f19", badge: "EN", class: "status-en" },
  vu: { color: "#f39c12", badge: "VU", class: "status-vu" },
  vulnerable: { color: "#f39c12", badge: "VU", class: "status-vu" },
  nt: { color: "#f1c40f", badge: "NT", class: "status-nt" },
  near_threatened: { color: "#f1c40f", badge: "NT", class: "status-nt" },
  lc: { color: "#27ae60", badge: "LC", class: "status-lc" },
  least_concern: { color: "#27ae60", badge: "LC", class: "status-lc" },
};

// Helper function to get conservation status config
function getConservationStatus(status) {
  if (!status) return null;
  return CONSERVATION_STATUS[status.toLowerCase()] || null;
}

// Helper function to get iconic taxon icon
function getIconicTaxonIcon(taxonName) {
  return ICONIC_TAXON_ICONS[taxonName] || "🔍";
}

// Allow unit tests (Node) to import the helpers; no-op in the browser.
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    API_BASE,
    ICONIC_TAXON_ICONS,
    CONSERVATION_STATUS,
    getConservationStatus,
    getIconicTaxonIcon,
  };
}
