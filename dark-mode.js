// Dark mode functionality
// The inline bootstrap in each page's <head> already put .dark-mode on <html>
// before first paint; here we build the toggle and keep <html> and <body>
// in sync (some scripts still check document.body for the class).
(function () {
  // Create dark mode toggle button if it doesn't exist
  let darkModeToggle = document.getElementById("darkModeToggle");

  if (!darkModeToggle) {
    darkModeToggle = document.createElement("button");
    darkModeToggle.id = "darkModeToggle";
    darkModeToggle.className = "dark-mode-toggle";
    darkModeToggle.title = "Toggle dark mode";
    darkModeToggle.textContent = "🌛";
    document.body.insertBefore(darkModeToggle, document.body.firstChild);
  }

  // Load dark mode preference from localStorage
  const isDark = localStorage.getItem("darkMode") === "true";
  document.documentElement.classList.toggle("dark-mode", isDark);
  document.body.classList.toggle("dark-mode", isDark);
  if (isDark) {
    darkModeToggle.textContent = "☀️";
  }

  // Toggle dark mode
  darkModeToggle.addEventListener("click", () => {
    const isDarkMode = !document.documentElement.classList.contains("dark-mode");
    document.documentElement.classList.toggle("dark-mode", isDarkMode);
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
    darkModeToggle.textContent = isDarkMode ? "☀️" : "🌛";
  });
})();
