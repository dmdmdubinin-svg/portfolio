# DUBININ — Portfolio

English portfolio for freelance clients: landing pages, Shopify/WordPress stores, Telegram bots, and automations.

**Live demos**
- [North Rim Tyres](demos/tyre-shop/) — service site + booking form
- [Lumen Atelier](demos/boutique/) — boutique storefront + cart
- [DeskBot](demos/booking-bot/) — Telegram booking bot simulator

## Run locally

```bash
# from this folder
npx --yes serve -l 4173
```

Open `http://localhost:4173`

## Contact overrides

Append query params to the homepage:

`?tg=your_username&email=you@mail.com`

## GitHub Pages

This repo is intended for GitHub Pages from the `master` branch root (`/`).

After push: **Settings → Pages → Deploy from branch → master / (root)**.

Site URL will be:

`https://dmdmdubinin-svg.github.io/portfolio/`

(or `https://dmdmdubinin-svg.github.io/` if published from a `*.github.io` repo)

## Stack

Static HTML/CSS/JS. No build step.
