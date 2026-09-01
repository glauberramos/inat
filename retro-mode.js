// Retro Pokédex theme toggle (SpeciesDex page only)
// The inline bootstrap in speciesdex.html's <head> already put .retro-mode
// on <html> before first paint; here we build the toggle (next to the dark
// mode toggle) and keep <html> and <body> in sync.
(function () {
  let retroToggle = document.getElementById("retroModeToggle");

  if (!retroToggle) {
    retroToggle = document.createElement("button");
    retroToggle.id = "retroModeToggle";
    retroToggle.className = "retro-mode-toggle";
    retroToggle.title = "Toggle retro Pokédex theme";
    retroToggle.textContent = "🕹️";
    document.body.insertBefore(retroToggle, document.body.firstChild);
  }

  // While retro is on, each card photo gets a low-resolution canvas overlay
  // that redraws it in chunky pixels (CSS upscales it with
  // image-rendering: pixelated). Drawing — not reading back — a
  // cross-origin image is allowed, so this works for every photo host.
  const PIXEL_WIDTH = 112; // internal resolution; smaller = chunkier
  const PIXEL_HEIGHT = 84; // 4:3, matching the card photo box

  function drawPixelated(img, canvas) {
    const w = img.naturalWidth;
    const h = img.naturalHeight;
    if (!w || !h) return;
    canvas.width = PIXEL_WIDTH;
    canvas.height = PIXEL_HEIGHT;
    const ctx = canvas.getContext("2d");
    // crop the source to 4:3 like object-fit: cover
    const scale = Math.max(PIXEL_WIDTH / w, PIXEL_HEIGHT / h);
    const sw = PIXEL_WIDTH / scale;
    const sh = PIXEL_HEIGHT / scale;
    ctx.drawImage(
      img,
      (w - sw) / 2,
      (h - sh) / 2,
      sw,
      sh,
      0,
      0,
      PIXEL_WIDTH,
      PIXEL_HEIGHT
    );
  }

  function pixelateImg(img) {
    if (img.dataset.retroPixel) return;
    img.dataset.retroPixel = "1";
    const canvas = document.createElement("canvas");
    canvas.className = "retro-pixel-canvas";
    img.after(canvas);
    const render = () => drawPixelated(img, canvas);
    if (img.complete) render();
    img.addEventListener("load", render);
  }

  function restoreImg(img) {
    if (!img.dataset.retroPixel) return;
    delete img.dataset.retroPixel;
    const canvas = img.parentElement.querySelector(".retro-pixel-canvas");
    if (canvas) canvas.remove();
  }

  function updateCardImages() {
    const isRetro = document.documentElement.classList.contains("retro-mode");
    document
      .querySelectorAll(".species-card img")
      .forEach(isRetro ? pixelateImg : restoreImg);
  }

  // Cards render after each search — keep new ones in sync
  const grid = document.getElementById("speciesGrid");
  if (grid) {
    new MutationObserver(updateCardImages).observe(grid, { childList: true });
  }

  // Load retro preference from localStorage
  const isRetro = localStorage.getItem("speciesdexRetro") === "true";
  document.documentElement.classList.toggle("retro-mode", isRetro);
  document.body.classList.toggle("retro-mode", isRetro);
  updateCardImages();

  // Toggle retro theme
  retroToggle.addEventListener("click", () => {
    const isRetroMode =
      !document.documentElement.classList.contains("retro-mode");
    document.documentElement.classList.toggle("retro-mode", isRetroMode);
    document.body.classList.toggle("retro-mode", isRetroMode);
    localStorage.setItem("speciesdexRetro", isRetroMode);
    updateCardImages();
  });
})();
