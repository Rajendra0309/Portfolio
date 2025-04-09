const navbar = document.querySelector('.navbar');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

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

menuBtn.addEventListener('click', toggleMenu);
menuBtn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
    }
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    });
});

function toggleMenu() {
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');

    const isExpanded = navLinks.classList.contains('active');
    menuBtn.setAttribute('aria-expanded', isExpanded);

    if (isExpanded) {
        document.body.style.overflow = 'hidden';
        trapFocus(navLinks);
    } else {
        document.body.style.overflow = '';
    }
}

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
                target.setAttribute('tabindex', '-1');
                target.focus({preventScroll: true});
                
                target.classList.add('section-focus');
                setTimeout(() => target.classList.remove('section-focus'), 1000);
                
                if (navLinks.classList.contains('active')) {
                    toggleMenu();
                }
            }
        }
        requestAnimationFrame(animation);
    });
});

const observerOptions = {
    threshold: [0.1, 0.5, 1.0],
    rootMargin: '0px 0px -10% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const delay = Array.from(element.parentElement.children).indexOf(element) * 100;

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
            
            observer.unobserve(element);
        }
    });
}, observerOptions);

const animateElements = document.querySelectorAll('.section-title, .about-content, .project-card, .contact-content');
const observeElements = new Set();

animateElements.forEach(element => {
    element.classList.add('reveal');
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    observeElements.add(element);
});

observeElements.forEach(element => observer.observe(element));

const contactForm = document.getElementById('contact-form');
const formInputs = contactForm.querySelectorAll('input, textarea');

formInputs.forEach(input => {
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

    submitBtn.style.transition = 'all 0.3s ease';
    submitBtn.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
        formInputs.forEach(input => input.classList.remove('valid'));

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
    
    notification.style.animation = 'slideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('showing'), 10);
    
    const dismissTimeout = setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
    
    notification.addEventListener('click', () => {
        clearTimeout(dismissTimeout);
        notification.style.animation = 'slideOut 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        setTimeout(() => notification.remove(), 400);
    });
}

function typeEffect() {
    const text = "Frontend Developer & Designer";
    const typingElement = document.querySelector('.hero p');
    
    if (!typingElement) return;
    
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
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.innerHTML = '|';
            typingElement.appendChild(cursor);
        }
    }
    
    requestAnimationFrame(() => setTimeout(type, 1000));
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', typeEffect);
} else {
    typeEffect();
}

const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    const info = card.querySelector('.project-info');
    const img = card.querySelector('img');

    if (window.innerWidth > 768) {
        const handleHover = (isEntering) => {
            requestAnimationFrame(() => {
                card.style.transform = isEntering ? 'translateY(-10px)' : 'translateY(0)';
                card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            });
        };
        
        card.addEventListener('mouseenter', () => handleHover(true));
        card.addEventListener('mouseleave', () => handleHover(false));
        
        card.addEventListener('focusin', () => handleHover(true));
        card.addEventListener('focusout', () => handleHover(false));
    }
});

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

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();
    const isValid = input.checkValidity();
    
    input.classList.toggle('valid', isValid && value.length > 0);
    input.classList.toggle('invalid', !isValid && value.length > 0);

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

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }
});

function handleTouchScreens() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.documentElement.classList.add('touch-device');
        
        const touchProjects = document.querySelectorAll('.project-card');
        touchProjects.forEach(project => {
            project.addEventListener('touchstart', function() {
                this.classList.add('touch-focus');
            }, { passive: true });
            
            document.addEventListener('touchstart', function(e) {
                if (!project.contains(e.target)) {
                    project.classList.remove('touch-focus');
                }
            }, { passive: true });
        });
    }
}

handleTouchScreens();