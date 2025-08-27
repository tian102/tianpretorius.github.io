// Theme Management
class ThemeManager {
    constructor() {
        this.theme = localStorage.getItem('theme') || 'light';
        this.themeToggle = document.getElementById('theme-toggle');
        this.init();
    }

    init() {
        this.applyTheme();
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        
        // Update button text based on current theme
        this.updateToggleButton();
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.theme);
    }

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        this.updateToggleButton();
        localStorage.setItem('theme', this.theme);
    }

    updateToggleButton() {
        this.themeToggle.textContent = this.theme === 'light' ? '🌙' : '☀️';
        this.themeToggle.setAttribute('aria-label', `Switch to ${this.theme === 'light' ? 'dark' : 'light'} mode`);
    }
}

// Mobile Navigation
class MobileNav {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => this.toggleMenu());
        
        // Close menu when clicking on nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.hamburger.contains(e.target) && !this.navMenu.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.hamburger.classList.toggle('active');
        this.navMenu.classList.toggle('active');
        document.body.style.overflow = this.navMenu.classList.contains('active') ? 'hidden' : '';
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Typewriter Effect
class TypewriterEffect {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isPaused = false;
        this.init();
    }

    init() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (!this.isDeleting) {
            // Typing
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
            
            if (this.charIndex === currentText.length) {
                // Finished typing, pause then start deleting
                this.isPaused = true;
                setTimeout(() => {
                    this.isPaused = false;
                    this.isDeleting = true;
                    this.type();
                }, 2000);
                return;
            }
        } else {
            // Deleting
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
            
            if (this.charIndex === 0) {
                // Finished deleting, move to next text
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
            }
        }
        
        if (!this.isPaused) {
            const timeout = this.isDeleting ? this.speed / 2 : this.speed;
            setTimeout(() => this.type(), timeout);
        }
    }
}

// Smooth Scrolling for Navigation Links
class SmoothScrolling {
    constructor() {
        this.navLinks = document.querySelectorAll('a[href^="#"]');
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Active Navigation Highlighting
class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.highlightActiveSection());
        this.highlightActiveSection(); // Initial check
    }

    highlightActiveSection() {
        const scrollPosition = window.scrollY + 100;

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Simple AOS (Animate On Scroll) Implementation
class AnimateOnScroll {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.init();
    }

    init() {
        this.elements.forEach(element => {
            this.observer.observe(element);
        });
    }

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.getAttribute('data-aos-delay') || 0;
                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
}

// Skill Bar Animation
class SkillBarAnimation {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.init();
    }

    init() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.getAttribute('data-width') + '%';
                    progressBar.style.width = '0%';
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 200);
                    this.observer.unobserve(progressBar);
                }
            });
        }, {
            threshold: 0.5
        });

        this.skillBars.forEach(bar => {
            this.observer.observe(bar);
        });
    }
}

// Navigation Background Change on Scroll
class NavScrollEffect {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                this.nav.style.background = 'rgba(15, 23, 42, 0.98)';
                this.nav.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                this.nav.style.background = 'rgba(15, 23, 42, 0.95)';
                this.nav.style.boxShadow = 'none';
            }
        });
    }
}

// Parallax Effect for Hero Section
class ParallaxEffect {
    constructor() {
        this.heroSection = document.querySelector('.home-section');
        this.profileImage = document.querySelector('.profile-image');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            if (this.heroSection && scrolled < window.innerHeight) {
                this.heroSection.style.transform = `translateY(${rate}px)`;
            }
            
            if (this.profileImage && scrolled < window.innerHeight) {
                this.profileImage.style.transform = `translateY(${scrolled * 0.3}px) scale(${1 - scrolled * 0.0002})`;
            }
        });
    }
}

// Loading Animation
class LoadingAnimation {
    constructor() {
        this.init();
    }

    init() {
        // Add loading class to body
        document.body.classList.add('loading');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                document.body.classList.remove('loading');
                document.body.classList.add('loaded');
                
                // Start typewriter effect after loading
                this.initTypewriter();
            }, 500);
        });
    }

    initTypewriter() {
        const typewriterElement = document.getElementById('typewriter');
        if (typewriterElement) {
            const texts = [
                'Computer Engineer',
                'Software Developer', 
                'Technical Leader',
                'System Architect',
                'Automation Specialist'
            ];
            new TypewriterEffect(typewriterElement, texts, 120);
        }
    }
}

// Contact Form Enhancement (if you add a form later)
class ContactFormHandler {
    constructor() {
        this.form = document.querySelector('#contact-form');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const submitButton = this.form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;
        
        try {
            // Add your form submission logic here
            // For now, just simulate a successful submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showMessage('Message sent successfully!', 'success');
            this.form.reset();
        } catch (error) {
            this.showMessage('Failed to send message. Please try again.', 'error');
        } finally {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }
    }

    showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;
        
        this.form.appendChild(messageDiv);
        
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Easter Egg - Konami Code
class EasterEgg {
    constructor() {
        this.sequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
        this.userInput = [];
        this.init();
    }

    init() {
        document.addEventListener('keydown', (e) => {
            this.userInput.push(e.code);
            
            if (this.userInput.length > this.sequence.length) {
                this.userInput.shift();
            }
            
            if (this.userInput.length === this.sequence.length) {
                if (this.userInput.every((key, index) => key === this.sequence[index])) {
                    this.activateEasterEgg();
                }
            }
        });
    }

    activateEasterEgg() {
        // Create floating emojis
        const emojis = ['🚀', '💻', '⚡', '🔥', '🎉', '🌟'];
        
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const emoji = document.createElement('div');
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.position = 'fixed';
                emoji.style.fontSize = '30px';
                emoji.style.zIndex = '9999';
                emoji.style.pointerEvents = 'none';
                emoji.style.left = Math.random() * window.innerWidth + 'px';
                emoji.style.top = window.innerHeight + 'px';
                emoji.style.animation = 'floatUp 3s ease-out forwards';
                
                document.body.appendChild(emoji);
                
                setTimeout(() => emoji.remove(), 3000);
            }, i * 100);
        }
        
        // Add CSS for floating animation if it doesn't exist
        if (!document.querySelector('#easter-egg-styles')) {
            const style = document.createElement('style');
            style.id = 'easter-egg-styles';
            style.textContent = `
                @keyframes floatUp {
                    to {
                        transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        console.log('🎉 Easter egg activated! You found the secret code!');
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }

    init() {
        // Log loading performance
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
                
                // Log to analytics if available
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        name: 'load',
                        value: loadTime
                    });
                }
            }
        });
    }
}

// Initialize Everything
document.addEventListener('DOMContentLoaded', () => {
    // Core functionality
    new ThemeManager();
    new MobileNav();
    new SmoothScrolling();
    new ActiveNavigation();
    new LoadingAnimation();
    
    // Animations and effects
    new AnimateOnScroll();
    new SkillBarAnimation();
    new NavScrollEffect();
    new ParallaxEffect();
    
    // Enhanced features
    new ContactFormHandler();
    new EasterEgg();
    new PerformanceMonitor();
    
    // Add loading styles
    const loadingStyles = document.createElement('style');
    loadingStyles.textContent = `
        .loading {
            overflow: hidden;
        }
        
        .loading * {
            animation-play-state: paused !important;
        }
        
        .loaded {
            animation: fadeIn 0.5s ease-in-out;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(loadingStyles);
});

// Service Worker Registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
