/**
 * ============================================================
 *  SMEAR PATHOLOGY — PARTIALS.JS v5
 *  Injects shared header & footer into every page.
 *  Wires: nav links, language toggle, cart badge, contact hrefs.
 *  Must be loaded AFTER config.js, content.en.js, content.mr.js.
 * ============================================================
 */

(function () {
  'use strict';

  // ── UTILITY ────────────────────────────────────────────────
  var LANG_KEY = 'smear_lang';
  var CART_KEY = 'smear_cart_v1';

  function getLang() {
    try { return localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { return 'en'; }
  }

  function getContent() {
    var lang = getLang();
    return (lang === 'mr' && window.CONTENT_MR) ? window.CONTENT_MR : (window.CONTENT_EN || {});
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // Resolve "relative to root" asset paths from any sub-directory depth
  function rootPath(p) {
    // pages in /packages/ are one level deep; everything else is at root
    var depth = (window.location.pathname.match(/\//g) || []).length - 1;
    if (depth <= 0) return p;
    var prefix = '';
    for (var i = 0; i < depth; i++) prefix += '../';
    return prefix + p;
  }

  // ── CART STATE ─────────────────────────────────────────────
  function cartCount() {
    try {
      var cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
      return Array.isArray(cart) ? cart.reduce(function (n, item) { return n + (item.qty || 1); }, 0) : 0;
    } catch (e) { return 0; }
  }

  function updateCartBadge() {
    var count = cartCount();
    document.querySelectorAll('.cart-badge').forEach(function (el) {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  // Allow other scripts to trigger a badge refresh
  window.refreshCartBadge = updateCartBadge;

  // ── WA SVG ─────────────────────────────────────────────────
  var WA_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M16 0C7.163 0 0 7.163 0 16c0 2.822.736 5.469 2.023 7.773L0 32l8.466-2.018A15.93 15.93 0 0016 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.222 22.403c-.347.974-2.017 1.859-2.777 1.977-.71.11-1.608.155-2.592-.163-.599-.19-1.369-.445-2.352-.871-4.14-1.784-6.845-5.959-7.052-6.237-.208-.278-1.693-2.252-1.693-4.296 0-2.043 1.073-3.049 1.453-3.463.381-.413.832-.516 1.108-.516.278 0 .555.003.798.013.255.012.597-.097.934.713.347.832 1.179 2.876 1.284 3.085.104.208.174.451.035.728-.139.278-.208.451-.415.694-.208.243-.437.543-.624.729-.208.208-.424.432-.182.847.242.416 1.076 1.776 2.31 2.878 1.587 1.41 2.926 1.847 3.342 2.054.416.208.659.174.902-.104.243-.278 1.041-1.214 1.318-1.63.278-.416.555-.347.937-.208.381.139 2.422 1.143 2.838 1.351.416.208.693.312.797.486.104.173.104 1.006-.242 1.98z"/></svg>';
  var CALL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z"/></svg>';
  var CART_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" width="20" height="20"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>';

  // ── HEADER HTML ────────────────────────────────────────────
  function buildHeader(c) {
    var root = rootPath('');
    var cartHref = root + 'cart.html';
    var shopHref = root + 'shop.html';
    var homeHref = root + 'index.html';
    var homeCollHref = root + 'home-collection.html';

    // Detect current page for active nav link
    var path = window.location.pathname;
    function isActive(p) { return path.indexOf(p) !== -1 ? ' nav-link--active' : ''; }

    var nav = c.nav || {};

    return '' +
      '<header id="site-header" class="site-header" role="banner">' +
      '  <div class="container header-inner">' +
      '    <a href="' + homeHref + '" class="header-logo" aria-label="Smear Pathology — Home">' +
      '      <img src="' + root + 'public/assets/logo/logo.png" alt="Smear Pathology logo" class="header-logo__img" id="logo-img"' +
      '        onerror="this.style.display=\'none\';document.getElementById(\'logo-text\').style.display=\'block\'" />' +
      '      <span id="logo-text" class="header-logo__text" style="display:none">' +
      '        <span class="logo-text-smear">Smear</span><span class="logo-text-path">Pathology</span>' +
      '      </span>' +
      '    </a>' +

      '    <nav class="header-nav" aria-label="Main navigation">' +
      '      <a href="' + homeHref + '" class="nav-link' + isActive('index') + '">' + esc(nav.home || 'Home') + '</a>' +
      '      <a href="' + shopHref + '" class="nav-link' + isActive('shop') + '">' + esc(nav.shop || 'Shop') + '</a>' +
      (HOME_COLLECTION_AVAILABLE ? '      <a href="' + homeCollHref + '" class="nav-link' + isActive('home-collection') + '">' + esc(nav.homeCollection || 'Home Collection') + '</a>' : '') +
      '      <a href="' + homeHref + '#about" class="nav-link">' + esc(nav.about || 'About') + '</a>' +
      '      <a href="' + homeHref + '#contact" class="nav-link">' + esc(nav.contact || 'Contact') + '</a>' +
      '    </nav>' +

      '    <div class="header-ctas" aria-label="Quick contact">' +
      '      <a href="' + CONTACT_PHONE_TEL + '" id="header-call-btn" class="btn-icon btn-icon--call" aria-label="Call Smear Pathology">' +
      CALL_SVG + '<span>' + esc((c.header || {}).callBtn || 'Call Now') + '</span></a>' +
      '      <a href="' + CONTACT_WHATSAPP_URL + '" id="header-wa-btn" class="btn-icon btn-icon--whatsapp" aria-label="WhatsApp Smear Pathology" target="_blank" rel="noopener noreferrer">' +
      WA_SVG + '<span>' + esc((c.header || {}).waBtn || 'WhatsApp') + '</span></a>' +
      '      <a href="' + cartHref + '" class="btn-icon btn-icon--cart" aria-label="View cart" id="header-cart-btn">' +
      CART_SVG +
      '        <span class="cart-badge" style="display:none" aria-live="polite" aria-label="Items in cart">0</span>' +
      '      </a>' +
      '      <button id="lang-toggle" class="lang-toggle" aria-label="Switch language" title="Switch language">' +
      '        <span id="lang-toggle-label">' + esc((c.langToggle) || 'म') + '</span>' +
      '      </button>' +
      '    </div>' +

      '    <button id="hamburger" class="hamburger" aria-label="Open menu" aria-expanded="false" aria-controls="mobile-nav">' +
      '      <span></span><span></span><span></span>' +
      '    </button>' +
      '  </div>' +

      '  <div id="mobile-nav" class="mobile-nav" aria-hidden="true">' +
      '    <nav aria-label="Mobile navigation">' +
      '      <a href="' + homeHref + '" class="mobile-nav__link">' + esc(nav.home || 'Home') + '</a>' +
      '      <a href="' + shopHref + '" class="mobile-nav__link">' + esc(nav.shop || 'Shop') + '</a>' +
      (HOME_COLLECTION_AVAILABLE ? '      <a href="' + homeCollHref + '" class="mobile-nav__link">' + esc(nav.homeCollection || 'Home Collection') + '</a>' : '') +
      '      <a href="' + homeHref + '#about" class="mobile-nav__link">' + esc(nav.about || 'About') + '</a>' +
      '      <a href="' + homeHref + '#contact" class="mobile-nav__link">' + esc(nav.contact || 'Contact') + '</a>' +
      '      <a href="' + cartHref + '" class="mobile-nav__link" id="mobile-cart-link">' +
      CART_SVG + ' <span>' + esc((c.header || {}).cartBtn || 'My Cart') + '</span>' +
      '        <span class="cart-badge" style="display:none" aria-live="polite">0</span>' +
      '      </a>' +
      '    </nav>' +
      '    <div class="mobile-nav__ctas">' +
      '      <a href="' + CONTACT_PHONE_TEL + '" id="mobile-call-btn" class="btn btn--outline-white btn--full">' +
      CALL_SVG + '<span>' + esc((c.header || {}).callBtn || 'Call Now') + '</span></a>' +
      '      <a href="' + CONTACT_WHATSAPP_URL + '" id="mobile-wa-btn" class="btn btn--green btn--full" target="_blank" rel="noopener noreferrer">' +
      WA_SVG + '<span>' + esc((c.floatBtn) || 'WhatsApp Us') + '</span></a>' +
      '      <button id="lang-toggle-mobile" class="btn btn--outline-white btn--full lang-toggle-mobile" aria-label="Switch language">' +
      '        <span>' + esc((c.langToggle) || 'म') + '</span>' +
      '      </button>' +
      '    </div>' +
      '  </div>' +
      '</header>' +
      '<div id="mobile-nav-overlay" class="mobile-nav-overlay" aria-hidden="true" style="display:none;opacity:0"></div>';
  }

  // ── FOOTER HTML ────────────────────────────────────────────
  function buildFooter(c) {
    var root = rootPath('');
    var f = c.footer || {};
    var nav = c.nav || {};

    return '' +
      '<footer class="site-footer" role="contentinfo">' +
      '  <div class="container footer-grid">' +
      '    <div class="footer-brand">' +
      '      <a href="' + root + 'index.html" class="footer-logo-link" aria-label="Smear Pathology home">' +
      '        <img src="' + root + 'public/assets/logo/logo.png" alt="Smear Pathology" class="footer-logo-img" loading="lazy"' +
      '          onerror="this.style.display=\'none\'" />' +
      '      </a>' +
      '      <p class="footer-tagline">' + esc(f.tagline || 'The Most Trusted Laboratory of Indapur') + '</p>' +
      '      <p class="footer-seo-line">' + esc(f.seoLine || '') + '</p>' +
      '    </div>' +

      '    <div class="footer-col">' +
      '      <h3 class="footer-col__title">' + esc(f.navTitle || 'Navigation') + '</h3>' +
      '      <nav aria-label="Footer navigation">' +
      '        <a href="' + root + 'index.html" class="footer-link">' + esc(nav.home || 'Home') + '</a>' +
      '        <a href="' + root + 'shop.html" class="footer-link">' + esc(nav.shop || 'Shop') + '</a>' +
      (HOME_COLLECTION_AVAILABLE ? '        <a href="' + root + 'home-collection.html" class="footer-link">' + esc(nav.homeCollection || 'Home Collection') + '</a>' : '') +
      '        <a href="' + root + 'index.html#about" class="footer-link">' + esc(nav.about || 'About') + '</a>' +
      '        <a href="' + root + 'index.html#contact" class="footer-link">' + esc(nav.contact || 'Contact') + '</a>' +
      '        <a href="' + root + 'terms.html" class="footer-link">' + esc(f.termsLink || 'Terms & Conditions') + '</a>' +
      '        <a href="' + root + 'privacy.html" class="footer-link">' + esc(f.privacyLink || 'Privacy Policy') + '</a>' +
      '      </nav>' +
      '    </div>' +

      '    <div class="footer-col">' +
      '      <h3 class="footer-col__title">' + esc(f.contactTitle || 'Contact') + '</h3>' +
      '      <a href="' + CONTACT_PHONE_TEL + '" id="footer-call-btn" class="footer-contact__link">' + esc(CONTACT_PHONE_DISPLAY) + '</a>' +
      '      <a href="' + CONTACT_WHATSAPP_URL + '" id="footer-wa-btn" class="footer-contact__link" target="_blank" rel="noopener noreferrer">' + esc(f.waLink || 'WhatsApp') + '</a>' +
      '      <a href="' + CONTACT_EMAIL_HREF + '" id="footer-email-btn" class="footer-contact__link email-display">' + esc(CONTACT_EMAIL) + '</a>' +
      '      <a href="' + MAP_DIRECTIONS_URL + '" id="footer-directions-btn" class="footer-contact__link" target="_blank" rel="noopener noreferrer">' + esc(f.directionsLink || 'Get Directions') + '</a>' +
      '      <a href="' + INSTAGRAM_URL + '" class="footer-contact__link" target="_blank" rel="noopener noreferrer">Instagram</a>' +
      '    </div>' +
      '  </div>' +

      '  <div class="footer-bottom">' +
      '    <div class="container footer-bottom-inner">' +
      '      <p class="footer-copy">&copy; <span id="footer-year"></span> Smear Pathology. ' +
      esc(f.copyright || 'All rights reserved.') + ' | Indapur, Pune, Maharashtra.</p>' +
      '      <p class="footer-legal-links">' +
      '        <a href="' + root + 'terms.html">' + esc(f.termsLink || 'Terms & Conditions') + '</a> &middot; ' +
      '        <a href="' + root + 'privacy.html">' + esc(f.privacyLink || 'Privacy Policy') + '</a>' +
      '      </p>' +
      '      <p class="footer-developer">Website designed &amp; developed by ' +
      '        <a href="https://www.instagram.com/srjj.png/?hl=en" target="_blank" rel="noopener noreferrer">Suraj Yadav</a> | ' +
      '        <a href="https://www.linkedin.com/in/surajyadav07" target="_blank" rel="noopener noreferrer">LinkedIn</a> | ' +
      '        <a href="https://github.com/SurajYadavx" target="_blank" rel="noopener noreferrer">GitHub</a>' +
      '      </p>' +
      '    </div>' +
      '  </div>' +
      '</footer>';
  }

  // ── LANGUAGE APPLICATION ────────────────────────────────────
  function applyLangToPartials(lang) {
    var c = (lang === 'mr' && window.CONTENT_MR) ? window.CONTENT_MR : (window.CONTENT_EN || {});
    // update lang-toggle labels
    ['lang-toggle-label'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = c.langToggle || 'म';
    });
    document.querySelectorAll('.lang-toggle-mobile span').forEach(function (el) {
      el.textContent = c.langToggle || 'म';
    });
    // update html lang attr
    document.documentElement.lang = lang;
  }

  // ── MOBILE NAV INIT ─────────────────────────────────────────
  var _mobileNavOpen = false;
  var _scrollY = 0;
  function lockScrollPartial() {
    _scrollY = window.scrollY;
    document.body.style.cssText += ';position:fixed;top:-' + _scrollY + 'px;left:0;right:0;overflow:hidden';
  }
  function unlockScrollPartial() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, _scrollY);
  }

  function initMobileNav() {
    var hamburger = document.getElementById('hamburger');
    var nav = document.getElementById('mobile-nav');
    var overlay = document.getElementById('mobile-nav-overlay');
    if (!hamburger || !nav) return;

    function openNav() {
      _mobileNavOpen = true;
      hamburger.classList.add('open'); hamburger.setAttribute('aria-expanded', 'true');
      nav.setAttribute('aria-hidden', 'false'); nav.classList.add('is-open');
      if (overlay) { overlay.style.display = 'block'; setTimeout(function () { overlay.style.opacity = '1'; }, 10); }
      // Only lock scroll if no other scroll lock is active (e.g. lang popup)
      if (!document.body.style.position) lockScrollPartial();
      var first = nav.querySelector('a,button'); if (first) first.focus();
    }
    function closeNav() {
      _mobileNavOpen = false;
      hamburger.classList.remove('open'); hamburger.setAttribute('aria-expanded', 'false');
      nav.setAttribute('aria-hidden', 'true'); nav.classList.remove('is-open');
      if (overlay) { overlay.style.opacity = '0'; setTimeout(function () { overlay.style.display = 'none'; }, 250); }
      unlockScrollPartial();
      hamburger.focus();
    }

    hamburger.addEventListener('click', function () { if (_mobileNavOpen) closeNav(); else openNav(); });
    nav.querySelectorAll('a,.mobile-nav__link').forEach(function (link) { link.addEventListener('click', closeNav); });
    if (overlay) overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && _mobileNavOpen) closeNav(); });
    window.addEventListener('resize', function () { if (_mobileNavOpen && window.innerWidth >= 768) closeNav(); }, { passive: true });
  }

  // ── LANGUAGE TOGGLE INIT ────────────────────────────────────
  function initLangToggles() {
    function doToggle() {
      var current;
      try { current = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { current = 'en'; }
      var next = current === 'en' ? 'mr' : 'en';
      try { localStorage.setItem(LANG_KEY, next); } catch (e) {}
      // Fire the main app's switchLanguage if available, else reload
      if (typeof window.switchLanguage === 'function') {
        window.switchLanguage();
      } else {
        window.location.reload();
      }
    }
    var t1 = document.getElementById('lang-toggle');
    var t2 = document.getElementById('lang-toggle-mobile');
    if (t1) t1.addEventListener('click', doToggle);
    if (t2) t2.addEventListener('click', doToggle);
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
  function setYear() {
    var el = document.getElementById('footer-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  // ── FLOATING BUTTONS ────────────────────────────────────────
  function buildFloatingButtons() {
    // Only inject if not already present (index.html already has them)
    if (document.getElementById('whatsapp-float')) return;
    var el = document.createElement('div');
    el.innerHTML = '' +
      '<a id="whatsapp-float" href="' + CONTACT_WHATSAPP_URL + '" aria-label="Chat on WhatsApp" class="whatsapp-float" target="_blank" rel="noopener noreferrer">' +
      WA_SVG.replace('width="18" height="18"','') +
      '<span class="whatsapp-float__label">WhatsApp Us</span></a>' +
      '<a id="call-float" href="' + CONTACT_PHONE_TEL + '" class="call-float" aria-label="Call Smear Pathology">' +
      CALL_SVG.replace('width="18" height="18"','') +
      '<span>Call Now</span></a>';
    document.body.appendChild(el.firstElementChild);
    document.body.appendChild(el.lastElementChild);
  }

  // ── CONTACT HREF WIRING ─────────────────────────────────────
  // Runs on every page (including index.html which has hardcoded #href values
  // that need to be replaced with real config values).
  function applyContactHrefs() {
    var callBtns = ['header-call-btn', 'mobile-call-btn', 'footer-call-btn', 'call-float'];
    callBtns.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = CONTACT_PHONE_TEL;
    });
    var waBtns = ['header-wa-btn', 'mobile-wa-btn', 'footer-wa-btn', 'whatsapp-float', 'hc-wa-book', 'hc-cs-wa', 'lead-success-call'];
    waBtns.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) {
        if (id === 'lead-success-call') el.href = CONTACT_PHONE_TEL;
        else el.href = CONTACT_WHATSAPP_URL;
      }
    });
    var emailBtns = ['footer-email-btn'];
    emailBtns.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = CONTACT_EMAIL_HREF;
    });
    var dirBtns = ['footer-directions-btn', 'contact-directions-btn'];
    dirBtns.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = MAP_DIRECTIONS_URL;
    });
    var phoneDsps = ['footer-phone-display'];
    phoneDsps.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = CONTACT_PHONE_DISPLAY;
    });
  }

  // ── MAIN INJECT ─────────────────────────────────────────────
  function injectPartials() {
    var lang = getLang();
    var c = (lang === 'mr' && window.CONTENT_MR) ? window.CONTENT_MR : (window.CONTENT_EN || {});

    // Detect slot type:
    //   <div id="site-header"> → new page, inject full header
    //   <header id="site-header"> → index.html, just wire up cart badge & lang toggles
    var headerSlot = document.getElementById('site-header');
    var isSlot = headerSlot && headerSlot.tagName === 'DIV';
    var isRealHeader = headerSlot && headerSlot.tagName === 'HEADER';

    if (isSlot) {
      // Replace the div slot with the real header HTML
      var tmp = document.createElement('div');
      tmp.innerHTML = buildHeader(c);
      // Insert header
      headerSlot.outerHTML = tmp.firstElementChild.outerHTML;
      // Insert overlay (second element from innerHTML)
      var overlay = tmp.lastElementChild;
      if (overlay && overlay.id === 'mobile-nav-overlay') {
        var hdr = document.getElementById('site-header');
        if (hdr) hdr.insertAdjacentElement('afterend', overlay);
      }
    }

    // Inject footer — only if slot is a div (on all pages except any that built their own footer)
    var footerSlot = document.getElementById('site-footer');
    if (footerSlot && footerSlot.tagName === 'DIV') {
      var tmp2 = document.createElement('div');
      tmp2.innerHTML = buildFooter(c);
      footerSlot.outerHTML = tmp2.firstElementChild.outerHTML;
    }

    // For index.html (real header), floating buttons are already in the HTML
    // For new pages, they're in partials (already injected above) or in page HTML
    if (isSlot) {
      buildFloatingButtons();
    }

    // Wire up ALL pages (both real header and slot-injected)
    initMobileNav();
    initLangToggles();
    initHeaderScroll();
    updateCartBadge();
    setYear();

    // Apply contact hrefs from config (safe to run on any page)
    applyContactHrefs();

    // Apply correct lang labels immediately
    applyLangToPartials(lang);
  }

  // ── BOOT ───────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPartials);
  } else {
    injectPartials();
  }

  // Expose for external re-render on lang switch
  window.partialsReinject = function () {
    // Re-render footer and header lang labels only (avoid full re-inject which resets event listeners)
    var lang = getLang();
    applyLangToPartials(lang);
    updateCartBadge();
  };

  // Listen for storage changes (cart updated in another tab)
  window.addEventListener('storage', function (e) {
    if (e.key === CART_KEY) updateCartBadge();
  });

}());
