document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.landing-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navItems = document.querySelectorAll('.nav-link');
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Intersection Observer for fade-up animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const cardsToObserve = document.querySelectorAll('.feature-card, .service-card, .org-card');
    cardsToObserve.forEach((card, index) => {
        // Add staggered delay based on index
        card.style.animationDelay = `${(index % 4) * 0.15}s`;
        observer.observe(card);
    });
});

// Navigation functions to app.html
function goToLogin() {
    // In a real scenario, this might append a hash or query param to open the login modal automatically
    // e.g. window.location.href = 'app.html?modal=login'
    window.location.href = 'app.html';
}

function goToRegister() {
    // e.g. window.location.href = 'app.html?modal=register'
    window.location.href = 'app.html';
}
