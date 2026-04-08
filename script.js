document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ─── Scroll Reveal Animation ────────────────────────────
    const reveals = document.querySelectorAll('.service-v2-card, .reveal, .reveal-right, .story-grid');
    
    const revealOnScroll = () => {
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 80) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // ─── Header Shadow on Scroll ────────────────────────────
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '12px 0';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.padding = '20px 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // ─── Mobile Navigation Drawer ───────────────────────────
    const mobileToggle = document.getElementById('mobile-toggle');
    const mobileDrawer = document.getElementById('mobile-drawer');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobileClose = document.getElementById('mobile-close');

    function openMobileNav() {
        if (mobileDrawer) mobileDrawer.classList.add('open');
        if (mobileOverlay) mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
        if (mobileDrawer) mobileDrawer.classList.remove('open');
        if (mobileOverlay) mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) mobileToggle.addEventListener('click', openMobileNav);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileNav);

    // Close drawer when clicking a link inside it
    if (mobileDrawer) {
        mobileDrawer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileNav);
        });
    }

    // ─── Form Handling ──────────────────────────────────────
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            
            btn.innerText = 'Skickar...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            setTimeout(() => {
                alert('Tack för ditt meddelande! Vi på LöneCenter hör av oss till dig inom kort.');
                contactForm.reset();
                btn.innerText = originalText;
                btn.style.opacity = '1';
                btn.disabled = false;
            }, 1200);
        });
    }
    // ─── Service Card Toggle ────────────────────────────────
    document.querySelectorAll('.service-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const detail = document.getElementById(targetId);
            if (!detail) return;

            const isOpen = detail.classList.contains('open');

            // Close all other open details
            document.querySelectorAll('.service-detail.open').forEach(d => {
                d.classList.remove('open');
            });
            document.querySelectorAll('.service-toggle.open').forEach(b => {
                b.classList.remove('open');
            });

            // Toggle the clicked one
            if (!isOpen) {
                detail.classList.add('open');
                btn.classList.add('open');
            }
        });
    });
});
