# minakshee25.github.io

Personal portfolio for Minakshee Narayankar, Applied AI Engineer. It is a static site built with plain HTML, CSS and vanilla JS. There is no build step and no dependencies.

## Structure

```
index.html            the single page (content lives here)
404.html              not-found page
assets/css/styles.css design tokens, layout, light/dark themes
assets/js/main.js     theme toggle, nav, accordions, badge highlighting, copy email
assets/fonts/          self-hosted Fraunces, Inter Tight, JetBrains Mono (latin, SIL OFL)
assets/favicon.svg
assets/Minakshee_Narayankar_Resume.pdf
robots.txt, sitemap.xml, .nojekyll
```

## Preview locally

```bash
cd portfolio
python -m http.server 8080
# open http://localhost:8080
```

## Deploy to GitHub Pages

1. Create a **public** repo named exactly `Minakshee25.github.io` on the GitHub account `Minakshee25`.
2. Push the contents of this folder (not the folder itself) to the `main` branch:
   ```bash
   cd portfolio
   git init -b main
   git add .
   git commit -m "Launch portfolio"
   git remote add origin https://github.com/Minakshee25/Minakshee25.github.io.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages → Build and deployment**. Choose **Deploy from a branch**, then `main` and `/ (root)`.
4. The site goes live at `https://minakshee25.github.io/` within a minute or two.

If you deploy under a different repo name or a custom domain, update the URL in these places: `<link rel="canonical">`, `og:url` and the JSON-LD `url` in `index.html`, plus `robots.txt` and `sitemap.xml`.

## Things to fill in

- **Project links:** search `index.html` for `data-placeholder`. For each link, replace `href="#"` with the real URL and delete the `data-placeholder` attribute and the `<span class="soon">` badge.
- **Résumé:** replace `assets/Minakshee_Narayankar_Resume.pdf` and keep the same filename.
- **Skill tiers:** in the Skills section, each tag has a `tier-1` (shipped in production), `tier-2` (projects and research) or `tier-3` (working knowledge) class. Adjust these to match what you would defend in an interview.
- **Cross-highlighting:** any element with the same `data-tech="key"` lights up together on hover. A skill tag whose key also appears in Experience or Work becomes clickable and jumps there.
- **Social preview image (optional):** add a 1200×630 `assets/og-image.png`. Then add `<meta property="og:image" content="https://minakshee25.github.io/assets/og-image.png">` and change `twitter:card` to `summary_large_image`.
