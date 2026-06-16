document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. INITIALIZE LUCIDE ICONS
    // ==========================================================================
    lucide.createIcons();

    // ==========================================================================
    // 2. SMOOTH SCROLL (LENIS)
    // ==========================================================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Integrate Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                closeMobileMenu();
                
                lenis.scrollTo(targetElement, {
                    offset: -80, // Offset for sticky header
                    duration: 1.5,
                });
            }
        });
    });

    // ==========================================================================
    // 3. HEADER SCROLL EFFECT & MOBILE MENU
    // ==========================================================================
    const header = document.getElementById('header');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');
    
    // Header scroll background change
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Toggle Mobile Menu
    let isMobileMenuOpen = false;

    function openMobileMenu() {
        mobileNavOverlay.classList.add('active');
        mobileMenuBtn.innerHTML = '<i data-lucide="x"></i>';
        lucide.createIcons();
        isMobileMenuOpen = true;
        lenis.stop(); // Stop scroll when menu is open
    }

    function closeMobileMenu() {
        mobileNavOverlay.classList.remove('active');
        mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
        lucide.createIcons();
        isMobileMenuOpen = false;
        lenis.start(); // Resume scroll
    }

    mobileMenuBtn.addEventListener('click', () => {
        if (isMobileMenuOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    // Close menu when clicking overlay links
    document.querySelectorAll('.mobile-nav-link, .mobile-nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // ==========================================================================
    // 4. GSAP & SCROLLTRIGGER ANIMATIONS
    // ==========================================================================
    
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Load Animations
    const heroTl = gsap.timeline();
    
    heroTl.from('.hero-badge', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power3.out',
        delay: 0.2
    })
    .from('.hero-title', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power3.out'
    }, '-=0.6')
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
    .from('.stat-card', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        onComplete: startCountdowns
    }, '-=0.4');

    // Stats Countdown Animation
    function startCountdowns() {
        // Kids Counter (1500+)
        animateCounter('stat-kids', 1500, 2);
        // Teams Counter (38)
        animateCounter('stat-teams', 38, 1.5);
        // Accuracy Counter (99.9) - showing float values
        animateCounterFloat('stat-accuracy', 99.9, 1.8);
    }

    function animateCounter(id, target, duration) {
        const obj = { val: 0 };
        const element = document.getElementById(id);
        if (!element) return;
        
        gsap.to(obj, {
            val: target,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
                element.textContent = Math.floor(obj.val).toLocaleString();
            }
        });
    }

    function animateCounterFloat(id, target, duration) {
        const obj = { val: 0 };
        const element = document.getElementById(id);
        if (!element) return;

        gsap.to(obj, {
            val: target,
            duration: duration,
            ease: 'power2.out',
            onUpdate: () => {
                element.textContent = obj.val.toFixed(1);
            }
        });
    }

    // Standard Fade-in scroll animations
    gsap.utils.toArray('.fade-in').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 85%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            y: 40,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Left Fade-in (Mission Section etc.)
    gsap.utils.toArray('.fade-in-left').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: -50,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // Right Fade-in
    gsap.utils.toArray('.fade-in-right').forEach(element => {
        gsap.from(element, {
            scrollTrigger: {
                trigger: element,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
            opacity: 0,
            x: 50,
            duration: 1.2,
            ease: 'power3.out'
        });
    });

    // ==========================================================================
    // 5. COMPONENT SPECIFIC INTERACTIVE SCROLL ANIMATIONS
    // ==========================================================================

    // Feature 2: F-V Profile graph dot movement
    const graphDots = document.querySelectorAll('.graph-dot');
    if (graphDots.length > 0) {
        gsap.from('.graph-line', {
            scrollTrigger: {
                trigger: '.graph-placeholder',
                start: 'top 75%'
            },
            scaleX: 0,
            transformOrigin: 'left top',
            duration: 1.5,
            ease: 'power2.inOut'
        });

        gsap.from(graphDots, {
            scrollTrigger: {
                trigger: '.graph-placeholder',
                start: 'top 75%'
            },
            scale: 0,
            opacity: 0,
            duration: 0.5,
            stagger: 0.2,
            delay: 0.8,
            ease: 'back.out(1.7)'
        });
    }

    // Feature 3: Asymmetry Meter filling
    const meterBars = document.querySelectorAll('.meter-fill');
    if (meterBars.length > 0) {
        meterBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = '0%'; // Reset first

            gsap.to(bar, {
                scrollTrigger: {
                    trigger: '.asymmetry-box',
                    start: 'top 80%'
                },
                width: width,
                duration: 1.8,
                ease: 'power3.out'
            });
        });
        
        gsap.from('.asymmetry-status', {
            scrollTrigger: {
                trigger: '.asymmetry-box',
                start: 'top 80%'
            },
            opacity: 0,
            y: 10,
            duration: 0.6,
            delay: 1.2,
            ease: 'power2.out'
        });
    }

    // Feature 4: HIIT Schedule Day highlights
    const hiitDays = document.querySelectorAll('.hiit-schedule .day');
    if (hiitDays.length > 0) {
        gsap.from(hiitDays, {
            scrollTrigger: {
                trigger: '.hiit-box',
                start: 'top 80%'
            },
            opacity: 0,
            scale: 0.9,
            y: 10,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power2.out'
        });
    }

    // Feature 5: PHV Timeline stages
    const phvStages = document.querySelectorAll('.phv-timeline .stage');
    if (phvStages.length > 0) {
        gsap.from(phvStages, {
            scrollTrigger: {
                trigger: '.phv-box',
                start: 'top 80%'
            },
            opacity: 0,
            y: 15,
            duration: 0.8,
            stagger: 0.2,
            ease: 'back.out(1.5)'
        });
    }

    // Form Submission Handler (Active FormSubmit.co Integration)
    const contactForm = document.getElementById('lp-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnSpan = submitBtn ? submitBtn.querySelector('span') : null;
            const originalText = btnSpan ? btnSpan.textContent : '送信する';
            
            if (submitBtn) submitBtn.disabled = true;
            if (btnSpan) btnSpan.textContent = '送信中...';
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                category: document.getElementById('contact-type').value,
                message: document.getElementById('message').value,
                _subject: '【Awake Okinawa】LPより新しいお問い合わせが届きました'
            };
            
            fetch('https://formsubmit.co/ajax/sprintacademyawake@gmail.com', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (submitBtn) submitBtn.disabled = false;
                if (btnSpan) btnSpan.textContent = originalText;
                
                if (response.ok) {
                    alert('送信完了いたしました。お問い合わせいただきありがとうございます。');
                    contactForm.reset();
                } else {
                    alert('送信中にエラーが発生しました。お手数ですが、公式LINEまたはInstagramより直接お問い合わせください。');
                }
            })
            .catch(error => {
                if (submitBtn) submitBtn.disabled = false;
                if (btnSpan) btnSpan.textContent = originalText;
                alert('通信エラーが発生しました。インターネット接続状況をご確認いただくか、公式LINEよりお問い合わせください。');
            });
        });
    }
});
