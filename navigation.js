/* ============================================
   AISYTE - navigation.js
   Sticky navbar, hamburger, smooth scroll,
   active link highlighting
   ============================================ */

(function initNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  /* --- Sticky Navbar on Scroll --- */
  window.addEventListener('scroll', () => {
    if (!navbar) return;
    if (window.scrollY > 20) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  });

  /* --- Hamburger Toggle --- */
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.contains('open');
      hamburger.classList.toggle('open', !isOpen);
      mobileNav.classList.toggle('open', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    });

    // Close on mobile nav link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* --- Smooth Scroll for all anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const offset = 80; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --- Active Nav Link Highlighting --- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');

  function highlightNav() {
    const scrollY = window.scrollY + 100;
    let current = '';

    sections.forEach(section => {
      if (scrollY >= section.offsetTop) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav, { passive: true });
  highlightNav();

})();