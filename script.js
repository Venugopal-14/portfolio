// Light-theme portfolio — vanilla JS, no external animation library.
// All content is visible from HTML + CSS; JS only adds reveal + interactivity.
(function () {
    'use strict';

    const PREFERS_REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ===== Scroll reveal =====
    (function reveal() {
        const items = document.querySelectorAll('[data-animate]');
        if (!items.length) return;
        if (PREFERS_REDUCED_MOTION || !('IntersectionObserver' in window)) {
            items.forEach(el => el.classList.add('in-view'));
            return;
        }
        const obs = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        items.forEach(el => obs.observe(el));
    })();

    // ===== Navbar scroll state =====
    (function navbar() {
        const nav = document.getElementById('navbar');
        if (!nav) return;
        const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    })();

    // ===== Mobile menu =====
    (function mobileNav() {
        const toggle = document.getElementById('nav-toggle');
        const menu = document.getElementById('nav-menu');
        if (!toggle || !menu) return;
        toggle.addEventListener('click', () => {
            const open = toggle.classList.toggle('active');
            menu.classList.toggle('active', open);
            toggle.setAttribute('aria-expanded', String(open));
        });
        menu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    })();

    // ===== Active nav link on scroll =====
    (function activeNav() {
        const sections = document.querySelectorAll('section[id]');
        const links = document.querySelectorAll('.nav-link');
        if (!sections.length || !links.length) return;
        const onScroll = () => {
            const y = window.scrollY + 140;
            let current = '';
            sections.forEach(s => { if (y >= s.offsetTop) current = s.id; });
            links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    })();

    // ===== Contact form (client-side demo) =====
    (function contactForm() {
        const form = document.getElementById('contact-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = new FormData(form);
            const email = (data.get('email') || '').toString();
            if (!data.get('name') || !email || !data.get('subject') || !data.get('message')) {
                notify('Please fill in all fields.', 'error'); return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                notify('Please enter a valid email address.', 'error'); return;
            }
            const btn = form.querySelector('button[type="submit"]');
            const original = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            btn.disabled = true;
            setTimeout(() => {
                notify("Message sent! I'll get back to you soon.", 'success');
                form.reset();
                btn.innerHTML = original;
                btn.disabled = false;
            }, 1100);
        });
    })();

    function notify(message, type) {
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        const n = document.createElement('div');
        n.className = 'notification notification-' + type;
        n.innerHTML = '<i class="fas ' + (type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle') + '"></i><span></span>';
        n.querySelector('span').textContent = message;
        document.body.appendChild(n);
        setTimeout(() => {
            n.style.transition = 'opacity 0.4s, transform 0.4s';
            n.style.opacity = '0';
            n.style.transform = 'translateY(16px)';
            setTimeout(() => n.remove(), 400);
        }, 4000);
    }

    console.log('%c Hey! 👋  venugopal.dev7@gmail.com ',
        'background: linear-gradient(135deg,#7c5cfc,#4f7cf7); color:#fff; font-size:13px; padding:8px 12px; border-radius:6px; font-weight:bold;');
})();
