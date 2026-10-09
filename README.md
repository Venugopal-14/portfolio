# Venugopal A — Portfolio

Personal portfolio for **Venugopal A** — Software Engineer specializing in
AI & Platform Engineering (backend, AI/ML, cloud-native infrastructure, CI/CD
automation, observability).

**Live site:** https://venugopal-14.github.io/portfolio/

## Stack

Plain, dependency-light static site:

- `index.html` — markup and content
- `style.css` — premium dark navy/cyan/violet theme, fully responsive
- `script.js` — progressive-enhancement interactions
- GSAP (loaded from CDN) is used only for animation **enhancement**

## Design principles

1. **Content-first / graceful degradation** — all text, buttons, and links are
   visible by default from HTML + CSS. JavaScript and GSAP only *enhance* with
   animation. If the GSAP CDN fails to load, or JS is disabled, the page still
   renders correctly (this was the original bug: the hero title and image were
   invisible because they depended entirely on JS).
2. **Accessibility** — respects `prefers-reduced-motion`, uses `:focus-visible`
   outlines, `aria-label`s, and keeps the custom cursor to fine-pointer devices.
3. **Honesty** — in-progress projects (DeployHub, PayPal AI Payment Agent,
   AutoOps AI) are clearly labelled **In Development**. No invented metrics,
   repos, or completed features.

## Adding a profile photo (optional)

The hero and about sections use a designed **"VA" initials avatar** so there is
never a broken image. If you want a real photo instead:

1. Add `profile.jpg` to this folder.
2. In `index.html`, replace the two `<div class="avatar ...">...</div>` blocks
   with `<img src="profile.jpg" alt="Venugopal A" class="hero-photo">` (and the
   about one with `class="about-photo"`), then add matching styles.

## Local preview

It's a static site — just open `index.html` in a browser. Or serve it:

```bash
# Node
npx serve .
# Python
python -m http.server 8000
```

## Deploy (GitHub Pages)

The repo is already published via GitHub Pages from the `main` branch. These
changes are on the `portfolio-upgrade` branch. After you review and approve:

```bash
git checkout main
git merge portfolio-upgrade
git push origin main
```

Do **not** push until you've reviewed the result and added the CV PDF.
