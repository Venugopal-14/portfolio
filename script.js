// ===== Capability flags =====
// The whole point: the site must look correct even if GSAP (CDN) never loads.
// Content is visible by default via CSS; JS only ENHANCES it.
const HAS_GSAP = typeof window.gsap !== 'undefined';
const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const CAN_ANIMATE = HAS_GSAP && !PREFERS_REDUCED_MOTION;
const FINE_POINTER = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (CAN_ANIMATE) {
    try {
        gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
    } catch (e) { /* plugins unavailable; degrade gracefully */ }
}

// ===== Loader =====
(function handleLoader() {
    const loader = document.getElementById('loader');
    if (!loader) return;
    const hide = () => loader.classList.add('hidden');
    // Hide shortly after load; never leave the page covered.
    window.addEventListener('load', () => setTimeout(hide, CAN_ANIMATE ? 700 : 150));
    // Absolute safety net in case 'load' already fired or is delayed.
    setTimeout(hide, 2500);
})();

// ===== Custom Cursor (desktop fine-pointer only) =====
if (FINE_POINTER && HAS_GSAP) {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    if (cursor && follower) {
        let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX; mouseY = e.clientY;
            gsap.to(cursor, { x: mouseX - 4, y: mouseY - 4, duration: 0.1 });
        });
        (function animateFollower() {
            followerX += (mouseX - followerX - 20) * 0.1;
            followerY += (mouseY - followerY - 20) * 0.1;
            follower.style.transform = `translate(${followerX}px, ${followerY}px)`;
            requestAnimationFrame(animateFollower);
        })();
        document.querySelectorAll('a, button, [data-magnetic]').forEach(el => {
            el.addEventListener('mouseenter', () => { cursor.classList.add('active'); follower.classList.add('active'); });
            el.addEventListener('mouseleave', () => { cursor.classList.remove('active'); follower.classList.remove('active'); });
        });
    }
}

// ===== Magnetic Effect (enhancement) =====
if (CAN_ANIMATE && FINE_POINTER) {
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
}

// ===== Particle System (skipped on reduced-motion) =====
if (!PREFERS_REDUCED_MOTION) {
    const canvas = document.getElementById('particles-canvas');
    if (canvas && canvas.getContext) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouseParticleX = window.innerWidth / 2;
        let mouseParticleY = window.innerHeight / 2;

        const resizeCanvas = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resizeCanvas();
        window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
        window.addEventListener('mousemove', (e) => { mouseParticleX = e.clientX; mouseParticleY = e.clientY; });

        class Particle {
            constructor() { this.reset(); }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
                this.color = Math.random() > 0.5 ? '79, 140, 255' : '34, 211, 238';
            }
            update() {
                const dx = mouseParticleX - this.x;
                const dy = mouseParticleY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150 && dist > 0) {
                    const force = (150 - dist) / 150;
                    this.x -= (dx / dist) * force * 1.2;
                    this.y -= (dy / dist) * force * 1.2;
                }
                this.x += this.speedX; this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
                this.x = Math.max(0, Math.min(canvas.width, this.x));
                this.y = Math.max(0, Math.min(canvas.height, this.y));
            }
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            const count = Math.min(70, Math.floor(window.innerWidth / 18));
            particles = [];
            for (let i = 0; i < count; i++) particles.push(new Particle());
        }
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(79, 140, 255, ${0.08 * (1 - d / 120)})`;
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
            requestAnimationFrame(animateParticles);
        }
        initParticles();
        animateParticles();
    }
}

// ===== Typing Effect (plain JS; no GSAP dependency) =====
(function initTyping() {
    const typingEl = document.querySelector('.typing-text');
    if (!typingEl) return;
    // On reduced motion, keep the static title already in the HTML.
    if (PREFERS_REDUCED_MOTION) return;

    const titles = [
        'Software Engineer',
        'AI & Platform Engineer',
        'Backend Developer',
        'AIOps & Automation Builder',
        'Python · FastAPI · Django'
    ];
    let titleIndex = 0, charIndex = titles[0].length, isDeleting = false;

    function type() {
        const current = titles[titleIndex];
        charIndex += isDeleting ? -1 : 1;
        typingEl.textContent = current.substring(0, charIndex);
        let speed = isDeleting ? 35 : 70;
        if (!isDeleting && charIndex === current.length) { speed = 2000; isDeleting = true; }
        else if (isDeleting && charIndex === 0) { isDeleting = false; titleIndex = (titleIndex + 1) % titles.length; speed = 400; }
        setTimeout(type, speed);
    }
    setTimeout(type, 2200);
})();

// ===== Hero entrance (enhancement only; content already visible) =====
if (CAN_ANIMATE) {
    try {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.hero-greeting', { opacity: 0, y: 20, duration: 0.5, delay: 0.3 })
          .from('.hero-name', { opacity: 0, y: 24, duration: 0.6 }, '-=0.2')
          .from('.hero-title', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
          .from('.hero-tagline', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
          .from('.hero-description', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
          .from('.hero-buttons', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
          .from('.hero-socials', { opacity: 0, y: 16, duration: 0.5 }, '-=0.3')
          .from('.scroll-indicator', { opacity: 0, duration: 0.6 }, '-=0.2')
          .from('.hero-visual', { opacity: 0, scale: 0.9, duration: 0.8 }, '-=1.2');
    } catch (e) { /* ignore */ }
}

// ===== Tilt Effect (enhancement) =====
if (CAN_ANIMATE && FINE_POINTER) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const rotateX = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -4;
            const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 4;
            gsap.to(card, { rotateX, rotateY, duration: 0.4, ease: 'power2.out', transformPerspective: 1000 });
        });
        card.addEventListener('mouseleave', () => {
            gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' });
        });
    });
}

// ===== ScrollTrigger reveal animations (enhancement) =====
if (CAN_ANIMATE && typeof ScrollTrigger !== 'undefined') {
    try {
        const reveal = (selector, vars) => {
            gsap.utils.toArray(selector).forEach((el, i) => {
                gsap.from(el, Object.assign({
                    scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none none' },
                    delay: (i % 6) * 0.08
                }, vars));
            });
        };
        reveal('[data-animate="fade-up"]', { opacity: 0, y: 40, duration: 0.7 });
        reveal('[data-animate="scale-in"]', { opacity: 0, scale: 0.9, duration: 0.7, ease: 'back.out(1.5)' });
        reveal('[data-animate="slide-in-left"]', { opacity: 0, x: -50, duration: 0.7 });
        reveal('.tech-card', { opacity: 0, y: 30, scale: 0.9, duration: 0.5, ease: 'back.out(1.5)' });
        reveal('.project-card', { opacity: 0, y: 40, duration: 0.6 });
        reveal('.cert-card', { opacity: 0, y: 24, duration: 0.5 });
        reveal('.edu-card', { opacity: 0, y: 40, duration: 0.7 });
    } catch (e) { /* ignore */ }
}

// ===== Counter animation (plain JS via IntersectionObserver; no GSAP needed) =====
(function initCounters() {
    const counters = document.querySelectorAll('[data-animate="counter"]');
    if (!counters.length) return;

    const run = (el) => {
        const numEl = el.querySelector('.stat-number');
        if (!numEl) return;
        const target = parseInt(el.getAttribute('data-count'), 10) || 0;
        const suffix = el.getAttribute('data-suffix') || '';
        if (PREFERS_REDUCED_MOTION) { numEl.textContent = target + suffix; return; }
        const duration = 1800;
        let startTs = null;
        const step = (ts) => {
            if (!startTs) startTs = ts;
            const progress = Math.min((ts - startTs) / duration, 1);
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            numEl.textContent = Math.floor(eased * target) + suffix;
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    if ('IntersectionObserver' in window) {
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { run(entry.target); observer.unobserve(entry.target); }
            });
        }, { threshold: 0.4 });
        counters.forEach(c => obs.observe(c));
    } else {
        counters.forEach(run);
    }
})();

// ===== Navbar scroll effect =====
(function navbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    onScroll();
})();

// ===== Mobile navigation =====
(function mobileNav() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    if (!navToggle || !navMenu) return;
    navToggle.addEventListener('click', () => {
        const open = navToggle.classList.toggle('active');
        navMenu.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', String(open));
    });
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        });
    });
})();

// ===== Active nav link on scroll =====
(function activeNav() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;
    const onScroll = () => {
        const scrollY = window.scrollY + 120;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const link = document.querySelector(`.nav-link[href="#${section.id}"]`);
            if (link) link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        });
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
})();

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href.length < 2) return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        if (CAN_ANIMATE && typeof gsap.plugins !== 'undefined') {
            try { gsap.to(window, { scrollTo: { y: target, offsetY: 80 }, duration: 1, ease: 'power3.inOut' }); return; }
            catch (err) { /* fall through to native */ }
        }
        target.scrollIntoView({ behavior: PREFERS_REDUCED_MOTION ? 'auto' : 'smooth', block: 'start' });
    });
});

// ===== Contact form (client-side demo) =====
(function contactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = new FormData(form);
        const name = data.get('name'), email = data.get('email'),
              subject = data.get('subject'), message = data.get('message');
        if (!name || !email || !subject || !message) { showNotification('Please fill in all fields.', 'error'); return; }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showNotification('Please enter a valid email address.', 'error'); return; }

        const btn = form.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '<span class="btn-text"><i class="fas fa-spinner fa-spin"></i> Sending...</span>';
        btn.disabled = true;
        setTimeout(() => {
            showNotification("Message sent! I'll get back to you soon.", 'success');
            form.reset();
            btn.innerHTML = original;
            btn.disabled = false;
        }, 1200);
    });
})();

function showNotification(message, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    const n = document.createElement('div');
    n.className = `notification notification-${type}`;
    n.innerHTML = `<i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i><span></span>`;
    n.querySelector('span').textContent = message;
    document.body.appendChild(n);
    setTimeout(() => {
        n.style.transition = 'opacity 0.4s, transform 0.4s';
        n.style.opacity = '0';
        n.style.transform = 'translateY(20px)';
        setTimeout(() => n.remove(), 400);
    }, 4000);
}

// ===== Console note =====
console.log('%c Hey there! 👋  venugopal.dev7@gmail.com ',
    'background: linear-gradient(135deg, #4f8cff, #22d3ee); color: #061018; font-size: 14px; padding: 8px 12px; border-radius: 6px; font-weight: bold;');
