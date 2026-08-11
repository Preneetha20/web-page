document.addEventListener('DOMContentLoaded', function() {

    // ===== Mobile Menu Toggle =====
    const menuBtn = document.getElementById('menu-btn');
    const navbar = document.getElementById('navbar');

    if (menuBtn && navbar) {
        menuBtn.addEventListener('click', function() {
            navbar.classList.toggle('active');
            this.textContent = navbar.classList.contains('active') ? '✕' : '☰';
        });

        // Close menu when clicking a nav link
        navbar.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navbar.classList.remove('active');
                menuBtn.textContent = '☰';
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && !menuBtn.contains(e.target)) {
                navbar.classList.remove('active');
                menuBtn.textContent = '☰';
            }
        });
    }

    // ===== Header Scroll Effect =====
    const header = document.getElementById('header');
    if (header) {
        let lastScrollY = 0;
        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            if (scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScrollY = scrollY;
        }, { passive: true });
    }

    // ===== Active Nav Link Highlighting =====
    const currentPath = window.location.pathname.replace(/\/index\.html?$/, '/').replace(/\.html$/, '');
    const normalizedPath = currentPath === '' ? '/' : currentPath;
    document.querySelectorAll('.navbar ul li a').forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const normalizedHref = href === '/' ? '/' : href.replace(/\/$/, '');
        const comparePath = normalizedPath === '/' ? '/' : normalizedPath.replace(/\/$/, '');
        if (normalizedHref === comparePath) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // ===== Scroll Animations (Intersection Observer) =====
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -60px 0px'
        });

        animatedElements.forEach(el => observer.observe(el));
    }

    // ===== Slideshow =====
    let slideIndex = 1;
    const slides = document.getElementsByClassName('mySlides');
    const dots = document.getElementsByClassName('dot');

    function showSlides(n) {
        if (slides.length === 0) return;

        if (n > slides.length) slideIndex = 1;
        if (n < 1) slideIndex = slides.length;

        for (let i = 0; i < slides.length; i++) {
            slides[i].style.display = 'none';
        }
        for (let i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active');
        }

        slides[slideIndex - 1].style.display = 'block';
        if (dots[slideIndex - 1]) {
            dots[slideIndex - 1].classList.add('active');
        }
    }

    // Make slideshow functions global for onclick handlers
    window.plusSlides = function(n) {
        showSlides(slideIndex += n);
    };

    window.currentSlide = function(n) {
        showSlides(slideIndex = n);
    };

    // Initialize slideshow
    if (slides.length > 0) {
        showSlides(slideIndex);

        // Auto-advance every 4 seconds
        let autoSlide = setInterval(() => {
            showSlides(slideIndex += 1);
        }, 4000);

        // Pause on hover
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', () => clearInterval(autoSlide));
            slideshowContainer.addEventListener('mouseleave', () => {
                autoSlide = setInterval(() => {
                    showSlides(slideIndex += 1);
                }, 4000);
            });
        }
    }

    // ===== Touch Swipe Support for Slideshow =====
    const slideshowEl = document.querySelector('.slideshow-container');
    if (slideshowEl) {
        let touchStartX = 0;
        let touchEndX = 0;

        slideshowEl.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slideshowEl.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    window.plusSlides(1);
                } else {
                    window.plusSlides(-1);
                }
            }
        }, { passive: true });
    }

    // ===== Smooth Parallax for Hero Image =====
    const heroImg = document.querySelector('.hero .background-container');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroImg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }

    // ===== Animated Stat Counters =====
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    if (statNumbers.length > 0) {
        const animateCount = (el) => {
            const target = parseFloat(el.getAttribute('data-target'));
            const suffix = el.getAttribute('data-suffix') || '';
            const duration = 1400;
            const start = performance.now();

            const step = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const value = Math.floor(eased * target);
                el.textContent = value + suffix;
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    el.textContent = target + suffix;
                }
            };
            requestAnimationFrame(step);
        };

        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });

        statNumbers.forEach(el => statObserver.observe(el));
    }

    // ===== FAQ Accordion =====
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            if (!question || !answer) return;

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('open');

                faqItems.forEach(other => {
                    other.classList.remove('open');
                    const otherAnswer = other.querySelector('.faq-answer');
                    if (otherAnswer) otherAnswer.style.maxHeight = null;
                });

                if (!isOpen) {
                    item.classList.add('open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }

    // ===== Gallery: Filters, Captions, Keyboard Access, Lightbox =====
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    if (galleryItems.length > 0) {

        // Make each item keyboard-focusable and announce its role
        galleryItems.forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            if (!item.hasAttribute('aria-label')) {
                item.setAttribute('aria-label', 'View photo ' + (index + 1) + ' larger');
            }
        });

        // ---- Filtering ----
        const filterButtons = document.querySelectorAll('.gallery-filter');
        const galleryCountEl = document.querySelector('.gallery-meta .js-gallery-count');

        const applyFilter = (category) => {
            let visibleCount = 0;
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category') || 'all';
                const show = category === 'all' || itemCategory === category;
                item.style.display = show ? '' : 'none';
                if (show) visibleCount++;
            });
            if (galleryCountEl) galleryCountEl.textContent = visibleCount;
        };

        if (filterButtons.length > 0) {
            filterButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    filterButtons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    applyFilter(btn.getAttribute('data-filter') || 'all');
                });
            });
        }
        if (galleryCountEl) galleryCountEl.textContent = galleryItems.length;

        // ---- Lightbox ----
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-frame">
                <button class="lightbox-close" aria-label="Close">✕</button>
                <button class="lightbox-prev" aria-label="Previous photo">&#10094;</button>
                <img src="" alt="">
                <button class="lightbox-next" aria-label="Next photo">&#10095;</button>
                <div class="lightbox-counter"></div>
            </div>
        `;
        document.body.appendChild(lightbox);

        const lbImg = lightbox.querySelector('img');
        const lbClose = lightbox.querySelector('.lightbox-close');
        const lbPrev = lightbox.querySelector('.lightbox-prev');
        const lbNext = lightbox.querySelector('.lightbox-next');
        const lbCounter = lightbox.querySelector('.lightbox-counter');
        let currentIndex = 0;

        const getVisibleImgs = () => galleryItems
            .filter(item => item.style.display !== 'none')
            .map(item => item.querySelector('img'));

        const renderSlide = () => {
            const imgs = getVisibleImgs();
            const img = imgs[currentIndex];
            if (!img) return;
            lbImg.src = img.src;
            lbImg.alt = img.alt;
            lbCounter.textContent = (currentIndex + 1) + ' / ' + imgs.length;
        };

        const openLightbox = (item) => {
            const imgs = getVisibleImgs();
            const targetImg = item.querySelector('img');
            currentIndex = Math.max(imgs.indexOf(targetImg), 0);
            renderSlide();
            lightbox.classList.add('open');
            document.body.style.overflow = 'hidden';
            lbClose.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('open');
            document.body.style.overflow = '';
        };

        const showDelta = (delta) => {
            const imgs = getVisibleImgs();
            currentIndex = (currentIndex + delta + imgs.length) % imgs.length;
            renderSlide();
        };

        galleryItems.forEach((item) => {
            item.addEventListener('click', () => openLightbox(item));
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openLightbox(item);
                }
            });
        });

        lbClose.addEventListener('click', closeLightbox);
        lbPrev.addEventListener('click', () => showDelta(-1));
        lbNext.addEventListener('click', () => showDelta(1));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('open')) return;
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showDelta(-1);
            if (e.key === 'ArrowRight') showDelta(1);
        });
    }

    // ===== Floating Actions: WhatsApp + Back to Top =====
    if (!document.querySelector('.floating-actions')) {
        const floatWrap = document.createElement('div');
        floatWrap.className = 'floating-actions';
        floatWrap.innerHTML = `
            <button class="fab-top" aria-label="Back to top"><i class="fas fa-arrow-up"></i></button>
            <a class="fab-whatsapp" href="https://wa.me/919842787578" target="_blank" aria-label="Chat on WhatsApp">
                <i class="fa-brands fa-whatsapp"></i>
            </a>
        `;
        document.body.appendChild(floatWrap);

        const fabTop = floatWrap.querySelector('.fab-top');
        window.addEventListener('scroll', () => {
            fabTop.classList.toggle('visible', window.scrollY > 500);
        }, { passive: true });

        fabTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});