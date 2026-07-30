# DUBININ — freelance portfolio

A conversion-focused, English-first portfolio for freelance clients: landing pages,
Shopify/WooCommerce stores, Telegram bots and automations.

**Live:** https://dmdmdubinin-svg.github.io/portfolio/

## Live demos

| Demo | What it proves |
| --- | --- |
| [North Rim Tyres](demos/tyre-shop/) | Service site with a validated booking form |
| [Lumen Atelier](demos/boutique/) | Storefront with a cart that survives reloads |
| [DeskBot](demos/booking-bot/) | Telegram-style booking bot writing leads to a sheet |

## Before you share the link

Two things are placeholders — set them once and every call to action updates.

1. **Contact.** Open `main.js` and fill the config block at the top:

```js
const CONTACT = {
  telegram: "your_handle",
  email: "you@mail.com",
};
```

   To preview without editing files, append query params:
   `?tg=your_handle&email=you@mail.com`

   If both stay empty, the brief builder still works — it just tells visitors to
   copy the brief and paste it into the freelance platform instead.

2. **Prices.** The `#pricing` section in `index.html` uses starting figures
   ($250 / $400 / $200 / $80). Replace them with your own numbers before sending
   the link to clients.

## Run locally

```bash
npx --yes serve -l 4173
```

Then open `http://localhost:4173`.

## How it is built to sell

- Hero states the offer, the speed and the risk profile above the fold
- Live demos instead of screenshots — visitors can test the flows themselves
- Price anchors so clients self-qualify before writing to you
- A "why this is low-risk" block that answers the no-track-record objection head on
- FAQ written around real objections (reviews, speed, AI usage, ownership)
- Brief builder that turns four fields into a ready-to-send message
- Every demo page links back to the quote form

## Stack

Static HTML, CSS and vanilla JS. No build step, no dependencies, no tracking.

## Files

```
index.html          landing page
styles.css          design system + layout
main.js             nav, reveal, parallax, brief builder
404.html            GitHub Pages fallback
robots.txt          crawl rules
sitemap.xml         single-page sitemap
assets/og.svg       social preview card
demos/              three working demo builds
```
