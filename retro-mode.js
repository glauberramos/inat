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

  // Load retro preference from localStorage
  const isRetro = localStorage.getItem("speciesdexRetro") === "true";
  document.documentElement.classList.toggle("retro-mode", isRetro);
  document.body.classList.toggle("retro-mode", isRetro);

  // Toggle retro theme
  retroToggle.addEventListener("click", () => {
    const isRetroMode =
      !document.documentElement.classList.contains("retro-mode");
    document.documentElement.classList.toggle("retro-mode", isRetroMode);
    document.body.classList.toggle("retro-mode", isRetroMode);
    localStorage.setItem("speciesdexRetro", isRetroMode);
  });
})();
