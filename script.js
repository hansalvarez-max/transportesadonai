document.addEventListener('DOMContentLoaded', () => {
    // 1. Scroll Animations (IntersectionObserver)
    const fadeElements = document.querySelectorAll('.fade-in');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once visible
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(el => observer.observe(el));

    // 2. Header Scroll Effect
    const header = document.querySelector('.header');
    let isScrolling = false;
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (!isScrolling) {
                window.requestAnimationFrame(() => {
                    if (window.scrollY > 80) {
                        header.classList.add('header--scrolled');
                    } else {
                        header.classList.remove('header--scrolled');
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        }, { passive: true });
    }

    // 3. Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const menuClose = document.querySelector('.mobile-menu-close');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu nav a');
    
    if (menuToggle && mobileMenu) {
        const openMenu = () => {
            mobileMenu.classList.add('open');
            document.body.style.overflow = 'hidden';
        };
        const closeMenu = () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        };

        menuToggle.addEventListener('click', openMenu);
        if (menuClose) menuClose.addEventListener('click', closeMenu);

        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    // 4. Fleet Gallery Carousel
    const track = document.querySelector('.carousel-track');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (track) {
        const getScrollAmount = () => {
            const firstChild = track.firstElementChild;
            if (!firstChild) return 0;
            const style = window.getComputedStyle(track);
            const gap = parseFloat(style.gap) || 0;
            return firstChild.offsetWidth + gap;
        };

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
            });
        }

        // Touch/swipe support
        let startX = 0;
        let endX = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        const handleSwipe = () => {
            const deltaX = endX - startX;
            if (Math.abs(deltaX) > 50) {
                if (deltaX < 0) {
                    track.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
                } else {
                    track.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
                }
            }
        };
    }

    // 5. FAQ Accordion
    const detailsElements = document.querySelectorAll('.faq-section details');
    detailsElements.forEach(targetDetail => {
        targetDetail.addEventListener('toggle', (e) => {
            if (targetDetail.open) {
                detailsElements.forEach(detail => {
                    if (detail !== targetDetail && detail.open) {
                        detail.removeAttribute('open');
                    }
                });
            }
        });
    });

    // 6. Contact Form to WhatsApp
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const nombre = formData.get('nombre') || '';
            const telefono = formData.get('telefono') || '';
            const ubicacion = formData.get('ubicacion') || '';
            const servicio = formData.get('servicio') || '';
            
            const text = `Hola Grúas Adonai, necesito asistencia.\n\nNombre: ${nombre}\nTeléfono: ${telefono}\nUbicación: ${ubicacion}\nServicio: ${servicio}`;
            const encodedText = encodeURIComponent(text);
            
            const whatsappUrl = `https://wa.me/56991211322?text=${encodedText}`;
            window.open(whatsappUrl, '_blank');
        });
    }

    // 7. GTM Event Tracking Helper
    const trackEvent = (action, category, label) => {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, { event_category: category, event_label: label });
        }
        if (typeof dataLayer !== 'undefined') {
            dataLayer.push({ event: action, eventCategory: category, eventLabel: label });
        }
    };

    const trackClick = (selector, action, category, label) => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('click', () => trackEvent(action, category, label));
        });
    };

    trackClick('.btn-call', 'click_call', 'contact', 'Call Button');
    trackClick('.btn-whatsapp', 'click_whatsapp', 'contact', 'WhatsApp Button');
    trackClick('.emergency-card', 'click_emergency', 'contact', 'Emergency Card');

    // 8. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 9. Gallery Modal
    const galleryModal = document.getElementById('gallery-modal');
    const btnGalleryAll = document.getElementById('btn-gallery-all');
    const galleryModalClose = document.getElementById('gallery-modal-close');

    if (btnGalleryAll && galleryModal) {
        btnGalleryAll.addEventListener('click', () => {
            galleryModal.style.display = 'block';
            galleryModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        });
    }

    const closeGalleryModal = () => {
        if (galleryModal) {
            galleryModal.style.display = 'none';
            galleryModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    };

    if (galleryModalClose) {
        galleryModalClose.addEventListener('click', closeGalleryModal);
    }

    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                closeGalleryModal();
            }
        });
    }
});
