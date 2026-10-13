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

    var call2 = document.getElementById('footer-call-btn-2');
    if (call2 && typeof CONTACT_PHONE_2_TEL !== 'undefined') call2.href = CONTACT_PHONE_2_TEL;

    var call3 = document.getElementById('footer-call-btn-3');
    if (call3 && typeof CONTACT_PHONE_3_TEL !== 'undefined') call3.href = CONTACT_PHONE_3_TEL;

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
    var phoneDsps = [
      { id: 'footer-phone-display', val: typeof CONTACT_PHONE_DISPLAY !== 'undefined' ? CONTACT_PHONE_DISPLAY : null },
      { id: 'footer-phone-display-2', val: typeof CONTACT_PHONE_2_DISPLAY !== 'undefined' ? CONTACT_PHONE_2_DISPLAY : null },
      { id: 'footer-phone-display-3', val: typeof CONTACT_PHONE_3_DISPLAY !== 'undefined' ? CONTACT_PHONE_3_DISPLAY : null }
    ];
    phoneDsps.forEach(function (item) {
      var el = document.getElementById(item.id);
      if (el && item.val) el.textContent = item.val;
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

  // ── MULTI-NUMBER CALL CHOOSER MODAL ─────────────────────────
  function initCallModal() {
    // Inject stylesheet for call chooser modal
    if (!document.getElementById('smear-call-modal-css')) {
      var st = document.createElement('style');
      st.id = 'smear-call-modal-css';
      st.textContent =
        '.smear-call-modal{position:fixed;inset:0;z-index:999999;display:flex;align-items:center;justify-content:center;padding:16px;opacity:0;pointer-events:none;transition:opacity .24s ease}' +
        '.smear-call-modal.is-open{opacity:1;pointer-events:auto}' +
        '.smear-call-modal__backdrop{position:absolute;inset:0;background:rgba(15,23,42,0.65);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}' +
        '.smear-call-modal__card{position:relative;z-index:1;background:#fff;width:100%;max-width:440px;border-radius:20px;box-shadow:0 25px 50px -12px rgba(0,0,0,0.25);overflow:hidden;border:1px solid rgba(226,232,240,0.9);transform:translateY(12px) scale(.97);transition:transform .24s cubic-bezier(.16,1,.3,1)}' +
        '.smear-call-modal.is-open .smear-call-modal__card{transform:translateY(0) scale(1)}' +
        '.smear-call-modal__header{padding:18px 22px;border-bottom:1px solid #f1f5f9;display:flex;align-items:center;justify-content:space-between;background:#f8fafc}' +
        '.smear-call-modal__title-wrap{display:flex;align-items:center;gap:12px}' +
        '.smear-call-modal__icon{width:40px;height:40px;border-radius:10px;background:#0d9488;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
        '.smear-call-modal__title{margin:0;font-size:1.1rem;font-weight:700;color:#0f172a}' +
        '.smear-call-modal__subtitle{margin:2px 0 0;font-size:0.8rem;color:#64748b}' +
        '.smear-call-modal__close{background:none;border:none;font-size:24px;line-height:1;color:#94a3b8;cursor:pointer;padding:4px 8px;border-radius:8px;transition:all .15s}' +
        '.smear-call-modal__close:hover{color:#0f172a;background:#e2e8f0}' +
        '.smear-call-modal__list{padding:16px 20px 20px;display:flex;flex-direction:column;gap:10px}' +
        '.smear-call-option{display:flex;align-items:center;gap:14px;padding:12px 16px;border-radius:14px;background:#fff;border:1.5px solid #e2e8f0;text-decoration:none;color:#0f172a;transition:all .18s ease}' +
        '.smear-call-option:hover{border-color:#0d9488;background:#f0fdfa;transform:translateY(-1px);box-shadow:0 4px 12px rgba(13,148,136,0.12)}' +
        '.smear-call-option__icon{width:36px;height:36px;border-radius:10px;background:rgba(13,148,136,0.12);color:#0d9488;display:flex;align-items:center;justify-content:center;flex-shrink:0}' +
        '.smear-call-option__content{flex:1;min-width:0}' +
        '.smear-call-option__num{font-size:1.02rem;font-weight:700;color:#0f172a}' +
        '.smear-call-option__label{font-size:0.78rem;font-weight:500;color:#64748b;margin-top:1px}' +
        '.smear-call-option__action{font-size:0.82rem;font-weight:600;color:#0d9488;padding:5px 10px;border-radius:6px;background:rgba(13,148,136,0.08);white-space:nowrap}' +
        '.smear-call-option:hover .smear-call-option__action{background:#0d9488;color:#fff}';
      document.head.appendChild(st);
    }

    var modal = document.getElementById('smear-call-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'smear-call-modal';
      modal.className = 'smear-call-modal';
      modal.setAttribute('aria-hidden', 'true');

      var p1Tel = typeof CONTACT_PHONE_TEL !== 'undefined' ? CONTACT_PHONE_TEL : 'tel:+917410745222';
      var p1Dsp = typeof CONTACT_PHONE_DISPLAY !== 'undefined' ? CONTACT_PHONE_DISPLAY : '+91 74107 45222';
      var p2Tel = typeof CONTACT_PHONE_2_TEL !== 'undefined' ? CONTACT_PHONE_2_TEL : 'tel:+919096053901';
      var p2Dsp = typeof CONTACT_PHONE_2_DISPLAY !== 'undefined' ? CONTACT_PHONE_2_DISPLAY : '+91 90960 53901';
      var p3Tel = typeof CONTACT_PHONE_3_TEL !== 'undefined' ? CONTACT_PHONE_3_TEL : 'tel:+919096053801';
      var p3Dsp = typeof CONTACT_PHONE_3_DISPLAY !== 'undefined' ? CONTACT_PHONE_3_DISPLAY : '+91 90960 53801';

      var phoneSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>';

      modal.innerHTML =
        '<div class="smear-call-modal__backdrop" id="smear-call-backdrop"></div>' +
        '<div class="smear-call-modal__card" role="dialog" aria-modal="true" aria-labelledby="smear-call-title">' +
          '<div class="smear-call-modal__header">' +
            '<div class="smear-call-modal__title-wrap">' +
              '<div class="smear-call-modal__icon">' + phoneSvg + '</div>' +
              '<div>' +
                '<h3 id="smear-call-title" class="smear-call-modal__title">Call Smear Pathology</h3>' +
                '<p class="smear-call-modal__subtitle">Select a service number to connect</p>' +
              '</div>' +
            '</div>' +
            '<button type="button" class="smear-call-modal__close" id="smear-call-close" aria-label="Close">&times;</button>' +
          '</div>' +
          '<div class="smear-call-modal__list">' +
            '<a href="' + p1Tel + '" class="smear-call-option">' +
              '<div class="smear-call-option__icon">' + phoneSvg + '</div>' +
              '<div class="smear-call-option__content">' +
                '<div class="smear-call-option__num">' + p1Dsp + '</div>' +
                '<div class="smear-call-option__label">Lab &amp; Main Line</div>' +
              '</div>' +
              '<span class="smear-call-option__action">Call &rarr;</span>' +
            '</a>' +
            '<a href="' + p2Tel + '" class="smear-call-option">' +
              '<div class="smear-call-option__icon">' + phoneSvg + '</div>' +
              '<div class="smear-call-option__content">' +
                '<div class="smear-call-option__num">' + p2Dsp + '</div>' +
                '<div class="smear-call-option__label">Doctor / Service Line 1</div>' +
              '</div>' +
              '<span class="smear-call-option__action">Call &rarr;</span>' +
            '</a>' +
            '<a href="' + p3Tel + '" class="smear-call-option">' +
              '<div class="smear-call-option__icon">' + phoneSvg + '</div>' +
              '<div class="smear-call-option__content">' +
                '<div class="smear-call-option__num">' + p3Dsp + '</div>' +
                '<div class="smear-call-option__label">Doctor / Service Line 2</div>' +
              '</div>' +
              '<span class="smear-call-option__action">Call &rarr;</span>' +
            '</a>' +
          '</div>' +
        '</div>';
      document.body.appendChild(modal);
    }

    function openCallModal(e) {
      if (e) e.preventDefault();
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      lockScroll();
    }

    function closeCallModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      unlockScroll();
    }

    var closeBtn = document.getElementById('smear-call-close');
    var backdrop = document.getElementById('smear-call-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeCallModal);
    if (backdrop) backdrop.addEventListener('click', closeCallModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeCallModal();
    });

    // Wire general Call Now buttons to open the chooser
    var triggers = ['#header-call-btn', '#mobile-call-btn', '#hero-call-btn', '#call-float'];
    triggers.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (btn) {
        btn.addEventListener('click', openCallModal);
      });
    });

    window.openSmearCallModal = openCallModal;
    window.closeSmearCallModal = closeCallModal;
  }

  // ── BOOT ───────────────────────────────────────────────────
  function init() {
    initMobileNav();
    initLangToggles();
    initHeaderScroll();
    updateCartBadge();
    setFooterYear();
    applyContactHrefs();
    initCallModal();
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
