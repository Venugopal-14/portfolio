// ===== Register GSAP Plugins =====
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ===== Loader =====
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    document.body.classList.add('loading');

    gsap.to(loader, {
        opacity: 0,
        duration: 0.6,
        delay: 1.5,
        ease: 'power2.inOut',
        onComplete: () => {
            loader.classList.add('hidden');
            document.body.classList.remove('loading');
            initHeroAnimations();
        }
    });
});

// ===== Custom Cursor =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(cursor, { x: mouseX - 4, y: mouseY - 4, duration: 0.1 });
});

function animateFollower() {
    followerX += (mouseX - followerX - 20) * 0.08;
    followerY += (mouseY - followerY - 20) * 0.08;
    follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
    requestAnimationFrame(animateFollower);
}
animateFollower();

// Cursor hover effects
document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
        follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        follower.classList.remove('active');
    });
});

// ===== Magnetic Effect =====
document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.3)' });
    });
});

// ===== Particle System =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.color = Math.random() > 0.5 ? '108, 99, 255' : '0, 212, 170';
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    particles = [];
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(108, 99, 255, ${0.08 * (1 - dist / 120)})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animationId = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// ===== Hero Animations =====
function initHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Split hero name into characters
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        const text = heroName.textContent;
        heroName.innerHTML = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            heroName.appendChild(span);
        });
    }

    tl.to('.hero-greeting', { opacity: 1, y: 0, duration: 0.6, delay: 0.2 })
      .to('.hero-name .char', {
          opacity: 1, y: 0, duration: 0.5,
          stagger: 0.04, ease: 'back.out(1.7)'
      }, '-=0.3')
      .to('.hero-description', { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
      .to('.hero-buttons', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .to('.hero-socials', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
      .to('.scroll-indicator', { opacity: 1, duration: 0.8 }, '-=0.2');

    // Animate code block lines
    gsap.to('.code-line', {
        opacity: 1, x: 0, duration: 0.4,
        stagger: 0.1, delay: 1.8, ease: 'power2.out'
    });

    // Start typing
    setTimeout(typeTitle, 2000);
}

// ===== Typing Effect =====
const titles = [
    'Python & AI/ML Engineer',
    'DevOps & Platform Engineer',
    'Django & FastAPI Developer',
    'GenAI & AIOps Builder',
    'Infrastructure Automator',
    'Machine Learning Enthusiast'
];
let titleIndex = 0, charIndex = 0, isDeleting = false;
const typingEl = document.querySelector('.typing-text');

function typeTitle() {
    if (!typingEl) return;
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
        charIndex--;
        typingEl.textContent = currentTitle.substring(0, charIndex);
    } else {
        charIndex++;
        typingEl.textContent = currentTitle.substring(0, charIndex);
    }

    let speed = isDeleting ? 35 : 70;

    if (!isDeleting && charIndex === currentTitle.length) {
        speed = 2200;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
        speed = 400;
    }

    setTimeout(typeTitle, speed);
}

// ===== Tilt Effect on Cards =====
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        gsap.to(card, {
            rotateX: rotateX,
            rotateY: rotateY,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 1000
        });
    });

    card.addEventListener('mouseleave', () => {
        gsap.to(card, {
            rotateX: 0, rotateY: 0,
            duration: 0.6, ease: 'elastic.out(1, 0.5)'
        });
    });
});

// ===== Button Ripple Effect =====
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        btn.style.setProperty('--x', x + '%');
        btn.style.setProperty('--y', y + '%');
    });
});

// ===== GSAP ScrollTrigger Animations =====

// Section title split text animation
document.querySelectorAll('.section-title').forEach(title => {
    const text = title.textContent;
    title.innerHTML = '';
    text.split('').forEach(char => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = char === ' ' ? '\u00A0' : char;
        title.appendChild(span);
    });

    ScrollTrigger.create({
        trigger: title,
        start: 'top 85%',
        onEnter: () => {
            gsap.to(title.querySelectorAll('.char'), {
                opacity: 1, y: 0, duration: 0.4,
                stagger: 0.03, ease: 'back.out(1.7)'
            });
            title.classList.add('animated');
        },
        once: true
    });
});

// Fade-up animations
document.querySelectorAll('[data-animate="fade-up"]').forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
        },
        opacity: 0, y: 40, duration: 0.8,
        ease: 'power3.out'
    });
});

// Scale-in animations
document.querySelectorAll('[data-animate="scale-in"]').forEach(el => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0, scale: 0.8, duration: 0.8,
        ease: 'back.out(1.7)'
    });
});

// Slide-in-left animations
document.querySelectorAll('[data-animate="slide-in-left"]').forEach((el, i) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
        },
        opacity: 0, x: -60, duration: 0.8,
        delay: i * 0.15, ease: 'power3.out'
    });
});

// Stagger animations for grid items
gsap.utils.toArray('.skills-categories .skill-category').forEach((el, i) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
        },
        opacity: 0, y: 50, duration: 0.7,
        delay: i * 0.1, ease: 'power3.out'
    });
});

gsap.utils.toArray('.projects-grid .project-card').forEach((el, i) => {
    gsap.set(el, { opacity: 1, visibility: 'visible' });
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none'
        },
        opacity: 0, y: 50, rotateY: 5, duration: 0.8,
        delay: i * 0.15, ease: 'power3.out'
    });
});

gsap.utils.toArray('.certs-grid .cert-card').forEach((el, i) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            toggleActions: 'play none none none'
        },
        opacity: 0, y: 30, scale: 0.9, duration: 0.6,
        delay: i * 0.08, ease: 'back.out(1.7)'
    });
});

// Counter animation
document.querySelectorAll('[data-animate="counter"]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const suffix = el.querySelector('.stat-number').textContent.replace(/[0-9]/g, '');

    ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        onEnter: () => {
            gsap.to(el, {
                duration: 2,
                ease: 'power2.out',
                onUpdate: function() {
                    const progress = this.progress();
                    const current = Math.round(target * progress);
                    el.querySelector('.stat-number').textContent = current + suffix;
                }
            });
        },
        once: true
    });
});

// ===== Navbar Scroll Effect =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== Mobile Navigation =====
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== Active Navigation on Scroll =====
const sections = document.querySelectorAll('section[id]');

function setActiveLink() {
    const scrollY = window.scrollY + 120;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (navLink) {
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLink.classList.add('active');
            } else {
                navLink.classList.remove('active');
            }
        }
    });
}

window.addEventListener('scroll', setActiveLink);

// ===== Smooth Scroll with GSAP =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                scrollTo: { y: target, offsetY: 80 },
                duration: 1.2,
                ease: 'power3.inOut'
            });
        }
    });
});

// ===== Parallax on Hero =====
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        if (heroContent) {
            heroContent.style.transform = `translateY(${scrolled * 0.25}px)`;
            heroContent.style.opacity = 1 - scrolled / 800;
        }
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.12}px)`;
        }
    }
});

// ===== Contact Form =====
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    if (!name || !email || !subject || !message) {
        showNotification('Please fill in all fields.', 'error');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="btn-text"><i class="fas fa-spinner fa-spin"></i> Sending...</span>';
    submitBtn.disabled = true;

    setTimeout(() => {
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 1500);
});

// ===== Notification =====
function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'none';
        gsap.to(notification, {
            opacity: 0, y: 20, duration: 0.4,
            onComplete: () => notification.remove()
        });
    }, 4000);
}

// ===== Fallback: ensure project cards are visible =====
setTimeout(() => {
    document.querySelectorAll('.project-card').forEach(card => {
        if (getComputedStyle(card).opacity === '0') {
            gsap.to(card, { opacity: 1, y: 0, duration: 0.5 });
        }
    });
}, 3000);

// ===== Skill Tags Stagger on Hover =====
document.querySelectorAll('.skill-category').forEach(category => {
    const tags = category.querySelectorAll('.skill-tag');
    category.addEventListener('mouseenter', () => {
        gsap.fromTo(tags, 
            { scale: 0.95 },
            { scale: 1, duration: 0.3, stagger: 0.03, ease: 'back.out(2)' }
        );
    });
});

// ===== Scroll Progress Indicator (Navbar line) =====
gsap.to('body', {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
            const progress = self.progress;
            document.documentElement.style.setProperty('--scroll-progress', progress);
        }
    }
});

// ===== Console Easter Egg =====
console.log(
    '%c Hey there! 👋 ',
    'background: linear-gradient(135deg, #6c63ff, #00d4aa); color: white; font-size: 16px; padding: 10px 14px; border-radius: 6px; font-weight: bold;'
);
console.log(
    '%c Looking at the source? Nice! Feel free to reach out — venugopal.dev7@gmail.com ',
    'color: #6c63ff; font-size: 12px; padding: 4px;'
);

// ===== Text Scramble Effect on Hover =====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#_~';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise(resolve => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 20);
            const end = start + Math.floor(Math.random() * 20);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0; i < this.queue.length; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.chars[Math.floor(Math.random() * this.chars.length)];
                    this.queue[i].char = char;
                }
                output += `<span class="scramble-char">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
}

// Apply scramble effect on project card titles
document.querySelectorAll('.project-info h3, .skill-category h3').forEach(el => {
    const originalText = el.textContent;
    const scrambler = new TextScramble(el);
    
    el.addEventListener('mouseenter', () => {
        scrambler.setText(originalText);
    });
});

// ===== Enhanced Particles - Mouse Interaction =====
let mouseParticleX = canvas.width / 2;
let mouseParticleY = canvas.height / 2;

canvas.parentElement.addEventListener('mousemove', (e) => {
    mouseParticleX = e.clientX;
    mouseParticleY = e.clientY;
});

// Override particle update to react to mouse
const originalUpdate = Particle.prototype.update;
Particle.prototype.update = function() {
    // Attract/repel from mouse
    const dx = mouseParticleX - this.x;
    const dy = mouseParticleY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < 150) {
        // Push particles away from cursor
        const force = (150 - dist) / 150;
        this.x -= (dx / dist) * force * 1.5;
        this.y -= (dy / dist) * force * 1.5;
    }
    
    this.x += this.speedX;
    this.y += this.speedY;
    
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    
    // Keep in bounds
    this.x = Math.max(0, Math.min(canvas.width, this.x));
    this.y = Math.max(0, Math.min(canvas.height, this.y));
};

// ===== Smooth Number Counter with Easing =====
function animateValue(el, start, end, duration, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = Math.floor(eased * (end - start) + start);
        el.textContent = current + suffix;
        if (progress < 1) {
            requestAnimationFrame(step);
        }
    };
    requestAnimationFrame(step);
}

// Reinforce counter with the smoother version
document.querySelectorAll('[data-animate="counter"]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'));
    const numEl = el.querySelector('.stat-number');
    const suffix = numEl.textContent.replace(/[0-9]/g, '');
    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateValue(numEl, 0, target, 2500, suffix);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(el);
});

// ===== Hero Illustration Float Animation =====
gsap.to('.hero-illustration', {
    y: -15,
    duration: 3,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
});

// Floating badges stagger
gsap.to('.about-float-badge', {
    y: -8,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
    stagger: 0.5
});

// ===== Reveal Animation for Hero Code Mini =====
gsap.from('.hero-code-mini', {
    opacity: 0,
    x: 40,
    duration: 1,
    delay: 2.5,
    ease: 'back.out(1.7)'
});

gsap.from('.hero-code-mini .code-line-mini', {
    opacity: 0,
    x: 20,
    duration: 0.5,
    stagger: 0.2,
    delay: 3,
    ease: 'power2.out'
});

// ===== Section Parallax Layers =====
gsap.utils.toArray('.section').forEach(section => {
    const bg = section.querySelector(':before');
    gsap.to(section, {
        scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        },
        backgroundPositionY: '30%',
        ease: 'none'
    });
});

// ===== Hover Sound Feedback (subtle visual pulse) =====
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('mouseenter', () => {
        gsap.fromTo(btn, 
            { boxShadow: '0 4px 20px rgba(108, 99, 255, 0.3)' },
            { boxShadow: '0 8px 40px rgba(108, 99, 255, 0.6), 0 0 60px rgba(108, 99, 255, 0.3)', 
              duration: 0.4, ease: 'power2.out' }
        );
    });
    btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { 
            boxShadow: '0 4px 20px rgba(108, 99, 255, 0.3)', 
            duration: 0.4 
        });
    });
});

// ===== SVG Icon Rotation on Scroll =====
gsap.utils.toArray('.skill-icon-wrapper').forEach(icon => {
    gsap.to(icon, {
        scrollTrigger: {
            trigger: icon,
            start: 'top 90%',
            end: 'top 50%',
            scrub: 1
        },
        rotate: 360,
        ease: 'none'
    });
});

// ===== Mouse Trail Glow Effect =====
let trailTimeout;
document.addEventListener('mousemove', (e) => {
    clearTimeout(trailTimeout);
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        left: ${e.clientX - 3}px;
        top: ${e.clientY - 3}px;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: rgba(108, 99, 255, 0.4);
        pointer-events: none;
        z-index: 99997;
        transition: all 0.8s ease;
    `;
    document.body.appendChild(trail);
    
    requestAnimationFrame(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(3)';
    });
    
    setTimeout(() => trail.remove(), 800);
});

// ===== Tech Stack Cards Stagger Animation =====
gsap.utils.toArray('.techstack-grid .tech-card').forEach((el, i) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 92%',
            toggleActions: 'play none none none'
        },
        opacity: 0, y: 40, scale: 0.85, duration: 0.5,
        delay: i * 0.05, ease: 'back.out(1.7)'
    });
});

// ===== Education Cards Animation =====
gsap.utils.toArray('.education-grid .edu-card').forEach((el, i) => {
    gsap.from(el, {
        scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none'
        },
        opacity: 0, y: 50, rotateX: 10, duration: 0.8,
        delay: i * 0.15, ease: 'power3.out'
    });
});

// ===== CV Card Pulse Animation =====
gsap.from('.cv-card', {
    scrollTrigger: {
        trigger: '.cv-card',
        start: 'top 85%',
        toggleActions: 'play none none none'
    },
    opacity: 0, scale: 0.9, duration: 1,
    ease: 'elastic.out(1, 0.5)'
});

// ===== Working Tags Stagger =====
gsap.from('.working-tag', {
    scrollTrigger: {
        trigger: '.currently-working',
        start: 'top 85%',
        toggleActions: 'play none none none'
    },
    opacity: 0, x: -20, duration: 0.4,
    stagger: 0.08, ease: 'power2.out'
});
