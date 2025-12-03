// Dark mode functionality
(function() {
  // Create dark mode toggle button if it doesn't exist
  let darkModeToggle = document.getElementById("darkModeToggle");

  if (!darkModeToggle) {
    darkModeToggle = document.createElement("button");
    darkModeToggle.id = "darkModeToggle";
    darkModeToggle.className = "dark-mode-toggle";
    darkModeToggle.title = "Toggle dark mode";
    darkModeToggle.textContent = "🌙";
    document.body.insertBefore(darkModeToggle, document.body.firstChild);
  }

  // Load dark mode preference from localStorage
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️";
  }

  // Toggle dark mode
  darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
    darkModeToggle.textContent = isDarkMode ? "☀️" : "🌙";
  });
})();
