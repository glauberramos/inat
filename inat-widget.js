/**
 * iNaturalist Observations Widget
 * A modern, embeddable widget for displaying iNaturalist observations
 * https://glauberramos.github.io/inat/widget
 */
(function () {
  "use strict";

  const INAT_API = "https://api.inaturalist.org/v1";
  const WIDGET_HOME_URL = "https://glauberramos.github.io/inat/widget?ref=widget-embed";
  const MAX_LIMIT = 50;
  const SLIDESHOW_MAX_LIMIT = 1000;
  // The API caps per_page at 200, so bigger slideshows fetch further pages as they play
  const API_MAX_PER_PAGE = 200;

  function initWidgets() {
    const containers = document.querySelectorAll("[data-inat-widget]");
    containers.forEach((el) => new InatWidget(el));
  }

  class InatWidget {
    constructor(container) {
      this.container = container;
      this.source = container.dataset.inatSource || "";
      this.sourceType = container.dataset.inatSourceType || "user";
      this.dataType = container.dataset.inatDataType || "observations";
      this.orderBy = container.dataset.inatOrderBy || "observed_on";
      this.layout = container.dataset.inatLayout || "grid";
      const isSlideshow = this.layout === "slideshow";
      this.limit = Math.min(
        isSlideshow ? SLIDESHOW_MAX_LIMIT : MAX_LIMIT,
        Math.max(1, parseInt(container.dataset.inatLimit) || 10)
      );
      this.theme = container.dataset.inatTheme || "light";
      this.title = container.dataset.inatTitle || "";
      this.headerText = container.dataset.inatHeaderText || "";
      this.taxon = container.dataset.inatTaxon || "";
      this.qualityGrade = container.dataset.inatQuality || "";
      this.dateFrom = container.dataset.inatDateFrom || "";
      this.dateTo = container.dataset.inatDateTo || "";
      this.dateOn = container.dataset.inatDate || "";
      this.showGrade = container.dataset.inatShowGrade === "true";
      this.showLocation = container.dataset.inatShowLocation !== "false";
      this.showNotes = container.dataset.inatShowNotes === "true";
      // Slideshow defaults to no title and always-visible names; other layouts the reverse
      this.showTitle =
        container.dataset.inatShowTitle !== undefined
          ? container.dataset.inatShowTitle !== "false"
          : !isSlideshow;
      this.borderRadius =
        container.dataset.inatRadius !== undefined ? parseInt(container.dataset.inatRadius) : 12;
      this.padding =
        container.dataset.inatPadding !== undefined ? parseInt(container.dataset.inatPadding) : 16;
      this.compact = container.dataset.inatCompact === "true";
      this.lang = container.dataset.inatLang || "";
      this.extraParams = container.dataset.inatParams || "";
      // Slideshows page through results on their own
      this.pagination = container.dataset.inatPagination === "true" && !isSlideshow;
      this.searchEnabled = container.dataset.inatSearch === "true";
      this.showNames =
        container.dataset.inatShowNames !== undefined
          ? container.dataset.inatShowNames === "true"
          : isSlideshow;
      this.showCount = container.dataset.inatShowCount !== "false";
      // Stretch a slideshow to the viewport, e.g. when the embed page is opened directly
      this.fill = isSlideshow && container.dataset.inatFill === "true";
      this.interval = Math.min(60, Math.max(1, parseInt(container.dataset.inatInterval) || 5));
      this.slideTimer = null;
      this.searchTaxon = null;
      this.page = 1;
      this.totalResults = 0;
      this.observations = [];

      this.injectStyles();
      this.render();
      this.fetchObservations();
    }

    injectStyles() {
      if (document.getElementById("inat-widget-styles")) return;
      const style = document.createElement("style");
      style.id = "inat-widget-styles";
      style.textContent = this.getStyles();
      document.head.appendChild(style);
    }

    getStyles() {
      return `
        .inat-w {
          --inat-bg: #ffffff;
          --inat-card-bg: #ffffff;
          --inat-text: #1a1a2e;
          --inat-text-secondary: #64748b;
          --inat-border: #e2e8f0;
          --inat-accent: #74ac00;
          --inat-accent-dark: #5d8a00;
          --inat-hover: #f8fafc;
          --inat-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
          --inat-shadow-hover: 0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.06);
          --inat-radius: 12px;
          --inat-radius-sm: 8px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: var(--inat-text);
          background: var(--inat-bg);
          border-radius: var(--inat-radius);
          overflow: hidden;
          position: relative;
        }
        .inat-w.inat-theme-dark {
          --inat-bg: #0f172a;
          --inat-card-bg: #1e293b;
          --inat-text: #f1f5f9;
          --inat-text-secondary: #94a3b8;
          --inat-border: #334155;
          --inat-hover: #283548;
          --inat-shadow: 0 1px 3px rgba(0,0,0,0.3);
          --inat-shadow-hover: 0 10px 25px rgba(0,0,0,0.4);
        }
        .inat-w.inat-theme-transparent-light {
          --inat-bg: transparent;
          --inat-card-bg: #ffffff;
          --inat-text: #1a1a2e;
          --inat-text-secondary: #64748b;
          --inat-border: #e2e8f0;
          --inat-hover: #f8fafc;
          --inat-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
          --inat-shadow-hover: 0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.06);
        }
        .inat-w.inat-theme-transparent-dark {
          --inat-bg: transparent;
          --inat-card-bg: #1e293b;
          --inat-text: #f1f5f9;
          --inat-text-secondary: #94a3b8;
          --inat-border: #334155;
          --inat-hover: #283548;
          --inat-shadow: 0 1px 3px rgba(0,0,0,0.3);
          --inat-shadow-hover: 0 10px 25px rgba(0,0,0,0.4);
        }
        .inat-theme-transparent-dark .inat-w-header-logo {
          filter: brightness(0) invert(1);
        }
        .inat-w * { box-sizing: border-box; margin: 0; padding: 0; }
        .inat-w a { color: var(--inat-accent); text-decoration: none; }
        .inat-w a:hover { color: var(--inat-accent-dark); }
        .inat-w img { max-width: 100%; display: block; }

        /* Header */
        .inat-w-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
        }
        .inat-w-header-left {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .inat-w-header-logo {
          height: 14px;
          width: auto;
        }
        .inat-theme-dark .inat-w-header-logo {
          filter: brightness(0) invert(1);
        }
        .inat-w-header-sep {
          color: var(--inat-border);
          font-size: 13px;
          font-weight: 300;
        }
        .inat-w-header-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--inat-text);
        }
        .inat-w-header-link {
          font-size: 11px;
          font-weight: 500;
          color: var(--inat-accent) !important;
        }
        .inat-w-header-text {
          font-size: 12px;
          font-weight: 600;
          color: var(--inat-text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-left: 12px;
        }

        /* Loading */
        .inat-w-loading {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: var(--inat-text-secondary);
          font-size: 14px;
          gap: 8px;
        }
        .inat-w-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--inat-border);
          border-top-color: var(--inat-accent);
          border-radius: 50%;
          animation: inat-spin 0.8s linear infinite;
        }
        @keyframes inat-spin { to { rotate: 360deg; } }

        /* Error */
        .inat-w-error {
          text-align: center;
          padding: 32px 16px;
          color: var(--inat-text-secondary);
          font-size: 14px;
        }
        .inat-w-error-icon { font-size: 24px; margin-bottom: 8px; }

        /* ===== LIST LAYOUT ===== */
        .inat-w-list {
          display: flex;
          flex-direction: column;
          gap: 0;
        }
        .inat-w-list-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 4px 10px;
          border-radius: var(--inat-radius-sm);
          transition: background 0.15s;
          text-decoration: none !important;
          color: var(--inat-text) !important;
        }
        .inat-w-list-item:hover {
          background: var(--inat-hover);
        }
        .inat-w-list-img {
          width: 48px;
          height: 48px;
          border-radius: var(--inat-radius-sm);
          object-fit: cover;
          flex-shrink: 0;
          background: var(--inat-border);
        }
        .inat-w-list-info {
          flex: 1;
          min-width: 0;
        }
        .inat-w-list-name {
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .inat-w-list-scientific {
          font-size: 12px;
          font-style: italic;
          color: var(--inat-text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .inat-w-list-meta {
          font-size: 11px;
          color: var(--inat-text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* ===== GRID LAYOUT ===== */
        .inat-w-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(125px, 1fr));
          gap: 8px;
        }
        .inat-w-grid-item {
          position: relative;
          border-radius: var(--inat-radius-sm);
          overflow: hidden;
          aspect-ratio: 1;
          background: var(--inat-border);
          text-decoration: none !important;
          display: block;
        }
        .inat-w-grid-item:hover .inat-w-grid-overlay {
          opacity: 1;
        }
        .inat-w-grid-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .inat-w-grid-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 24px 8px 8px;
          background: linear-gradient(transparent, rgba(0,0,0,0.75));
          color: #fff !important;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .inat-w-grid-name {
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #fff;
        }
        .inat-w-grid-sci {
          font-size: 10px;
          font-style: italic;
          color: rgba(255,255,255,0.8);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        /* Touch devices have no hover — always show tile names */
        @media (hover: none) {
          .inat-w-grid-item .inat-w-grid-overlay { opacity: 1; }
        }
        .inat-w-grid.inat-w-show-names .inat-w-grid-overlay {
          opacity: 1;
        }
        /* Photo count badge on grid */
        .inat-w-photo-count {
          position: absolute;
          top: 6px;
          right: 6px;
          background: rgba(0,0,0,0.6);
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 3px;
        }
        .inat-w-photo-count-icon {
          font-size: 9px;
        }

        /* ===== CARDS LAYOUT ===== */
        .inat-w-cards {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }
        .inat-w-card {
          background: var(--inat-card-bg);
          border-radius: var(--inat-radius);
          overflow: hidden;
          box-shadow: var(--inat-shadow);
          transition: box-shadow 0.25s;
          text-decoration: none !important;
          color: var(--inat-text) !important;
          display: block;
          border: 1px solid var(--inat-border);
        }
        .inat-w-card:hover {
          box-shadow: var(--inat-shadow-hover);
        }
        .inat-w-card-cover {
          position: relative;
          height: 180px;
          overflow: visible;
          background: var(--inat-border);
        }
        .inat-w-card-cover-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .inat-w-card-photos-clip {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .inat-w-card-taxon-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 3px solid var(--inat-card-bg);
          overflow: hidden;
          background: var(--inat-border);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .inat-w-card-taxon-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .inat-w-card-body {
          padding: 16px;
          text-align: center;
        }
        .inat-w-card-common {
          font-size: 16px;
          font-weight: 700;
          color: var(--inat-accent);
          margin-bottom: 2px;
        }
        .inat-w-card-scientific {
          font-size: 13px;
          font-style: italic;
          color: var(--inat-accent);
          opacity: 0.8;
          margin-bottom: 12px;
        }
        .inat-w-card-details {
          font-size: 12px;
          color: var(--inat-text-secondary);
          display: flex;
          flex-direction: column;
          gap: 4px;
          text-align: left;
          padding: 12px;
          background: var(--inat-hover);
          border-radius: var(--inat-radius-sm);
        }
        .inat-w-card-detail {
          display: flex;
          gap: 6px;
        }
        .inat-w-card-detail-label {
          font-weight: 600;
          color: var(--inat-text);
          white-space: nowrap;
        }
        .inat-w-card-detail-value {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Compact cards */
        .inat-w-cards.inat-w-compact {
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px;
        }
        .inat-w-cards.inat-w-compact .inat-w-card-cover { height: 110px; }
        .inat-w-cards.inat-w-compact .inat-w-card-body { padding: 10px; }
        .inat-w-cards.inat-w-compact .inat-w-card-common { font-size: 13px; }
        .inat-w-cards.inat-w-compact .inat-w-card-scientific { font-size: 11px; margin-bottom: 8px; }
        .inat-w-cards.inat-w-compact .inat-w-card-details { padding: 8px; font-size: 11px; }
        .inat-w-cards.inat-w-compact .inat-w-card-taxon-badge { width: 36px; height: 36px; border-width: 2px; }

        /* Card photo navigation */
        .inat-w-card-photos {
          display: flex;
          width: 100%;
          height: 100%;
          transition: margin-left 0.3s ease;
        }
        .inat-w-card-cover .inat-w-card-photos img {
          width: 100%;
          min-width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .inat-w-card-nav {
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto 0;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.5);
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .inat-w-card-cover:hover .inat-w-card-nav {
          opacity: 1;
        }
        .inat-w-card-nav-prev { left: 6px; }
        .inat-w-card-nav-next { right: 6px; }
        .inat-w-card-nav:hover { background: rgba(0,0,0,0.7); }
        .inat-w-card-dots {
          position: absolute;
          bottom: 8px;
          left: 0;
          right: 0;
          margin: 0 auto;
          width: fit-content;
          display: flex;
          gap: 4px;
        }
        .inat-w-card-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          transition: background 0.2s;
        }
        .inat-w-card-dot.active {
          background: #fff;
        }

        /* ===== SLIDESHOW LAYOUT ===== */
        .inat-w-slideshow {
          position: relative;
          aspect-ratio: 3 / 2;
          margin: 0 auto;
          border-radius: var(--inat-radius-sm);
          overflow: hidden;
          background: var(--inat-border);
        }
        .inat-w-slide {
          position: absolute;
          inset: 0;
          display: block;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.6s ease, visibility 0.6s;
          text-decoration: none !important;
        }
        .inat-w-slide.inat-w-active {
          opacity: 1;
          visibility: visible;
        }
        .inat-w-slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .inat-w-slide-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 40px 14px 12px;
          background: linear-gradient(transparent, rgba(0,0,0,0.75));
          opacity: 0;
          transition: opacity 0.2s;
        }
        .inat-w-slideshow:hover .inat-w-slide-overlay,
        .inat-w-slideshow.inat-w-show-names .inat-w-slide-overlay {
          opacity: 1;
        }
        .inat-w-slide-name {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .inat-w-slide-sci {
          font-size: 13px;
          font-style: italic;
          color: rgba(255,255,255,0.85);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .inat-w-slide-nav {
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto 0;
          z-index: 2;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.5);
          color: #fff;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .inat-w-slideshow:hover .inat-w-slide-nav {
          opacity: 1;
        }
        .inat-w-slide-nav-prev { left: 8px; }
        .inat-w-slide-nav-next { right: 8px; }
        .inat-w-slide-nav:hover { background: rgba(0,0,0,0.7); }
        .inat-w-slide-counter {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 2;
          background: rgba(0,0,0,0.6);
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 10px;
        }
        /* Touch devices have no hover — keep names and arrows visible */
        @media (hover: none) {
          .inat-w-slide-overlay,
          .inat-w-slide-nav { opacity: 1; }
        }
        @media (prefers-reduced-motion: reduce) {
          .inat-w-slide { transition: none; }
        }
        /* Fill: slideshow takes the whole viewport and shows each photo uncropped */
        .inat-w.inat-w-fill {
          display: flex;
          flex-direction: column;
          height: 100vh;
          height: 100dvh;
          box-sizing: border-box;
        }
        .inat-w-fill .inat-w-content {
          flex: 1;
          min-height: 0;
        }
        .inat-w-fill .inat-w-slideshow {
          aspect-ratio: auto;
          height: 100%;
          background: #000;
        }
        .inat-w-fill .inat-w-slide-img {
          object-fit: contain;
        }

        /* Footer */
        .inat-w-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 4px 12px;
          margin-top: 14px;
          padding-top: 10px;
          border-top: 1px solid var(--inat-border);
        }
        .inat-w-footer a {
          font-size: 12px;
          font-weight: 500;
          color: var(--inat-text-secondary) !important;
          transition: color 0.15s;
        }
        .inat-w-footer a:hover {
          color: var(--inat-accent) !important;
        }
        .inat-w-attribution {
          margin-left: auto;
          font-size: 11px !important;
          opacity: 0.7;
          transition: opacity 0.15s, color 0.15s;
        }
        .inat-w-attribution:hover {
          opacity: 1;
        }
        .inat-w-attribution strong {
          font-weight: 600;
        }

        /* Species observation count badge */
        .inat-w-count-badge {
          position: absolute;
          top: 6px;
          left: 6px;
          background: var(--inat-accent);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.25);
        }
        .inat-w-count-pill {
          display: inline-block;
          background: var(--inat-accent);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 10px;
          flex-shrink: 0;
        }

        /* Quality grade badge */
        .inat-w-grade {
          font-size: 10px;
          font-weight: 600;
          padding: 1px 6px;
          border-radius: 4px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .inat-w-grade-research {
          background: var(--inat-accent);
          color: #fff;
        }
        .inat-w-grade-needs_id {
          background: #f59e0b;
          color: #fff;
        }

        /* Compact grid */
        .inat-w-grid.inat-w-compact {
          gap: 4px;
          grid-template-columns: repeat(auto-fill, 75px);
        }
        .inat-w-compact .inat-w-grid-item {
          width: 75px;
          height: 75px;
        }
        .inat-w-compact .inat-w-grid-overlay { display: none; }
        .inat-w-compact .inat-w-grid-item:hover .inat-w-grid-img { }

        /* Pagination */
        .inat-w-pagination {
          display: none;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 14px;
        }
        .inat-w-pagination.inat-w-pagination-visible {
          display: flex;
        }
        .inat-w-page-btn {
          padding: 6px 12px;
          border: 1px solid var(--inat-border);
          background: var(--inat-card-bg);
          color: var(--inat-text);
          border-radius: var(--inat-radius-sm);
          font-size: 12px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          transition: background 0.15s;
        }
        .inat-w-page-btn:hover:not(:disabled) { background: var(--inat-hover); }
        .inat-w-page-btn:disabled { opacity: 0.4; cursor: default; }
        .inat-w-page-info {
          font-size: 12px;
          color: var(--inat-text-secondary);
          white-space: nowrap;
        }

        /* Taxa search */
        .inat-w-search {
          position: relative;
          margin-bottom: 12px;
        }
        .inat-w-search-input {
          width: 100%;
          padding: 8px 30px 8px 32px;
          border: 1.5px solid var(--inat-border);
          border-radius: var(--inat-radius-sm);
          font-size: 13px;
          font-family: inherit;
          background: var(--inat-card-bg);
          color: var(--inat-text);
          outline: none;
          transition: border-color 0.15s;
        }
        .inat-w-search-input::placeholder { color: var(--inat-text-secondary); }
        .inat-w-search-input:focus { border-color: var(--inat-accent); }
        .inat-w-search-icon {
          position: absolute;
          left: 10px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          pointer-events: none;
        }
        .inat-w-search-clear {
          position: absolute;
          right: 6px;
          top: 50%;
          transform: translateY(-50%);
          width: 20px;
          height: 20px;
          border: none;
          border-radius: 50%;
          background: var(--inat-border);
          color: var(--inat-text-secondary);
          font-size: 13px;
          line-height: 1;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
        }
        .inat-w-search-clear.inat-w-visible { display: flex; }
        .inat-w-search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 4px;
          background: var(--inat-card-bg);
          border: 1px solid var(--inat-border);
          border-radius: var(--inat-radius-sm);
          box-shadow: var(--inat-shadow-hover);
          max-height: 220px;
          overflow-y: auto;
          z-index: 20;
          display: none;
        }
        .inat-w-search-results.inat-w-visible { display: block; }
        .inat-w-search-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          cursor: pointer;
        }
        .inat-w-search-item:hover { background: var(--inat-hover); }
        .inat-w-search-item img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          background: var(--inat-border);
          flex-shrink: 0;
        }
        .inat-w-search-item-info { flex: 1; min-width: 0; }
        .inat-w-search-item-name {
          font-size: 12px;
          font-weight: 600;
          color: var(--inat-text);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .inat-w-search-item-sub {
          font-size: 10px;
          color: var(--inat-text-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .inat-w-search-item-sub em { font-style: italic; }

        /* Placeholder image */
        .inat-w-no-photo {
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--inat-border);
          color: var(--inat-text-secondary);
          font-size: 20px;
          width: 100%;
          height: 100%;
        }
      `;
    }

    render() {
      this.container.innerHTML = "";
      this.container.className =
        `inat-w inat-theme-${this.theme}` + (this.fill ? " inat-w-fill" : "");
      this.container.style.setProperty("--inat-radius", `${this.borderRadius}px`);
      this.container.style.setProperty(
        "--inat-radius-sm",
        `${Math.max(0, this.borderRadius - 4)}px`
      );
      this.container.style.padding = `${this.padding}px`;

      // Header
      const header = document.createElement("div");
      header.className = "inat-w-header";
      header.innerHTML = `
        <div class="inat-w-header-left">
          <img class="inat-w-header-logo" src="https://static.inaturalist.org/sites/1-logo.svg" alt="iNaturalist" />
          ${
            this.showTitle
              ? `<span class="inat-w-header-sep">/</span>
          <span class="inat-w-header-title">${this.escapeHtml(this.title || this.source)}</span>`
              : ""
          }
        </div>
        ${this.headerText ? `<span class="inat-w-header-text">${this.escapeHtml(this.headerText)}</span>` : ""}
      `;
      this.container.appendChild(header);

      // Taxa search bar
      if (this.searchEnabled && this.sourceType !== "observation") {
        this.renderSearchBar();
      }

      // Content area
      this.contentEl = document.createElement("div");
      this.contentEl.className = "inat-w-content";
      this.contentEl.innerHTML = `<div class="inat-w-loading"><div class="inat-w-spinner"></div><span>Loading observations…</span></div>`;
      this.container.appendChild(this.contentEl);

      // Pagination
      this.paginationEl = document.createElement("div");
      this.paginationEl.className = "inat-w-pagination";
      this.container.appendChild(this.paginationEl);

      // Footer
      const footer = document.createElement("div");
      footer.className = "inat-w-footer";
      footer.innerHTML =
        `<a href="${this.getSourceUrl()}" target="_blank" rel="noopener">View more on iNaturalist &rarr;</a>` +
        `<a class="inat-w-attribution" href="${WIDGET_HOME_URL}" target="_blank" rel="noopener">Powered by <strong>iNat Tools</strong></a>`;
      this.container.appendChild(footer);
    }

    renderSearchBar() {
      const bar = document.createElement("div");
      bar.className = "inat-w-search";
      bar.innerHTML = `
        <span class="inat-w-search-icon">&#x1F50D;</span>
        <input type="text" class="inat-w-search-input" placeholder="Search any taxa (birds, oaks, fungi…)" autocomplete="off" />
        <button type="button" class="inat-w-search-clear" aria-label="Clear search">&times;</button>
        <div class="inat-w-search-results"></div>
      `;
      this.container.appendChild(bar);

      const input = bar.querySelector(".inat-w-search-input");
      const clearBtn = bar.querySelector(".inat-w-search-clear");
      const results = bar.querySelector(".inat-w-search-results");
      let searchTimeout = null;

      const hideResults = () => results.classList.remove("inat-w-visible");

      const applyTaxon = (taxonId, label) => {
        this.searchTaxon = taxonId;
        this.page = 1;
        input.value = label || "";
        clearBtn.classList.toggle("inat-w-visible", !!taxonId);
        hideResults();
        this.contentEl.innerHTML = `<div class="inat-w-loading"><div class="inat-w-spinner"></div><span>Loading…</span></div>`;
        this.fetchObservations();
      };

      input.addEventListener("input", () => {
        const q = input.value.trim();
        clearTimeout(searchTimeout);
        if (q.length < 2) {
          hideResults();
          // Reset filter when the box is emptied after an active search
          if (q.length === 0 && this.searchTaxon) applyTaxon(null, "");
          return;
        }
        searchTimeout = setTimeout(() => this.fetchTaxaSuggestions(q, results, applyTaxon), 300);
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") hideResults();
        if (e.key === "Enter") {
          const first = results.querySelector(".inat-w-search-item");
          if (first) first.click();
        }
      });

      clearBtn.addEventListener("click", () => applyTaxon(null, ""));

      document.addEventListener("click", (e) => {
        if (!bar.contains(e.target)) hideResults();
      });
    }

    async fetchTaxaSuggestions(query, resultsEl, applyTaxon) {
      try {
        const params = new URLSearchParams({ q: query, per_page: 6 });
        if (this.lang) params.set("locale", this.lang);
        const res = await fetch(`${INAT_API}/taxa/autocomplete?${params.toString()}`);
        if (!res.ok) throw new Error("autocomplete failed");
        const data = await res.json();
        const taxa = data.results || [];
        resultsEl.innerHTML = "";
        if (!taxa.length) {
          resultsEl.classList.remove("inat-w-visible");
          return;
        }
        taxa.forEach((t) => {
          const displayName = t.preferred_common_name || t.name;
          const item = document.createElement("div");
          item.className = "inat-w-search-item";

          const img = document.createElement("img");
          img.src = t.default_photo && t.default_photo.square_url ? t.default_photo.square_url : "";
          img.alt = "";
          img.loading = "lazy";

          const info = document.createElement("div");
          info.className = "inat-w-search-item-info";
          const nameEl = document.createElement("div");
          nameEl.className = "inat-w-search-item-name";
          nameEl.textContent = displayName;
          const subEl = document.createElement("div");
          subEl.className = "inat-w-search-item-sub";
          const sciEl = document.createElement("em");
          sciEl.textContent = t.name;
          subEl.appendChild(sciEl);
          subEl.appendChild(document.createTextNode(t.rank ? ` · ${t.rank}` : ""));
          info.appendChild(nameEl);
          info.appendChild(subEl);

          item.appendChild(img);
          item.appendChild(info);
          item.addEventListener("click", () => applyTaxon(t.id, displayName));
          resultsEl.appendChild(item);
        });
        resultsEl.classList.add("inat-w-visible");
      } catch {
        resultsEl.classList.remove("inat-w-visible");
      }
    }

    renderPagination() {
      if (!this.pagination || this.sourceType === "observation") return;
      // The API rejects requests where page * per_page exceeds 10,000 results
      const maxPage = Math.max(1, Math.floor(10000 / this.limit));
      const totalPages = Math.min(maxPage, Math.max(1, Math.ceil(this.totalResults / this.limit)));
      if (totalPages <= 1) {
        this.paginationEl.classList.remove("inat-w-pagination-visible");
        return;
      }
      this.paginationEl.innerHTML = `
        <button class="inat-w-page-btn" data-page-prev ${this.page <= 1 ? "disabled" : ""}>&larr; Prev</button>
        <span class="inat-w-page-info">Page ${this.page} of ${totalPages}</span>
        <button class="inat-w-page-btn" data-page-next ${this.page >= totalPages ? "disabled" : ""}>Next &rarr;</button>
      `;
      this.paginationEl.classList.add("inat-w-pagination-visible");
      this.paginationEl
        .querySelector("[data-page-prev]")
        .addEventListener("click", () => this.goToPage(this.page - 1));
      this.paginationEl
        .querySelector("[data-page-next]")
        .addEventListener("click", () => this.goToPage(this.page + 1));
    }

    goToPage(page) {
      if (page < 1 || page === this.page) return;
      this.page = page;
      this.contentEl.innerHTML = `<div class="inat-w-loading"><div class="inat-w-spinner"></div><span>Loading…</span></div>`;
      this.fetchObservations();
    }

    getSourceUrl() {
      if (this.sourceType === "observation") {
        return `https://www.inaturalist.org/observations/${encodeURIComponent(this.source)}`;
      }
      const speciesView = this.dataType === "species" ? "&view=species" : "";
      if (this.sourceType === "project") {
        return `https://www.inaturalist.org/projects/${encodeURIComponent(this.source)}?tab=observations${speciesView ? "&subtab=species" : ""}`;
      }
      if (this.sourceType === "place") {
        return `https://www.inaturalist.org/observations?place_id=${encodeURIComponent(this.source)}${speciesView}`;
      }
      return `https://www.inaturalist.org/observations?user_id=${encodeURIComponent(this.source)}${speciesView}`;
    }

    async fetchObservations() {
      try {
        // Single observation mode
        if (this.sourceType === "observation") {
          const singleParams = new URLSearchParams();
          if (this.lang) singleParams.set("locale", this.lang);
          const singleQuery = singleParams.toString();
          const response = await fetch(
            `${INAT_API}/observations/${encodeURIComponent(this.source)}${singleQuery ? "?" + singleQuery : ""}`
          );
          if (!response.ok) throw new Error("Failed to fetch observation");
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            this.observations = data.results;
          } else {
            this.contentEl.innerHTML = `<div class="inat-w-error"><div class="inat-w-error-icon">&#x1F50D;</div><div>Observation not found</div></div>`;
            return;
          }
          this.renderObservations();
          return;
        }

        const isSpecies = this.dataType === "species";
        const perPage =
          this.layout === "slideshow" ? Math.min(this.limit, API_MAX_PER_PAGE) : this.limit;
        const response = await fetch(this.listUrl(perPage, this.page));
        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        this.observations = data.results || [];
        this.totalResults = data.total_results || 0;

        if (this.observations.length === 0) {
          const emptyMsg = isSpecies ? "No species found" : "No observations found";
          this.contentEl.innerHTML = `<div class="inat-w-error"><div class="inat-w-error-icon">&#x1F50D;</div><div>${emptyMsg}</div></div>`;
          this.renderPagination();
          return;
        }

        this.renderObservations();
        this.renderPagination();
      } catch {
        const errMsg =
          this.dataType === "species"
            ? "Could not load species. Check the source name and try again."
            : "Could not load observations. Check the source name and try again.";
        this.contentEl.innerHTML = `<div class="inat-w-error"><div class="inat-w-error-icon">&#x26A0;&#xFE0F;</div><div>${errMsg}</div></div>`;
      }
    }

    listUrl(perPage, page) {
      const isSpecies = this.dataType === "species";
      const params = new URLSearchParams({
        per_page: perPage,
      });
      if (page > 1) {
        params.set("page", page);
      }
      if (!isSpecies) {
        params.set("order", "desc");
        params.set("order_by", this.orderBy);
      }

      if (this.sourceType === "project") {
        params.set("project_id", this.source);
      } else if (this.sourceType === "place") {
        params.set("place_id", this.source);
      } else {
        params.set("user_id", this.source);
      }

      // Language/locale
      if (this.lang) {
        params.set("locale", this.lang);
      }

      // Taxon filter (in-widget search takes precedence over the configured filter)
      const taxonFilter = this.searchTaxon || this.taxon;
      if (taxonFilter) {
        params.set("taxon_id", taxonFilter);
      }

      // Quality grade filter
      if (this.qualityGrade && this.qualityGrade !== "any") {
        params.set("quality_grade", this.qualityGrade);
      }

      // Date filters
      if (this.dateOn) {
        params.set("on", this.dateOn);
      } else {
        if (this.dateFrom) params.set("d1", this.dateFrom);
        if (this.dateTo) params.set("d2", this.dateTo);
      }

      // Raw API params passthrough — any /observations filter the widget has no
      // attribute for (e.g. "photos=true&threatened=true" or "user_id=alice,bob").
      // Overrides other attributes on conflict; the in-widget taxa search still wins.
      if (this.extraParams) {
        new URLSearchParams(this.extraParams).forEach((value, key) => {
          params.set(key, value);
        });
        if (this.searchTaxon) params.set("taxon_id", this.searchTaxon);
      }

      const endpoint = isSpecies ? "observations/species_counts" : "observations";
      return `${INAT_API}/${endpoint}?${params.toString()}`;
    }

    renderObservations() {
      // Single observation always renders as card
      if (this.sourceType === "observation") {
        this.renderCards();
        return;
      }
      if (this.dataType === "species") {
        switch (this.layout) {
          case "list":
            this.renderSpeciesList();
            break;
          case "cards":
            this.renderSpeciesCards();
            break;
          case "slideshow":
            this.renderSlideshow();
            break;
          case "grid":
          default:
            this.renderSpeciesGrid();
            break;
        }
        return;
      }
      switch (this.layout) {
        case "list":
          this.renderList();
          break;
        case "grid":
          this.renderGrid();
          break;
        case "slideshow":
          this.renderSlideshow();
          break;
        case "cards":
        default:
          this.renderCards();
          break;
      }
    }

    renderList() {
      const wrap = document.createElement("div");
      wrap.className = "inat-w-list";

      this.observations.forEach((obs) => {
        const name = this.getCommonName(obs);
        const scientific = this.getScientificName(obs);
        const photo = this.getPhotoUrl(obs, "square");
        const date = this.formatDate(obs);
        const user = obs.user ? obs.user.login : "";
        const url = `https://www.inaturalist.org/observations/${obs.id}`;

        const item = document.createElement("a");
        item.className = "inat-w-list-item";
        item.href = url;
        item.target = "_blank";
        item.rel = "noopener";
        item.innerHTML = `
          ${photo ? `<img class="inat-w-list-img" src="${photo}" alt="${this.escapeHtml(name)}" loading="lazy" />` : `<div class="inat-w-list-img inat-w-no-photo" style="width:48px;height:48px;flex-shrink:0;font-size:16px">${this.noPhotoIcon(obs)}</div>`}
          <div class="inat-w-list-info">
            <div class="inat-w-list-name">${this.escapeHtml(name)}</div>
            <div class="inat-w-list-scientific">${this.escapeHtml(scientific)}</div>
            <div class="inat-w-list-meta">${this.escapeHtml(user)} · ${date}</div>
          </div>
          ${this.showGrade && obs.quality_grade && obs.quality_grade !== "casual" ? `<span class="inat-w-grade inat-w-grade-${obs.quality_grade}">${obs.quality_grade === "research" ? "RG" : "Needs ID"}</span>` : ""}
        `;
        wrap.appendChild(item);
      });

      this.contentEl.innerHTML = "";
      this.contentEl.appendChild(wrap);
    }

    renderGrid() {
      const wrap = document.createElement("div");
      wrap.className =
        "inat-w-grid" +
        (this.compact ? " inat-w-compact" : "") +
        (this.showNames ? " inat-w-show-names" : "");

      this.observations.forEach((obs) => {
        const name = this.getCommonName(obs);
        const scientific = this.getScientificName(obs);
        const photo = this.getPhotoUrl(obs, this.compact ? "square" : "medium");
        const url = `https://www.inaturalist.org/observations/${obs.id}`;

        const item = document.createElement("a");
        item.className = "inat-w-grid-item";
        item.href = url;
        item.target = "_blank";
        item.rel = "noopener";
        item.innerHTML = `
          ${photo ? `<img class="inat-w-grid-img" src="${photo}" alt="${this.escapeHtml(name)}" loading="lazy" />` : `<div class="inat-w-no-photo" style="aspect-ratio:1">${this.noPhotoIcon(obs)}</div>`}
          <div class="inat-w-grid-overlay">
            <div class="inat-w-grid-name">${this.escapeHtml(name)}</div>
            <div class="inat-w-grid-sci">${this.escapeHtml(scientific)}</div>
          </div>
        `;
        wrap.appendChild(item);
      });

      this.contentEl.innerHTML = "";
      this.contentEl.appendChild(wrap);
    }

    renderCards() {
      const wrap = document.createElement("div");
      wrap.className = "inat-w-cards" + (this.compact ? " inat-w-compact" : "");

      const isMultiUser = this.sourceType === "project" || this.sourceType === "place";

      this.observations.forEach((obs) => {
        const name = this.getCommonName(obs);
        const scientific = this.getScientificName(obs);
        const coverPhoto = this.getPhotoUrl(obs, "medium");
        const date = this.formatDate(obs);
        const user = obs.user ? obs.user.login : "Unknown";
        const userIcon = obs.user && obs.user.icon ? obs.user.icon : null;
        const place = obs.place_guess || "Unknown location";
        const notes = obs.description || "";
        const url = `https://www.inaturalist.org/observations/${obs.id}`;
        const photos = obs.photos || [];
        const hasMultiPhotos = photos.length > 1;

        const avatarBadge = isMultiUser
          ? `
            <div class="inat-w-card-taxon-badge">
              ${userIcon ? `<img class="inat-w-card-taxon-img" src="${userIcon}" alt="${this.escapeHtml(user)}" loading="lazy" />` : `<div class="inat-w-no-photo" style="border-radius:50%">&#x1F464;</div>`}
            </div>
          `
          : "";

        let photoHtml;
        if (hasMultiPhotos) {
          const photoImgs = photos
            .map(
              (p) =>
                `<img src="${p.url ? p.url.replace("square", "medium") : ""}" alt="${this.escapeHtml(name)}" loading="lazy" />`
            )
            .join("");
          const dots = photos
            .map((_, i) => `<span class="inat-w-card-dot${i === 0 ? " active" : ""}"></span>`)
            .join("");
          photoHtml = `
            <div class="inat-w-card-photos-clip">
              <div class="inat-w-card-photos" data-index="0">${photoImgs}</div>
            </div>
            <button class="inat-w-card-nav inat-w-card-nav-prev" data-dir="-1">‹</button>
            <button class="inat-w-card-nav inat-w-card-nav-next" data-dir="1">›</button>
            <div class="inat-w-card-dots">${dots}</div>
          `;
        } else {
          photoHtml = coverPhoto
            ? `<img class="inat-w-card-cover-img" src="${coverPhoto}" alt="${this.escapeHtml(name)}" loading="lazy" />`
            : `<div class="inat-w-no-photo">${this.noPhotoIcon(obs)}</div>`;
        }

        const coverHtml = `
          <div class="inat-w-card-cover">
            ${photoHtml}
            ${avatarBadge}
          </div>
        `;

        const card = document.createElement("a");
        card.className = "inat-w-card";
        card.href = url;
        card.target = "_blank";
        card.rel = "noopener";
        card.innerHTML = `
          ${coverHtml}
          <div class="inat-w-card-body">
            <div class="inat-w-card-common">${this.escapeHtml(name)}</div>
            <div class="inat-w-card-scientific">${this.escapeHtml(scientific)}</div>
            <div class="inat-w-card-details">
              <div class="inat-w-card-detail">
                <span class="inat-w-card-detail-label">Observer:</span>
                <span class="inat-w-card-detail-value">${this.escapeHtml(user)}</span>
              </div>
              <div class="inat-w-card-detail">
                <span class="inat-w-card-detail-label">Date:</span>
                <span class="inat-w-card-detail-value">${date}</span>
              </div>
              ${
                this.showLocation
                  ? `<div class="inat-w-card-detail">
                <span class="inat-w-card-detail-label">Location:</span>
                <span class="inat-w-card-detail-value">${this.escapeHtml(place)}</span>
              </div>`
                  : ""
              }
              ${
                this.showGrade && obs.quality_grade && obs.quality_grade !== "casual"
                  ? `<div class="inat-w-card-detail">
                <span class="inat-w-card-detail-label">Grade:</span>
                <span class="inat-w-card-detail-value"><span class="inat-w-grade inat-w-grade-${obs.quality_grade}">${obs.quality_grade === "research" ? "Research Grade" : "Needs ID"}</span></span>
              </div>`
                  : ""
              }
              ${
                this.showNotes && notes
                  ? `<div class="inat-w-card-detail">
                <span class="inat-w-card-detail-label">Notes:</span>
                <span class="inat-w-card-detail-value">${this.escapeHtml(notes)}</span>
              </div>`
                  : ""
              }
            </div>
          </div>
        `;

        // Bind photo navigation (prevent link click)
        if (hasMultiPhotos) {
          card.querySelectorAll(".inat-w-card-nav").forEach((btn) => {
            btn.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              const photosEl = card.querySelector(".inat-w-card-photos");
              let idx = parseInt(photosEl.dataset.index) || 0;
              const dir = parseInt(btn.dataset.dir);
              idx = (idx + dir + photos.length) % photos.length;
              photosEl.dataset.index = idx;
              photosEl.style.marginLeft = `-${idx * 100}%`;
              const dots = card.querySelectorAll(".inat-w-card-dot");
              dots.forEach((d, i) => d.classList.toggle("active", i === idx));
            });
          });
        }

        wrap.appendChild(card);
      });

      this.contentEl.innerHTML = "";
      this.contentEl.appendChild(wrap);
    }

    speciesItems() {
      // species_counts results have shape { count, taxon }
      return this.observations.map((r) => ({
        count: r.count,
        taxon: r.taxon || {},
      }));
    }

    speciesPhoto(taxon, size) {
      const photo = taxon && taxon.default_photo;
      if (!photo) return null;
      const url = photo[`${size}_url`] || photo.medium_url || photo.square_url;
      return url || null;
    }

    speciesUrl(taxon) {
      if (!taxon || !taxon.id) return "https://www.inaturalist.org";
      return `https://www.inaturalist.org/taxa/${taxon.id}`;
    }

    speciesCommonName(taxon) {
      if (!taxon) return "Unknown species";
      return taxon.preferred_common_name || taxon.name || "Unknown species";
    }

    speciesScientificName(taxon) {
      return (taxon && taxon.name) || "";
    }

    formatCount(n) {
      if (n == null) return "";
      return n.toLocaleString();
    }

    renderSpeciesList() {
      const wrap = document.createElement("div");
      wrap.className = "inat-w-list";
      this.speciesItems().forEach(({ count, taxon }) => {
        const name = this.speciesCommonName(taxon);
        const sci = this.speciesScientificName(taxon);
        const photo = this.speciesPhoto(taxon, "square");
        const url = this.speciesUrl(taxon);
        const item = document.createElement("a");
        item.className = "inat-w-list-item";
        item.href = url;
        item.target = "_blank";
        item.rel = "noopener";
        item.innerHTML = `
          ${photo ? `<img class="inat-w-list-img" src="${photo}" alt="${this.escapeHtml(name)}" loading="lazy" />` : `<div class="inat-w-list-img inat-w-no-photo" style="width:48px;height:48px;flex-shrink:0;font-size:16px">&#x1F33F;</div>`}
          <div class="inat-w-list-info">
            <div class="inat-w-list-name">${this.escapeHtml(name)}</div>
            <div class="inat-w-list-scientific">${this.escapeHtml(sci)}</div>
          </div>
          ${this.showCount ? `<span class="inat-w-count-pill">${this.formatCount(count)}</span>` : ""}
        `;
        wrap.appendChild(item);
      });
      this.contentEl.innerHTML = "";
      this.contentEl.appendChild(wrap);
    }

    renderSpeciesGrid() {
      const wrap = document.createElement("div");
      wrap.className =
        "inat-w-grid" +
        (this.compact ? " inat-w-compact" : "") +
        (this.showNames ? " inat-w-show-names" : "");
      this.speciesItems().forEach(({ count, taxon }) => {
        const name = this.speciesCommonName(taxon);
        const sci = this.speciesScientificName(taxon);
        const photo = this.speciesPhoto(taxon, this.compact ? "square" : "medium");
        const url = this.speciesUrl(taxon);
        const item = document.createElement("a");
        item.className = "inat-w-grid-item";
        item.href = url;
        item.target = "_blank";
        item.rel = "noopener";
        item.innerHTML = `
          ${photo ? `<img class="inat-w-grid-img" src="${photo}" alt="${this.escapeHtml(name)}" loading="lazy" />` : `<div class="inat-w-no-photo" style="aspect-ratio:1">&#x1F33F;</div>`}
          ${this.showCount ? `<span class="inat-w-count-badge">${this.formatCount(count)}</span>` : ""}
          <div class="inat-w-grid-overlay">
            <div class="inat-w-grid-name">${this.escapeHtml(name)}</div>
            <div class="inat-w-grid-sci">${this.escapeHtml(sci)}</div>
          </div>
        `;
        wrap.appendChild(item);
      });
      this.contentEl.innerHTML = "";
      this.contentEl.appendChild(wrap);
    }

    renderSpeciesCards() {
      const wrap = document.createElement("div");
      wrap.className = "inat-w-cards" + (this.compact ? " inat-w-compact" : "");
      this.speciesItems().forEach(({ count, taxon }) => {
        const name = this.speciesCommonName(taxon);
        const sci = this.speciesScientificName(taxon);
        const cover = this.speciesPhoto(taxon, "medium");
        const url = this.speciesUrl(taxon);
        const card = document.createElement("a");
        card.className = "inat-w-card";
        card.href = url;
        card.target = "_blank";
        card.rel = "noopener";
        card.innerHTML = `
          <div class="inat-w-card-cover">
            ${cover ? `<img class="inat-w-card-cover-img" src="${cover}" alt="${this.escapeHtml(name)}" loading="lazy" />` : `<div class="inat-w-no-photo">&#x1F33F;</div>`}
            ${this.showCount ? `<span class="inat-w-count-badge">${this.formatCount(count)} obs</span>` : ""}
          </div>
          <div class="inat-w-card-body">
            <div class="inat-w-card-common">${this.escapeHtml(name)}</div>
            <div class="inat-w-card-scientific">${this.escapeHtml(sci)}</div>
          </div>
        `;
        wrap.appendChild(card);
      });
      this.contentEl.innerHTML = "";
      this.contentEl.appendChild(wrap);
    }

    slideshowItem(result) {
      if (this.dataType === "species") {
        const taxon = result.taxon || {};
        // Taxon photos only expose medium; iNat-hosted ones also have a large size
        const medium = this.speciesPhoto(taxon, "medium");
        return {
          url: this.speciesUrl(taxon),
          name: this.speciesCommonName(taxon),
          sci: this.speciesScientificName(taxon),
          photo: medium ? medium.replace("/medium.", "/large.") : null,
          placeholder: "&#x1F33F;",
          badge: this.showCount
            ? `<span class="inat-w-count-badge">${this.formatCount(result.count)} obs</span>`
            : "",
        };
      }
      return {
        url: `https://www.inaturalist.org/observations/${result.id}`,
        name: this.getCommonName(result),
        sci: this.getScientificName(result),
        photo: this.getPhotoUrl(result, "large"),
        placeholder: this.noPhotoIcon(result),
        badge: "",
      };
    }

    renderSlideshow() {
      clearInterval(this.slideTimer);
      const wrap = document.createElement("div");
      wrap.className = "inat-w-slideshow" + (this.showNames ? " inat-w-show-names" : "");

      // Only the first page is loaded up front; later pages load as the slideshow nears them
      const pageSize = Math.min(this.limit, API_MAX_PER_PAGE);
      let total = Math.max(this.observations.length, Math.min(this.limit, this.totalResults));
      const slideEls = [];
      let current = 0;
      let hovering = false;
      let loadingMore = false;

      const addSlides = (results) => {
        results.forEach((r) => {
          const s = this.slideshowItem(r);
          const slide = document.createElement("a");
          slide.className = "inat-w-slide";
          slide.href = s.url;
          slide.target = "_blank";
          slide.rel = "noopener";
          // Photos load on demand as slides come up (see show below)
          slide.innerHTML = `
            ${s.photo ? `<img class="inat-w-slide-img" data-src="${s.photo}" alt="${this.escapeHtml(s.name)}" />` : `<div class="inat-w-no-photo" style="font-size:40px">${s.placeholder}</div>`}
            ${s.badge}
            <div class="inat-w-slide-overlay">
              <div class="inat-w-slide-name">${this.escapeHtml(s.name)}</div>
              <div class="inat-w-slide-sci">${this.escapeHtml(s.sci)}</div>
            </div>
          `;
          wrap.appendChild(slide);
          slideEls.push(slide);
        });
      };

      addSlides(this.observations);

      if (total > 1) {
        wrap.insertAdjacentHTML(
          "beforeend",
          `<button type="button" class="inat-w-slide-nav inat-w-slide-nav-prev" data-dir="-1" aria-label="Previous">‹</button>
          <button type="button" class="inat-w-slide-nav inat-w-slide-nav-next" data-dir="1" aria-label="Next">›</button>
          <span class="inat-w-slide-counter"></span>`
        );
      }
      const counter = wrap.querySelector(".inat-w-slide-counter");
      const updateCounter = () => {
        if (counter) {
          counter.textContent = `${this.formatCount(current + 1)} / ${this.formatCount(total)}`;
        }
      };

      const loadMore = async () => {
        loadingMore = true;
        try {
          const page = Math.floor(slideEls.length / pageSize) + 1;
          const response = await fetch(this.listUrl(pageSize, page));
          if (!response.ok) throw new Error("Failed to fetch");
          const data = await response.json();
          // Drop the page if the slideshow was replaced while it loaded
          if (!wrap.isConnected) return;
          const results = data.results || [];
          addSlides(results.slice(0, total - slideEls.length));
          // A short page means the source has fewer results than expected
          if (results.length < pageSize) total = slideEls.length;
        } catch {
          // Stop paging and keep cycling through what loaded
          total = slideEls.length;
        }
        updateCounter();
        loadingMore = false;
      };

      const show = (idx) => {
        slideEls[current].classList.remove("inat-w-active");
        current = (idx + slideEls.length) % slideEls.length;
        slideEls[current].classList.add("inat-w-active");
        // Load the current photo and preload the next one
        [current, (current + 1) % slideEls.length].forEach((i) => {
          const img = slideEls[i].querySelector("img[data-src]");
          if (img) {
            img.src = img.dataset.src;
            img.removeAttribute("data-src");
          }
        });
        updateCounter();
        // Fetch the next page a few slides before running out
        if (!loadingMore && slideEls.length < total && current >= slideEls.length - 3) {
          loadMore();
        }
      };

      const start = () => {
        clearInterval(this.slideTimer);
        if (hovering || slideEls.length < 2) return;
        this.slideTimer = setInterval(() => {
          // Stop once this slideshow leaves the page (re-render, search, builder preview swap)
          if (!wrap.isConnected) {
            clearInterval(this.slideTimer);
            return;
          }
          show(current + 1);
        }, this.interval * 1000);
      };

      wrap.querySelectorAll(".inat-w-slide-nav").forEach((btn) => {
        btn.addEventListener("click", () => {
          show(current + parseInt(btn.dataset.dir));
          start();
        });
      });

      // Pause while a mouse hovers; touch taps would otherwise pause it indefinitely
      wrap.addEventListener("pointerenter", (e) => {
        if (e.pointerType !== "mouse") return;
        hovering = true;
        clearInterval(this.slideTimer);
      });
      wrap.addEventListener("pointerleave", (e) => {
        if (e.pointerType !== "mouse") return;
        hovering = false;
        start();
      });

      show(0);
      this.contentEl.innerHTML = "";
      this.contentEl.appendChild(wrap);
      if (!this.fill) {
        // Keep the 3:2 shape but narrow it (centered) so the whole widget fits the screen height
        const chrome = Math.round(this.container.offsetHeight - wrap.offsetHeight);
        const fitWidth = (vh) => `min(100%, max(300px, calc((${vh} - ${chrome}px) * 1.5)))`;
        wrap.style.width = fitWidth("100vh");
        wrap.style.width = fitWidth("100dvh"); // ignored where dvh is unsupported
      }
      start();
    }

    getCommonName(obs) {
      if (obs.taxon && obs.taxon.preferred_common_name) return obs.taxon.preferred_common_name;
      if (obs.taxon && obs.taxon.name) return obs.taxon.name;
      return "Unknown species";
    }

    getScientificName(obs) {
      if (obs.taxon && obs.taxon.name) return obs.taxon.name;
      return "";
    }

    getPhotoUrl(obs, size) {
      if (obs.photos && obs.photos.length > 0 && obs.photos[0].url) {
        return obs.photos[0].url.replace("square", size);
      }
      return null;
    }

    hasSound(obs) {
      return obs.sounds && obs.sounds.length > 0;
    }

    noPhotoIcon(obs) {
      return this.hasSound(obs) ? "&#x1F50A;" : "&#x1F4F7;";
    }

    getTaxonPhoto(obs) {
      if (obs.taxon && obs.taxon.default_photo && obs.taxon.default_photo.square_url) {
        return obs.taxon.default_photo.square_url;
      }
      return this.getPhotoUrl(obs, "square");
    }

    formatDate(obs) {
      const dateStr =
        obs.observed_on_details && obs.observed_on_details.date
          ? obs.observed_on_details.date
          : obs.observed_on || obs.created_at;
      if (!dateStr) return "Unknown date";
      try {
        const d = new Date(dateStr);
        return d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      } catch {
        return dateStr;
      }
    }

    escapeHtml(str) {
      if (!str) return "";
      const div = document.createElement("div");
      div.textContent = str;
      return div.innerHTML;
    }
  }

  // Auto-init on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initWidgets);
  } else {
    initWidgets();
  }

  // Expose for manual init
  window.InatWidget = InatWidget;
  window.initInatWidgets = initWidgets;
})();
