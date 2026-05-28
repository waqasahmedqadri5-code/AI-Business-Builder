/* ============================================
   AISYTE - main.js
   Core utilities: loader, back-to-top,
   notification, counters, FAQ, forms
   ============================================ */

/* === LOADER === */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.style.overflow = '';
  }, 1600);
});

document.body.style.overflow = 'hidden';

/* === SCROLL PROGRESS BAR === */
const scrollBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  if (!scrollBar) return;
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollBar.style.width = pct + '%';
});

/* === BACK TO TOP === */
const btt = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (!btt) return;
  if (window.scrollY > 400) btt.classList.add('visible');
  else btt.classList.remove('visible');
});

if (btt) {
  btt.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* === NOTIFICATION TOAST === */
function showNotification(msg, type = 'success', duration = 3500) {
  const el = document.getElementById('notification');
  if (!el) return;

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  el.className = `${type}`;
  el.innerHTML = `
    <div class="notif-icon">${icons[type] || icons.info}</div>
    <span>${msg}</span>
  `;
  el.classList.add('show');

  clearTimeout(el._timer);
  el._timer = setTimeout(() => el.classList.remove('show'), duration);
}

/* === FAQ ACCORDION === */
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.faq-item');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(el => {
      el.classList.remove('open');
    });

    // Open clicked (if it wasn't already open)
    if (!isOpen) item.classList.add('open');
  });
});

/* === ANIMATED COUNTERS === */
function animateCounter(el) {
  const target = parseFloat(el.getAttribute('data-target'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 2000;
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  const step = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out quad
    const ease = 1 - (1 - progress) * (1 - progress);
    const value = target * ease;
    el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.floor(value).toLocaleString()) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}

/* === PRICING TOGGLE === */
const pricingToggle = document.getElementById('pricing-toggle');
const monthlyLabel = document.getElementById('monthly-label');
const yearlyLabel = document.getElementById('yearly-label');
let isYearly = false;

const priceData = [
  { monthly: 0,   yearly: 0   },
  { monthly: 29,  yearly: 19  },
  { monthly: 79,  yearly: 59  },
];

if (pricingToggle) {
  pricingToggle.addEventListener('click', () => {
    isYearly = !isYearly;
    pricingToggle.classList.toggle('on', isYearly);

    if (monthlyLabel && yearlyLabel) {
      monthlyLabel.classList.toggle('active-label', !isYearly);
      yearlyLabel.classList.toggle('active-label', isYearly);
    }

    // Update displayed prices
    document.querySelectorAll('[data-price-idx]').forEach(el => {
      const idx = parseInt(el.getAttribute('data-price-idx'));
      const data = priceData[idx];
      if (!data) return;
      el.textContent = isYearly ? data.yearly : data.monthly;
    });
  });
}

/* === TEMPLATE FILTER === */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');
    document.querySelectorAll('.template-card').forEach(card => {
      const cat = card.getAttribute('data-category');
      const show = filter === 'all' || cat === filter;
      card.style.display = show ? '' : 'none';
      card.style.opacity = show ? '' : '0';
    });
  });
});

/* === CONTACT FORM VALIDATION === */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const fields = [
      { id: 'c-name',    msg: 'Please enter your name.',           min: 2 },
      { id: 'c-email',   msg: 'Please enter a valid email.',        email: true },
      { id: 'c-message', msg: 'Message must be at least 10 chars.', min: 10 },
    ];

    fields.forEach(f => {
      const input = document.getElementById(f.id);
      const errEl = document.getElementById(f.id + '-err');
      if (!input) return;

      let error = '';
      const val = input.value.trim();

      if (!val) {
        error = f.msg;
      } else if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        error = f.msg;
      } else if (f.min && val.length < f.min) {
        error = f.msg;
      }

      if (errEl) errEl.textContent = error;

      if (error) {
        valid = false;
        input.style.borderColor = 'var(--accent3)';
      } else {
        input.style.borderColor = '';
      }
    });

    if (valid) {
      showNotification('Message sent! We\'ll be in touch soon.', 'success');
      contactForm.reset();
      document.querySelectorAll('.form-err').forEach(el => el.textContent = '');
      document.querySelectorAll('.form-field input, .form-field textarea').forEach(el => el.style.borderColor = '');
    } else {
      showNotification('Please fix the errors below.', 'error');
    }
  });

  // Live clear error on input
  contactForm.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('input', () => {
      const errEl = document.getElementById(input.id + '-err');
      if (errEl) errEl.textContent = '';
      input.style.borderColor = '';
    });
  });
}

/* === NEWSLETTER FORM === */
document.querySelectorAll('.newsletter-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (!input) return;

    if (!input.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
      showNotification('Enter a valid email to subscribe.', 'error');
      return;
    }

    showNotification('🎉 Subscribed! Welcome to AISyte.', 'success');
    input.value = '';
  });
});

/* === RIPPLE EFFECT on .btn === */
document.querySelectorAll('.btn').forEach(btn => {
  btn.classList.add('ripple-container');
  btn.addEventListener('click', (e) => {
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple-wave';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

/* === DEMO STEP TOGGLE === */
document.querySelectorAll('.demo-step').forEach((step, i) => {
  step.addEventListener('click', () => {
    document.querySelectorAll('.demo-step').forEach(s => s.classList.remove('active'));
    step.classList.add('active');
  });
});

/* Auto-cycle demo steps */
if (document.querySelectorAll('.demo-step').length > 0) {
  let currentStep = 0;
  const steps = document.querySelectorAll('.demo-step');
  setInterval(() => {
    steps[currentStep].classList.remove('active');
    currentStep = (currentStep + 1) % steps.length;
    steps[currentStep].classList.add('active');
  }, 3000);
}