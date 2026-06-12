const initAWAKE = () => {

  // --- Initialize Lucide Icons ---
  const initIcons = () => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  };
  initIcons();

  // --- Initialize Lenis for Smooth Scrolling ---
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
    });

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  }

  // --- GSAP & ScrollTrigger Animations ---
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis with ScrollTrigger
    if (lenis) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0, 0);
    }

    // Hero Entry Animation
    const heroTl = gsap.timeline();
    heroTl.from('.hero-badge', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from('.hero-title', {
      opacity: 0,
      y: 30,
      duration: 1.0,
      ease: 'power3.out'
    }, '-=0.5')
    .from('.hero-subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.hero-actions', {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.6')
    .from('.stat-item', {
      opacity: 0,
      y: 20,
      stagger: 0.15,
      duration: 0.8,
      ease: 'power3.out',
      onComplete: () => {
        // Run counters once their container is revealed
        startCounters();
      }
    }, '-=0.5');

    // Scroll-reveal animations removed to ensure immediate visibility of all content on page load.

  } else {
    // Fallback if GSAP is not loaded
    startCounters();
  }

  // --- Number Count-up Animation ---
  function startCounters() {
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const isFloat = target % 1 !== 0;
      const duration = 2000; // ms
      const startTime = performance.now();

      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing: easeOutExpo
        const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentVal = target * ease;

        if (isFloat) {
          counter.innerText = currentVal.toFixed(1);
        } else {
          counter.innerText = Math.floor(currentVal);
        }

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }
      requestAnimationFrame(update);
    });
  }

  // --- Header Scroll State ---
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Mobile Navigation Menu ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navList = document.querySelector('.nav-list');
  const menuIcon = mobileMenuBtn.querySelector('i');

  mobileMenuBtn.addEventListener('click', () => {
    const isActive = navList.classList.toggle('active');
    
    // Toggle menu icon between menu & x (close) using lucide
    if (isActive) {
      menuIcon.setAttribute('data-lucide', 'x');
    } else {
      menuIcon.setAttribute('data-lucide', 'menu');
    }
    lucide.createIcons();
  });

  // Close mobile navigation drawer when clicking links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      // Smooth scroll if anchor exists
      const targetId = link.getAttribute('href');
      if (targetId.startsWith('#')) {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          const offset = header.offsetHeight;
          
          if (lenis) {
            lenis.scrollTo(targetElement, {
              offset: -offset,
              duration: 1.2
            });
          } else {
            const pos = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({
              top: pos,
              behavior: 'smooth'
            });
          }
        }
      }

      // Close mobile menu if active
      if (navList.classList.contains('active')) {
        navList.classList.remove('active');
        menuIcon.setAttribute('data-lucide', 'menu');
        lucide.createIcons();
      }
    });
  });

  // --- Accordions (Trainer Details) ---
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isOpen = this.classList.contains('active');

      // Close other accordions
      accordionTriggers.forEach(btn => {
        btn.classList.remove('active');
        const c = btn.nextElementSibling;
        if (c) c.style.maxHeight = null;
      });

      if (!isOpen) {
        this.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        this.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });

  // --- FAQ Accordions ---
  const faqTriggers = document.querySelectorAll('.faq-trigger');
  faqTriggers.forEach(trigger => {
    trigger.addEventListener('click', function() {
      const content = this.nextElementSibling;
      const isOpen = this.classList.contains('active');

      // Close other FAQs
      faqTriggers.forEach(btn => {
        btn.classList.remove('active');
        const c = btn.nextElementSibling;
        if (c) c.style.maxHeight = null;
      });

      if (!isOpen) {
        this.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        this.classList.remove('active');
        content.style.maxHeight = null;
      }
    });
  });

  // --- Contact Form Booking Simulator (Null-Safe) ---
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');
  const formResetBtn = document.getElementById('form-reset-btn');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const btnLoader = submitBtn ? submitBtn.querySelector('.btn-loader') : null;

  if (contactForm && submitBtn) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Show Loader State
      submitBtn.disabled = true;
      if (btnText) btnText.classList.add('hidden');
      if (btnLoader) btnLoader.classList.remove('hidden');

      // Simulate Server Request (1.5 seconds)
      setTimeout(() => {
        // Hide form and loader
        contactForm.classList.add('hidden');
        submitBtn.disabled = false;
        if (btnText) btnText.classList.remove('hidden');
        if (btnLoader) btnLoader.classList.add('hidden');

        // Show success dialogue
        if (formSuccess) {
          formSuccess.classList.remove('hidden');

          // Scroll to Success Box
          const offset = header ? header.offsetHeight : 0;
          if (lenis) {
            lenis.scrollTo(formSuccess, {
              offset: -offset - 30,
              duration: 1
            });
          } else {
            const pos = formSuccess.getBoundingClientRect().top + window.pageYOffset - offset - 30;
            window.scrollTo({
              top: pos,
              behavior: 'smooth'
            });
          }
        }
      }, 1500);
    });
  }

  // Reset Form
  if (formResetBtn && contactForm && formSuccess) {
    formResetBtn.addEventListener('click', () => {
      contactForm.reset();
      formSuccess.classList.add('hidden');
      contactForm.classList.remove('hidden');
    });
  }

  // Refresh ScrollTrigger and re-initialize icons once fully loaded
  const refreshLayout = () => {
    initIcons();
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.refresh();
    }
  };

  if (document.readyState === 'complete') {
    refreshLayout();
  } else {
    window.addEventListener('load', refreshLayout);
  }

  // Fallback timeouts to handle slow loading dynamic libraries or fonts
  setTimeout(refreshLayout, 500);
  setTimeout(refreshLayout, 1500);

};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAWAKE);
} else {
  initAWAKE();
}
