/**
 * iNaturalist Observations Widget
 * A modern, embeddable widget for displaying iNaturalist observations
 * https://glauberramos.github.io/inat/widget
 */
(function () {
  "use strict";

  const INAT_API = "https://api.inaturalist.org/v1";
  const WIDGET_BASE = "https://glauberramos.github.io/inat";

  function initWidgets() {
    const containers = document.querySelectorAll("[data-inat-widget]");
    containers.forEach((el) => new InatWidget(el));
  }

  class InatWidget {
    constructor(container) {
      this.container = container;
      this.source = container.dataset.inatSource || "";
      this.sourceType = container.dataset.inatSourceType || "user";
      this.limit = Math.min(
        50,
        Math.max(1, parseInt(container.dataset.inatLimit) || 10)
      );
      this.orderBy = container.dataset.inatOrderBy || "observed_on";
      this.layout = container.dataset.inatLayout || "grid";
      this.theme = container.dataset.inatTheme || "light";
      this.title = container.dataset.inatTitle || "";
      this.taxon = container.dataset.inatTaxon || "";
      this.qualityGrade = container.dataset.inatQuality || "";
      this.dateFrom = container.dataset.inatDateFrom || "";
      this.dateTo = container.dataset.inatDateTo || "";
      this.dateOn = container.dataset.inatDate || "";
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
          padding: 16px;
          border-radius: var(--inat-radius);
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
        .inat-w.inat-theme-transparent {
          --inat-bg: transparent;
          --inat-card-bg: #ffffff;
          --inat-text: #1a1a2e;
          --inat-text-secondary: #64748b;
          --inat-border: #e2e8f0;
          --inat-hover: #f8fafc;
          --inat-shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
          --inat-shadow-hover: 0 10px 25px rgba(0,0,0,0.1), 0 4px 10px rgba(0,0,0,0.06);
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
          padding-bottom: 10px;
          border-bottom: 1px solid var(--inat-border);
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
        @keyframes inat-spin { to { transform: rotate(360deg); } }

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
          padding: 6px 10px;
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
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
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
          transition: transform 0.3s;
        }
        .inat-w-grid-item:hover .inat-w-grid-img {
          transform: scale(1.05);
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
          z-index: 2;
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
          transition: box-shadow 0.25s, transform 0.25s;
          text-decoration: none !important;
          color: var(--inat-text) !important;
          display: block;
          border: 1px solid var(--inat-border);
        }
        .inat-w-card:hover {
          box-shadow: var(--inat-shadow-hover);
          transform: translateY(-2px);
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
        .inat-w-card-cover .inat-w-card-photos {
          overflow: hidden;
          clip-path: inset(0);
        }
        .inat-w-card-taxon-badge {
          position: absolute;
          bottom: -28px;
          left: 50%;
          transform: translateX(-50%);
          width: 56px;
          height: 56px;
          border-radius: 50%;
          border: 3px solid var(--inat-card-bg);
          overflow: hidden;
          background: var(--inat-border);
          z-index: 1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .inat-w-card-taxon-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .inat-w-card-body {
          padding: 36px 16px 16px;
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

        /* Card photo navigation */
        .inat-w-card-photos {
          display: flex;
          height: 100%;
          transition: transform 0.3s ease;
        }
        .inat-w-card-photos img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .inat-w-card-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
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
          z-index: 3;
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
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          z-index: 3;
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

        /* Footer */
        .inat-w-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-top: 14px;
          padding-top: 12px;
          border-top: 1px solid var(--inat-border);
        }
        .inat-w-footer a {
          font-size: 12px;
          font-weight: 500;
          color: var(--inat-accent) !important;
        }

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
      this.container.className = `inat-w inat-theme-${this.theme}`;

      // Header
      const header = document.createElement("div");
      header.className = "inat-w-header";
      header.innerHTML = `
        <div class="inat-w-header-left">
          <img class="inat-w-header-logo" src="https://static.inaturalist.org/sites/1-logo.svg" alt="iNaturalist" />
          <span class="inat-w-header-sep">/</span>
          <span class="inat-w-header-title">${this.escapeHtml(this.title || this.source)}</span>
        </div>
        <a class="inat-w-header-link" href="${this.getSourceUrl()}" target="_blank" rel="noopener">View on iNaturalist →</a>
      `;
      this.container.appendChild(header);

      // Content area
      this.contentEl = document.createElement("div");
      this.contentEl.innerHTML = `<div class="inat-w-loading"><div class="inat-w-spinner"></div><span>Loading observations…</span></div>`;
      this.container.appendChild(this.contentEl);

      // Footer
      const footer = document.createElement("div");
      footer.className = "inat-w-footer";
      footer.innerHTML = `<a href="${WIDGET_BASE}/widget" target="_blank" rel="noopener">Powered by iNat Widget</a>`;
      this.container.appendChild(footer);
    }

    getSourceUrl() {
      if (this.sourceType === "observation") {
        return `https://www.inaturalist.org/observations/${encodeURIComponent(this.source)}`;
      }
      if (this.sourceType === "project") {
        return `https://www.inaturalist.org/projects/${encodeURIComponent(this.source)}`;
      }
      if (this.sourceType === "place") {
        return `https://www.inaturalist.org/observations?place_id=${encodeURIComponent(this.source)}`;
      }
      return `https://www.inaturalist.org/observations?user_id=${encodeURIComponent(this.source)}`;
    }

    async fetchObservations() {
      try {
        // Single observation mode
        if (this.sourceType === "observation") {
          const response = await fetch(`${INAT_API}/observations/${encodeURIComponent(this.source)}`);
          if (!response.ok) throw new Error("Failed to fetch observation");
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            this.observations = data.results;
          } else {
            this.contentEl.innerHTML = `<div class="inat-w-error"><div class="inat-w-error-icon">🔍</div><div>Observation not found</div></div>`;
            return;
          }
          this.renderObservations();
          return;
        }

        const params = new URLSearchParams({
          per_page: this.limit,
          order: "desc",
          order_by: this.orderBy,
        });

        if (this.sourceType === "project") {
          params.set("project_id", this.source);
        } else if (this.sourceType === "place") {
          params.set("place_id", this.source);
        } else {
          params.set("user_id", this.source);
        }

        // Taxon filter
        if (this.taxon) {
          params.set("taxon_id", this.taxon);
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

        const response = await fetch(
          `${INAT_API}/observations?${params.toString()}`
        );
        if (!response.ok) throw new Error("Failed to fetch observations");

        const data = await response.json();
        this.observations = data.results || [];

        if (this.observations.length === 0) {
          this.contentEl.innerHTML = `<div class="inat-w-error"><div class="inat-w-error-icon">🔍</div><div>No observations found</div></div>`;
          return;
        }

        this.renderObservations();
      } catch (err) {
        this.contentEl.innerHTML = `<div class="inat-w-error"><div class="inat-w-error-icon">⚠️</div><div>Could not load observations. Check the source name and try again.</div></div>`;
      }
    }

    renderObservations() {
      // Single observation always renders as card
      if (this.sourceType === "observation") {
        this.renderCards();
        return;
      }
      switch (this.layout) {
        case "list":
          this.renderList();
          break;
        case "grid":
          this.renderGrid();
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
        const photoCount = obs.photos ? obs.photos.length : 0;
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
        `;
        wrap.appendChild(item);
      });

      this.contentEl.innerHTML = "";
      this.contentEl.appendChild(wrap);
    }

    renderGrid() {
      const wrap = document.createElement("div");
      wrap.className = "inat-w-grid";

      this.observations.forEach((obs) => {
        const name = this.getCommonName(obs);
        const scientific = this.getScientificName(obs);
        const photo = this.getPhotoUrl(obs, "medium");
        const photoCount = obs.photos ? obs.photos.length : 0;
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
      wrap.className = "inat-w-cards";

      const isMultiUser = this.sourceType === "project" || this.sourceType === "place";

      this.observations.forEach((obs) => {
        const name = this.getCommonName(obs);
        const scientific = this.getScientificName(obs);
        const coverPhoto = this.getPhotoUrl(obs, "medium");
        const date = this.formatDate(obs);
        const user = obs.user ? obs.user.login : "Unknown";
        const userIcon = obs.user && obs.user.icon ? obs.user.icon : null;
        const place = obs.place_guess || "Unknown location";
        const url = `https://www.inaturalist.org/observations/${obs.id}`;
        const photos = obs.photos || [];
        const hasMultiPhotos = photos.length > 1;

        const avatarBadge = isMultiUser ? `
            <div class="inat-w-card-taxon-badge">
              ${userIcon ? `<img class="inat-w-card-taxon-img" src="${userIcon}" alt="${this.escapeHtml(user)}" loading="lazy" />` : `<div class="inat-w-no-photo" style="border-radius:50%">👤</div>`}
            </div>
          ` : "";
        const bodyPadding = isMultiUser ? "36px 16px 16px" : "16px";

        let photoHtml;
        if (hasMultiPhotos) {
          const photoImgs = photos.map((p) =>
            `<img src="${p.url ? p.url.replace("square", "medium") : ""}" alt="${this.escapeHtml(name)}" loading="lazy" />`
          ).join("");
          const dots = photos.map((_, i) =>
            `<span class="inat-w-card-dot${i === 0 ? " active" : ""}"></span>`
          ).join("");
          photoHtml = `
            <div class="inat-w-card-photos" data-index="0">${photoImgs}</div>
            <button class="inat-w-card-nav inat-w-card-nav-prev" data-dir="-1">‹</button>
            <button class="inat-w-card-nav inat-w-card-nav-next" data-dir="1">›</button>
            <div class="inat-w-card-dots">${dots}</div>
          `;
        } else {
          photoHtml = coverPhoto
            ? `<img class="inat-w-card-cover-img" src="${coverPhoto}" alt="${this.escapeHtml(name)}" loading="lazy" />`
            : `<div class="inat-w-no-photo" style="height:180px">${this.noPhotoIcon(obs)}</div>`;
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
          <div class="inat-w-card-body" style="padding: ${bodyPadding}">
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
              <div class="inat-w-card-detail">
                <span class="inat-w-card-detail-label">Location:</span>
                <span class="inat-w-card-detail-value">${this.escapeHtml(place)}</span>
              </div>
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
              idx = Math.max(0, Math.min(photos.length - 1, idx + dir));
              photosEl.dataset.index = idx;
              photosEl.style.transform = `translateX(-${idx * 100}%)`;
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

    getCommonName(obs) {
      if (obs.taxon && obs.taxon.preferred_common_name)
        return obs.taxon.preferred_common_name;
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
      return this.hasSound(obs) ? "🔊" : "📷";
    }

    getTaxonPhoto(obs) {
      if (
        obs.taxon &&
        obs.taxon.default_photo &&
        obs.taxon.default_photo.square_url
      ) {
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
        return d.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
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
