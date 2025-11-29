document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth Scroll & Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            // Close mobile menu if open
            const nav = document.querySelector('.nav-links');
            const burger = document.querySelector('.hamburger');
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.toggle('toggle');
            }

            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 70;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // --- Navbar Scroll Effect ---
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate counters if present
                const counters = entry.target.querySelectorAll('.stat-number');
                if (counters.length > 0) {
                    counters.forEach(counter => {
                        const target = +counter.getAttribute('data-target');
                        const duration = 2000; // 2 seconds
                        const increment = target / (duration / 16); // 60fps
                        
                        let current = 0;
                        const updateCounter = () => {
                            current += increment;
                            if (current < target) {
                                counter.innerText = Math.ceil(current);
                                requestAnimationFrame(updateCounter);
                            } else {
                                counter.innerText = target;
                            }
                        };
                        updateCounter();
                    });
                }

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(section => {
        observer.observe(section);
    });

    // --- Mobile Menu ---
    const burger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav-links');
    
    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    // --- Schedule Tabs ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const scheduleContents = document.querySelectorAll('.schedule-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            tabBtns.forEach(b => b.classList.remove('active'));
            scheduleContents.forEach(c => c.classList.remove('active'));

            // Add active to clicked
            btn.classList.add('active');
            const day = btn.getAttribute('data-day');
            document.getElementById(day).classList.add('active');
        });
    });

    // --- Payment Modal Logic ---
    const modal = document.getElementById('paymentModal');
    const closeBtn = document.querySelector('.close-modal');
    const modalPrice = document.getElementById('modalPrice');
    const selectedTicketText = document.getElementById('selectedTicket');
    const paymentForm = document.getElementById('paymentForm');

    // Function to open modal (exposed to global scope for inline onclicks if needed, 
    // but better to attach listeners dynamically if possible. For now, we'll attach to window)
    window.openModal = function(ticketName, price) {
        modal.style.display = 'flex';
        selectedTicketText.textContent = ticketName;
        modalPrice.textContent = `$${price}.00`;
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    };

    // Close modal
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Simulate Payment Processing
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const btn = paymentForm.querySelector('.pay-btn');
        const btnText = btn.querySelector('.btn-text');
        const loader = btn.querySelector('.loader');
        
        // Loading state
        btnText.textContent = 'PROCESSING...';
        loader.style.display = 'block';
        btn.disabled = true;
        
        setTimeout(() => {
            // Success state
            btnText.textContent = 'ACCESS GRANTED';
            loader.style.display = 'none';
            btn.style.background = '#00ff00';
            btn.style.color = '#000';
            
            setTimeout(() => {
                // Reset and close
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
                paymentForm.reset();
                
                // Reset button
                btn.style.background = '';
                btn.style.color = '';
                btnText.textContent = 'CONFIRM PAYMENT';
                btn.disabled = false;
                
                alert(`Ticket purchased successfully! Check your neural link for access codes.`);
            }, 1000);
        }, 2000);
    });
});
