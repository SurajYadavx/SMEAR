/**
 * ============================================================
 *  SMEAR PATHOLOGY — PARTIALS.JS v5.1 (WIRING ONLY)
 *
 *  This file NO LONGER builds or injects any HTML.
 *  Every page carries its own real header/footer markup.
 *  This script only wires behaviour on top of that markup:
 *    - Mobile menu open / close
 *    - Cart badge count (reads SmearCart.count())
 *    - Active nav-link highlight (based on current filename)
 *    - Contact hrefs from config.js constants
 *    - Language toggle button click
 *    - Header scroll class
 *    - Footer year
 *    - Floating button hrefs
 * ============================================================
 */

(function () {
  'use strict';

  var LANG_KEY = 'smear_lang';
  var CART_KEY = 'smear_cart_v1';

  // ── HELPERS ────────────────────────────────────────────────
  function getLang() {
    try { return localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { return 'en'; }
  }

  // ── CART BADGE ─────────────────────────────────────────────
  function cartCount() {
    try {
      var cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(cart) ? cart.reduce(function (n, i) { return n + (i.qty || 1); }, 0) : 0;
    } catch (e) { return 0; }
  }

  function updateCartBadge() {
    var count = cartCount();
    document.querySelectorAll('.cart-badge').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  window.refreshCartBadge = updateCartBadge;

  // ── ACTIVE NAV LINK ─────────────────────────────────────────
  function highlightActiveNav() {
    var page = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav__link, .footer-nav__link, .footer-link').forEach(function (a) {
      var href = (a.getAttribute('href') || '').split('#')[0].split('/').pop();
      var active = href && href === page;
      a.classList.toggle('nav-link--active', active);
    });
  }

  // ── CONTACT HREFS ──────────────────────────────────────────
  function applyContactHrefs() {
    var callIds = ['header-call-btn', 'mobile-call-btn', 'footer-call-btn', 'hero-call-btn', 'call-float'];
    callIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && typeof CONTACT_PHONE_TEL !== 'undefined') el.href = CONTACT_PHONE_TEL;
    });

    var waIds = ['header-wa-btn', 'mobile-wa-btn', 'footer-wa-btn', 'hero-wa-btn', 'whatsapp-float',
                 'hc-wa-book', 'hc-cs-wa', 'shop-wa-float'];
    waIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && typeof CONTACT_WHATSAPP_URL !== 'undefined') el.href = CONTACT_WHATSAPP_URL;
    });

    var emailIds = ['footer-email-btn'];
    emailIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && typeof CONTACT_EMAIL_HREF !== 'undefined') el.href = CONTACT_EMAIL_HREF;
    });

    var dirIds = ['footer-directions-btn', 'contact-directions-btn'];
    dirIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && typeof MAP_DIRECTIONS_URL !== 'undefined') el.href = MAP_DIRECTIONS_URL;
    });

    // Phone display spans
    var phoneDsps = ['footer-phone-display'];
    phoneDsps.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && typeof CONTACT_PHONE_DISPLAY !== 'undefined') el.textContent = CONTACT_PHONE_DISPLAY;
    });
  }

  // ── MOBILE NAV ─────────────────────────────────────────────
  var _navOpen = false;
  var _savedScroll = 0;

  function lockScroll() {
    _savedScroll = window.scrollY;
    document.body.style.cssText += ';position:fixed;top:-' + _savedScroll + 'px;left:0;right:0;overflow:hidden';
  }
  function unlockScroll() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, _savedScroll);
  }

  function initMobileNav() {
    var hamburger = document.getElementById('hamburger');
    var nav       = document.getElementById('mobile-nav');
    var overlay   = document.getElementById('mobile-nav-overlay');
    if (!hamburger || !nav) return;

    function openNav() {
      _navOpen = true;
      hamburger.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      nav.setAttribute('aria-hidden', 'false');
      nav.classList.add('is-open');
      if (overlay) { overlay.style.display = 'block'; setTimeout(function () { overlay.style.opacity = '1'; }, 10); }
      if (!document.body.style.position) lockScroll();
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    }

    function closeNav() {
      _navOpen = false;
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true');
      nav.classList.remove('is-open');
      if (overlay) { overlay.style.opacity = '0'; setTimeout(function () { overlay.style.display = 'none'; }, 250); }
      unlockScroll();
      hamburger.focus();
    }

    hamburger.addEventListener('click', function () { if (_navOpen) closeNav(); else openNav(); });
    nav.querySelectorAll('a, .mobile-nav__link').forEach(function (link) { link.addEventListener('click', closeNav); });
    if (overlay) overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && _navOpen) closeNav(); });
    window.addEventListener('resize', function () { if (_navOpen && window.innerWidth >= 768) closeNav(); }, { passive: true });
  }

  // ── LANGUAGE TOGGLE ─────────────────────────────────────────
  function initLangToggles() {
    function doToggle() {
      var current;
      try { current = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { current = 'en'; }
      var next = current === 'en' ? 'mr' : 'en';
      try { localStorage.setItem(LANG_KEY, next); } catch (e) {}
      if (typeof window.switchLanguage === 'function') {
        window.switchLanguage();
      } else {
        window.location.reload();
      }
    }
    ['lang-toggle', 'lang-toggle-mobile'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.addEventListener('click', doToggle);
    });
  }

  // ── HEADER SCROLL CLASS ─────────────────────────────────────
  function initHeaderScroll() {
    var h = document.getElementById('site-header');
    if (!h) return;
    window.addEventListener('scroll', function () {
      h.classList.toggle('scrolled', window.scrollY > 8);
    }, { passive: true });
  }

  // ── FOOTER YEAR ─────────────────────────────────────────────
  function setFooterYear() {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ── APPLY LANG LABELS (lang-toggle button text) ────────────
  function applyLangLabel() {
    var lang = getLang();
    var c = (lang === 'mr' && window.CONTENT_MR) ? window.CONTENT_MR : (window.CONTENT_EN || {});
    var label = c.langToggle || (lang === 'en' ? 'म' : 'EN');
    document.querySelectorAll('#lang-toggle-label, .lang-toggle-mobile span').forEach(function (el) {
      el.textContent = label;
    });
    document.documentElement.lang = lang;
  }

  // Exposed for main.js to call after language switch
  window.partialsApplyLangLabel = applyLangLabel;

  // ── HOME COLLECTION NAV ITEM (hide if flag false) ──────────
  function applyHCNavVisibility() {
    if (typeof HOME_COLLECTION_AVAILABLE !== 'undefined' && !HOME_COLLECTION_AVAILABLE) {
      document.querySelectorAll('[href="home-collection.html"], [href="./home-collection.html"]').forEach(function (el) {
        var li = el.closest('li');
        if (li) li.style.display = 'none';
        else el.style.display = 'none';
      });
    }
  }

  // ── BOOT ───────────────────────────────────────────────────
  function init() {
    initMobileNav();
    initLangToggles();
    initHeaderScroll();
    updateCartBadge();
    setFooterYear();
    applyContactHrefs();
    applyLangLabel();
    highlightActiveNav();
    applyHCNavVisibility();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-sync badge when cart changes in another tab
  window.addEventListener('storage', function (e) {
    if (e.key === CART_KEY) updateCartBadge();
  });

}());
