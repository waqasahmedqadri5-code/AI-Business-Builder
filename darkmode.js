/* ============================================
   AISYTE - darkmode.js
   Dark/Light mode toggle with localStorage
   ============================================ */

(function() {
  const STORAGE_KEY = 'aisyte-theme';
  const btn = document.getElementById('theme-toggle');
  const mobilBtn = document.getElementById('theme-toggle-mobile');

  /* Determine initial theme */
  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initial = saved || (prefersDark ? 'dark' : 'light');

  applyTheme(initial, false);

  function applyTheme(theme, animate = true) {
    if (animate) {
      document.documentElement.style.transition = 'background-color 0.4s ease, color 0.4s ease';
    }

    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }

    localStorage.setItem(STORAGE_KEY, theme);
    updateIcon(theme);

    if (animate) {
      setTimeout(() => {
        document.documentElement.style.transition = '';
      }, 400);
    }
  }

  function updateIcon(theme) {
    const icon = theme === 'light' ? '🌙' : '☀️';
    const title = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
    [btn, mobilBtn].forEach(b => {
      if (b) {
        b.textContent = icon;
        b.title = title;
      }
    });
  }

  function toggle() {
    const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    applyTheme(current === 'light' ? 'dark' : 'light');
  }

  if (btn) btn.addEventListener('click', toggle);
  if (mobilBtn) mobilBtn.addEventListener('click', toggle);

  /* Listen for system preference change */
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });
})();