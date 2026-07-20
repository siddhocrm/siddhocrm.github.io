document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        if (mobileToggle.querySelector('i')) {
          mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
        }
      });
    });
  }

  // FAQ Accordion Logic
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Interactive ROI Calculator Logic
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
        toggleStatus.textContent = 'ENABLED (+₹799/mo)';
        toggleStatus.className = 'toggle-status-badge badge-on';
      } else {
        toggleStatus.textContent = 'DISABLED';
        toggleStatus.className = 'toggle-status-badge badge-off';
      }
    }

    // Market Cost Calculation: ~ ₹18,000/yr per software module + ₹60,000/yr for external CA/accountant
    let marketYearly = modules * 15000;
    if (includeAccounting) {
      marketYearly += 60000; // Average offline CA monthly billing + tax filing cost
    }

    // Siddho CRM Cost: ₹299 Setup + (₹15 * 12) base + (₹799 * 12 if accounting)
    let siddhoYearly = 299 + (15 * 12);
    if (includeAccounting) {
      siddhoYearly += (799 * 12);
    }

    const savingsYearly = marketYearly - siddhoYearly;

    // Formatting numbers in Indian currency format
    const formatINR = (val) => '₹' + val.toLocaleString('en-IN') + ' / yr';

    marketCostDisplay.textContent = formatINR(marketYearly);
    siddhoCostDisplay.textContent = formatINR(siddhoYearly);
    savingsDisplay.textContent = formatINR(savingsYearly);
  };

  if (softwareSlider && accountingToggle) {
    softwareSlider.addEventListener('input', updateCalculator);
    accountingToggle.addEventListener('change', updateCalculator);
    updateCalculator(); // Initial calculation on load
  }

  // Lead Form Submission Handler
  const leadForm = document.getElementById('lead-form');
  const formStatus = document.getElementById('form-status');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const business = document.getElementById('business').value.trim() || 'Not specified';
      
      const selectedServices = Array.from(document.querySelectorAll('input[name="service"]:checked'))
        .map(cb => cb.value)
        .join(', ');

      formStatus.style.color = '#00f2fe';
      formStatus.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Processing your request...';

      setTimeout(() => {
        formStatus.style.color = '#10b981';
        formStatus.innerHTML = `<i class="fa-solid fa-circle-check"></i> Thank you ${name}! Opening WhatsApp to connect with our Hooghly team...`;

        // Create WhatsApp pre-filled message link
        const waMsg = `Hi Siddho CRM! I submitted a request from your website.%0A%0A*Name:* ${encodeURIComponent(name)}%0A*Phone:* ${encodeURIComponent(phone)}%0A*Business:* ${encodeURIComponent(business)}%0A*Services Interested:* ${encodeURIComponent(selectedServices)}`;
        const waUrl = `https://wa.me/918900415759?text=${waMsg}`;

        // Redirect to WhatsApp after brief delay
        setTimeout(() => {
          window.open(waUrl, '_blank');
        }, 1500);

        leadForm.reset();
      }, 1000);
    });
  }

  // Header background shadow on scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.8)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
});
