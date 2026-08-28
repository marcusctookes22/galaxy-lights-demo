# Galaxy Car Lights Demo

A lightweight static GitHub Pages demo for Galaxy Car Lights.

## Production structure

- `index.html` — semantic page content and metadata
- `styles.css` — core responsive visual system
- `hero.css` — render-blocking hero presentation; no runtime style injection
- `app.js` — navigation, FAQ, starlight studio, canvas effects, and quote-summary behavior
- `galaxy-logo.webp` — approved Galaxy Car Lights logo used directly by the markup
- `hero-luxury.webp` — local optimized luxury-car hero asset

The demo intentionally avoids build tooling, runtime HTML fragments, runtime logo swapping, dynamically injected hero styles, stacked theme patches, and translation layers so it can deploy reliably on GitHub Pages.
