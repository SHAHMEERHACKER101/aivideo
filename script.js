// DOM Elements
const progressBar = document.getElementById('progressBar');
const videoCounter = document.getElementById('videoCounter');
const timeSaved = document.getElementById('timeSaved');
const particlesContainer = document.getElementById('particles');
const floatingCta = document.getElementById('floatingCta');
const quizModal = document.getElementById('quizModal');
const quizClose = document.getElementById('quizClose');

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeParticles();
    initializeScrollProgress();
    initializeCounters();
    initializeFAQ();
    initializeScrollAnimations();
    initializeFloatingCTA();
    initializeQuiz();
    initializeExitIntent();
    
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
    let videoCount = 528491;
    let timeMinutes = 0;
    let timeSeconds = 0;
    
    // Video counter - increment every 3 seconds
    setInterval(() => {
        videoCount += Math.floor(Math.random() * 3) + 1;
        videoCounter.textContent = videoCount.toLocaleString();
    }, 3000);
    
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

// Interactive Quiz
function initializeQuiz() {
    const quizStyles = {
        social: {
            style: '🎬 Social Media Viral',
            description: 'Short, engaging videos perfect for TikTok, Instagram, and YouTube Shorts. High impact, trending content.'
        },
        business: {
            style: '💼 Professional Business',
            description: 'Clean, corporate videos for presentations, training, and company communications. Professional and polished.'
        },
        education: {
            style: '📚 Educational Content',
            description: 'Informative, easy-to-follow videos perfect for tutorials, courses, and knowledge sharing.'
        },
        marketing: {
            style: '🚀 Marketing Campaign',
            description: 'Persuasive, conversion-focused videos designed to drive sales and engagement. High-converting content.'
        }
    };
    
    // Show quiz after 30 seconds
    setTimeout(() => {
        if (!localStorage.getItem('quizCompleted')) {
            quizModal.classList.add('active');
        }
    }, 30000);
    
    // Close quiz
    quizClose.addEventListener('click', () => {
        quizModal.classList.remove('active');
    });
    
    // Handle quiz options
    const quizOptions = document.querySelectorAll('.quiz-option');
    quizOptions.forEach(option => {
        option.addEventListener('click', () => {
            const answer = option.dataset.answer;
            showQuizResult(quizStyles[answer]);
            localStorage.setItem('quizCompleted', 'true');
        });
    });
    
    function showQuizResult(result) {
        const quizQuestion = document.querySelector('.quiz-question');
        const quizResult = document.getElementById('quizResult');
        const resultStyle = document.getElementById('resultStyle');
        const resultDescription = document.getElementById('resultDescription');
        
        quizQuestion.classList.remove('active');
        quizResult.classList.add('active');
        
        resultStyle.textContent = result.style;
        resultDescription.textContent = result.description;
    }
}

// Exit Intent Detection
function initializeExitIntent() {
    let hasTriggered = false;
    
    document.addEventListener('mouseleave', (e) => {
        if (!hasTriggered && e.clientY <= 0) {
            hasTriggered = true;
            
            // Show exit intent popup after a delay
            setTimeout(() => {
                if (!localStorage.getItem('exitIntentShown')) {
                    showExitIntentPopup();
                    localStorage.setItem('exitIntentShown', 'true');
                }
            }, 1000);
        }
    });
}

function showExitIntentPopup() {
    // Create exit intent overlay
    const overlay = document.createElement('div');
    overlay.className = 'exit-intent-overlay';
    overlay.innerHTML = `
        <div class="exit-intent-popup">
            <div class="exit-intent-content">
                <h3>Wait! Don't miss out! 🌟</h3>
                <p>Get instant access to the most powerful AI video generator. Create your first video in minutes!</p>
                <div class="exit-intent-buttons">
                    <a href="https://invideo.sjv.io/xLDV53" class="btn-exit-yes" target="_blank" rel="noopener">
                        Yes, Create My Video Now!
                    </a>
                    <button class="btn-exit-no">Maybe Later</button>
                </div>
            </div>
        </div>
    `;
    
    // Add styles
    const styles = `
        .exit-intent-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            backdrop-filter: blur(10px);
        }
        
        .exit-intent-popup {
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            max-width: 500px;
            margin: 2rem;
            backdrop-filter: blur(20px);
            animation: popupSlideIn 0.5s ease;
        }
        
        @keyframes popupSlideIn {
            from { transform: translateY(-50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        .exit-intent-content h3 {
            font-size: 2rem;
            margin-bottom: 1rem;
            background: linear-gradient(45deg, #00f0ff, #ff2a6d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .exit-intent-content p {
            font-size: 1.1rem;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .exit-intent-buttons {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
        }
        
        .btn-exit-yes {
            padding: 1rem 2rem;
            background: linear-gradient(45deg, #00f0ff, #ff2a6d);
            color: white;
            text-decoration: none;
            border-radius: 50px;
            font-weight: 600;
            transition: transform 0.3s ease;
        }
        
        .btn-exit-yes:hover {
            transform: translateY(-2px) scale(1.05);
        }
        
        .btn-exit-no {
            padding: 1rem 2rem;
            background: transparent;
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: rgba(255, 255, 255, 0.7);
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-exit-no:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }
    `;
    
    // Add styles to head
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
    
    document.body.appendChild(overlay);
    
    // Handle close
    overlay.querySelector('.btn-exit-no').addEventListener('click', () => {
        overlay.remove();
        styleSheet.remove();
    });
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
            styleSheet.remove();
        }
    });
}

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

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        if (quizModal.classList.contains('active')) {
            quizModal.classList.remove('active');
        }
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