// Navigation
const navbar = document.querySelector('.navbar');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

// Debounced scroll handler for better performance
let scrollTimeout;
const handleScroll = () => {
    if (scrollTimeout) {
        window.cancelAnimationFrame(scrollTimeout);
    }
    
    scrollTimeout = window.requestAnimationFrame(() => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
};

window.addEventListener('scroll', handleScroll);

// Mobile menu toggle with smooth animation and keyboard support
menuBtn.addEventListener('click', toggleMenu);
menuBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});

function toggleMenu() {
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
    
    // Improve accessibility
    const isExpanded = navLinks.classList.contains('active');
    menuBtn.setAttribute('aria-expanded', isExpanded);
    
    // Trap focus within mobile menu when open
    if (isExpanded) {
        trapFocus(navLinks);
    }
}

// Enhanced smooth scrolling with progress indication
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition - navHeight;
        
        let startTime = null;
        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / 800, 1);
            
            const easing = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
            window.scrollTo(0, startPosition + distance * easing(progress));
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            } else {
                // Enhance focus visibility
                target.setAttribute('tabindex', '-1');
                target.focus({preventScroll: true});
                
                // Visual feedback
                target.classList.add('section-focus');
                setTimeout(() => target.classList.remove('section-focus'), 1000);
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            }
        }
        requestAnimationFrame(animation);
    });
});

// Optimized Intersection Observer for scroll animations
const observerOptions = {
    threshold: [0.1, 0.5, 1.0],
    rootMargin: '0px 0px -10% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const delay = Array.from(element.parentElement.children).indexOf(element) * 100;
            
            // Progressive enhancement with reduced motion preference
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                element.style.opacity = '1';
                element.style.transform = 'none';
            } else {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        element.classList.add('animate');
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, delay);
                });
            }
            
            // Unobserve after animation
            observer.unobserve(element);
        }
    });
}, observerOptions);

// Enhanced animation setup with performance optimization
const animateElements = document.querySelectorAll('.section-title, .about-content, .project-card, .contact-content');
const observeElements = new Set();

animateElements.forEach(element => {
    element.classList.add('reveal');
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observeElements.add(element);
});

// Batch observe elements for better performance
observeElements.forEach(element => observer.observe(element));

// Enhanced form handling with validation and feedback
const contactForm = document.getElementById('contact-form');
const formInputs = contactForm.querySelectorAll('input, textarea');

formInputs.forEach(input => {
    // Real-time validation feedback
    input.addEventListener('input', validateInput);
    input.addEventListener('blur', validateInput);
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    
    // Enhanced loading state
    submitBtn.style.transition = 'all 0.3s ease';
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
        formInputs.forEach(input => input.classList.remove('valid'));
        
        // Success animation
        contactForm.classList.add('submitted');
        setTimeout(() => contactForm.classList.remove('submitted'), 1000);
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});

// Enhanced notification system with accessibility
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon"></span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Improved animation
    notification.style.animation = 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.appendChild(notification);
    
    // Ensure screen readers announce the notification
    setTimeout(() => notification.classList.add('showing'), 10);
    
    // Auto-dismiss with progress indicator
    const dismissTimeout = setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
    
    // Allow manual dismissal
    notification.addEventListener('click', () => {
        clearTimeout(dismissTimeout);
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 400);
    });
}

// Improved typing effect with better timing and fallback
function typeEffect() {
    const text = "Frontend Developer & Designer";
    const typingElement = document.querySelector('.hero p');
    
    if (!typingElement) return;
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typingElement.textContent = text;
        return;
    }
    
    let i = 0;
    typingElement.textContent = '';
    typingElement.setAttribute('aria-label', text);
    
    function type() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, Math.random() * 50 + 50); // Variable typing speed
        } else {
            typingElement.classList.add('typed');
            // Add cursor blink effect
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.innerHTML = '|';
            typingElement.appendChild(cursor);
        }
    }
    
    requestAnimationFrame(() => setTimeout(type, 1000));
}

// Initialize typing effect when content is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', typeEffect);
} else {
    typeEffect();
}

// Enhanced project interactions
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    const info = card.querySelector('.project-info');
    
    // Smooth hover effects
    const handleHover = (isEntering) => {
        requestAnimationFrame(() => {
            info.style.transform = isEntering ? 'translateY(0)' : 'translateY(100%)';
            card.style.transform = isEntering ? 'translateY(-10px)' : 'translateY(0)';
            card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        });
    };
    
    card.addEventListener('mouseenter', () => handleHover(true));
    card.addEventListener('mouseleave', () => handleHover(false));
    
    // Keyboard navigation support
    card.addEventListener('focusin', () => handleHover(true));
    card.addEventListener('focusout', () => handleHover(false));
});

// Optimized skill animations
const skills = document.querySelectorAll('.skill');

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    skills.forEach((skill, index) => {
        skill.style.opacity = '0';
        skill.style.transform = 'translateY(20px)';
        
        const delay = index * 100;
        requestAnimationFrame(() => {
            skill.style.animation = `fadeInUp 0.5s ease forwards ${delay}ms`;
        });
    });
}

// Optimized parallax effect
let ticking = false;
const hero = document.querySelector('.hero');
const heroContent = document.querySelector('.hero-content');

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            if (hero && heroContent) {
                hero.style.backgroundPositionY = `${scrolled * 0.4}px`;
                heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                heroContent.style.opacity = Math.max(0, 1 - (scrolled * 0.002));
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Optimized navigation highlight
let highlightTimeout;
window.addEventListener('scroll', () => {
    if (highlightTimeout) {
        cancelAnimationFrame(highlightTimeout);
    }
    
    highlightTimeout = requestAnimationFrame(() => {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-links a');
        const scrollPosition = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const currentId = section.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
                });
            }
        });
    });
});

// Lazy loading images with loading animation
const lazyImages = document.querySelectorAll('img[loading="lazy"]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.5s ease';
            
            img.addEventListener('load', function() {
                requestAnimationFrame(() => {
                    this.classList.add('loaded');
                    this.style.opacity = '1';
                });
            }, { once: true });
            
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Enhanced form input animations
const enhancedFormInputs = document.querySelectorAll('.form-group input, .form-group textarea');

enhancedFormInputs.forEach(input => {
    const handleFocus = (isFocused) => {
        requestAnimationFrame(() => {
            input.parentElement.classList.toggle('focused', isFocused || input.value.length > 0);
            input.style.transform = isFocused ? 'translateY(-4px)' : input.value.length > 0 ? 'translateY(-4px)' : 'translateY(0)';
        });
    };
    
    input.addEventListener('focus', () => handleFocus(true));
    input.addEventListener('blur', () => handleFocus(false));
    input.addEventListener('input', () => handleFocus(document.activeElement === input));
});

// Helper function to trap focus for accessibility
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    
    element.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === firstFocusable) {
                e.preventDefault();
                lastFocusable.focus();
            } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                e.preventDefault();
                firstFocusable.focus();
            }
        }
    });
}

// Form validation helper
function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    const isValid = input.checkValidity();
    
    input.classList.toggle('valid', isValid && value.length > 0);
    input.classList.toggle('invalid', !isValid && value.length > 0);
    
    // Show validation message
    const errorElement = input.parentElement.querySelector('.error-message');
    if (errorElement) {
        errorElement.textContent = input.validationMessage;
        errorElement.style.display = !isValid && value.length > 0 ? 'block' : 'none';
    }
}

function validateForm() {
    let isValid = true;
    formInputs.forEach(input => {
        if (!input.checkValidity()) {
            isValid = false;
            input.classList.add('invalid');
        }
    });
    return isValid;
}