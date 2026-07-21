document.addEventListener('DOMContentLoaded', () => {

  // =============================================
  // Mobile Nav Toggle
  // =============================================
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  const closeMenu = () => {
    if (!navMenu) return;
    navMenu.classList.remove('active');
    document.body.style.overflow = '';
    const icon = mobileToggle && mobileToggle.querySelector('i');
    if (icon) icon.className = 'fa-solid fa-bars';
  };

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (isOpen) {
        icon.className = 'fa-solid fa-xmark';
        document.body.style.overflow = 'hidden';
      } else {
        icon.className = 'fa-solid fa-bars';
        document.body.style.overflow = '';
      }
    });

    // Close on nav link click
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });

    // Close on outside click / tap
    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) &&
        !mobileToggle.contains(e.target)) {
        closeMenu();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }


  // =============================================
  // FAQ Accordion
  // =============================================
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) item.classList.add('active');
    });
  });


  // =============================================
  // ROI Calculator
  // =============================================
  const softwareSlider = document.getElementById('software-count');
  const moduleDisplay = document.getElementById('module-display');
  const accountingToggle = document.getElementById('accounting-toggle');
  const toggleStatus = document.getElementById('toggle-status');
  const accFeeLine = document.getElementById('acc-fee-line');
  const marketCostDisplay = document.getElementById('market-cost-display');
  const siddhoCostDisplay = document.getElementById('siddho-cost-display');
  const savingsDisplay = document.getElementById('savings-display');

  const updateCalculator = () => {
    if (!softwareSlider || !accountingToggle) return;

    const modules = parseInt(softwareSlider.value, 10);
    moduleDisplay.textContent = modules;

    const includeAccounting = accountingToggle.checked;
    accFeeLine.style.display = includeAccounting ? 'flex' : 'none';

    if (toggleStatus) {
      if (includeAccounting) {
        toggleStatus.textContent = 'ENABLED (+\u20b9799/mo)';
        toggleStatus.className = 'toggle-status-badge badge-on';
      } else {
        toggleStatus.textContent = 'DISABLED';
        toggleStatus.className = 'toggle-status-badge badge-off';
      }
    }

    let marketYearly = modules * 15000;
    if (includeAccounting) marketYearly += 60000;

    let siddhoYearly = 299 + (15 * 12);
    if (includeAccounting) siddhoYearly += (799 * 12);

    const savingsYearly = marketYearly - siddhoYearly;
    const formatINR = (val) => '\u20b9' + val.toLocaleString('en-IN') + ' / yr';

    marketCostDisplay.textContent = formatINR(marketYearly);
    siddhoCostDisplay.textContent = formatINR(siddhoYearly);
    savingsDisplay.textContent = formatINR(savingsYearly);
  };

  if (softwareSlider && accountingToggle) {
    softwareSlider.addEventListener('input', updateCalculator);
    accountingToggle.addEventListener('change', updateCalculator);
    updateCalculator();
  }


  // =============================================
  // Lead Form → WhatsApp + Google Sheets
  // =============================================

  // ── STEP: Paste your deployed Apps Script Web App URL below ──────────────
  const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbxjwkv1lLvciW5j1KIMQwSRgSmuPInPBZUPtO-eJtyymBVRLFGJ3qTyL-vTQfCEJJk/exec'; // <-- Replace with your URL
  // ─────────────────────────────────────────────────────────────────────────

  const leadForm = document.getElementById('lead-form');
  const formStatus = document.getElementById('form-status');

  // Helper: show styled status message
  function showStatus(type, html) {
    if (!formStatus) return;
    formStatus.innerHTML = html;
    formStatus.style.display = 'block';
    formStatus.style.color = type === 'error' ? '#f87171' : '#10b981';
    formStatus.style.background = type === 'error'
      ? 'rgba(248,113,113,0.08)'
      : 'rgba(16,185,129,0.08)';
    formStatus.style.border = type === 'error'
      ? '1px solid rgba(248,113,113,0.3)'
      : '1px solid rgba(16,185,129,0.3)';
    formStatus.style.padding = '12px 16px';
    formStatus.style.borderRadius = '10px';
    formStatus.style.marginTop = '16px';
    formStatus.style.fontSize = '0.95rem';
  }

  /**
   * Silently sends form data to Google Sheets via Apps Script.
   * Runs in the background — never blocks or delays the user.
   */
  function sendToGoogleSheets(payload) {
    if (!SHEETS_URL || SHEETS_URL === 'YOUR_APPS_SCRIPT_URL') return; // Skip if not configured
    fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors', // Apps Script doesn't return CORS headers; response is opaque but data IS saved
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).catch(() => { }); // Silently ignore network errors — WhatsApp flow is unaffected
  }

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect values
      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const business = document.getElementById('business').value.trim();

      const selectedServices = Array.from(
        document.querySelectorAll('input[name="service"]:checked')
      ).map(cb => cb.value);

      // ---- Validation ----
      if (!name) {
        showStatus('error', '\u26a0\ufe0f Please enter your name before submitting.');
        document.getElementById('name').focus();
        return;
      }
      const cleanPhone = phone.replace(/\s+/g, '');
      if (!cleanPhone || !/^\d{10}$/.test(cleanPhone)) {
        showStatus('error', '\u26a0\ufe0f Please enter a valid 10-digit mobile number.');
        document.getElementById('phone').focus();
        return;
      }

      // ---- Build timestamp ----
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });
      const timestamp = dateStr + ' ' + timeStr;
      const servicesLine = selectedServices.length > 0
        ? selectedServices.join(', ')
        : 'Not specified';
      const businessLine = business || 'Not specified';

      // ---- 1. Send to Google Sheets (silent background, no await) ----
      sendToGoogleSheets({
        timestamp: timestamp,
        name: name,
        phone: cleanPhone,
        business: businessLine,
        services: servicesLine
      });

      // ---- Show success confirmation ----
      showStatus('success',
        '<i class="fa-solid fa-circle-check"></i>&nbsp; Thank you, <strong>' +
        name + '</strong>! Your request has been received. Our team will call you back shortly. \uD83D\uDCCA'
      );

      // Reset form after brief delay
      setTimeout(() => {
        leadForm.reset();
        setTimeout(() => {
          if (formStatus) {
            formStatus.innerHTML = '';
            formStatus.style.display = 'none';
          }
        }, 5000);
      }, 1500);
    });
  }


  // =============================================
  // Navbar scroll shadow
  // =============================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });


  // =============================================
  // Dark / Light Theme Toggle
  // =============================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  const body = document.body;

  // Load saved preference
  const savedTheme = localStorage.getItem('siddho-theme');
  if (savedTheme === 'light') {
    body.classList.add('light-theme');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const isLight = body.classList.toggle('light-theme');
      localStorage.setItem('siddho-theme', isLight ? 'light' : 'dark');
    });
  }


  // =============================================
  // Scroll To Top Button
  // =============================================
  const scrollToTopBtn = document.getElementById('scroll-to-top');

  if (scrollToTopBtn) {
    // Show / hide based on scroll position
    window.addEventListener('scroll', () => {
      if (window.scrollY > 350) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    // Smooth scroll to top on click
    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // =============================================
  // Particle / Star Background (Hero Canvas)
  // =============================================
  const heroCanvas = document.getElementById('hero-canvas');
  if (heroCanvas) {
    const ctx2d = heroCanvas.getContext('2d');
    const STAR_COUNT = 110;
    let stars = [];

    const resizeCanvas = () => {
      const section = heroCanvas.parentElement;
      heroCanvas.width  = section.offsetWidth;
      heroCanvas.height = section.offsetHeight;
    };

    class Star {
      constructor(initial) {
        this.reset(initial);
      }
      reset(initial = false) {
        this.x         = Math.random() * heroCanvas.width;
        this.y         = initial ? Math.random() * heroCanvas.height : (Math.random() > 0.5 ? 0 : heroCanvas.height);
        this.r         = Math.random() * 1.4 + 0.2;
        this.vx        = (Math.random() - 0.5) * 0.25;
        this.vy        = (Math.random() - 0.5) * 0.25;
        this.baseAlpha = Math.random() * 0.5 + 0.1;
        this.alpha     = this.baseAlpha;
        this.twinkle   = (Math.random() * 0.006 + 0.002) * (Math.random() > 0.5 ? 1 : -1);
      }
      update() {
        this.x     += this.vx;
        this.y     += this.vy;
        this.alpha += this.twinkle;
        if (this.alpha > this.baseAlpha + 0.3 || this.alpha < 0.04) this.twinkle *= -1;
        const pad = 5;
        if (this.x < -pad || this.x > heroCanvas.width + pad ||
            this.y < -pad || this.y > heroCanvas.height + pad) {
          this.reset(false);
        }
      }
      draw() {
        const isLight = document.body.classList.contains('light-theme');
        const rgba = isLight
          ? `rgba(29,78,216,${(this.alpha * 0.55).toFixed(3)})`
          : `rgba(255,255,255,${this.alpha.toFixed(3)})`;
        ctx2d.beginPath();
        ctx2d.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx2d.fillStyle = rgba;
        ctx2d.fill();
      }
    }

    resizeCanvas();
    window.addEventListener('resize', () => {
      resizeCanvas();
      stars = Array.from({ length: STAR_COUNT }, () => new Star(true));
    });

    stars = Array.from({ length: STAR_COUNT }, () => new Star(true));

    const animateStars = () => {
      ctx2d.clearRect(0, 0, heroCanvas.width, heroCanvas.height);
      stars.forEach(s => { s.update(); s.draw(); });
      requestAnimationFrame(animateStars);
    };
    animateStars();
  }


  // =============================================
  // Typewriter Effect (Hero)
  // =============================================
  const typewriterEl = document.getElementById('typewriter-text');
  const businessTypes = [
    'Kiranas & Retail Shops',
    'Restaurants & Sweet Shops',
    'Clinics & Pharmacies',
    'Distributors & Factories',
    'Boutiques & Salons',
    'Travel Agents & Services',
    'Schools & Coaching Centres',
  ];

  if (typewriterEl) {
    let twIdx     = 0;
    let twChar    = 0;
    let twDelete  = false;
    let twPaused  = false;
    let twTimer   = null;

    const tick = () => {
      if (twPaused) return;
      const word = businessTypes[twIdx];
      if (!twDelete) {
        twChar++;
        typewriterEl.textContent = word.slice(0, twChar);
        if (twChar === word.length) {
          twPaused = true;
          setTimeout(() => { twPaused = false; twDelete = true; tick(); }, 2200);
          return;
        }
        twTimer = setTimeout(tick, 65);
      } else {
        twChar--;
        typewriterEl.textContent = word.slice(0, twChar);
        if (twChar === 0) {
          twDelete = false;
          twIdx    = (twIdx + 1) % businessTypes.length;
        }
        twTimer = setTimeout(tick, 38);
      }
    };

    setTimeout(tick, 900);
  }


  // =============================================
  // Animated Number Counters
  // =============================================
  const counterItems = document.querySelectorAll('.stat-counter-item');

  const runCounter = (item) => {
    const valEl     = item.querySelector('.counter-val');
    const suffixEl  = item.querySelector('.counter-suffix');
    const target    = parseInt(item.dataset.target, 10);
    const isRating  = target === 48; // special case: show 4.8★
    const duration  = 1800;
    const startTime = performance.now();

    const step = (now) => {
      const elapsed  = Math.min(now - startTime, duration);
      const progress = elapsed / duration;
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * target);

      if (isRating) {
        // Display as  4.9 ★  (target 49 → 4.9)
        valEl.textContent = (current / 10).toFixed(1);
        if (suffixEl) suffixEl.textContent = ' ★';
      } else {
        valEl.textContent = current;
      }

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        valEl.textContent = isRating ? '4.8' : target;
        if (suffixEl && isRating) suffixEl.textContent = ' ★';
      }
    };
    requestAnimationFrame(step);
  };

  if (counterItems.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    counterItems.forEach(item => counterObserver.observe(item));
  }

});
