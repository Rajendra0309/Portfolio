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



function typeEffect() {
    const roles = [
        "MERN Stack Developer",
        "Cloud & DevOps Enthusiast",
        "Backend Developer",
        "Problem Solver"
    ];
    const typingElement = document.querySelector('.typing-text');
    
    if (!typingElement) return;
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typingElement.textContent = roles[0];
        return;
    }
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = Math.random() * 50 + 50;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500;
        }
        
        setTimeout(type, typingSpeed);
    }
    
    setTimeout(type, 1000);
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



// Experience Accordion Logic
const experienceHeaders = document.querySelectorAll('.toggle-experience');

experienceHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const body = header.nextElementSibling;
        
        const isExpanded = body.classList.contains('expanded');
        
        // Optional: Close all others first
        document.querySelectorAll('.experience-body.collapsible').forEach(b => b.classList.remove('expanded'));
        document.querySelectorAll('.toggle-experience').forEach(h => h.classList.remove('active'));
        
        if (!isExpanded) {
            header.classList.add('active');
            body.classList.add('expanded');
        }
    });
});