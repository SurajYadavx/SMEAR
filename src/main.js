/**
 * ============================================================
 *  SMEAR PATHOLOGY — MAIN SCRIPT  v2
 *  Parts:
 *   1. CONFIG (contact constants — single source of truth)
 *   2. i18n (language picker popup + apply language)
 *   3. Scroll-lock (overflow + touch prevention)
 *   4. Contact wiring
 *   5. Test cards builder
 *   6. Gallery & Reviews carousels
 *   7. Test-detail modal
 *   8. Gallery lightbox
 *   9. FAQ accordion builder
 *  10. Header (shadow on scroll)
 *  11. Mobile nav
 *  12. Scroll-triggered fade-in
 *  13. Footer year
 * ============================================================
 */

// ─────────────────────────────────────────────────────────────
//  1. CONFIG — edit ONLY here, never hardcode elsewhere
// ─────────────────────────────────────────────────────────────
const CONTACT_PHONE = '7410745222';
const CONTACT_PHONE_DISPLAY = '+91 74107 45222';
const CONTACT_PHONE_TEL = 'tel:+91' + CONTACT_PHONE;
const CONTACT_WHATSAPP_URL = 'https://wa.me/91' + CONTACT_PHONE +
  '?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20your%20tests%20at%20Smear%20Pathology';
const MAPS_URL = 'https://maps.app.goo.gl/ZiUNsvbcQZ3rjY6z8';
const INSTAGRAM_URL = 'https://www.instagram.com/smear_path0355';
const LAB_HOURS = 'Mon – Sat: 7:00 AM – 9:00 PM  |  Sun: 8:00 AM – 2:00 PM';

const GALLERY_IMAGES = [
  { src: './public/assets/gallery/gallery-01.png', alt: 'Smear Pathology facility photo 1' },
  { src: './public/assets/gallery/gallery-02.png', alt: 'Smear Pathology facility photo 2' },
  { src: './public/assets/gallery/gallery-03.png', alt: 'Smear Pathology facility photo 3' },
  { src: './public/assets/gallery/gallery-04.png', alt: 'Smear Pathology facility photo 4' },
  { src: './public/assets/gallery/gallery-05.png', alt: 'Smear Pathology facility photo 5' },
  { src: './public/assets/gallery/gallery-06.png', alt: 'Smear Pathology facility photo 6' },
  { src: './public/assets/gallery/gallery-07.png', alt: 'Smear Pathology facility photo 7' },
  { src: './public/assets/gallery/gallery-08.png', alt: 'Smear Pathology facility photo 8' },
  { src: './public/assets/gallery/gallery-09.png', alt: 'Smear Pathology facility photo 9' },
  { src: './public/assets/gallery/gallery-10.png', alt: 'Smear Pathology facility photo 10' },
];

const REVIEW_IMAGES = [
  // { src: './public/assets/reviews/review-01.png', alt: 'Google review for Smear Pathology Indapur' },
  // { src: './public/assets/reviews/review-02.png', alt: 'Patient review for Smear Pathology' },
];

// Active language content — set by initLanguagePicker()
var _content = null;

// ─────────────────────────────────────────────────────────────
//  SCROLL LOCK (Part 1 bug fix)
//  Handles both overflow:hidden AND touch-move prevention so
//  iOS Safari & Android Chrome don't scroll the background
//  when a modal or lightbox is open.
// ─────────────────────────────────────────────────────────────
var _scrollLockCount = 0;
var _scrollY = 0;

function lockScroll() {
  _scrollLockCount++;
  if (_scrollLockCount > 1) return;
  _scrollY = window.scrollY;
  document.body.style.position = 'fixed';
  document.body.style.top = '-' + _scrollY + 'px';
  document.body.style.left = '0';
  document.body.style.right = '0';
  document.body.style.overflow = 'hidden';
}

function unlockScroll() {
  _scrollLockCount = Math.max(0, _scrollLockCount - 1);
  if (_scrollLockCount > 0) return;
  document.body.style.position = '';
  document.body.style.top = '';
  document.body.style.left = '';
  document.body.style.right = '';
  document.body.style.overflow = '';
  window.scrollTo(0, _scrollY);
}

// Prevent touchmove on overlay backdrop (for iOS)
function preventTouchScroll(e) {
  // Allow scrolling inside modal-card / lightbox-img
  var el = e.target;
  while (el && el !== document.body) {
    if (el.classList && (el.classList.contains('modal-card') ||
      el.classList.contains('lightbox-img') ||
      el.classList.contains('faq-answer'))) return;
    el = el.parentElement;
  }
  e.preventDefault();
}

// ─────────────────────────────────────────────────────────────
//  INITIALISATION — runs after DOM is ready
// ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  initLanguagePicker();   // MUST run first — sets _content
});

// ─────────────────────────────────────────────────────────────
//  2. i18n — LANGUAGE PICKER + APPLY
// ─────────────────────────────────────────────────────────────
var LANG_KEY = 'smear_lang'; // localStorage key

function initLanguagePicker() {
  var saved = localStorage.getItem(LANG_KEY);

  // Wire the header toggle (both desktop + mobile)
  var toggle = document.getElementById('lang-toggle');
  var toggleMob = document.getElementById('lang-toggle-mobile');
  if (toggle) toggle.addEventListener('click', switchLanguage);
  if (toggleMob) toggleMob.addEventListener('click', switchLanguage);

  if (saved === 'en' || saved === 'mr') {
    // Returning visitor — apply saved choice silently
    applyLanguage(saved);
    bootApp();
  } else {
    // First visit — show popup
    showLangPopup();
  }
}

function showLangPopup() {
  var popup = document.getElementById('lang-popup');
  if (!popup) return;
  popup.setAttribute('aria-hidden', 'false');
  popup.classList.add('is-visible');
  lockScroll();

  document.getElementById('lang-btn-mr').addEventListener('click', function () {
    chooseLang('mr');
  });
  document.getElementById('lang-btn-en').addEventListener('click', function () {
    chooseLang('en');
  });
}

function chooseLang(lang) {
  localStorage.setItem(LANG_KEY, lang);
  var popup = document.getElementById('lang-popup');
  if (popup) {
    popup.classList.remove('is-visible');
    popup.setAttribute('aria-hidden', 'true');
  }
  unlockScroll();
  applyLanguage(lang);
  bootApp();
}

function switchLanguage() {
  var current = localStorage.getItem(LANG_KEY) || 'en';
  var next = current === 'en' ? 'mr' : 'en';
  localStorage.setItem(LANG_KEY, next);
  applyLanguage(next);
  // Rebuild dynamic sections
  buildTestCards();
  buildFAQ();
}

// ── Apply language: walk all [data-i18n] elements ────────────
function applyLanguage(lang) {
  _content = (lang === 'mr' && window.CONTENT_MR) ? window.CONTENT_MR : window.CONTENT_EN;
  if (!_content) { _content = window.CONTENT_EN; }

  // Update html lang attribute
  document.getElementById('html-root').lang = _content.lang || lang;

  // Walk all data-i18n elements and set textContent
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    var key = el.getAttribute('data-i18n');
    var val = getNestedValue(_content, key);
    if (val !== undefined && val !== null) {
      if (typeof val === 'string' && val.indexOf('\n') !== -1) {
        el.innerHTML = val.replace(/\n/g, '<br>');
      } else if (typeof val === 'string') {
        el.textContent = val;
      }
    }
  });

  // Walk data-i18n-attr elements: format "attr1:key1 attr2:key2"
  // Used for: img[alt], input[placeholder], etc.
  document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
    var spec = el.getAttribute('data-i18n-attr');
    spec.split(/\s+/).forEach(function (pair) {
      var parts = pair.split(':');
      if (parts.length !== 2) return;
      var attr = parts[0].trim();
      var key = parts[1].trim();
      var val = getNestedValue(_content, key);
      if (val !== undefined && val !== null) {
        el.setAttribute(attr, val);
      }
    });
  });
}

// ── Helper: resolve 'a.b.c' key path on object ───────────────
function getNestedValue(obj, path) {
  if (!obj || !path) return undefined;
  var parts = path.split('.');
  var cur = obj;
  for (var i = 0; i < parts.length; i++) {
    if (cur === null || cur === undefined) return undefined;
    cur = cur[parts[i]];
  }
  return cur;
}

// ─────────────────────────────────────────────────────────────
//  BOOT APP — called after language is set
// ─────────────────────────────────────────────────────────────
function bootApp() {
  wireContactLinks();
  wireStaticContactBlocks();
  buildTestCards();
  buildGalleryCarousel();
  buildReviewsCarousel();
  buildFAQ();
  initHeader();
  initMobileNav();
  initModal();
  initLightbox();
  initScrollFadeIn();
  initCarouselDrag();
  setFooterYear();
}

// ─────────────────────────────────────────────────────────────
//  3. CONTACT WIRING
// ─────────────────────────────────────────────────────────────
function wireContactLinks() {
  var callSelectors = [
    '#header-call-btn', '#hero-call-btn', '#mobile-call-btn',
    '#modal-call-btn', '#contact-cta-call', '#footer-call-btn',
  ];
  var waSelectors = [
    '#header-wa-btn', '#hero-wa-btn', '#mobile-wa-btn',
    '#modal-wa-btn', '#contact-cta-wa', '#footer-wa-btn',
    '#contact-wa-link', '.whatsapp-float',
  ];

  callSelectors.forEach(function (sel) {
    var el = document.querySelector(sel);
    if (el) el.href = CONTACT_PHONE_TEL;
  });

  waSelectors.forEach(function (sel) {
    var el = document.querySelector(sel);
    if (el) {
      el.href = CONTACT_WHATSAPP_URL;
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  });
}

function wireStaticContactBlocks() {
  var phoneLinkEl = document.getElementById('contact-phone-link');
  if (phoneLinkEl) {
    phoneLinkEl.textContent = CONTACT_PHONE_DISPLAY;
    phoneLinkEl.href = CONTACT_PHONE_TEL;
  }
  var footerPhone = document.getElementById('footer-phone-display');
  if (footerPhone) footerPhone.textContent = CONTACT_PHONE_DISPLAY;

  var hoursEl = document.getElementById('contact-hours');
  if (hoursEl) hoursEl.textContent = LAB_HOURS;
}

// ─────────────────────────────────────────────────────────────
//  4. BUILD TEST CARDS
// ─────────────────────────────────────────────────────────────
function buildTestCards() {
  var grid = document.getElementById('tests-grid');
  if (!grid) return;
  grid.innerHTML = '';

  var tests = (_content && _content.testData) ? _content.testData : (window.CONTENT_EN ? window.CONTENT_EN.testData : []);
  var viewDetailsLabel = getNestedValue(_content, 'tests.viewDetails') || 'View details';
  var startingFromLabel = getNestedValue(_content, 'tests.startingFrom') || 'Starting from';

  tests.forEach(function (test) {
    var card = document.createElement('article');
    card.className = 'test-card fade-in';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', test.name + ' — ₹' + test.price);
    card.dataset.testId = test.id;

    card.innerHTML = '<div class="test-card__img-wrap">' +
      '<img class="test-card__img" src="' + test.image + '"' +
      ' alt="' + test.name + ' test at Smear Pathology Indapur"' +
      ' loading="lazy"' +
      ' onerror="this.style.display=\'none\'; this.parentElement.querySelector(\'.test-card__img-placeholder\').style.display=\'flex\'" />' +
      '<div class="test-card__img-placeholder" style="display:none">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none">' +
      '<circle cx="24" cy="20" r="8" stroke="currentColor" stroke-width="1.5" opacity=".5"/>' +
      '<path d="M8 40c0-8.8 7.2-16 16-16s16 7.2 16 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity=".5"/>' +
      '</svg></div></div>' +
      '<div class="test-card__body">' +
      '<h3 class="test-card__name">' + test.name + '</h3>' +
      '<p class="test-card__short">' + test.shortDesc + '</p>' +
      '<div class="test-card__footer">' +
      '<span class="test-card__price">₹' + test.price + '</span>' +
      '<span class="test-card__cta">' + viewDetailsLabel +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>' +
      '</span></div></div>';

    card.addEventListener('click', function () { openModal(test); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(test); }
    });

    grid.appendChild(card);
  });

  // Re-observe new fade-in cards
  if (window._fadeObserver) {
    grid.querySelectorAll('.fade-in').forEach(function (el) {
      window._fadeObserver.observe(el);
    });
  }
}

// ─────────────────────────────────────────────────────────────
//  5. GALLERY CAROUSEL
// ─────────────────────────────────────────────────────────────
function buildGalleryCarousel() {
  var track = document.getElementById('gallery-track');
  if (!track) return;

  if (GALLERY_IMAGES.length === 0) {
    return; // Placeholder in HTML stays visible
  }

  var placeholder = document.getElementById('gallery-placeholder');
  if (placeholder) placeholder.remove();

  GALLERY_IMAGES.forEach(function (item) {
    var wrap = document.createElement('div');
    wrap.className = 'gallery-photo';
    wrap.dataset.src = item.src;
    wrap.dataset.alt = item.alt;
    var img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    img.setAttribute('draggable', 'false');
    wrap.appendChild(img);
    track.appendChild(wrap);
    wrap.addEventListener('click', function () { openLightbox(item.src, item.alt); });
  });

  initCarouselAutoScroll('gallery-track', 'gallery-prev', 'gallery-next');
}

// ─────────────────────────────────────────────────────────────
//  6. REVIEWS CAROUSEL
// ─────────────────────────────────────────────────────────────
function buildReviewsCarousel() {
  var track = document.getElementById('reviews-track');
  if (!track) return;

  if (REVIEW_IMAGES.length === 0) {
    initCarouselAutoScroll('reviews-track', 'reviews-prev', 'reviews-next', 3500);
    return;
  }

  ['review-placeholder-1', 'review-placeholder-2', 'review-placeholder-3'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) el.remove();
  });

  REVIEW_IMAGES.forEach(function (item) {
    var card = document.createElement('div');
    card.className = 'review-screenshot-card';
    var img = document.createElement('img');
    img.src = item.src;
    img.alt = item.alt;
    img.loading = 'lazy';
    img.setAttribute('draggable', 'false');
    card.appendChild(img);
    track.appendChild(card);
  });

  initCarouselAutoScroll('reviews-track', 'reviews-prev', 'reviews-next', 3500);
}

// ── Carousel auto-scroll ──────────────────────────────────────
function initCarouselAutoScroll(trackId, prevId, nextId, intervalMs) {
  intervalMs = intervalMs || 3000;
  var track = document.getElementById(trackId);
  var prevBtn = document.getElementById(prevId);
  var nextBtn = document.getElementById(nextId);
  if (!track) return;

  var timer = null;
  var isPaused = false;

  function getStep() {
    var first = track.firstElementChild;
    if (!first) return 300;
    return first.offsetWidth + 20;
  }

  function scrollBy(dir) {
    track.scrollBy({ left: dir * getStep(), behavior: 'smooth' });
  }

  function autoScroll() {
    if (isPaused) return;
    if (track.scrollLeft + track.clientWidth >= track.scrollWidth - 4) {
      track.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      scrollBy(1);
    }
  }

  function startTimer() { timer = setInterval(autoScroll, intervalMs); }
  function stopTimer() { clearInterval(timer); timer = null; }

  track.addEventListener('mouseenter', function () { isPaused = true; stopTimer(); });
  track.addEventListener('mouseleave', function () { isPaused = false; startTimer(); });
  track.addEventListener('touchstart', function () { isPaused = true; stopTimer(); }, { passive: true });
  track.addEventListener('touchend', function () { isPaused = false; setTimeout(startTimer, 1200); });

  if (prevBtn) prevBtn.addEventListener('click', function () { scrollBy(-1); stopTimer(); setTimeout(startTimer, 2000); });
  if (nextBtn) nextBtn.addEventListener('click', function () { scrollBy(1); stopTimer(); setTimeout(startTimer, 2000); });

  startTimer();
}

// ── Carousel drag-to-scroll ───────────────────────────────────
function initCarouselDrag() {
  document.querySelectorAll('.carousel-track').forEach(function (track) {
    var isDown = false, startX = 0, scrollLeft = 0;

    track.addEventListener('mousedown', function (e) {
      isDown = true;
      track.style.cursor = 'grabbing';
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    track.addEventListener('mouseleave', function () { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mouseup', function () { isDown = false; track.style.cursor = 'grab'; });
    track.addEventListener('mousemove', function (e) {
      if (!isDown) return;
      e.preventDefault();
      var x = e.pageX - track.offsetLeft;
      var walk = (x - startX) * 1.5;
      track.scrollLeft = scrollLeft - walk;
    });
  });
}

// ─────────────────────────────────────────────────────────────
//  7. TEST DETAIL MODAL
// ─────────────────────────────────────────────────────────────
function initModal() {
  var overlay = document.getElementById('test-modal');
  var closeBtn = document.getElementById('modal-close');
  if (!overlay) return;

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeModal();
  });
  overlay.addEventListener('touchmove', preventTouchScroll, { passive: false });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') closeModal();
  });
}

function openModal(test) {
  var overlay = document.getElementById('test-modal');
  var titleEl = document.getElementById('modal-title');
  var priceEl = document.getElementById('modal-price');
  var descEl = document.getElementById('modal-desc');
  var imgEl = document.getElementById('modal-img');
  var imgPholder = document.getElementById('modal-img-placeholder');
  var callBtn = document.getElementById('modal-call-btn');
  var waBtn = document.getElementById('modal-wa-btn');
  if (!overlay) return;

  var startingFrom = getNestedValue(_content, 'tests.startingFrom') || 'Starting from';

  titleEl.textContent = test.name;
  priceEl.textContent = startingFrom + ' ₹' + test.price;
  descEl.textContent = test.fullDesc;
  callBtn.href = CONTACT_PHONE_TEL;

  var waMsg = encodeURIComponent('Hi, I\'d like to book the ' + test.name + ' test at Smear Pathology.');
  waBtn.href = 'https://wa.me/91' + CONTACT_PHONE + '?text=' + waMsg;
  waBtn.setAttribute('target', '_blank');

  if (test.image) {
    imgEl.src = test.image;
    imgEl.alt = test.name + ' — Smear Pathology diagnostic test';
    imgEl.style.display = 'block';
    imgPholder.style.display = 'none';
    imgEl.onerror = function () {
      imgEl.style.display = 'none';
      imgPholder.style.display = 'flex';
    };
  } else {
    imgEl.style.display = 'none';
    imgPholder.style.display = 'flex';
  }

  overlay.setAttribute('aria-hidden', 'false');
  lockScroll();
  setTimeout(function () { var c = document.getElementById('modal-close'); if (c) c.focus(); }, 80);
}

function closeModal() {
  var overlay = document.getElementById('test-modal');
  if (!overlay) return;
  overlay.setAttribute('aria-hidden', 'true');
  unlockScroll();
}

// ─────────────────────────────────────────────────────────────
//  8. GALLERY LIGHTBOX
// ─────────────────────────────────────────────────────────────
function initLightbox() {
  var lightbox = document.getElementById('lightbox');
  var closeBtn = document.getElementById('lightbox-close');
  if (!lightbox) return;

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  lightbox.addEventListener('touchmove', preventTouchScroll, { passive: false });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.getAttribute('aria-hidden') === 'false') closeLightbox();
  });
}

function openLightbox(src, alt) {
  var lightbox = document.getElementById('lightbox');
  var img = document.getElementById('lightbox-img');
  if (!lightbox || !img) return;
  img.src = src;
  img.alt = alt;
  lightbox.setAttribute('aria-hidden', 'false');
  lockScroll();
}

function closeLightbox() {
  var lightbox = document.getElementById('lightbox');
  if (!lightbox) return;
  lightbox.setAttribute('aria-hidden', 'true');
  unlockScroll();
}

// ─────────────────────────────────────────────────────────────
//  9. FAQ ACCORDION
// ─────────────────────────────────────────────────────────────
function buildFAQ() {
  var list = document.getElementById('faq-list');
  if (!list) return;
  list.innerHTML = '';

  var items = getNestedValue(_content, 'faq.items') || [];

  items.forEach(function (item, i) {
    var el = document.createElement('div');
    el.className = 'faq-item fade-in';
    el.setAttribute('role', 'listitem');

    var btnId = 'faq-btn-' + i;
    var bodyId = 'faq-body-' + i;

    el.innerHTML = '<button class="faq-question" id="' + btnId + '"' +
      ' aria-expanded="false" aria-controls="' + bodyId + '">' +
      '<span class="faq-question__text">' + item.q + '</span>' +
      '<span class="faq-question__icon" aria-hidden="true">' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>' +
      '</span></button>' +
      '<div class="faq-answer" id="' + bodyId + '" role="region" aria-labelledby="' + btnId + '" hidden>' +
      '<p>' + item.a + '</p>' +
      '</div>';

    var btn = el.querySelector('.faq-question');
    var body = el.querySelector('.faq-answer');

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      // Close all other open items
      list.querySelectorAll('.faq-question[aria-expanded="true"]').forEach(function (otherBtn) {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          var otherId = otherBtn.getAttribute('aria-controls');
          var otherBody = document.getElementById(otherId);
          if (otherBody) otherBody.hidden = true;
        }
      });
      btn.setAttribute('aria-expanded', String(!isOpen));
      body.hidden = isOpen;
    });

    list.appendChild(el);
  });

  // Re-observe new fade-in items
  if (window._fadeObserver) {
    list.querySelectorAll('.fade-in').forEach(function (el) {
      window._fadeObserver.observe(el);
    });
  }
}

// ─────────────────────────────────────────────────────────────
//  10. STICKY HEADER SHADOW
// ─────────────────────────────────────────────────────────────
function initHeader() {
  var header = document.getElementById('site-header');
  if (!header) return;
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
//  11. MOBILE NAV
// ─────────────────────────────────────────────────────────────
function initMobileNav() {
  var hamburger = document.getElementById('hamburger');
  var nav = document.getElementById('mobile-nav');
  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', function () {
    var isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
    nav.setAttribute('aria-hidden', String(!isOpen));
    if (isOpen) lockScroll(); else unlockScroll();
  });

  nav.querySelectorAll('.mobile-nav__link').forEach(function (link) {
    link.addEventListener('click', function () {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
      unlockScroll();
    });
  });
}

// ─────────────────────────────────────────────────────────────
//  12. SCROLL FADE-IN OBSERVER
// ─────────────────────────────────────────────────────────────
function initScrollFadeIn() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.fade-in').forEach(function (el) { el.classList.add('visible'); });
    return;
  }

  window._fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        window._fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-in').forEach(function (el) { window._fadeObserver.observe(el); });
}

// ─────────────────────────────────────────────────────────────
//  13. FOOTER YEAR
// ─────────────────────────────────────────────────────────────
function setFooterYear() {
  var el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}
