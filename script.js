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
  const softwareSlider    = document.getElementById('software-count');
  const moduleDisplay     = document.getElementById('module-display');
  const accountingToggle  = document.getElementById('accounting-toggle');
  const toggleStatus      = document.getElementById('toggle-status');
  const accFeeLine        = document.getElementById('acc-fee-line');
  const marketCostDisplay = document.getElementById('market-cost-display');
  const siddhoCostDisplay = document.getElementById('siddho-cost-display');
  const savingsDisplay    = document.getElementById('savings-display');

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
    savingsDisplay.textContent    = formatINR(savingsYearly);
  };

  if (softwareSlider && accountingToggle) {
    softwareSlider.addEventListener('input', updateCalculator);
    accountingToggle.addEventListener('change', updateCalculator);
    updateCalculator();
  }


  // =============================================
  // Lead Form → WhatsApp Submission
  // =============================================
  const leadForm   = document.getElementById('lead-form');
  const formStatus = document.getElementById('form-status');

  // Helper: show styled status message
  function showStatus(type, html) {
    if (!formStatus) return;
    formStatus.innerHTML       = html;
    formStatus.style.display   = 'block';
    formStatus.style.color     = type === 'error' ? '#f87171' : '#10b981';
    formStatus.style.background = type === 'error'
      ? 'rgba(248,113,113,0.08)'
      : 'rgba(16,185,129,0.08)';
    formStatus.style.border    = type === 'error'
      ? '1px solid rgba(248,113,113,0.3)'
      : '1px solid rgba(16,185,129,0.3)';
    formStatus.style.padding      = '12px 16px';
    formStatus.style.borderRadius = '10px';
    formStatus.style.marginTop    = '16px';
    formStatus.style.fontSize     = '0.95rem';
  }

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Collect values
      const name     = document.getElementById('name').value.trim();
      const phone    = document.getElementById('phone').value.trim();
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

      // ---- Build formatted WhatsApp message ----
      const now     = new Date();
      const dateStr = now.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      const timeStr = now.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });

      const servicesLine = selectedServices.length > 0
        ? selectedServices.join(', ')
        : 'Not specified';
      const businessLine = business || 'Not specified';

      const lines = [
        '\uD83D\uDE4F *New Enquiry \u2014 Siddho CRM Website*',
        '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501',
        '\uD83D\uDC64 *Name:* ' + name,
        '\uD83D\uDCF1 *Phone / WhatsApp:* ' + cleanPhone,
        '\uD83C\uDFEA *Business:* ' + businessLine,
        '\uD83D\uDEE0\uFE0F *Services Required:*',
        '   \u25BA ' + servicesLine,
        '\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501\u2501',
        '\uD83D\uDD50 *Submitted:* ' + dateStr + ' at ' + timeStr,
        '',
        '_Please reply within 30 minutes for best results!_ \uD83D\uDE80'
      ];

      const message = lines.join('\n');
      const waUrl   = 'https://wa.me/918900415759?text=' + encodeURIComponent(message);

      // ---- Show success & open WhatsApp immediately ----
      showStatus('success',
        '<i class="fa-solid fa-circle-check"></i>&nbsp; Thank you, <strong>' +
        name + '</strong>! Opening WhatsApp to connect with our team\u2026'
      );

      // Open WhatsApp in new tab
      window.open(waUrl, '_blank');

      // Reset form after brief delay, then clear status
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

});
