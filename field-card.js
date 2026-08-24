/* ==========================================================================
   Field Card — standalone share-card generator.
   Fetches a user's headline stats (7 API calls, rate-limited), draws a
   1080×1350 card on canvas, and offers download / copy / native share.
   No dependencies; photos load with crossOrigin so the canvas stays
   exportable. Requires constants.js (API_BASE) and shared-utils.js.
   ========================================================================== */

(function () {
  const CARD_W = 1080;
  const CARD_H = 1350;

  const THEMES = {
    paper: {
      bg: '#f3f5ec',
      dot: 'rgba(28, 36, 21, 0.07)',
      surface: '#ffffff',
      ink: '#1c2415',
      muted: '#66705c',
      line: '#dfe4d2',
      green: '#74ac00',
      greenStrong: '#587f00',
      greenTint: '#eef4dc',
      gold: '#c9971c',
      red: '#c0533f',
      orange: '#c97a1c',
      teal: '#2e8b74',
      chip: 'rgba(20, 26, 12, 0.78)',
      spineEnd: '#a8c832'
    },
    night: {
      bg: '#11150c',
      dot: 'rgba(233, 237, 221, 0.07)',
      surface: '#1a2113',
      ink: '#e9eddd',
      muted: '#9aa48a',
      line: '#2b3520',
      green: '#8fc61e',
      greenStrong: '#a5d63a',
      greenTint: '#232d15',
      gold: '#e0b23f',
      red: '#e0705c',
      orange: '#e09a3f',
      teal: '#4fb89d',
      chip: 'rgba(0, 0, 0, 0.66)',
      spineEnd: '#d9e800'
    }
  };

  const MONO = '"Space Mono", ui-monospace, Menlo, monospace';
  const DISPLAY = '"Bricolage Grotesque", -apple-system, sans-serif';

  let cardData = null;
  let currentTheme = 'paper';
  const imageCache = {};

  function fmt(n) {
    return (n || 0).toLocaleString('en-US');
  }

  // wsrv.nl re-serves any image with Access-Control-Allow-Origin: * —
  // needed because static.inaturalist.org (avatars, copyrighted photos)
  // sends no CORS headers, which would taint the canvas and block export
  function proxied(url) {
    return 'https://wsrv.nl/?url=' + encodeURIComponent(url) + '&w=640';
  }

  function loadImage(url) {
    if (!url) return Promise.resolve(null);
    if (imageCache[url]) return imageCache[url];
    imageCache[url] = new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      if (url.includes('static.inaturalist.org')) {
        // known CORS-less host: go straight through the proxy
        img.onerror = () => resolve(null);
        img.src = proxied(url);
      } else {
        // try direct first (S3 open-data supports CORS), proxy as fallback;
        // the cache-buster dodges cached plain-<img> responses that lack
        // CORS headers and would otherwise fail the crossOrigin load
        img.onerror = () => {
          const retry = new Image();
          retry.crossOrigin = 'anonymous';
          retry.onload = () => resolve(retry);
          retry.onerror = () => resolve(null);
          retry.src = proxied(url);
        };
        img.src = url + (url.includes('?') ? '&' : '?') + 'inatcors=1';
      }
    });
    return imageCache[url];
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x, y, w, h, r);
    } else {
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    }
  }

  function truncate(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let t = text;
    while (t.length > 1 && ctx.measureText(t + '…').width > maxWidth) {
      t = t.slice(0, -1);
    }
    return t + '…';
  }

  function drawCoverImage(ctx, img, x, y, w, h, r) {
    ctx.save();
    roundRectPath(ctx, x, y, w, h, r);
    ctx.clip();
    const scale = Math.max(w / img.width, h / img.height);
    const dw = img.width * scale;
    const dh = img.height * scale;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
    ctx.restore();
  }

  async function drawCard(themeName) {
    const canvas = document.getElementById('fieldCardCanvas');
    const ctx = canvas.getContext('2d');
    const T = THEMES[themeName] || THEMES.paper;
    const data = cardData || {};
    const user = data.user || {};
    const stats = data.stats || {};
    const topSpecies = (data.topSpecies || []).slice(0, 3);

    try {
      await Promise.all([
        document.fonts.load(`700 100px ${MONO}`),
        document.fonts.load(`400 26px ${MONO}`),
        document.fonts.load(`700 68px ${DISPLAY}`),
        document.fonts.load(`600 30px ${DISPLAY}`)
      ]);
    } catch (e) {
      /* draw with fallbacks */
    }

    const avatarUrl = user.icon
      ? user.icon.replace(/medium|square|small|thumb/g, 'original')
      : null;
    const [avatarImg, ...speciesImgs] = await Promise.all([
      loadImage(avatarUrl),
      ...topSpecies.map((s) => {
        const p = s.taxon && s.taxon.default_photo;
        return loadImage(p ? p.medium_url || p.square_url : null);
      })
    ]);

    const M = 72;
    const CW = CARD_W - M * 2;

    // --- Ground: paper + dot grid -----------------------------------------
    ctx.clearRect(0, 0, CARD_W, CARD_H);
    ctx.fillStyle = T.bg;
    ctx.fillRect(0, 0, CARD_W, CARD_H);
    ctx.fillStyle = T.dot;
    for (let gy = 22; gy < CARD_H; gy += 33) {
      for (let gx = 22; gx < CARD_W; gx += 33) {
        ctx.beginPath();
        ctx.arc(gx, gy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // --- Spine ------------------------------------------------------------
    const spine = ctx.createLinearGradient(0, 0, CARD_W, 0);
    spine.addColorStop(0, T.green);
    spine.addColorStop(1, T.spineEnd);
    ctx.fillStyle = spine;
    ctx.fillRect(0, 0, CARD_W, 16);

    // --- Header -----------------------------------------------------------
    ctx.textBaseline = 'alphabetic';
    ctx.textAlign = 'left';
    ctx.fillStyle = T.greenStrong;
    ctx.font = `700 26px ${MONO}`;
    ctx.fillText('F I E L D   P R O F I L E   ·   I N A T U R A L I S T', M, 128);

    // Avatar (circle, green ring)
    const avR = 84;
    const avX = M + avR;
    const avY = 262;
    ctx.save();
    ctx.beginPath();
    ctx.arc(avX, avY, avR, 0, Math.PI * 2);
    ctx.fillStyle = T.greenTint;
    ctx.fill();
    ctx.clip();
    if (avatarImg) {
      const s = Math.max((avR * 2) / avatarImg.width, (avR * 2) / avatarImg.height);
      ctx.drawImage(
        avatarImg,
        avX - (avatarImg.width * s) / 2,
        avY - (avatarImg.height * s) / 2,
        avatarImg.width * s,
        avatarImg.height * s
      );
    } else {
      // monogram fallback — avatars live on static.inaturalist.org, which
      // sends no CORS headers, so they can't be drawn without tainting
      const initial = ((user.name || user.login || '?').trim()[0] || '?').toUpperCase();
      ctx.fillStyle = T.green;
      ctx.globalAlpha = 0.14;
      ctx.fillRect(avX - avR, avY - avR, avR * 2, avR * 2);
      ctx.globalAlpha = 1;
      ctx.font = `700 92px ${DISPLAY}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = T.greenStrong;
      ctx.fillText(initial, avX, avY + 8);
      ctx.textBaseline = 'alphabetic';
    }
    ctx.restore();
    ctx.beginPath();
    ctx.arc(avX, avY, avR, 0, Math.PI * 2);
    ctx.lineWidth = 7;
    ctx.strokeStyle = T.green;
    ctx.stroke();

    // Name, handle, meta
    const textX = M + avR * 2 + 44;
    const nameMax = CW - avR * 2 - 44;
    ctx.textAlign = 'left';
    ctx.fillStyle = T.ink;
    let nameSize = 68;
    const displayName = user.name || user.login || '';
    ctx.font = `700 ${nameSize}px ${DISPLAY}`;
    while (nameSize > 38 && ctx.measureText(displayName).width > nameMax) {
      nameSize -= 4;
      ctx.font = `700 ${nameSize}px ${DISPLAY}`;
    }
    ctx.fillText(truncate(ctx, displayName, nameMax), textX, 236);

    ctx.fillStyle = T.green;
    ctx.font = `700 34px ${MONO}`;
    ctx.fillText('@' + (user.login || ''), textX, 288);

    const metaParts = [];
    if (user.created_at) {
      const jd = new Date(user.created_at);
      metaParts.push(
        'Joined ' + jd.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      );
    }
    if (stats.activeDays) {
      metaParts.push(fmt(stats.activeDays) + ' days afield');
    }
    if (metaParts.length > 0) {
      ctx.fillStyle = T.muted;
      ctx.font = `400 26px ${MONO}`;
      ctx.fillText(metaParts.join('  ·  '), textX, 336);
    }

    // --- Dividers ---------------------------------------------------------
    function dashedLine(y) {
      ctx.save();
      ctx.strokeStyle = T.line;
      ctx.lineWidth = 3;
      ctx.setLineDash([2, 10]);
      ctx.beginPath();
      ctx.moveTo(M, y);
      ctx.lineTo(CARD_W - M, y);
      ctx.stroke();
      ctx.restore();
    }
    dashedLine(392);

    // --- Hero numbers -----------------------------------------------------
    const heroY = 520;
    const halves = [
      { value: fmt(stats.observations), label: 'OBSERVATIONS' },
      { value: fmt(stats.species), label: 'SPECIES' }
    ];
    halves.forEach((h, i) => {
      const cx = M + (CW / 4) * (i * 2 + 1);
      ctx.textAlign = 'center';
      ctx.fillStyle = i === 0 ? T.greenStrong : T.green;
      let size = 100;
      ctx.font = `700 ${size}px ${MONO}`;
      while (size > 56 && ctx.measureText(h.value).width > CW / 2 - 60) {
        size -= 6;
        ctx.font = `700 ${size}px ${MONO}`;
      }
      ctx.fillText(h.value, cx, heroY);
      ctx.fillStyle = T.muted;
      ctx.font = `700 24px ${MONO}`;
      ctx.fillText(h.label.split('').join(' '), cx, heroY + 46);
    });
    ctx.save();
    ctx.strokeStyle = T.line;
    ctx.lineWidth = 3;
    ctx.setLineDash([2, 10]);
    ctx.beginPath();
    ctx.moveTo(CARD_W / 2, 432);
    ctx.lineTo(CARD_W / 2, heroY + 56);
    ctx.stroke();
    ctx.restore();

    // --- Conservation / origin chips -------------------------------------
    const chips = [
      { n: stats.threatened, label: 'THREATENED', color: T.red },
      { n: stats.endemic, label: 'ENDEMIC', color: T.gold },
      { n: stats.native, label: 'NATIVE', color: T.teal },
      { n: stats.introduced, label: 'INTRODUCED', color: T.orange }
    ];
    const chipH = 66;
    const chipY = 630;
    const chipGap = 18;
    const numFont = `700 32px ${MONO}`;
    const labFont = `700 20px ${MONO}`;
    const pad = 26;
    const widths = chips.map((c) => {
      ctx.font = numFont;
      const wN = ctx.measureText(fmt(c.n)).width;
      ctx.font = labFont;
      const wL = ctx.measureText(c.label).width;
      return pad + wN + 12 + wL + pad;
    });
    const totalW = widths.reduce((a, b) => a + b, 0) + chipGap * (chips.length - 1);
    let cx = (CARD_W - totalW) / 2;
    chips.forEach((c, i) => {
      roundRectPath(ctx, cx, chipY, widths[i], chipH, chipH / 2);
      ctx.fillStyle = T.surface;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = T.line;
      ctx.stroke();
      ctx.textAlign = 'left';
      ctx.font = numFont;
      ctx.fillStyle = c.color;
      ctx.fillText(fmt(c.n), cx + pad, chipY + chipH / 2 + 11);
      const wN = ctx.measureText(fmt(c.n)).width;
      ctx.font = labFont;
      ctx.fillStyle = T.muted;
      ctx.fillText(c.label, cx + pad + wN + 12, chipY + chipH / 2 + 8);
      cx += widths[i] + chipGap;
    });

    // --- Most observed species -------------------------------------------
    let footerLineY = 1216;
    if (topSpecies.length > 0) {
      ctx.textAlign = 'left';
      ctx.fillStyle = T.greenStrong;
      ctx.font = `700 24px ${MONO}`;
      ctx.fillText('M O S T   O B S E R V E D', M, 782);

      const n = topSpecies.length;
      const gap = 24;
      const cell = (CW - gap * (n - 1)) / n;
      const photoY = 806;
      const photoH = Math.min(cell, 300);

      topSpecies.forEach((s, i) => {
        const x = M + i * (cell + gap);
        const taxon = s.taxon || {};
        const img = speciesImgs[i];

        if (img) {
          drawCoverImage(ctx, img, x, photoY, cell, photoH, 16);
        } else {
          roundRectPath(ctx, x, photoY, cell, photoH, 16);
          ctx.fillStyle = T.greenTint;
          ctx.fill();
          ctx.font = '72px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('🌿', x + cell / 2, photoY + photoH / 2 + 24);
        }
        roundRectPath(ctx, x, photoY, cell, photoH, 16);
        ctx.lineWidth = 2;
        ctx.strokeStyle = T.line;
        ctx.stroke();

        // rank chip
        ctx.font = `700 22px ${MONO}`;
        const rank = '#' + String(i + 1).padStart(2, '0');
        const rw = ctx.measureText(rank).width + 20;
        roundRectPath(ctx, x + 12, photoY + 12, rw, 36, 8);
        ctx.fillStyle = T.chip;
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'left';
        ctx.fillText(rank, x + 22, photoY + 38);

        // count chip
        const countTxt = fmt(s.count) + ' obs';
        const cw2 = ctx.measureText(countTxt).width + 24;
        roundRectPath(ctx, x + cell - cw2 - 12, photoY + photoH - 48, cw2, 36, 18);
        ctx.fillStyle = T.green;
        ctx.fill();
        ctx.fillStyle = themeName === 'night' ? '#101505' : '#ffffff';
        ctx.fillText(countTxt, x + cell - cw2, photoY + photoH - 22);

        // names
        const common = taxon.preferred_common_name || taxon.name || '';
        const sci = taxon.name || '';
        ctx.textAlign = 'center';
        ctx.fillStyle = T.ink;
        ctx.font = `600 30px ${DISPLAY}`;
        ctx.fillText(truncate(ctx, common, cell - 8), x + cell / 2, photoY + photoH + 44);
        if (sci && sci !== common) {
          ctx.fillStyle = T.muted;
          ctx.font = `italic 400 24px ${DISPLAY}`;
          ctx.fillText(truncate(ctx, sci, cell - 8), x + cell / 2, photoY + photoH + 78);
        }
      });
    } else {
      footerLineY = 900;
    }

    // --- Footer -----------------------------------------------------------
    dashedLine(footerLineY);
    ctx.textAlign = 'left';
    ctx.fillStyle = T.muted;
    ctx.font = `700 24px ${MONO}`;
    ctx.fillText('🍃 glauberramos.github.io/inat', M, footerLineY + 62);
    ctx.textAlign = 'right';
    const today = new Date()
      .toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      .toUpperCase();
    ctx.fillText(today, CARD_W - M, footerLineY + 62);
  }

  // --- Data loading -------------------------------------------------------

  const TOTAL_STEPS = 8;

  async function fetchCardData(username, onProgress) {
    let step = 0;
    const tick = () => onProgress(++step, TOTAL_STEPS);

    const userResponse = await fetch(
      `${API_BASE}/users/autocomplete?q=${encodeURIComponent(username)}`
    );
    const userData = await userResponse.json();
    tick();
    if (!userData.results || userData.results.length === 0) {
      throw new Error('User not found');
    }
    const user =
      userData.results.find((u) => u.login.toLowerCase() === username.toLowerCase()) ||
      userData.results[0];
    await sleep(350);

    // per_page=6: one call returns both the species total and the top taxa
    const speciesResponse = await fetch(
      `${API_BASE}/observations/species_counts?user_id=${user.id}&verifiable=true&per_page=6`
    );
    const speciesData = await speciesResponse.json();
    tick();
    await sleep(350);

    const counts = {};
    for (const key of ['threatened', 'endemic', 'native', 'introduced']) {
      const response = await fetch(
        `${API_BASE}/observations/species_counts?user_id=${user.id}&${key}=true&verifiable=true&per_page=0`
      );
      const data = await response.json();
      counts[key] = data.total_results || 0;
      tick();
      await sleep(350);
    }

    // days afield — same logic as the profile page's insights so the two
    // tools agree: start from the earliest observation year (backdated
    // observations can predate the account), not the join date
    let activeDays = 0;
    try {
      const currentYear = new Date().getFullYear();
      const joinYear = user.created_at
        ? new Date(user.created_at).getFullYear()
        : currentYear;

      let earliestYear = joinYear;
      const firstObsResponse = await fetch(
        `${API_BASE}/observations?user_id=${user.id}&order=asc&order_by=observed_on&per_page=1`
      );
      const firstObsData = await firstObsResponse.json();
      tick();
      await sleep(350);
      if (
        firstObsData.results &&
        firstObsData.results.length > 0 &&
        firstObsData.results[0].observed_on
      ) {
        const firstObsYear = new Date(firstObsData.results[0].observed_on).getFullYear();
        earliestYear = Math.min(joinYear, firstObsYear);
      }

      const histResponse = await fetch(
        `${API_BASE}/observations/histogram?user_id=${user.id}&d1=${earliestYear}-01-01&d2=${currentYear}-12-31&date_field=observed&interval=day`
      );
      const histData = await histResponse.json();
      const days = (histData.results && histData.results.day) || {};
      activeDays = Object.keys(days).filter((d) => days[d] > 0).length;
    } catch (e) {
      /* card renders without the days-afield line */
    }
    tick();

    return {
      user,
      stats: {
        observations: user.observations_count || 0,
        species: speciesData.total_results || 0,
        threatened: counts.threatened,
        endemic: counts.endemic,
        native: counts.native,
        introduced: counts.introduced,
        activeDays
      },
      topSpecies: speciesData.results || []
    };
  }

  // --- Page wiring --------------------------------------------------------

  function canvasBlob() {
    return new Promise((resolve, reject) => {
      const canvas = document.getElementById('fieldCardCanvas');
      try {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Export failed'));
        }, 'image/png');
      } catch (e) {
        reject(e);
      }
    });
  }

  function setHint(msg) {
    const hint = document.getElementById('cardHint');
    if (hint) hint.textContent = msg || '';
  }

  async function generateCard() {
    const usernameInput = document.getElementById('usernameInput');
    const loading = document.getElementById('loading');
    const result = document.getElementById('cardResult');
    const username = usernameInput.value.trim();
    if (!username) {
      showError('errorMessage', 'Please enter a username');
      return;
    }

    hideError('errorMessage');
    result.style.display = 'none';
    loading.textContent = 'Gathering field data… 0/' + TOTAL_STEPS;
    loading.style.display = 'block';

    try {
      cardData = await fetchCardData(username, (step, total) => {
        loading.textContent = `Gathering field data… ${step}/${total}`;
      });
      localStorage.setItem('inatUsername', cardData.user.login);
      updateUrlWithUsername(cardData.user.login);
      document.getElementById('profileCrossLink').href =
        `/inat/profile?user=${encodeURIComponent(cardData.user.login)}`;

      loading.textContent = 'Drawing card…';
      await drawCard(currentTheme);

      loading.style.display = 'none';
      result.style.display = 'block';
      setHint('');
    } catch (error) {
      console.error('Error generating card:', error);
      loading.style.display = 'none';
      showError('errorMessage', error.message || 'Error generating card. Please try again.');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('usernameInput');
    const usernameAutocomplete = document.getElementById('usernameAutocomplete');
    const searchButton = document.getElementById('searchButton');
    let searchTimeout = null;

    // Prefill from URL or last-used username; auto-run on deep links
    const urlParams = new URLSearchParams(window.location.search);
    const urlUsername = urlParams.get('user');
    const savedUsername = localStorage.getItem('inatUsername');
    if (urlUsername) {
      usernameInput.value = urlUsername;
      generateCard();
    } else if (savedUsername) {
      usernameInput.value = savedUsername;
    }

    searchButton.addEventListener('click', generateCard);
    usernameInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') generateCard();
    });

    // Username autocomplete
    usernameInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      const query = e.target.value.trim();
      if (query.length < 2) {
        usernameAutocomplete.innerHTML = '';
        usernameAutocomplete.style.display = 'none';
        return;
      }
      searchTimeout = setTimeout(async () => {
        try {
          const response = await fetch(
            `${API_BASE}/users/autocomplete?q=${encodeURIComponent(query)}`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            usernameAutocomplete.innerHTML = data.results
              .slice(0, 10)
              .map(
                (user) => `
                  <div class="username-suggestion" data-login="${escapeHtml(user.login)}">
                    <div class="username-name">${escapeHtml(user.login)}</div>
                    <div class="username-info">${(user.observations_count || 0).toLocaleString()} observations</div>
                  </div>
                `
              )
              .join('');
            usernameAutocomplete.style.display = 'block';
            usernameAutocomplete.querySelectorAll('.username-suggestion').forEach((item) => {
              item.addEventListener('click', () => {
                usernameInput.value = item.dataset.login;
                usernameAutocomplete.style.display = 'none';
                generateCard();
              });
            });
          } else {
            usernameAutocomplete.style.display = 'none';
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      }, 300);
    });

    document.addEventListener('click', (e) => {
      if (!usernameInput.contains(e.target) && !usernameAutocomplete.contains(e.target)) {
        usernameAutocomplete.style.display = 'none';
      }
    });

    // Theme toggle
    document.querySelectorAll('.card-theme-btn').forEach((tb) => {
      tb.addEventListener('click', () => {
        document.querySelectorAll('.card-theme-btn').forEach((b) => b.classList.remove('active'));
        tb.classList.add('active');
        currentTheme = tb.dataset.theme;
        setHint('');
        if (cardData) drawCard(currentTheme);
      });
    });

    // Actions
    document.getElementById('cardDownload').addEventListener('click', async () => {
      try {
        const blob = await canvasBlob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `inat-field-card-${(cardData && cardData.user.login) || 'profile'}.png`;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
        setHint('Saved as PNG.');
      } catch (e) {
        setHint('Export blocked — a photo failed CORS. Try again from the hosted site.');
      }
    });

    const copyBtn = document.getElementById('cardCopy');
    if (!(window.ClipboardItem && navigator.clipboard && window.isSecureContext)) {
      copyBtn.style.display = 'none';
    } else {
      copyBtn.addEventListener('click', async () => {
        try {
          const blob = await canvasBlob();
          await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
          setHint('Copied — paste it anywhere.');
        } catch (e) {
          setHint('Copy failed. Use Download instead.');
        }
      });
    }

    const nativeBtn = document.getElementById('cardShare');
    const testFile = new File([''], 't.png', { type: 'image/png' });
    if (!(navigator.canShare && navigator.canShare({ files: [testFile] }))) {
      nativeBtn.style.display = 'none';
    } else {
      nativeBtn.addEventListener('click', async () => {
        try {
          const blob = await canvasBlob();
          const file = new File(
            [blob],
            `inat-field-card-${(cardData && cardData.user.login) || 'profile'}.png`,
            { type: 'image/png' }
          );
          await navigator.share({ files: [file], title: 'My iNaturalist field card' });
        } catch (e) {
          if (e.name !== 'AbortError') setHint('Share failed. Use Download instead.');
        }
      });
    }
  });
})();
