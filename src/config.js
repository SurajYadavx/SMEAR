/**
 * ============================================================
 *  SMEAR PATHOLOGY — SITE CONFIGURATION v5
 *  Single source of truth. Loaded on every page before partials.js.
 *  DO NOT hardcode these values anywhere else.
 * ============================================================
 */

// ── HOME COLLECTION FLAG ──────────────────────────────────────
// CONFIRM WITH CLIENT: set to true if home sample collection is offered.
// When false, all home-collection badges, links, and the home-collection.html
// page will show a "coming soon" state automatically.
var HOME_COLLECTION_AVAILABLE = true;

// ── CONTACT ──────────────────────────────────────────────────
// PLACEHOLDER: Replace with client's real number before launch
var CONTACT_PHONE         = '7410745222';
var CONTACT_PHONE_DISPLAY = '+91 74107 45222';
var CONTACT_PHONE_TEL     = 'tel:+91' + CONTACT_PHONE;
var CONTACT_EMAIL         = 'jssmearpathology0355@gmail.com';
var CONTACT_EMAIL_HREF    = 'mailto:' + CONTACT_EMAIL;
var CONTACT_WHATSAPP_URL  = 'https://wa.me/91' + CONTACT_PHONE +
  '?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20tests%20at%20Smear%20Pathology';

// ── SOCIAL & MAP ─────────────────────────────────────────────
var INSTAGRAM_URL = 'https://www.instagram.com/smear_path0355';
var MAPS_URL      = 'https://maps.app.goo.gl/ZiUNsvbcQZ3rjY6z8';
var MAP_LAT       = 18.1240501;
var MAP_LNG       = 75.0147934;
var MAP_SHARE_URL     = 'https://maps.app.goo.gl/bYwAMgtcDcBKMQsz8';
var MAP_EMBED_URL     = 'https://www.google.com/maps?q=' + MAP_LAT + ',' + MAP_LNG + '&z=17&output=embed';
var MAP_DIRECTIONS_URL = 'https://www.google.com/maps/dir/?api=1&destination=' + MAP_LAT + ',' + MAP_LNG;

// ── BUSINESS INFO ────────────────────────────────────────────
var LAB_NAME       = 'Smear Pathology';
var LAB_TAGLINE    = 'The Most Trusted Laboratory of Indapur';
var LAB_OWNER      = 'Mr. Pradip S. Jadhav';
var LAB_OWNER_CRED = 'BSc Microbiology, PGDMLT';
// PLACEHOLDER: Replace with exact confirmed address before launch
var LAB_ADDRESS    = 'Indapur, Pune District, Maharashtra \u2014 413106';
// PLACEHOLDER: Replace with confirmed operating hours before launch
var LAB_HOURS      = 'Mon \u2013 Sat: 7:00 AM \u2013 9:00 PM\u2003|\u2003Sun: 8:00 AM \u2013 2:00 PM';

// ── SEO / META BASE ──────────────────────────────────────────
var SEO_TITLE       = 'Smear Pathology \u2014 Pathology Lab & Diagnostic Centre in Indapur, Pune';
var SEO_DESCRIPTION = 'Smear Pathology is a trusted diagnostic pathology and microbiology laboratory in Indapur, Pune. Accurate blood tests, urine tests, and microbiological reports with quick turnaround. Book via WhatsApp or call.';
var SITE_URL        = 'https://smearpathology.in';

// ── GALLERY IMAGES ───────────────────────────────────────────
var GALLERY_IMAGES = [
  { src: 'public/assets/gallery/gallery-02.png', alt: 'Smear Pathology laboratory photo 1' },
  { src: 'public/assets/gallery/gallery-04.png', alt: 'Smear Pathology laboratory photo 2' },
  { src: 'public/assets/gallery/gallery-05.png', alt: 'Smear Pathology laboratory photo 3' },
  { src: 'public/assets/gallery/gallery-06.png', alt: 'Smear Pathology laboratory photo 4' },
  { src: 'public/assets/gallery/gallery-07.png', alt: 'Smear Pathology laboratory photo 5' },
  { src: 'public/assets/gallery/gallery-10.png', alt: 'Smear Pathology laboratory photo 6' },
  { src: 'public/assets/team/lab-equi.jpeg',     alt: 'Smear Pathology laboratory equipment' },
  { src: 'public/assets/team/lab_work.png',      alt: 'Smear Pathology laboratory workspace' },
];
var REVIEW_IMAGES = [];

// ── VIEW-MORE DEFAULTS ───────────────────────────────────────
var VIEW_MORE_DEFAULTS = {
  packages: { mobile: 4, desktop: 6 },
  tests:    { mobile: 6, desktop: 8 }
};
