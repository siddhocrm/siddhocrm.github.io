/* =============================================
   SIDDHO CRM — JavaScript
   Theme toggle, FAQ, scroll effects, form
   ============================================= */

// ── Theme Toggle ──
const html = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Load saved preference, default is light
const savedTheme = localStorage.getItem('siddho-theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeIcon.textContent = savedTheme === 'dark' ? '☀️' : '🌙';

themeToggle.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('siddho-theme', next);
  themeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
});

// ── Hamburger Menu ──
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// ── Navbar scroll effect ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── Back to Top ──
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});

// ── FAQ Toggle ──
function toggleFaq(id) {
  const item = document.getElementById(id);
  const isOpen = item.classList.contains('open');
  // Close all
  document.querySelectorAll('.faq-item').forEach(f => f.classList.remove('open'));
  // Open clicked if it was closed
  if (!isOpen) item.classList.add('open');
}

// ── Scroll-in Animations (IntersectionObserver) ──
const observerOptions = { threshold: 0.12 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Elements to animate on scroll
const animTargets = [
  '.why-card', '.about-stat-card', '.highlight-item',
  '.service-block', '.plan-card', '.testi-card', '.faq-item',
  '.about-text', '.about-cards', '.demo-text', '.demo-form'
];
animTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${i * 0.06}s`;
    observer.observe(el);
  });
});

// ── Demo Form Submit ──
// Track whether a submission is in progress to block double-submits
let demoSubmitting = false;

function handleDemoSubmit(e) {
  e.preventDefault();

  // Block if already in progress
  if (demoSubmitting) return;

  const form = document.getElementById('demo-form');
  const btn = document.getElementById('demo-submit-btn');

  // Use native HTML5 validation as a second guard
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Grab values only after validation passes
  const name = document.getElementById('demo-name').value.trim();
  const phone = document.getElementById('demo-phone').value.trim();
  const biz = document.getElementById('demo-biz').value;
  const need = document.getElementById('demo-need').value;

  // Lock the button while sending
  demoSubmitting = true;
  btn.textContent = '⏳ Sending...';
  btn.disabled = true;
  btn.style.opacity = '0.7';

  // Simulate network request (replace with real API call if needed)
  setTimeout(() => {
    // ✅ Only show the toast here — strictly after successful submission
    showDemoToast();

    // Reset form & button
    form.reset();
    btn.textContent = '🚀 Request Free Demo';
    btn.disabled = false;
    btn.style.opacity = '1';
    demoSubmitting = false;

    // Build WhatsApp message and open in new tab
    const msg = encodeURIComponent(
      `Hello Siddho CRM! 👋\n\nI'd like a FREE CONSULTATION.\n\nName: ${name}\nPhone: ${phone}\nBusiness: ${biz}\nService needed: ${need || 'Not specified'}`
    );
    window.open('https://api.whatsapp.com/send/?phone=%2B918900415759&text&type=phone_number&app_absent=0');
  }, 1200);
}

// ── Toast — only called by handleDemoSubmit on successful submit ──
function showDemoToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4500);
}

// ── Smooth anchor scroll with offset ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Typing effect in hero (optional subtle animation) ──
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
  heroTitle.style.opacity = '0';
  heroTitle.style.transform = 'translateY(20px)';
  setTimeout(() => {
    heroTitle.style.transition = 'opacity .7s ease, transform .7s ease';
    heroTitle.style.opacity = '1';
    heroTitle.style.transform = 'translateY(0)';
  }, 100);
}

// ── Active nav link highlight on scroll ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => {
        a.style.color = '';
        a.style.background = '';
        if (a.getAttribute('href') === '#' + entry.target.id) {
          a.style.color = 'var(--primary)';
          a.style.background = 'var(--primary-lt)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

// ── Custom Cursor ──
(function () {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  // Skip on touch-only devices
  if (!dot || !ring || window.matchMedia('(hover: none)').matches) return;

  let mouseX = -100, mouseY = -100;
  let ringX  = -100, ringY  = -100;
  let rafId;

  // Move dot instantly, ring follows with lerp
  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth-follow ring via rAF lerp
  function animateRing() {
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const hoverTargets = 'a, button, input, select, textarea, label, [role="button"]';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Click state
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  // Hide cursors when mouse leaves window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

// Floating WhatsApp button is handled directly in the HTML.
