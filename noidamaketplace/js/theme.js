/**
 * NoidaGym Marketplace - Theme Engine
 * Controls Light / Dark / System themes with persistent localStorage and media query listener.
 */

(function () {
  const THEME_KEY = 'noidagym_theme_preference';

  function getSystemPreference() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getStoredTheme() {
    return localStorage.getItem(THEME_KEY) || 'system';
  }

  function applyTheme(themeChoice) {
    const effectiveTheme = themeChoice === 'system' ? getSystemPreference() : themeChoice;
    document.documentElement.setAttribute('data-theme', effectiveTheme);

    // Update UI active buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      const mode = btn.getAttribute('data-theme-value');
      btn.classList.toggle('active', mode === themeChoice);
    });
  }

  function setTheme(themeChoice) {
    localStorage.setItem(THEME_KEY, themeChoice);
    applyTheme(themeChoice);
  }

  // Initial apply
  applyTheme(getStoredTheme());

  // Listen to system changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredTheme() === 'system') {
      applyTheme('system');
    }
  });

  // Export to global scope
  window.NoidaTheme = {
    setTheme,
    getStoredTheme,
    applyTheme
  };

  // Wire up theme buttons on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const selected = btn.getAttribute('data-theme-value');
        setTheme(selected);
      });
    });
    applyTheme(getStoredTheme());
  });
})();
