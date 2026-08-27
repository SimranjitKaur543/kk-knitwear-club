# K.K. Knitwear Club — website

A B2B website for a polyester and knitted fabric manufacturer in Ludhiana.
Plain HTML, CSS and JavaScript. No framework, no build step, no database.

**What a buyer does:**
browse or search → filter by GSM, width, construction or application →
shortlist → compare side by side → send one enquiry.

> **This is a demo.** There is no back end. The enquiry form validates,
> composes the message and hands it to WhatsApp or the buyer's email client.
> Nothing is stored or submitted anywhere.

---

## Files

| File | What it is |
|---|---|
| `index.html` | Home — range overview, categories, selected fabrics |
| `products.html` | Catalogue — search, filters, sorting, product grid |
| `product.html` | **One** page that shows **every** fabric |
| `compare.html` | Side-by-side comparison, up to 4 fabrics |
| `shortlist.html` | Saved fabrics, and bulk enquiry |
| `about.html` | Company profile and factsheet |
| `contact.html` | Contact details, map, enquiry form |
| `js/products.js` | **The product data. Edit this to change fabrics.** |
| `js/normalize.js` | Turns the published specs into filterable values |
| `js/store.js` | Shortlist and compare, kept in `localStorage` |
| `js/motion.js` | Scroll reveal and product-image fade-in |
| `js/ui.js` | Header, footer, cards, compare tray, enquiry form |
| `js/catalog.js` | The catalogue page |
| `js/detail.js` | The fabric page |
| `js/compare.js` · `js/shortlist.js` · `js/home.js` · `js/pages.js` | One per page |
| `css/style.css` | All styling |
| `images/products/` | 96 product photos |

## How to open it

Double click `index.html`.

Two things need a network connection and degrade gracefully without one:

- **Inter**, the typeface, is loaded from Google Fonts. Offline it falls back
  to the system UI font (`-apple-system`, Segoe UI, Roboto), which is
  metrically close enough that the layout does not shift.
- **The map embed** on the contact page. The address and the "Open in Google
  Maps" link beneath it always work.

To serve it properly:

```bash
npx serve
```

## How the fabric page works

There is only ONE fabric page. The fabric is chosen by the address:

```
product.html?id=sap-matty-fabric
product.html?id=polo-matty-fabric
product.html?id=150-gsm-bon-patti
```

`detail.js` reads the id, finds it in `products.js` and builds the page.
Adding a fabric never means creating a new HTML file.

---

## Where the content came from

Every fabric, specification, price, minimum order quantity and photo was
taken from the manufacturer's existing website, `kkknitwearclub.com`.
**Nothing was invented.**

### Two layers of specification data

This is the most important thing to understand before editing anything.

The manufacturer publishes the same idea under many different keys — GSM
appears as `GSM`, `Fabric GSM` and `Products GSM`; width appears as
`42 inches`, `36 Inches/90 cm`, `160 cm`, `on order` and `custom`.

So the data is kept in two layers:

1. **`specs` in `products.js` — verbatim.** This is what the fabric page
   prints, exactly as the mill published it. Never "correct" these values.
2. **Derived values — computed at runtime by `normalize.js`.** These power
   search, the filters and the comparison table.

When a published value cannot be parsed, the derived value is simply left
empty. It is **never guessed**. The fabric still shows its published value on
its own page; it just does not appear under that filter.

Two real examples:

- `Tent Table And Chair Cover Fabrics` publishes `Width: 37 mm`. Millimetres
  are not a usable fabric width, so it is shown on the page but excluded from
  width filtering.
- `Polyester Knitted Fabric (Poly-Cotton)` publishes `GSM: custom`. The page
  shows "custom"; the fabric does not appear under any GSM band.

### Buyer reviews

The eight reviews on the About page are copied verbatim from the
manufacturer's own testimonial page — names, cities, ratings, dates and
comment text. Only the two-digit years were written out in full.

The overall figure (**4.5 out of 5**) is *quoted* from that page, not
averaged from the eight entries. The source's own star breakdown counts a
one-star review it never displays, so the eight visible reviews are all 5/5
while the published average is 4.5. Averaging the visible eight would
overstate the rating as 5.0, so the mill's own number is used and the review
count shown beside it.

### Short descriptions

Only four products publish a description. For the rest, `buildSummary()` in
`normalize.js` composes one sentence from values the mill has already
published — GSM, construction, composition, width, finish, application:

> A 180 GSM dot knit fabric in 100% polyester, 42 inches wide, with a
> dri-fit finish. Used for sportswear, t-shirts and polo shirts.

Nothing is invented. It is a restatement, in prose, of numbers that appear
verbatim in the specification table further down the same page. Rules:

- A product with real published copy uses that instead.
- A product with fewer than two usable facts gets nothing rather than a
  padded sentence. All 50 currently clear that bar.
- `custom`, `on order` and the `37 mm` width are excluded, exactly as they
  are from filtering.

### What was changed from the original site

Only display copy, never a specification value:

- `Home Farnising` → **Home Furnishing**
- `Bhurka` / `Burka` / `Burkha` → unified to **Burkha**
- `POLO MATTY FABRIC` → **Polo Matty Fabric**
- Boilerplate that repeated across ~12 products
  ("We are engaged in offering Quality Products…") was dropped. The 5
  genuinely product-specific descriptions were kept.

Deliberately left untouched inside spec tables, because they are published
values: `Polyster`, `Multipul`, `hoddie`, `Caller Tape`, `37 mm`, `Than`.

### Categories

The original site had 17 categories, 9 of them holding a single product, with
overlapping names. These were reorganised into 8 categories by end use. No
product was removed — each one keeps its original category name in the
`source` field, which is searchable and shown on the fabric page.

### Duplicate names

Five fabrics shared a name but had different specifications. All were kept
and given ids that carry the difference, so nothing was lost:

- `polyester-foma-fabric-211-240-gsm` and `polyester-foma-fabric-250-gsm`
- `polyester-knitted-fabric-140-160-gsm`, `-130-gsm`, `-poly-cotton`
- `pillow-cover-fabric-100-gsm` and `pillow-cover-fabric-85-gsm`
- `dot-knit-fabric-100-150-gsm` and `dot-knit-fabric-100-180-gsm`

---

## Adding or changing a fabric

Open **`js/products.js`** and copy any block:

```js
{
    id: "cotton-rich-pique",              // used in the web address
    name: "Cotton Rich Pique",            // shown to buyers
    categories: ["tshirt"],               // one or more CATEGORIES keys
    source: "Mens T Shirt",               // original category, searchable
    images: ["cotton-rich-pique-1.jpg"],  // files in images/products/
    priceValue: 240,                      // number, or null for "on request"
    priceUnit: "Kg",                      // "Kg" or "Meter"
    moq: "100 Kg",                        // or null
    specs: {                              // VERBATIM from the mill
        "Minimum Order Quantity": "100 Kg",
        "GSM": "180",
        "Width": "42 inches",
        "Material": "60% Cotton 40% Polyester"
    },
    description: null                     // or product-specific text
}
```

Save and refresh. The fabric appears in the catalogue, gets its own page at
`product.html?id=cotton-rich-pique`, and is picked up by search, the filters
and comparison automatically. **No other file needs editing.**

Notes:

- `id` must be lower case with dashes, and must not be used twice.
- `categories` values must exist in `CATEGORIES` at the top of the file.
- Put photos in `images/products/` and list the file names only.
- Do not add derived fields such as GSM ranges by hand — `normalize.js`
  works them out from `specs`.

## Changing company details

Everything is in the `COMPANY` object at the bottom of `js/products.js`:
address, phone, WhatsApp number, email, GST, factsheet and about text. The
header, footer, about page, contact page and enquiry messages all read from
it, so each detail is edited in exactly one place.

The phone number carried over from the original site (`07942802251`) is a
call-routing number, not a WhatsApp mobile. Set `COMPANY.whatsapp` to a real
WhatsApp number before using this for anything other than a demo.

## Adding a category

Add an entry to `CATEGORIES` in `js/products.js`:

```js
{
    key: "elastane",
    name: "Elastane Blends",       // full name: filters, footer, breadcrumbs
    short: "Elastane",             // compact label used on product cards
    blurb: "Stretch knits for activewear."
}
```

Then use `"elastane"` in any product's `categories` array. It appears on the
home page, in the filters and in the footer automatically.

---

## Notes on behaviour

- **Shortlist and compare** live in `localStorage`, so they survive a refresh
  but stay on that one browser. Compare is capped at 4 fabrics.
- **Filter state is in the URL**, so a filtered view can be bookmarked or
  sent to a colleague — e.g. `products.html?category=sportswear&gsm=151%20-%20200%20GSM`.
- **Prices are not comparable across units.** Some fabrics are priced per Kg
  and others per Meter. The compare table warns when a selection mixes both.
- **Accessibility**: skip link, breadcrumbs, keyboard-operable filters and
  modal, `aria-pressed` on toggles, visible focus rings, and a `prefers-reduced-motion`
  block.
- **No horizontal scrolling** at 360 px.

## Colour

Roughly 65% light neutrals, 25% soft colour, 10% stronger accent. Ivory is
the page, cards stay white, and each accent holds one job.

| Colour | Job | Where it appears |
|---|---|---|
| **Ivory** `#FAF7F2` | Main background | The page itself, and the separator between tinted sections |
| **White** `#FFFFFF` | Cards and content areas | All 50 product cards, all panels, quick specs |
| **Warm beige** `#F2EDE5` | Areas | Toolbars, table heads, footer, saved-item bars |
| **Soft peach** `#F7E8DF` | Selected sections | The stat strip |
| **Light sage** `#E8F0E8` | Secondary sections | The featured-fabrics section; Best Suited For pills |
| **Powder blue** `#E7EEF5` | Subtle highlights | Filter-panel and info-card headers, informational notes |
| **Charcoal** `#292827` | Text only | Headings, figures, nav, the compare tray |
| **Terracotta** `#C96F5B` | Primary buttons, active states | Primary CTAs, active nav + underline, brand mark |
| **Sage green** `#718B73` | Secondary accents | Best Suited For, "success" |
| **Dusty blue** `#6F8FA8` | Links, filters, informational | Links, section labels, filter checkboxes, focus rings |
| **Soft ochre** `#D6A84F` | Very small highlights, badges | Review stars, stat-strip rules, the "these differ" highlight, cautions |

Feedback colours are drawn from the palette rather than adding new hues:
success is sage, caution is ochre, informational is powder blue. One colour
sits outside it — `#A13527`, reserved for form errors.

### Why some tokens are darker than the given hex

**All four accent hues fail WCAG AA as text, and as a fill with white text
on them.** Measured, not guessed:

| | as text | white text on it |
|---|---|---|
| Terracotta `#C96F5B` | 2.97 — fails | 3.55 — fails |
| Sage `#718B73` | 3.11 — fails | 3.72 — fails |
| Dusty blue `#6F8FA8` | 2.85 — fails | 3.40 — fails |
| Ochre `#D6A84F` | 1.83 — fails | 2.19 — fails |

Ochre alone works as a fill with **charcoal** on it (6.71), which is why it
stays a badge colour and never a text colour.

So the given hues stay as the **identity** — section backgrounds, fills,
borders, rules, tints, decoration — and deepened versions of the *same* hues
carry anything that has to be read:

```
--terracotta-ink  #A6503D   5.5:1   button fill, white text on it
--terracotta-dk   #8E4331   7.0:1   hover
--dusty-ink       #4A6B85   5.6:1   links
--dusty-dk        #3C5A72   7.3:1   link hover
--sage-ink        #4F684F   6.1:1   secondary accent text
--ochre-ink       #7A5A16   6.4:1   small label text
```

The site reads as the palette; it just stays legible. Each given hue still
appears at full strength where it is safe — ochre as the review stars and
the stat rules, dusty blue as the filter checkbox accent, sage and peach as
whole section backgrounds.

### Section rhythm

**Ivory must sit between any two tinted sections.** The four tinted tones
are only 1.00–1.03 apart from each other — mutually invisible — while each
is a clear 1.09–1.12 against ivory. The home page runs
ivory → peach → ivory → sage → ivory, with a beige footer.

Product cards are **white, not beige**: beige on ivory is only 1.09, and a
fabric photograph reads cleanest against white. Beige does the "areas" job
instead.

Section labels alternate: dusty blue on ivory, ochre (`.eyebrow--alt`) on
tinted sections.

### Contrast

**Zero failures across all seven pages** — audited on the rendered DOM,
walking every text element, resolving its true background through
ancestors, and applying the correct AA threshold for its size and weight.

Worst case for each text colour, across white, ivory, beige, peach, sage
and powder blue:

| | worst ratio |
|---|---|
| Charcoal `--ink` | 12.3 |
| Body `--ink-2` | 10.4 |
| `--muted` | 5.7 |
| `--muted-2` | 4.6 |
| Dusty ink | 4.7 |
| Terracotta ink | 4.6 |
| Sage ink | 5.1 |
| Ochre ink | 5.3 |

The whole palette lives in the `:root` block at the top of `style.css`, so a
change is a handful of token values, never a rewrite.

## Motion

Content blocks fade and rise 12px as they come into view, product photos fade
in as they decode, and Chrome cross-fades between pages via
`@view-transition`.

The **home page introduction** has its own hand-timed cascade, set by the
`HERO` array in `motion.js`: eyebrow (0ms) → headline (70ms, one word at a
time, 38ms apart) → collage (180ms) → paragraph (300ms) → buttons (400ms).
The headline is rewritten into one clipping box per word so each word slides
up from behind its own line. Two things this does not break:

- **Accessible text.** The heading keeps an `aria-label` carrying the
  original sentence and the generated word spans are `aria-hidden`, so screen
  readers read one continuous line, not a list of words.
- **Layout.** The split heading measures identically to the same text
  unsplit, so wrapping and line height are unchanged.

Only the home hero is split; every other heading on the site is untouched.

Three deliberate decisions behind the rest:

- **Nothing is ever hidden unless `js/motion.js` is running.** The hidden
  state is scoped to `html.motion-ready`, a class only that file adds, and it
  does not add it when the reader has asked for reduced motion. With
  JavaScript off, every element renders as authored.
- **Revealing does not depend on IntersectionObserver alone.** A throttled
  scroll sweep runs alongside it using plain geometry. Observer callbacks are
  delivered as part of the rendering loop, so a document that never paints —
  a background tab, a prerender — may never receive them. Both listeners
  detach once the last element is revealed.
- **The catalogue grid is deliberately not revealed.** It re-renders on every
  keystroke and every filter change; animating it would flicker. A working
  tool should feel instant. Only its photographs fade.

To change the feel: `--ease-out` and the `520ms` reveal duration in the Motion
section of `style.css`; `STAGGER`, `WORD_STAGGER` and the `HERO` delays in
`motion.js`.
