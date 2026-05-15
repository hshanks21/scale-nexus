# Scale-Nexus Design System

> **Status:** Draft — design phase
> **Last updated:** 2026-05-15

---

## Concept

Scale-Nexus is a document repository and knowledge graph for Scale agents. It has two distinct design zones:

1. **Document browsing** — Wired editorial aesthetic (strict black-and-white, serif display, magazine grid). This is where users scan categories, filter documents, and browse the catalog.
2. **Document content** — Light, clean, financial-dashboard aesthetic (Origin-style). White canvas, soft gray cards, rounded corners, minimal chrome. This is where users read and interact with a document.

The split is intentional: the browsing experience is editorial and authoritative; the reading experience is calm and focused.

---

## Design Zones

| Zone | Aesthetic | Mood |
|------|-----------|------|
| Document listing, categories, search | Wired editorial | Magazine, black-and-white, serif display headlines |
| Document content, viewer, metadata | Origin (light fintech) | Calm, white, rounded cards, light gray surfaces |

---

## Color System

### Zone 1 — Wired (Document Browsing)

Black-and-white editorial palette. No chromatic accent except the inline link blue (`#057dbc`).

| Token | Hex | Use |
|-------|-----|-----|
| `wired-ink` | `#000000` | Wordmark, headlines, CTAs, footer |
| `wired-canvas` | `#ffffff` | Page background |
| `wired-canvas-soft` | `#f5f5f5` | Hover states, rare tints |
| `wired-hairline` | `#e0e0e0` | 1 px dividers between story rows |
| `wired-body` | `#757575` | Bylines, timestamps, secondary metadata |
| `wired-link` | `#057dbc` | Inline body links inside articles only |

### Zone 2 — Origin (Document Content)

Light fintech palette. White canvas, soft gray surfaces, minimal black accents.

| Token | Hex | Use |
|-------|-----|-----|
| `origin-canvas` | `#ffffff` | Page background |
| `origin-surface` | `#f8f8f8` | Card backgrounds |
| `origin-border` | `#e5e5e5` | Card borders, dividers |
| `origin-ink` | `#1a1a1a` | Headings, primary text |
| `origin-body` | `#6b6b6b` | Secondary text, metadata |
| `origin-accent` | `#2563eb` | Interactive elements, selected states |

### Semantic Mapping (CSS variables)

```css
:root {
  /* Wired zone */
  --color-wired-ink: #000000;
  --color-wired-canvas: #ffffff;
  --color-wired-canvas-soft: #f5f5f5;
  --color-wired-hairline: #e0e0e0;
  --color-wired-body: #757575;
  --color-wired-link: #057dbc;

  /* Origin zone */
  --color-origin-canvas: #ffffff;
  --color-origin-surface: #f8f8f8;
  --color-origin-border: #e5e5e5;
  --color-origin-ink: #1a1a1a;
  --color-origin-body: #6b6b6b;
  --color-origin-accent: #2563eb;
  --color-origin-selected: rgba(37, 99, 235, 0.08);
}
```

---

## Typography

### Zone 1 — Wired

Three-face system. Serif for narrative, sans for structure.

| Token | Font | Size | Weight | Line-height | Tracking | Use |
|-------|------|------|--------|-------------|---------|-----|
| `wired-display-hero` | Playfair Display | 64px | 400 | 59.5px | -0.5px | Cover story headline |
| `wired-display-lg` | Playfair Display | 48px | 400 | 50.4px | -0.4px | Major section headlines |
| `wired-display-md` | Playfair Display | 32px | 400 | 35.2px | -0.3px | Story card large |
| `wired-body-serif` | Lora | 17px | 400 | 27px | 0 | Article body, bylines |
| `wired-body` | Inter | 14px | 400 | 20px | 0 | Metadata, captions |
| `wired-label` | Inter | 14px | 700 | 18px | 0.4px | Category eyebrows, nav |
| `wired-button` | Inter | 16px | 700 | 20px | 0.3px | Button labels |

**Font substitutes (open-source approximations):**
- WiredDisplay → **Playfair Display** (high-contrast didone serif)
- BreveText → **Lora** (humanist serif for body)
- Apercu → **Inter** (humanist sans for UI/labels)

### Zone 2 — Origin

Clean sans-serif system. Inter for all text — single family, hierarchy from size/weight.

| Token | Size | Weight | Line-height | Use |
|-------|------|--------|-------------|-----|
| `origin-heading` | 20px | 600 | 28px | Card titles, section headings |
| `origin-body` | 15px | 400 | 22px | Default body text |
| `origin-caption` | 13px | 400 | 18px | Metadata, timestamps |
| `origin-label` | 12px | 500 | 16px | Eyebrow labels, badges |
| `origin-button` | 14px | 600 | 20px | Button labels |

---

## Layout

### Document Browser (Wired zone)

```
┌─────────────────────────────────────────────────────────┐
│ MASTHEAD BAND — wordmark centred, section nav flanks   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  HERO BAND — large display headline                    │
│  "Document Repository" in wired-display-hero            │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────┐  ┌─────────────────┐               │
│  │  FEATURE CARD   │  │  SECONDARY CARD │               │
│  │  (large photo)  │  │  (4:3 thumbnail)│               │
│  └─────────────────┘  └─────────────────┘               │
│                                                         │
│  ─────────────────────────────────────────  (hairline)  │
│  STORY ROW — byline + headline + category eyebrow      │
│  ─────────────────────────────────────────  (hairline)  │
│  STORY ROW — byline + headline + category eyebrow      │
│  ...                                                   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Structure:**
- Masthead band: thin black strip, wordmark centred, no decoration
- Hero band: 48px vertical padding, display headline
- Magazine grid: 1 hero card + 2-up secondary cards
- Story row stack: full-width single column, hairline dividers, bylined rows
- Container max-width: ~1400px

### Document Content (Origin zone)

```
┌─────────────────────────────────────────────────────────┐
│ TOPBAR — back arrow, document title, actions            │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │  DOCUMENT CARD — rounded, soft border, white    │   │
│  │  Document title (origin-heading)                 │   │
│  │  Metadata strip — category, date, author        │   │
│  │                                                  │   │
│  │  [PDF viewer or markdown content]              │   │
│  │                                                  │   │
│  └──────────────────────────────────────────────────┘   │
│                                                         │
│  RELATED DOCUMENTS — horizontal scroll cards           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Structure:**
- White canvas background
- Content in rounded cards with soft border
- Section padding 24px
- Cards: 16px padding, 8px border-radius

---

## Components

### Buttons

**Wired zone — square (rounded: none):**
```css
/* Primary CTA — black fill, white text, 0px radius */
.wired-btn-primary {
  background: #000000;
  color: #ffffff;
  border-radius: 0;
  padding: 12px 20px;
  font: 700 16px/20px Inter;
  letter-spacing: 0.3px;
}

/* Outline — white fill, black border, 0px radius */
.wired-btn-outline {
  background: #ffffff;
  color: #000000;
  border: 1px solid #000000;
  border-radius: 0;
  padding: 12px 20px;
}
```

**Origin zone — rounded:**
```css
/* Primary — accent fill, rounded */
.origin-btn-primary {
  background: #2563eb;
  color: #ffffff;
  border-radius: 8px;
  padding: 10px 16px;
  font: 600 14px/20px Inter;
}

/* Ghost — transparent, accent text */
.origin-btn-ghost {
  background: transparent;
  color: #2563eb;
  border-radius: 8px;
  padding: 10px 16px;
}
```

### Cards

**Wired story card:**
- Background: `#ffffff`
- Border: none (lives on canvas, photo does the work)
- Padding: 16px
- Shape: `rounded: none` (square)

**Origin document card:**
- Background: `#ffffff`
- Border: 1px solid `#e5e5e5`
- Border-radius: 8px
- Padding: 24px
- Shadow: none (surface contrast only)
- Hover: background `#f8f8f8`

### Navigation

**Wired zone — masthead:**
- Background: `#ffffff`
- Wordmark: black, Playfair Display 24px
- Nav links: Inter 14px, `#000000`, uppercase
- Hairline bottom border

**Origin zone — topbar:**
- Background: `#ffffff`
- Border-bottom: 1px solid `#e5e5e5`
- Back arrow + document title + action icons

### Document List (Wired story rows)

```
┌─────────────────────────────────────────────────────┐
│ [EYEBROW]  category — Inter 12px uppercase          │
│ Headline in Playfair Display 24px                   │
│ By Author Name · May 14, 2026 — Lora 14px           │
└─────────────────────────────────────────────────────┘
  1px hairline divider (#e0e0e0)
```

---

## Shapes

| Token | Value | Use |
|-------|-------|-----|
| `wired-rounded-none` | 0px | All Wired zone interactive elements |
| `origin-rounded-sm` | 4px | Small tags, badges |
| `origin-rounded` | 8px | Cards, buttons, inputs |
| `origin-rounded-full` | 9999px | Avatar circles only |

---

## Spacing

Base unit: 4px.

| Token | Value | Use |
|-------|-------|-----|
| `spacing-xs` | 4px | Tight icon gaps |
| `spacing-sm` | 8px | Standard internal gap |
| `spacing-md` | 12px | Card internal padding |
| `spacing-lg` | 16px | Section rhythm |
| `spacing-xl` | 24px | Card padding |
| `spacing-2xl` | 32px | Section break |
| `spacing-4xl` | 48px | Hero band padding |

---

## Elevation

**Wired zone:** No shadows. Hairlines carry hierarchy.

| Level | Treatment |
|-------|-----------|
| 0 — Flat | Default — no shadow, no border |
| 1 — Hairline | 1px `#e0e0e0` divider |

**Origin zone:** Surface contrast + subtle border.

| Level | Treatment |
|-------|-----------|
| 0 — Flat | White canvas |
| 1 — Card | `#ffffff` bg, 1px `#e5e5e5` border, 8px radius |
| 2 — Elevated | `#ffffff` bg, subtle shadow (0 2px 8px rgba(0,0,0,0.06)) |

---

## Dark Mode

Not in scope for v1. Light mode only.

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Two-zone design | Wired for browsing, Origin for content | Each zone optimized for its task: scan vs. read |
| Square corners in Wired | `rounded: none` | Magazine brand identity — non-negotiable |
| Rounded corners in Origin | `rounded: 8px` | Modern fintech feel — approachable, clean |
| Playfair Display (Wired) | Open-source substitute | No proprietary WiredDisplay font available |
| Inter (Origin) | Google Fonts | Clean, professional, widely supported |
| No drop shadows (Wired) | Hairlines only | Wired brand rule — no soft shadows |
| No chromatic accent (Wired) | Black/white only | Editorial magazine identity |
| White canvas (Origin) | Light palette | Calm reading environment |

---

## Schema Strategy

Protobuf is used **only as a schema design artifact** — not as runtime serialization. The  file generates TypeScript types at build time via . The runtime API format is REST JSON, and MongoDB stores documents as JSON. No protobuf wire format is used at runtime.

## Schema Strategy

Protobuf is used only as a schema design artifact — not as runtime serialization. The proto file generates TypeScript types at build time via proto-loader. The runtime API format is REST JSON, and MongoDB stores documents as JSON. No protobuf wire format is used at runtime.

## Source

- Browsing aesthetic: Wired ( Condé Nast) — editorial design spec from design audit
- Content aesthetic: Origin (fintech dashboard) — document listing reference
- Font substitutes: Playfair Display (Wired), Lora (BreveText), Inter (Apercu)

---

## Schema Strategy

Protobuf is used **only as a schema design artifact** — not as runtime serialization.
-  generates TypeScript types at build time via 
- REST JSON is the runtime API format
- MongoDB stores documents as JSON
- No protobuf wire format at runtime

---

## Schema Strategy

Protobuf is used **only as a schema design artifact** — not as runtime serialization.
-  generates TypeScript types at build time via 
- REST JSON is the runtime API format
- MongoDB stores documents as JSON
- No protobuf wire format at runtime
---
## Schema Strategy

Protobuf is used only as a schema design artifact — not as runtime serialization.
- nexus.proto generates TypeScript types at build time via proto-loader
- REST JSON is the runtime API format
- MongoDB stores documents as JSON
- No protobuf wire format at runtime


---

## Schema Strategy

Protobuf is used only as a schema design artifact — not as runtime serialization.
- nexus.proto generates TypeScript types at build time via proto-loader
- REST JSON is the runtime API format
- MongoDB stores documents as JSON
- No protobuf wire format at runtime
