// ================================
// PIIK.ME - LANDING PAGE INTERACTIONS
// Scroll-driven animations and sticky content
// ================================

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe all fade-in elements
document.addEventListener('DOMContentLoaded', () => {
    const fadeElements = document.querySelectorAll('.fade-in-on-scroll');
    fadeElements.forEach(el => fadeInObserver.observe(el));
    
    initializeStickyFeatures();
    initializeMobileMenu();
    initializeGetStartedButtons();
});

// ================================
// GET STARTED AUTHENTICATION CHECK
// ================================

function initializeGetStartedButtons() {
    const getStartedButtons = [
        document.getElementById('navGetStarted'),
        document.getElementById('heroGetStarted'),
        document.getElementById('pricingGetStarted')
    ];
    
    getStartedButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                handleGetStarted();
            });
        }
    });
}

async function handleGetStarted() {
    // Check if user is already authenticated
    // Try to get user from localStorage or check Firebase auth
    try {
        // Check if Firebase is loaded
        if (typeof firebase !== 'undefined' && firebase.auth) {
            const user = firebase.auth().currentUser;
            if (user) {
                // User is signed in, redirect to dashboard
                window.location.href = '/home';
            } else {
                // User is not signed in, redirect to index.html which will show login
                window.location.href = '/home';
            }
        } else {
            // Firebase not loaded, just redirect to /home
            window.location.href = '/home';
        }
    } catch (error) {
        console.error('Error checking auth:', error);
        // On error, redirect to /home
        window.location.href = '/home';
    }
}

// ================================
// STICKY FEATURE VISUALIZATION
// ================================

function initializeStickyFeatures() {
    const featureBlocks = document.querySelectorAll('.feature-block');
    const visualContents = document.querySelectorAll('.visual-content');
    
    if (featureBlocks.length === 0 || visualContents.length === 0) return;
    
    // Create observer for feature blocks
    const featureObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const featureType = entry.target.dataset.feature;
                updateVisual(featureType);
            }
        });
    }, {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    // Observe all feature blocks
    featureBlocks.forEach(block => {
        featureObserver.observe(block);
    });
    
    // Function to update the visual
    function updateVisual(featureType) {
        visualContents.forEach(visual => {
            if (visual.dataset.visual === featureType) {
                visual.classList.add('active');
            } else {
                visual.classList.remove('active');
            }
        });
    }
    
    // Set initial state
    if (featureBlocks.length > 0) {
        const firstFeature = featureBlocks[0].dataset.feature;
        updateVisual(firstFeature);
    }
}

// ================================
// MOBILE MENU
// ================================

function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileMenuToggle || !navLinks) return;
    
    mobileMenuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        navLinks.classList.toggle('show');
        
        // Toggle icon
        const icon = mobileMenuToggle.querySelector('i');
        if (navLinks.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navLinks.classList.contains('show') && 
            !navLinks.contains(e.target) && 
            e.target !== mobileMenuToggle) {
            navLinks.classList.remove('show');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking nav links
    const allNavLinks = navLinks.querySelectorAll('.nav-link, .btn-primary');
    allNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                navLinks.classList.remove('show');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
}

// ================================
// SMOOTH SCROLL
// ================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed nav
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ================================
// NAVBAR BACKGROUND ON SCROLL
// ================================

let lastScroll = 0;
const nav = document.querySelector('.landing-nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
        nav.style.borderBottomColor = 'rgba(42, 42, 42, 0.8)';
    } else {
        nav.style.background = 'rgba(0, 0, 0, 0.8)';
        nav.style.borderBottomColor = 'rgba(42, 42, 42, 0.5)';
    }
    
    lastScroll = currentScroll;
});

// ================================
// DYNAMIC CONTENT ENHANCEMENT
// ================================

// Add subtle parallax effect to hero visual
window.addEventListener('scroll', () => {
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.3;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
});

// Animate chart bars on scroll
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bars = entry.target.querySelectorAll('.chart-bar');
            bars.forEach((bar, index) => {
                setTimeout(() => {
                    bar.style.animation = 'chartGrow 1s ease-out forwards';
                }, index * 100);
            });
            chartObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const chartPlaceholder = document.querySelector('.chart-placeholder');
if (chartPlaceholder) {
    chartObserver.observe(chartPlaceholder);
}

// ================================
// PERFORMANCE OPTIMIZATION
// ================================

// Debounce scroll events for better performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy load images (if any are added later)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}
