// ================================
// PIIK.ME - LANDING INTERACTIVITY
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initGlobe();
    initMobileMenu();
    initScrollAnimations();
});

// ================================
// 3D GLOBE VISUALIZATION
// ================================
function initGlobe() {
    const globeContainer = document.getElementById('globeViz');
    if (!globeContainer) return;

    // Configuration
    const N_ARCS = 20;
    const ARC_REL_LEN = 0.4; // relative to whole arc
    const FLIGHT_TIME = 1000;
    const NUM_RINGS = 3;
    const RINGS_MAX_R = 5; // deg
    const RING_PROPAGATION_SPEED = 5; // deg/sec

    // Generate random data
    const arcsData = [...Array(N_ARCS).keys()].map(() => ({
        startLat: (Math.random() - 0.5) * 180,
        startLng: (Math.random() - 0.5) * 360,
        endLat: (Math.random() - 0.5) * 180,
        endLng: (Math.random() - 0.5) * 360,
        color: [['#3b82f6', '#8b5cf6', '#ec4899'][Math.round(Math.random() * 2)], ['#3b82f6', '#8b5cf6', '#ec4899'][Math.round(Math.random() * 2)]]
    }));

    // Initialize Globe
    const world = Globe()
        (globeContainer)
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .arcsData(arcsData)
        .arcColor('color')
        .arcDashLength(ARC_REL_LEN)
        .arcDashGap(2)
        .arcDashInitialGap(1)
        .arcDashAnimateTime(FLIGHT_TIME)
        .peaksData(arcsData)
        .peakColor(() => '#3b82f6')
        .peakAltitude(0.1)
        .peakRadius(0.5)
        .atmosphereColor('#3b82f6')
        .atmosphereAltitude(0.15)
        .hexBinPointWeight('pop')
        .hexBinResolution(4)
        .hexBinMerge(true)
        .enablePointerInteraction(false) // Keep it as background
        .width(window.innerWidth)
        .height(window.innerHeight);

    // Auto-rotate
    world.controls().autoRotate = true;
    world.controls().autoRotateSpeed = 0.5;
    
    // Zoom out slightly to fit
    world.pointOfView({ altitude: 2.5 });

    // Handle Resize
    window.addEventListener('resize', () => {
        world.width(window.innerWidth);
        world.height(window.innerHeight);
    });
}

// ================================
// MOBILE MENU
// ================================
function initMobileMenu() {
    const toggle = document.getElementById('mobileMenuToggle');
    const menu = document.getElementById('mobileMenu');
    const links = document.querySelectorAll('.mobile-link');
    
    if (!toggle || !menu) return;

    let isOpen = false;

    function toggleMenu() {
        isOpen = !isOpen;
        if (isOpen) {
            menu.classList.remove('translate-x-full');
            toggle.innerHTML = '<i class="fas fa-times text-xl"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            menu.classList.add('translate-x-full');
            toggle.innerHTML = '<i class="fas fa-bars text-xl"></i>';
            document.body.style.overflow = '';
        }
    }

    toggle.addEventListener('click', toggleMenu);
    
    // Close on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (isOpen) toggleMenu();
        });
    });
}

// ================================
// SCROLL ANIMATIONS (GSAP)
// ================================
function initScrollAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Navbar Blur Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('bg-black/90', 'shadow-lg');
            navbar.classList.remove('bg-black/50');
        } else {
            navbar.classList.remove('bg-black/90', 'shadow-lg');
            navbar.classList.add('bg-black/50');
        }
    });

    // Reveal elements on scroll
    gsap.utils.toArray('.group').forEach(group => {
        gsap.fromTo(group, 
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: group,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });
}
