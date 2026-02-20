const navbar = document.querySelector('.navbar');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
const backToTop = document.querySelector('.back-to-top');

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
        
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
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
            
            const easing = t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
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
    threshold: [0.1, 0.4, 0.7],
    rootMargin: '0px 0px -5% 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            const delay = Array.from(element.parentElement.children).indexOf(element) * 100;
            
            const animationType = element.dataset.animation || 'fade-in-up';
            
            if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
                element.style.opacity = '1';
                element.style.transform = 'none';
            } else {
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        element.classList.add(animationType);
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0)';
                    }, delay);
                });
            }
            
            observer.unobserve(element);
        }
    });
}, observerOptions);

function setupAnimations() {
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        if (!title.hasAttribute('data-aos')) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';
            title.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1)';
            observer.observe(title);
        }
    });
    
    const aboutContent = document.querySelector('.about-content');
    if (aboutContent) {
        const aboutText = aboutContent.querySelector('.about-text');
        const aboutImage = aboutContent.querySelector('.about-image');
        
        if (aboutText && !aboutText.hasAttribute('data-aos')) {
            aboutText.style.opacity = '0';
            aboutText.style.transform = 'translateX(-30px)';
            aboutText.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1) 0.2s';
            aboutText.dataset.animation = 'fade-in-left';
            observer.observe(aboutText);
        }
        
        if (aboutImage && !aboutImage.hasAttribute('data-aos')) {
            aboutImage.style.opacity = '0';
            aboutImage.style.transform = 'translateX(30px)';
            aboutImage.style.transition = 'all 0.8s cubic-bezier(0.19, 1, 0.22, 1) 0.4s';
            aboutImage.dataset.animation = 'fade-in-right';
            observer.observe(aboutImage);
        }
    }
    
    document.querySelectorAll('.project-card').forEach((card, index) => {
        if (!card.hasAttribute('data-aos')) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = `all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.15}s`;
            observer.observe(card);
        }
    });
    
    document.querySelectorAll('.info-item').forEach((item, index) => {
        if (!item.hasAttribute('data-aos')) {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-30px)';
            item.style.transition = `all 0.6s cubic-bezier(0.19, 1, 0.22, 1) ${index * 0.1}s`;
            item.dataset.animation = 'fade-in-left';
            observer.observe(item);
        }
    });
    
    document.querySelectorAll('.cert-card').forEach((card, index) => {
        if (!card.hasAttribute('data-aos')) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(40px)';
            card.style.transition = `all 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 0.1}s`;
            observer.observe(card);
        }
    });
    
    const skills = document.querySelectorAll('.skill');
    skills.forEach((skill, index) => {
        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            skill.style.opacity = '0';
            skill.style.transform = 'translateY(20px) scale(0.95)';
            
            const delay = index * 80;
            requestAnimationFrame(() => {
                setTimeout(() => {
                    skill.style.transition = `all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${delay}ms`;
                    skill.style.opacity = '1';
                    skill.style.transform = 'translateY(0) scale(1)';
                }, 300);
            });
        }
    });

    const floatElements = document.querySelectorAll('.float-animation');
    floatElements.forEach(element => {
        element.style.animation = 'float 4s ease-in-out infinite';
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupAnimations();
    
    // Initialize AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            easing: 'ease-out',
            once: true,
            offset: 100,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        });
    }
    
    // Back to top button
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });
    }
});

const contactForm = document.getElementById('contact-form');
if (contactForm) {
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
    
        submitBtn.style.transition = 'all 0.3s var(--bounce)';
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
}

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
    
    notification.style.animation = 'slideIn 0.4s var(--bounce)';
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('showing'), 10);
    
    const dismissTimeout = setTimeout(() => {
        notification.style.animation = 'slideOut 0.4s var(--bounce)';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
    
    notification.addEventListener('click', () => {
        clearTimeout(dismissTimeout);
        notification.style.animation = 'slideOut 0.4s var(--bounce)';
        setTimeout(() => notification.remove(), 400);
    });
}

function typeEffect() {
    const text = "Full-Stack Developer (MERN) | Software Developer Trainee | DevOps & Cloud Enthusiast";
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
            setTimeout(type, Math.random() * 50 + 50);
        } else {
            typingElement.classList.add('typed');
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            cursor.innerHTML = '|';
            typingElement.appendChild(cursor);
        }
    }
    
    requestAnimationFrame(() => setTimeout(type, 800));
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
                card.style.transform = isEntering ? 'translateY(-15px) scale(1.03)' : 'translateY(0) scale(1)';
                card.style.boxShadow = isEntering ? 
                  '0 22px 40px rgba(0, 0, 0, 0.15)' : 
                  'var(--shadow-sm)';
                card.style.transition = 'transform 0.5s var(--bounce), box-shadow 0.5s var(--bounce)';
                
                if (img) {
                    img.style.transform = isEntering ? 'scale(1.08)' : 'scale(1)';
                    img.style.transition = 'transform 0.7s var(--ease-out)';
                }
            });
        };
        
        card.addEventListener('mouseenter', () => handleHover(true));
        card.addEventListener('mouseleave', () => handleHover(false));
        
        card.addEventListener('focusin', () => handleHover(true));
        card.addEventListener('focusout', () => handleHover(false));
    }
});

function handleParallaxEffects() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');

    if (hero && heroContent) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            requestAnimationFrame(() => {
                hero.style.backgroundPositionY = `${scrolled * 0.4}px`;
                heroContent.style.transform = `translateY(${scrolled * 0.15}px)`;
                heroContent.style.opacity = Math.max(0, 1 - (scrolled * 0.002));
            });
        });
    }
}

handleParallaxEffects();

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
    const formInputs = document.querySelectorAll('#contact-form input, #contact-form textarea');
    formInputs.forEach(input => {
        if (!input.checkValidity()) {
            isValid = false;
            input.classList.add('invalid');
        }
    });
    return isValid;
}

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

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 1000,
        easing: 'ease-out',
        once: true,
        offset: 100,
        disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
});

function createCursorEffect() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth <= 768) return;
    
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: rgba(99, 102, 241, 0.3);
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%) scale(1);
        transition: transform 0.15s ease-out, background 0.3s ease;
        mix-blend-mode: difference;
        opacity: 0;
    `;
    document.body.appendChild(cursor);
    
    const cursorFollower = document.createElement('div');
    cursorFollower.className = 'cursor-follower';
    cursorFollower.style.cssText = `
        position: fixed;
        width: 35px;
        height: 35px;
        border: 1px solid rgba(99, 102, 241, 0.5);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%) scale(1);
        transition: transform 0.3s ease-out, opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursorFollower);
    
    document.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => {
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
            cursor.style.opacity = '1';
            
            setTimeout(() => {
                cursorFollower.style.left = `${e.clientX}px`;
                cursorFollower.style.top = `${e.clientY}px`;
                cursorFollower.style.opacity = '1';
            }, 50);
        });
    });
    
    document.addEventListener('mouseout', () => {
        cursor.style.opacity = '0';
        cursorFollower.style.opacity = '0';
    });
    
    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(0.8)';
    });
    
    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    });
    
    const interactiveElements = document.querySelectorAll('a, button, .btn, .project-card, .about-image img');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.background = 'rgba(99, 102, 241, 0.7)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.background = 'rgba(99, 102, 241, 0.3)';
            cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });
}

if (window.innerWidth > 768) {
    createCursorEffect();
}