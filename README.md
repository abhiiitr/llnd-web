# Laboratory of Lipids and Neurological Diseases

Single-page website for the Singh Lab at Baylor College of Medicine / Texas Children's Hospital.

## Stack

Static HTML · CSS · Vanilla JS — no build step required. Drop onto any static host (Netlify, Vercel, GitHub Pages, S3).

## Structure

```
index.html      — single-page site
styles.css      — editorial-scientific dark theme
app.js          — animations (bilayer SVG, particle canvas, scroll reveals, tweaks panel)
assets/         — research figures + team photos
```

## Running locally

```bash
npx serve .
# or
python3 -m http.server 8080
```

## Deploying

Push to GitHub and connect the repo to Netlify / Vercel for instant deploys. No configuration needed.

## To do

- Add photos for Shubham Singh (PI), Jyotsna Shukla, and Femil J. Shajan as `assets/team-{shubham,jyotsna,femil}.jpg`
- Replace the SVG brand mark in the nav with a lab logo if available
- Update publication list as new papers are published
