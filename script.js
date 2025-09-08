// DOM Elements
const progressBar = document.getElementById('progressBar');
const videoCounter = document.getElementById('videoCounter');
const timeSaved = document.getElementById('timeSaved');
const particlesContainer = document.getElementById('particles');
const floatingCta = document.getElementById('floatingCta');
// Quiz modal references removed

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeScrollProgress();
    initializeCounters();
    initializeFAQ();
    initializeScrollAnimations();
    initializeFloatingCTA();
    
    // Add loading animation
    document.body.classList.add('loaded');
});

// Particle System
function initializeParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle();
    }
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
    
    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.3;
    
    // Random color (cyan or pink)
    particle.style.background = Math.random() > 0.5 ? '#00f0ff' : '#ff2a6d';
    
    particlesContainer.appendChild(particle);
}

// Scroll Progress Bar
function initializeScrollProgress() {
    window.addEventListener('scroll', updateProgressBar);
}

function updateProgressBar() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    progressBar.style.width = scrolled + '%';
}

// Animated Counters
function initializeCounters() {
    let targetCount = 259654;
    let currentCount = 0;
    let timeMinutes = 0;
    let timeSeconds = 0;
    
    // Fast animated counter that counts from 0 to target
    function animateCounter() {
        const duration = 1500; // 1.5 seconds for faster counting
        const increment = targetCount / (duration / 20); // Update every 20ms for smoother animation
        
        const counterInterval = setInterval(() => {
            currentCount += increment;
            if (currentCount >= targetCount) {
                currentCount = targetCount;
                videoCounter.textContent = Math.floor(currentCount).toLocaleString();
                clearInterval(counterInterval);
                
                // After reaching target, continue incrementing every 3 seconds
                setInterval(() => {
                    targetCount += Math.floor(Math.random() * 5) + 2;
                    videoCounter.textContent = targetCount.toLocaleString();
                }, 3000);
            } else {
                videoCounter.textContent = Math.floor(currentCount).toLocaleString();
            }
        }, 20);
    }
    
    // Start animation immediately when page loads
    setTimeout(animateCounter, 300);
    
    // Time saved counter - increment based on scroll
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        const totalMinutes = Math.floor(scrollPercent * 0.15); // Max 15 minutes
        const totalSeconds = Math.floor((scrollPercent * 9) % 60); // Seconds component
        
        if (totalMinutes !== timeMinutes || totalSeconds !== timeSeconds) {
            timeMinutes = totalMinutes;
            timeSeconds = totalSeconds;
            timeSaved.textContent = `${timeMinutes}m ${timeSeconds}s`;
        }
    });
}

// FAQ Accordion
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faq => faq.classList.remove('active'));
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-item, .power-card, .testimonial-card, .faq-item');
    animatedElements.forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Floating CTA
function initializeFloatingCTA() {
    let lastScrollY = 0;
    let ticking = false;
    
    function updateFloatingCTA() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Show after scrolling 50% of the page
        if (scrollY > documentHeight * 0.5) {
            floatingCta.classList.add('visible');
        } else {
            floatingCta.classList.remove('visible');
        }
        
        lastScrollY = scrollY;
        ticking = false;
    }
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateFloatingCTA);
            ticking = true;
        }
    });
}

// Quiz functionality removed as per user request

// Exit intent popup removed as per user request

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Performance optimization - throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Cache Control for better performance
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(() => console.log('Service Worker registered'))
        .catch(() => console.log('Service Worker registration failed'));
}

// Lazy loading optimization
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
lazyLoadImages();

// Analytics and tracking (placeholder for real implementation)
function trackEvent(eventName, eventData = {}) {
    // This would connect to your analytics service
    console.log('Event tracked:', eventName, eventData);
    
    // Example: gtag('event', eventName, eventData);
    // Example: analytics.track(eventName, eventData);
}

// Track important interactions
document.addEventListener('click', (e) => {
    if (e.target.matches('a[href*="invideo.sjv.io"]')) {
        trackEvent('cta_click', {
            button_text: e.target.textContent.trim(),
            page_location: window.location.href
        });
    }
});

// Track scroll depth
let maxScroll = 0;
window.addEventListener('scroll', throttle(() => {
    const scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    
    if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
        
        // Track milestone scrolls
        if (maxScroll >= 25 && maxScroll < 50) {
            trackEvent('scroll_depth', { depth: '25%' });
        } else if (maxScroll >= 50 && maxScroll < 75) {
            trackEvent('scroll_depth', { depth: '50%' });
        } else if (maxScroll >= 75 && maxScroll < 90) {
            trackEvent('scroll_depth', { depth: '75%' });
        } else if (maxScroll >= 90) {
            trackEvent('scroll_depth', { depth: '90%' });
        }
    }
}, 1000));

// Performance monitoring
window.addEventListener('load', () => {
    // Track page load time
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    trackEvent('page_load_time', { load_time: loadTime });
    
    // Track page visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            trackEvent('page_hidden');
        } else {
            trackEvent('page_visible');
        }
    });
});

// Error tracking
window.addEventListener('error', (e) => {
    trackEvent('javascript_error', {
        error_message: e.message,
        error_file: e.filename,
        error_line: e.lineno
    });
});

// Keyboard navigation support (popups removed)
document.addEventListener('keydown', (e) => {
    // Escape key functionality - popups removed as per user request
    if (e.key === 'Escape') {
        // Future modal support can be added here
    }
});

// Cache testimonials rotation
let testimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function rotateTestimonials() {
    testimonialCards.forEach((card, index) => {
        if (index === testimonialIndex) {
            card.style.transform = 'scale(1.05)';
            card.style.zIndex = '10';
        } else {
            card.style.transform = 'scale(1)';
            card.style.zIndex = '1';
        }
    });
    
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
}

// Rotate testimonials every 5 seconds
setInterval(rotateTestimonials, 5000);

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add a slight delay to ensure smooth loading
    setTimeout(() => {
        document.querySelectorAll('.loading').forEach(el => {
            el.classList.add('loaded');
        });
    }, 100);
});