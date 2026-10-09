# Venugopal A — Portfolio

Personal portfolio for **Venugopal A** — Software Engineer specializing in
AI & Platform Engineering (backend, AI/ML, cloud-native infrastructure, CI/CD
automation, observability).

**Live site:** https://venugopal-14.github.io/portfolio/

## Design

A premium **light theme** — white / soft lavender background with purple and
blue accents, large elegant typography, and generous whitespace.

- Hero: content on the left, a hand-built **CSS/SVG illustration** on the right
  (laptop with code, plant, coffee cup, a "Build → Automate → Deploy → Repeat"
  stack, and a quote card). No personal photo, no monitoring-dashboard widgets.
- Featured Projects: four cards in a horizontal row on desktop.
- About Me + Tech Stack side by side.
- Experience timeline, Education & Certifications, Contact.
- Fully responsive (desktop / tablet / mobile) with reduced-motion fallbacks.

## Stack

Dependency-light static site:

- `index.html` — markup and content
- `style.css` — light theme, illustration, layout, responsive rules
- `script.js` — vanilla JS (scroll reveal, nav, mobile menu, contact form).
  No external animation library — animations are CSS-driven, so nothing breaks
  if a CDN is slow.

## ⚠️ CV download (action needed)

Both **Download CV** buttons (navbar + hero) point to **`Venugopal_A_CV.pdf`**
at the repo root. That file is **not committed yet**, so the download will 404
until you add it:

1. Copy your résumé PDF into this folder.
2. Rename it to exactly: `Venugopal_A_CV.pdf`
3. Commit it:
   ```bash
   git add Venugopal_A_CV.pdf
   git commit -m "Add resume PDF"
   ```

## Projects — ownership & status

Project cards stay visually clean; each **View Details** opens a case-study
modal with the full technical write-up.

| Project                 | Ownership                     | Status         |
|-------------------------|-------------------------------|----------------|
| DeployHub               | Enterprise (BT Group)         | Professional   |
| AutoOps AI              | Enterprise (BT Group)         | Professional   |
| PayPal AI Payment Agent | Personal / Hackathon          | In Development  |
| OpsMind AI              | Personal (links to repo)      | Completed      |

Enterprise (BT Group) projects are marked **"Internal"** — no public repo link,
no confidential internal architecture, credentials or customer data published.
Only OpsMind AI links to a public repository.

## Local preview

Static site — just open `index.html` in a browser. Or serve it:

```bash
npx serve .            # Node
python -m http.server  # Python
```

## Deploy (GitHub Pages)

Changes are on the `light-redesign` branch. After you review and approve:

```bash
git checkout main
git merge light-redesign
git push origin main
```

GitHub Pages redeploys automatically. If you see an old version, hard-refresh
(`Ctrl + Shift + R`) or open an incognito window — it's browser cache.
