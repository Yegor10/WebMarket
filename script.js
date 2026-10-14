document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

    if (hasFinePointer) {
        document.body.classList.add('has-pointer');
    }

    // --- Scroll progress ---
    const scrollProgress = document.querySelector('.scroll-progress');
    const updateScrollProgress = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = `${progress}%`;
    };

    // --- Navbar ---
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a[data-section]');
    const sections = [...navLinks].map(link => document.getElementById(link.dataset.section)).filter(Boolean);

    const onScroll = () => {
        updateScrollProgress();
        navbar.classList.toggle('scrolled', window.scrollY > 20);

        const scrollPos = window.scrollY + navbar.offsetHeight + 100;
        let current = sections[0]?.id || '';
        sections.forEach(section => {
            if (section.offsetTop <= scrollPos) {
                current = section.id;
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.section === current);
        });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            closeMobileNav();

            const offset = navbar.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        });
    });

    // --- Mobile nav ---
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');

    function closeMobileNav() {
        nav.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
    }

    burger.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('open');
        burger.classList.toggle('open', isOpen);
        burger.setAttribute('aria-expanded', String(isOpen));
    });

    // --- Reveal on scroll ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add('visible');

            entry.target.querySelectorAll('.stat-number').forEach(counter => {
                if (counter.dataset.animated) return;
                counter.dataset.animated = 'true';
                animateCounter(counter);
            });

            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    function animateCounter(el) {
        const target = +el.dataset.target;
        const duration = prefersReducedMotion ? 0 : 1800;
        const start = performance.now();
        const format = target >= 1000;

        const tick = (now) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.round(target * eased);
            el.textContent = format && value >= 1000
                ? `${Math.round(value / 1000)}k`
                : value;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = format ? `${target / 1000}k` : target;
        };

        if (duration === 0) {
            el.textContent = format ? `${target / 1000}k` : target;
        } else {
            requestAnimationFrame(tick);
        }
    }

    // --- Cursor glow & hero orb parallax ---
    const cursorGlow = document.querySelector('.cursor-glow');
    const heroOrb = document.querySelector('.hero-orb');
    const particleCanvas = document.querySelector('.hero-particles');
    const particleContext = particleCanvas?.getContext('2d');
    const hero = document.querySelector('.hero-section');

    if (particleCanvas && particleContext && hero) {
        const pointer = { x: -1000, y: -1000 };
        let particles = [];
        let canvasWidth = 0;
        let canvasHeight = 0;
        let particleFrame = 0;

        const resizeParticles = () => {
            cancelAnimationFrame(particleFrame);
            const bounds = hero.getBoundingClientRect();
            const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
            canvasWidth = bounds.width;
            canvasHeight = bounds.height;
            particleCanvas.width = Math.round(canvasWidth * pixelRatio);
            particleCanvas.height = Math.round(canvasHeight * pixelRatio);
            particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

            const count = Math.min(76, Math.max(38, Math.round((canvasWidth * canvasHeight) / 24000)));
            particles = Array.from({ length: count }, () => ({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                radius: Math.random() * 1.4 + 0.45,
                vx: (Math.random() - 0.5) * 0.24,
                vy: (Math.random() - 0.5) * 0.24,
                alpha: Math.random() * 0.5 + 0.2
            }));
            drawParticles();
        };

        const drawParticles = () => {
            particleContext.clearRect(0, 0, canvasWidth, canvasHeight);
            particles.forEach((particle, index) => {
                if (!prefersReducedMotion) {
                    particle.x += particle.vx;
                    particle.y += particle.vy;
                    if (particle.x < 0 || particle.x > canvasWidth) particle.vx *= -1;
                    if (particle.y < 0 || particle.y > canvasHeight) particle.vy *= -1;
                }

                const pointerDistance = Math.hypot(particle.x - pointer.x, particle.y - pointer.y);
                particleContext.beginPath();
                particleContext.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                particleContext.fillStyle = `rgba(176, 255, 238, ${particle.alpha + (pointerDistance < 150 ? 0.35 : 0)})`;
                particleContext.fill();

                for (let next = index + 1; next < particles.length; next += 1) {
                    const other = particles[next];
                    const distance = Math.hypot(particle.x - other.x, particle.y - other.y);
                    if (distance > 115) continue;

                    particleContext.beginPath();
                    particleContext.moveTo(particle.x, particle.y);
                    particleContext.lineTo(other.x, other.y);
                    particleContext.strokeStyle = `rgba(114, 245, 209, ${(1 - distance / 115) * 0.16})`;
                    particleContext.lineWidth = 0.7;
                    particleContext.stroke();
                }
            });

            if (!prefersReducedMotion && !document.hidden) {
                particleFrame = requestAnimationFrame(drawParticles);
            }
        };

        hero.addEventListener('pointermove', (event) => {
            const bounds = hero.getBoundingClientRect();
            pointer.x = event.clientX - bounds.left;
            pointer.y = event.clientY - bounds.top;
        }, { passive: true });
        hero.addEventListener('pointerleave', () => {
            pointer.x = -1000;
            pointer.y = -1000;
        }, { passive: true });
        window.addEventListener('resize', resizeParticles, { passive: true });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                cancelAnimationFrame(particleFrame);
            } else if (!prefersReducedMotion) {
                drawParticles();
            }
        });

        resizeParticles();
    }

    if (hasFinePointer && !prefersReducedMotion) {
        let mouseX = 0;
        let mouseY = 0;
        let glowX = 0;
        let glowY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (heroOrb) {
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight / 2;
                const dx = (e.clientX - cx) / cx;
                const dy = (e.clientY - cy) / cy;
                heroOrb.style.transform = `translate(calc(-50% + ${dx * 30}px), calc(-50% + ${dy * 30}px))`;
            }

            const spotlight = document.querySelector('.spotlight-gradient');
            if (spotlight) {
                const rect = spotlight.getBoundingClientRect();
                if (e.clientY >= rect.top && e.clientY <= rect.bottom) {
                    const mx = ((e.clientX - rect.left) / rect.width) * 100;
                    const my = ((e.clientY - rect.top) / rect.height) * 100;
                    spotlight.style.setProperty('--mx', `${mx}%`);
                    spotlight.style.setProperty('--my', `${my}%`);
                }
            }
        });

        const animateGlow = () => {
            glowX += (mouseX - glowX) * 0.08;
            glowY += (mouseY - glowY) * 0.08;
            cursorGlow.style.left = `${glowX}px`;
            cursorGlow.style.top = `${glowY}px`;
            requestAnimationFrame(animateGlow);
        };
        animateGlow();
    }

    // --- Magnetic buttons ---
    if (hasFinePointer && !prefersReducedMotion) {
        document.querySelectorAll('.magnetic').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = '';
            });
        });
    }

    // --- Tilt cards ---
    if (hasFinePointer && !prefersReducedMotion) {
        document.querySelectorAll('[data-tilt]').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // --- Schedule tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const scheduleContents = document.querySelectorAll('.schedule-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            scheduleContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.day).classList.add('active');
        });
    });

    // --- Track player mock ---
    const trackBtns = document.querySelectorAll('.track-btn');
    const nowPlaying = document.querySelector('.now-playing');

    trackBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            trackBtns.forEach(b => b.classList.remove('playing'));
            btn.classList.add('playing');
            const track = btn.dataset.track;
            nowPlaying.textContent = `Now playing: ${track}`;
        });
    });

    // --- Gallery lightbox ---
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxVisual = lightbox.querySelector('.lightbox-visual img');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxBackdrop = lightbox.querySelector('.lightbox-backdrop');

    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const imgSrc = item.dataset.img;
            const title = item.dataset.title;
            lightboxVisual.src = imgSrc;
            lightboxVisual.alt = title;
            lightboxTitle.textContent = title;
            openOverlay(lightbox);
        });
    });

    lightboxClose.addEventListener('click', () => closeOverlay(lightbox));
    lightboxBackdrop.addEventListener('click', () => closeOverlay(lightbox));

    // --- Tickets ---
    const modal = document.getElementById('paymentModal');
    const modalPrice = document.getElementById('modalPrice');
    const selectedTicketText = document.getElementById('selectedTicket');
    const paymentForm = document.getElementById('paymentForm');
    const closeBtn = modal.querySelector('.close-modal');
    const modalBackdrop = modal.querySelector('.modal-backdrop');

    document.querySelectorAll('.ticket-card').forEach(card => {
        card.querySelector('.btn-ticket').addEventListener('click', () => {
            document.querySelectorAll('.ticket-card').forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const name = card.dataset.ticket;
            const price = card.dataset.price;
            selectedTicketText.textContent = name;
            modalPrice.textContent = `$${price}.00`;
            openOverlay(modal);
        });
    });

    closeBtn.addEventListener('click', () => closeOverlay(modal));
    modalBackdrop.addEventListener('click', () => closeOverlay(modal));

    function openOverlay(el) {
        el.classList.add('open');
        el.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeOverlay(el) {
        el.classList.remove('open');
        el.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightbox.classList.contains('open')) closeOverlay(lightbox);
            if (modal.classList.contains('open')) closeOverlay(modal);
        }
    });

    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = paymentForm.querySelector('.pay-btn');
        const btnText = btn.querySelector('.btn-text');

        btn.classList.add('loading');
        btn.disabled = true;
        btnText.textContent = 'Processing…';

        setTimeout(() => {
            btn.classList.remove('loading');
            btn.classList.add('success');
            btnText.textContent = 'Access granted';

            setTimeout(() => {
                closeOverlay(modal);
                paymentForm.reset();
                btn.classList.remove('success');
                btnText.textContent = 'Confirm payment';
                btn.disabled = false;
                showToast('Ticket purchased! Check your email for access codes.');
            }, 1200);
        }, 2000);
    });

    // --- FAQ accordion ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            const body = header.nextElementSibling;
            const isActive = header.classList.contains('active');

            document.querySelectorAll('.accordion-header').forEach(h => {
                h.classList.remove('active');
                h.setAttribute('aria-expanded', 'false');
                h.nextElementSibling.style.maxHeight = null;
            });

            if (!isActive) {
                header.classList.add('active');
                header.setAttribute('aria-expanded', 'true');
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });

    // --- Testimonial slider ---
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        currentSlide = index;
        testimonialCards.forEach((card, i) => card.classList.toggle('active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            goToSlide(i);
            resetSlideInterval();
        });
    });

    function resetSlideInterval() {
        clearInterval(slideInterval);
        if (!prefersReducedMotion) {
            slideInterval = setInterval(() => {
                goToSlide((currentSlide + 1) % testimonialCards.length);
            }, 5000);
        }
    }

    resetSlideInterval();

    // --- Newsletter ---
    document.querySelector('.news-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const feedback = document.querySelector('.form-feedback');
        feedback.textContent = 'You\'re on the list. See you in NeoPort.';
        e.target.reset();
        setTimeout(() => { feedback.textContent = ''; }, 4000);
    });

    // --- Merch buy ---
    document.querySelectorAll('.btn-buy').forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.closest('.merch-card').querySelector('h3').textContent;
            showToast(`${name} added to cart.`);
        });
    });

    // --- Toast ---
    const toast = document.querySelector('.toast');
    let toastTimeout;

    function showToast(message) {
        clearTimeout(toastTimeout);
        toast.textContent = message;
        toast.classList.add('show');
        toastTimeout = setTimeout(() => toast.classList.remove('show'), 3500);
    }
});
