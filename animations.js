/* ============================================
   AISYTE - animations.js
   Particles, scroll reveal, counters,
   tilt effect, typewriter, custom cursor
   ============================================ */

/* ============================================
   PARTICLE CANVAS
   ============================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(60, Math.floor((canvas.width * canvas.height) / 18000));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
  }

  function getAccentColor() {
    return getComputedStyle(document.documentElement)
      .getPropertyValue('--accent').trim() || '#6366f1';
  }

  function drawLine(a, b, dist) {
    const alpha = 1 - dist / 120;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(99,102,241,${alpha * 0.2})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const accent = getAccentColor();

    particles.forEach((p, i) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(99,102,241,${p.opacity})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[j].x - p.x;
        const dy = particles[j].y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) drawLine(p, particles[j], dist);
      }
    });

    animId = requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      cancelAnimationFrame(animId);
      resize();
      createParticles();
      animate();
    }, 200);
  });
})();

/* ============================================
   SCROLL REVEAL (Intersection Observer)
   ============================================ */
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger counter if applicable
        const counter = entry.target.querySelector('[data-target]');
        if (counter && !counter._counted) {
          counter._counted = true;
          animateCounter(counter);
        }

        // Trigger all counters inside
        entry.target.querySelectorAll('[data-target]').forEach(el => {
          if (!el._counted) {
            el._counted = true;
            animateCounter(el);
          }
        });
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px',
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  // Also observe stat items for counters
  document.querySelectorAll('.stat-item').forEach(el => observer.observe(el));
})();

function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2200;
  const start = performance.now();
  const isDecimal = String(target).includes('.');

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const value = target * ease;
    el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/* ============================================
   TESTIMONIALS CAROUSEL
   ============================================ */
(function initCarousel() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const totalCards = cards.length;
  if (totalCards === 0) return;

  let current = 0;
  let autoPlay;

  function getVisible() {
    if (window.innerWidth >= 900) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  }

  function updateCarousel() {
    const visible = getVisible();
    const cardWidth = track.parentElement.offsetWidth / visible;
    const offset = -(current * (cardWidth + 24));
    track.style.transform = `translateX(${offset}px)`;

    // Update dots
    document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function next() {
    const visible = getVisible();
    const max = Math.ceil(totalCards / visible) - 1;
    current = current >= max ? 0 : current + 1;
    updateCarousel();
  }

  function prev() {
    const visible = getVisible();
    const max = Math.ceil(totalCards / visible) - 1;
    current = current <= 0 ? max : current - 1;
    updateCarousel();
  }

  document.getElementById('carousel-next')?.addEventListener('click', next);
  document.getElementById('carousel-prev')?.addEventListener('click', prev);

  document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
    dot.addEventListener('click', () => {
      current = i;
      updateCarousel();
    });
  });

  autoPlay = setInterval(next, 4500);
  track.closest('.testimonials-carousel')?.addEventListener('mouseenter', () => clearInterval(autoPlay));
  track.closest('.testimonials-carousel')?.addEventListener('mouseleave', () => {
    autoPlay = setInterval(next, 4500);
  });

  window.addEventListener('resize', updateCarousel);
  updateCarousel();
})();

/* ============================================
   CUSTOM CURSOR
   ============================================ */
(function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (window.matchMedia('(pointer: coarse)').matches) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state
  document.querySelectorAll('a, button, .btn, .feature-card, .template-card, .faq-question').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovering'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovering'));
  });
})();

/* ============================================
   TYPEWRITER ANIMATION (AI demo)
   ============================================ */
(function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    'Build a modern SaaS landing page for a project management tool',
    'Create an e-commerce homepage with dark mode and animations',
    'Generate a portfolio website for a UX designer',
    'Design a startup homepage with pricing and testimonials',
    'Build a restaurant website with menu and booking system',
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pauseTimer;

  function type() {
    const phrase = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        pauseTimer = setTimeout(type, 2400);
        return;
      }
    } else {
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        pauseTimer = setTimeout(type, 400);
        return;
      }
    }

    setTimeout(type, deleting ? 35 : 62);
  }

  setTimeout(type, 800);
})();

/* ============================================
   3D TILT CARDS
   ============================================ */
(function initTilt() {
  document.querySelectorAll('.feature-card, .pricing-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const tiltX = ((y - centerY) / centerY) * 6;
      const tiltY = ((x - centerX) / centerX) * -6;
      card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================
   MOUSE PARALLAX (hero blobs)
   ============================================ */
(function initParallax() {
  const blobs = document.querySelectorAll('.hero-blob');
  if (!blobs.length) return;

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;

  document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animateBlobs() {
    currentX += (targetX - currentX) * 0.04;
    currentY += (targetY - currentY) * 0.04;

    blobs.forEach((blob, i) => {
      const factor = (i + 1) * 18;
      blob.style.transform = `translate(${currentX * factor}px, ${currentY * factor}px)`;
    });

    requestAnimationFrame(animateBlobs);
  }

  animateBlobs();
})();