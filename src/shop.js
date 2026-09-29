/**
 * ============================================================
 *  SMEAR PATHOLOGY — SHOP.JS v5
 *  Page-specific logic for shop.html.
 *  Reuses window.PACKAGE_DATA, window.TEST_CATALOGUE from packages.js.
 *  Uses window.SmearCart from cart.js.
 *  Relies on config.js for contact constants.
 * ============================================================
 */

(function () {
  'use strict';

  var LANG_KEY = 'smear_lang';

  function getLang() {
    try { return localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { return 'en'; }
  }
  function getContent() {
    var lang = getLang();
    return (lang === 'mr' && window.CONTENT_MR) ? window.CONTENT_MR : (window.CONTENT_EN || {});
  }

  // ── HELPERS ────────────────────────────────────────────────
  function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function waLink(name, price) {
    var msg = 'Hi, I would like to know more about the ' + name + (price ? ' (\u20b9' + price + ')' : '') + ' at Smear Pathology. Please share details.';
    return 'https://wa.me/91' + CONTACT_PHONE + '?text=' + encodeURIComponent(msg);
  }

  function pct(mrp, price) {
    if (!mrp || !price || mrp <= price) return 0;
    return Math.round(((mrp - price) / mrp) * 100);
  }

  // ── CATEGORY FILTER CHIPS ──────────────────────────────────
  var _activeCategory = 'All';

  function buildCategoryChips(packages) {
    var container = document.getElementById('shop-category-filters');
    if (!container) return;

    var cats = ['All'];
    packages.forEach(function (p) {
      var cat = p.category || p.concern || 'General';
      if (cats.indexOf(cat) === -1) cats.push(cat);
    });

    container.innerHTML = '';
    cats.forEach(function (cat) {
      var btn = document.createElement('button');
      btn.className = 'filter-chip' + (cat === _activeCategory ? ' filter-chip--active' : '');
      btn.textContent = cat;
      btn.setAttribute('aria-pressed', cat === _activeCategory ? 'true' : 'false');
      btn.addEventListener('click', function () {
        _activeCategory = cat;
        container.querySelectorAll('.filter-chip').forEach(function (b) {
          var active = b.textContent === cat;
          b.classList.toggle('filter-chip--active', active);
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        renderPackages(getCurrentPackages());
      });
      container.appendChild(btn);
    });
  }

  // ── PACKAGE CARD ───────────────────────────────────────────
  function buildPackageCard(pkg, lang) {
    var c = getContent();
    var name    = (lang === 'mr' && pkg.nameMr) ? pkg.nameMr : (pkg.name || '');
    var tagline = (lang === 'mr' && pkg.taglineMr) ? pkg.taglineMr : (pkg.tagline || '');
    var price   = pkg.price || 0;
    var mrp     = pkg.mrp  || 0;
    var slug    = pkg.slug || '';
    var imgSrc  = pkg.image ? 'public/assets/packages/' + pkg.image : '';
    var hc      = pkg.homeCollection || false;
    var discount = pct(mrp, price);
    var cat = pkg.category || pkg.concern || '';

    var card = document.createElement('div');
    card.className = 'shop-pkg-card';
    card.setAttribute('role', 'article');

    var imgHtml = imgSrc
      ? '<img src="' + esc(imgSrc) + '" alt="' + esc(name) + '" loading="lazy" decoding="async" />'
      : '<div class="shop-pkg-card__img-placeholder" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="12" fill="rgba(13,59,62,0.06)"/><path d="M20 44l10-12 8 8 6-7 10 11H20z" fill="rgba(13,59,62,0.15)"/><circle cx="42" cy="22" r="5" fill="rgba(13,59,62,0.15)"/></svg></div>';

    var discBadge  = discount > 0 ? '<span class="shop-pkg-card__discount-badge">' + discount + '% OFF</span>' : '';
    var hcBadge    = hc ? '<span class="shop-pkg-card__hc-badge"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>Home</span>' : '';

    var testsArr = pkg.tests || pkg.includes || [];
    var chipsHtml = '';
    if (testsArr.length > 0) {
      var visible = testsArr.slice(0, 4);
      var remaining = testsArr.length - 4;
      chipsHtml = '<div class="shop-pkg-card__chips">' +
        visible.map(function (t) {
          var label = typeof t === 'string' ? t : (t.name || '');
          return '<span class="shop-pkg-card__chip">' + esc(label) + '</span>';
        }).join('') +
        (remaining > 0 ? '<span class="shop-pkg-card__chip">+' + remaining + ' more</span>' : '') +
        '</div>';
    }

    var priceHtml = '<div class="shop-pkg-card__price-row">' +
      '<span class="shop-pkg-card__price">\u20b9' + price + '</span>' +
      (mrp && mrp > price ? '<span class="shop-pkg-card__mrp">\u20b9' + mrp + '</span>' : '') +
      '</div>';

    var detailsHref = slug ? 'packages/' + slug + '.html' : 'shop.html';

    card.innerHTML = '' +
      '<div class="shop-pkg-card__img-wrap">' + imgHtml + discBadge + hcBadge + '</div>' +
      '<div class="shop-pkg-card__body">' +
        (cat ? '<p class="shop-pkg-card__category">' + esc(cat) + '</p>' : '') +
        '<h3 class="shop-pkg-card__name">' + esc(name) + '</h3>' +
        (tagline ? '<p class="shop-pkg-card__tagline">' + esc(tagline) + '</p>' : '') +
        chipsHtml +
        priceHtml +
        '<div class="shop-pkg-card__actions">' +
          '<button class="btn btn--add-cart" data-pkg-id="' + esc(pkg.id || name) + '" data-pkg-name="' + esc(name) + '" data-pkg-price="' + price + '">Add to Cart</button>' +
          '<a href="' + esc(detailsHref) + '" class="btn btn--view-details">Details</a>' +
        '</div>' +
      '</div>';

    // Wire Add to Cart
    card.querySelector('.btn--add-cart').addEventListener('click', function () {
      window.SmearCart.add(pkg.id || name, 'package', name, price);
    });

    return card;
  }

  // ── TEST CARD ──────────────────────────────────────────────
  function buildTestCard(test, lang) {
    var name  = (lang === 'mr' && test.nameMr) ? test.nameMr : (test.name || '');
    var price = test.price || 0;
    var meta  = test.prepInfo || test.turnaround || '';

    var card = document.createElement('div');
    card.className = 'shop-test-card';
    card.setAttribute('role', 'article');

    card.innerHTML = '' +
      '<div class="shop-test-card__info">' +
        '<p class="shop-test-card__name">' + esc(name) + '</p>' +
        (meta ? '<p class="shop-test-card__meta">' + esc(meta) + '</p>' : '') +
      '</div>' +
      (price ? '<span class="shop-test-card__price">\u20b9' + price + '</span>' : '') +
      '<button class="shop-test-card__add btn" data-test-id="' + esc(test.id || name) + '" data-test-name="' + esc(name) + '" data-test-price="' + price + '">Add</button>';

    card.querySelector('.shop-test-card__add').addEventListener('click', function () {
      window.SmearCart.add(test.id || name, 'test', name, price);
    });

    return card;
  }

  // ── RENDER ─────────────────────────────────────────────────
  var _currentSearch = '';

  function getCurrentPackages() {
    var data = (window.PACKAGE_DATA || []);
    var lang = getLang();
    return data.filter(function (pkg) {
      var name = (lang === 'mr' && pkg.nameMr) ? pkg.nameMr : (pkg.name || '');
      // Category filter
      if (_activeCategory !== 'All') {
        var cat = pkg.category || pkg.concern || '';
        if (cat !== _activeCategory) return false;
      }
      // Search filter
      if (_currentSearch) {
        var q = _currentSearch.toLowerCase();
        if (name.toLowerCase().indexOf(q) === -1 &&
            (pkg.tagline || '').toLowerCase().indexOf(q) === -1 &&
            (pkg.category || '').toLowerCase().indexOf(q) === -1) {
          return false;
        }
      }
      return true;
    });
  }

  function getCurrentTests() {
    var data = (window.TEST_CATALOGUE || []);
    var lang = getLang();
    return data.filter(function (t) {
      var name = (lang === 'mr' && t.nameMr) ? t.nameMr : (t.name || '');
      if (_currentSearch) {
        var q = _currentSearch.toLowerCase();
        if (name.toLowerCase().indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function renderPackages(packages) {
    var grid = document.getElementById('shop-package-grid');
    if (!grid) return;
    var lang = getLang();
    grid.innerHTML = '';
    if (packages.length === 0) {
      grid.innerHTML = '<p class="no-results" style="color:#5a7070;padding:20px 0;grid-column:1/-1">No packages found. <a href="shop.html">Clear search</a></p>';
      return;
    }
    packages.forEach(function (pkg) { grid.appendChild(buildPackageCard(pkg, lang)); });
  }

  function renderTests(tests) {
    var grid = document.getElementById('shop-test-grid');
    if (!grid) return;
    var lang = getLang();
    grid.innerHTML = '';
    tests.forEach(function (t) { grid.appendChild(buildTestCard(t, lang)); });
  }

  function renderAll() {
    renderPackages(getCurrentPackages());
    renderTests(getCurrentTests());
  }

  // ── SEARCH ─────────────────────────────────────────────────
  function initSearch() {
    var input = document.getElementById('shop-search-input');
    if (!input) return;
    var timer;
    input.addEventListener('input', function () {
      clearTimeout(timer);
      var val = input.value.trim();
      timer = setTimeout(function () {
        _currentSearch = val;
        renderAll();
      }, 250);
    });
  }

  // ── HOME COLLECTION BANNER ─────────────────────────────────
  function initHCBanner() {
    var banner = document.getElementById('shop-home-coll-banner');
    if (banner && !HOME_COLLECTION_AVAILABLE) banner.style.display = 'none';
  }

  // ── LEAD CARD (inline on shop.html) ───────────────────────
  function initLeadCard() {
    var form    = document.getElementById('shop-lead-form');
    var nameEl  = document.getElementById('lead-name');
    var phoneEl = document.getElementById('lead-phone');
    var termsEl = document.getElementById('lead-terms');
    var waOptEl = document.getElementById('lead-wa-opt');
    var submitEl = document.getElementById('lead-submit-btn');
    var successEl = document.getElementById('lead-card-success');
    var callEl    = document.getElementById('lead-success-call');
    if (!form) return;

    if (callEl) callEl.href = CONTACT_PHONE_TEL;

    function updateSubmit() {
      var valid = nameEl && nameEl.value.trim().length >= 2 &&
                  phoneEl && /^\d{10}$/.test(phoneEl.value.trim()) &&
                  termsEl && termsEl.checked;
      if (submitEl) submitEl.disabled = !valid;
    }

    [nameEl, phoneEl, termsEl, waOptEl].forEach(function (el) {
      if (el) el.addEventListener(el.type === 'checkbox' ? 'change' : 'input', updateSubmit);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name   = nameEl ? nameEl.value.trim() : '';
      var phone  = phoneEl ? phoneEl.value.trim() : '';
      var waOpt  = waOptEl ? waOptEl.checked : false;
      var msg = 'Hi, I am ' + name + ' (' + phone + '). I need help booking a test at Smear Pathology.' +
                (waOpt ? ' Please send me updates on WhatsApp.' : '');
      var url = 'https://wa.me/91' + CONTACT_PHONE + '?text=' + encodeURIComponent(msg);
      window.open(url, '_blank', 'noopener,noreferrer');
      if (form) form.style.display = 'none';
      if (successEl) successEl.style.display = 'flex';
    });
  }

  // ── INIT ───────────────────────────────────────────────────
  function init() {
    var packages = window.PACKAGE_DATA || [];
    buildCategoryChips(packages);
    renderAll();
    initSearch();
    initHCBanner();
    initLeadCard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
