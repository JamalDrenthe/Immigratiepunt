---
version: alpha
name: Immigratiepunt-design
description: Warm-editorial interface for Immigratiepunt, a Dutch service that helps newcomers settle in the Netherlands and lets local helpers offer a postal address (postadres). Based on the Claude-style system from awesome-design-md: tinted cream canvas, coral primary, dark navy product surfaces, serif display headlines paired with a humanist sans body. The cream/coral pairing reads humanist and trustworthy — deliberately warm where government and NGO sites default to cool blue and slate.

colors:
  primary: "#cc785c"
  primary-active: "#a9583e"
  primary-disabled: "#e6dfd8"
  ink: "#141413"
  body: "#3d3d3a"
  body-strong: "#252523"
  muted: "#6c6a64"
  muted-soft: "#8e8b82"
  hairline: "#e6dfd8"
  hairline-soft: "#ebe6df"
  canvas: "#faf9f5"
  surface-soft: "#f5f0e8"
  surface-card: "#efe9de"
  surface-cream-strong: "#e8e0d2"
  surface-dark: "#181715"
  surface-dark-elevated: "#252320"
  surface-dark-soft: "#1f1e1b"
  on-primary: "#ffffff"
  on-dark: "#faf9f5"
  on-dark-soft: "#a09d96"
  accent-teal: "#5db8a6"
  accent-amber: "#e8a55a"
  success: "#5db872"
  warning: "#d4a017"
  error: "#c64545"

typography:
  display-xl: { fontFamily: "Cormorant Garamond, Garamond, serif", fontSize: 64px, fontWeight: 500, lineHeight: 1.05, letterSpacing: -1.5px }
  display-lg: { fontFamily: "Cormorant Garamond, Garamond, serif", fontSize: 48px, fontWeight: 500, lineHeight: 1.1, letterSpacing: -1px }
  display-md: { fontFamily: "Cormorant Garamond, Garamond, serif", fontSize: 36px, fontWeight: 500, lineHeight: 1.15, letterSpacing: -0.5px }
  display-sm: { fontFamily: "Cormorant Garamond, Garamond, serif", fontSize: 28px, fontWeight: 500, lineHeight: 1.2, letterSpacing: -0.3px }
  title-lg: { fontFamily: "Inter, sans-serif", fontSize: 22px, fontWeight: 500, lineHeight: 1.3 }
  title-md: { fontFamily: "Inter, sans-serif", fontSize: 18px, fontWeight: 500, lineHeight: 1.4 }
  title-sm: { fontFamily: "Inter, sans-serif", fontSize: 16px, fontWeight: 500, lineHeight: 1.4 }
  body-md: { fontFamily: "Inter, sans-serif", fontSize: 16px, fontWeight: 400, lineHeight: 1.55 }
  body-sm: { fontFamily: "Inter, sans-serif", fontSize: 14px, fontWeight: 400, lineHeight: 1.55 }
  caption: { fontFamily: "Inter, sans-serif", fontSize: 13px, fontWeight: 500, lineHeight: 1.4 }
  caption-uppercase: { fontFamily: "Inter, sans-serif", fontSize: 12px, fontWeight: 600, lineHeight: 1.4, letterSpacing: 1.5px }
  button: { fontFamily: "Inter, sans-serif", fontSize: 14px, fontWeight: 500, lineHeight: 1 }
  nav-link: { fontFamily: "Inter, sans-serif", fontSize: 14px, fontWeight: 500, lineHeight: 1.4 }

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px

spacing:
  section: 96px
  card: 32px

components:
  button-primary: coral fill, white text, 8px radius, 12x20px padding — the signature CTA
  button-secondary: cream fill, ink text, 1px hairline border
  button-secondary-on-dark: dark-elevated fill, cream text — never inverted to light on dark
  text-link: coral inline link
  top-nav: 64px cream bar; star-mark + serif wordmark left, nav links, coral CTA right
  feature-card: surface-card cream fill, 12px radius, 32px padding, icon top, serif title
  dark-band: surface-dark fill for process/data sections — contrast rhythm against cream
  callout-card-coral: full-bleed coral card, white type — reserved for the postadres program highlight and pre-footer CTA
  pricing/earnings-card: canvas fill + hairline border; featured tier flips to dark
  category-tab: transparent muted; active = surface-card fill + ink
  badge-pill: surface-card fill, 13px caption; badge-coral: coral fill, uppercase caption
  footer: surface-dark, on-dark-soft text, never inverts
---

## Overview

Immigratiepunt.nl is a warm, editorial interface. The base atmosphere is a **tinted cream canvas** (#faf9f5) — warm and human, not the cool gray-white of a generic SaaS or the cold blue of a government portal. Headlines run a serif display face (Cormorant Garamond, weight 500, negative letter-spacing) paired with Inter body sans — the site reads like a considered publication, not a marketing template.

Brand voltage comes from the **cream + coral pairing** — coral (#cc785c) is the signature accent, used on every primary CTA, the wordmark "punt" syllable, and on full-bleed callout cards (the postadres program highlight and the pre-footer CTA). The coral is warm and slightly muted — never cyan or blue.

Three surface modes alternate band by band:

1. **Cream canvas** — default body floor
2. **Light cream cards** (#efe9de) — feature/service cards
3. **Dark navy surfaces** (#181715) — the "how it works" band, the hero mockup card, the footer

The cream-to-dark contrast is the page's pacing rhythm: cream → cream-card → dark → cream → coral-callout → dark-footer.

## Logo

The mark is a **four-spoke compass star** (a "punt" rendered as a point on a map/compass) in coral (#cc785c), drawn as an inline SVG. It sits left of the serif wordmark "Immigratiepunt" where the "punt" syllable is set in coral. On dark surfaces the mark stays coral; the wordmark switches to cream. The mark is also the favicon.

## Typography

- Display headlines (h1/h2/section heads): Cormorant Garamond, weight 500, negative letter-spacing. Never bold — bigger serif before bolder weight.
- Body, nav, buttons, labels, captions: Inter 400/500 — humanist, never geometric.
- Numeric earnings figures ("€0,50", "€5,00") may run in the serif display face at display-sm for editorial emphasis.

## Layout

- Max content width ~1200px centered; section rhythm 96px vertical padding.
- Hero uses a 6/6 grid: serif h1 + sub + button row left, a dark product-mockup card right.
- Feature/service cards: 3-up or 4-up desktop, 1-up mobile, cream-card fill, 32px padding.
- Earnings cards on the postadres page: 3-up, featured tier dark.

## Do's and Don'ts

- Do anchor every page on the cream canvas. Pure white reads as "any other site".
- Do keep coral scarce on elements, generous on full-bleed callout cards.
- Do keep the postadres explanation explicit: a postadres is NOT a residential registration (woonadres) — say it plainly, it is the program's core trust claim.
- Don't use cool blue, cyan, or slate as brand color.
- Don't bold the serif display weight.
- Don't add hover styling beyond darkening the primary on press.
- Don't repeat the same surface mode in two consecutive bands.
