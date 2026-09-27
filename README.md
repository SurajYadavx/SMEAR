# Smear Pathology Website

**Production-grade static website for Smear Pathology, Indapur, Pune, Maharashtra.**

---

## Quick Start

This is a pure static site — open `index.html` in any browser, or serve it with any static file server.

### Option A — VS Code Live Server

Install the **Live Server** extension → right-click `index.html` → "Open with Live Server"

### Option B — Node http-server

```bash
npx -y http-server . -p 3000 -o
```

### Option C — Python

```bash
python -m http.server 3000
# Then open http://localhost:3000
```

---

## 📁 Folder Structure

```
Smear/
├── index.html              ← Single-page site entry point
├── src/
│   ├── main.js             ← All JS logic (contact links, carousels, modal, etc.)
│   ├── config.js           ← Config reference (not loaded directly — constants live in main.js)
│   ├── styles/
│   │   └── main.css        ← Full design system CSS
│   └── data/
│       └── tests.js        ← Test data reference (constants embedded in main.js)
└── public/
    └── assets/
        ├── logo/           ← Drop logo.png here (512×512, transparent BG)
        ├── gallery/        ← Drop gallery-01.jpg, gallery-02.jpg ... here
        ├── reviews/        ← Drop review-01.png, review-02.png ... here
        └── tests/          ← Drop test images (cbc.jpg, urine.jpg, widal.jpg, sputum.jpg) here
```

---

## ✏️ Client Handoff Checklist

### Before Launch — Required Changes

| #   | What                   | Where                                        | Notes                                                             |
| --- | ---------------------- | -------------------------------------------- | ----------------------------------------------------------------- |
| 1   | **Phone number**       | `src/main.js` line 9 — `CONTACT_PHONE`       | Change ONE constant, updates everywhere                           |
| 2   | **Real logo**          | `/public/assets/logo/logo.png`               | PNG, transparent bg, ≥512×512px                                   |
| 3   | **Clinic photos**      | `/public/assets/gallery/gallery-01.jpg` etc. | Add files + uncomment entries in `main.js` `GALLERY_IMAGES` array |
| 4   | **Review screenshots** | `/public/assets/reviews/review-01.png` etc.  | Add files + uncomment entries in `main.js` `REVIEW_IMAGES` array  |
| 5   | **Test list & prices** | `src/main.js` `TESTS` array                  | Replace 4 placeholder entries                                     |
| 6   | **Test images**        | `/public/assets/tests/`                      | cbc.jpg, urine.jpg, widal.jpg, sputum.jpg                         |
| 7   | **Exact address**      | `index.html` — `#contact-address` block      | Confirm with client                                               |
| 8   | **Operating hours**    | `src/main.js` `LAB_HOURS` constant           | Confirm with client                                               |
| 9   | **Hero image**         | `index.html` hero section                    | Replace placeholder div with `<img>` tag                          |
| 10  | **OG image URL**       | `index.html` `<meta property="og:image">`    | Update once logo is live                                          |
| 11  | **Canonical URL**      | `index.html` `<link rel="canonical">`        | Update to live domain                                             |

---

## Adding Gallery Images

1. Drop `gallery-01.jpg`, `gallery-02.jpg`, ... into `/public/assets/gallery/`
2. Open `src/main.js` and add entries to `GALLERY_IMAGES`:

```js
const GALLERY_IMAGES = [
  {
    src: "/assets/gallery/gallery-01.jpg",
    alt: "Smear Pathology reception area",
  },
  {
    src: "/assets/gallery/gallery-02.jpg",
    alt: "Laboratory equipment at Smear Pathology",
  },
];
```

That's it — the carousel auto-populates. ✅

## Adding Review Screenshots

Same process — add files to `/public/assets/reviews/`, then populate `REVIEW_IMAGES` in `main.js`:

```js
const REVIEW_IMAGES = [
  {
    src: "/assets/reviews/review-01.png",
    alt: "Google review for Smear Pathology Indapur",
  },
];
```

---

## Updating the Phone Number

Open `src/main.js`, find line:

```js
const CONTACT_PHONE = "7410745222"; // edit ONLY here
```

Replace the number. Every call button, WhatsApp link, and footer reference updates automatically.

---

## Deploying to Netlify / Vercel

**Netlify (recommended for static sites):**

1. Push to GitHub
2. Connect repo in Netlify dashboard
3. Build command: _(leave blank — no build step needed)_
4. Publish directory: `.` (root)
5. Add custom domain in Netlify settings

**Vercel:**

1. Push to GitHub
2. Import project in Vercel
3. Framework: `Other`
4. Root directory: `.`

---

## SEO Notes

The site includes:

- Descriptive `<title>` and `<meta description>` with local keywords (pathology lab Indapur, blood test Indapur, etc.)
- Open Graph tags for WhatsApp/Instagram link previews
- Semantic HTML5 landmarks (`header`, `main`, `section`, `footer`, `nav`)
- `alt` text on all images
- `<link rel="canonical">` — update to live domain before launch
- Lazy-loading on all gallery, review, and test images

---

_Built for Smear Pathology, Indapur, Pune, Maharashtra._
