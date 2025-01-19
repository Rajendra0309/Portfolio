// Navigation
const navbar = document.querySelector('.navbar');
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');

// Navbar scroll effect with smooth transition
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle with smooth animation
menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuBtn.classList.toggle('active');
});

// Enhanced smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        const navHeight = navbar.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
        
        // Add smooth scroll with easing
        window.scrollTo({
            top: targetPosition - navHeight,
            behavior: 'smooth'
        });

        // Animate the target section
        target.classList.add('section-focus');
        setTimeout(() => target.classList.remove('section-focus'), 1000);

        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        }
    });
});

// Enhanced Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Add staggered animation delay based on index
            const delay = Array.from(entry.target.parentElement.children).indexOf(entry.target) * 150;
            setTimeout(() => {
                entry.target.classList.add('animate');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, delay);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Elements to animate on scroll with initial state
document.querySelectorAll('.section-title, .about-content, .project-card, .contact-content').forEach(element => {
    element.classList.add('reveal');
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(element);
});

// Form handling with animation
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };

    // Show loading state with animation
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.style.transition = 'all 0.3s ease';
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');

    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        showNotification('Message sent successfully!', 'success');
        contactForm.reset();
        
        // Add success animation
        contactForm.classList.add('submitted');
        setTimeout(() => contactForm.classList.remove('submitted'), 1000);
    } catch (error) {
        showNotification('Failed to send message. Please try again.', 'error');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
    }
});

// Enhanced notification system with animations
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.animation = 'slideIn 0.5s ease forwards';

    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add('showing'), 10);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.5s ease forwards';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Enhanced dynamic typing effect
function typeEffect() {
    const text = "Frontend Developer & Designer";
    const typingElement = document.querySelector('.hero p');
    let i = 0;
    
    typingElement.textContent = '';
    typingElement.style.borderRight = '2px solid var(--primary-color)';
    
    function type() {
        if (i < text.length) {
            typingElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        } else {
            typingElement.style.borderRight = 'none';
            // Add cursor blink animation
            typingElement.classList.add('typed');
        }
    }
    
    setTimeout(type, 1000);
}

document.addEventListener('DOMContentLoaded', typeEffect);

// Enhanced project hover effects
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        const info = card.querySelector('.project-info');
        info.style.transform = 'translateY(0)';
        info.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.transform = 'translateY(-10px)';
        card.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    card.addEventListener('mouseleave', (e) => {
        const info = card.querySelector('.project-info');
        info.style.transform = 'translateY(100%)';
        card.style.transform = 'translateY(0)';
    });
});

// Enhanced skills animation
const skills = document.querySelectorAll('.skill');

skills.forEach((skill, index) => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateY(20px)';
    skill.style.animation = `fadeInUp 0.5s ease forwards ${index * 0.1}s`;
});

// Enhanced parallax effect
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    requestAnimationFrame(() => {
        hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled * 0.002);
    });
});

// Enhanced active navigation highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        const scrollPosition = window.pageYOffset;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const currentId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Enhanced image loading animation
const images = document.querySelectorAll('img');

images.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.5s ease';
    
    img.addEventListener('load', function() {
        this.classList.add('loaded');
        this.style.opacity = '1';
    });
});

// Enhanced form input animations
const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
        input.style.transform = 'translateY(-4px)';
        input.style.transition = 'transform 0.3s ease';
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
            input.style.transform = 'translateY(0)';
        }
    });
});