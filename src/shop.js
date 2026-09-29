/**
 * ============================================================
 *  SMEAR PATHOLOGY — SHOP.JS v5.1
 *  Page-specific logic for shop.html.
 *  Reads:  window.PACKAGE_DATA   (flat array, packages.js)
 *          window.TEST_CATALOGUE (flat array, tests.js)
 *          window.SmearCart      (cart.js)
 *          window.CONTACT_*      (config.js)
 * ============================================================
 */

(function () {
  'use strict';

  var LANG_KEY = 'smear_lang';

  function getLang() { try { return localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { return 'en'; } }
  function esc(s)    { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function t(item, field) {
    // Returns Marathi value if available and language is mr, else English
    var lang = getLang();
    var mrKey = field + 'Mr';
    if (lang === 'mr' && item[mrKey]) return item[mrKey];
    return item[field] || '';
  }

  // ── CATEGORY FILTER CHIPS ──────────────────────────────────
  var _activeCategory = 'All';

  function buildCategoryChips(packages) {
    var container = document.getElementById('shop-category-filters');
    if (!container) return;

    var lang = getLang();
    var cats = ['All'];
    var catMr = { All: 'सर्व' };
    packages.forEach(function (p) {
      var cat = p.category || 'General';
      if (cats.indexOf(cat) === -1) {
        cats.push(cat);
        catMr[cat] = p.categoryMr || cat;
      }
    });

    container.innerHTML = '';
    cats.forEach(function (cat) {
      var label = (lang === 'mr' && catMr[cat]) ? catMr[cat] : cat;
      var btn = document.createElement('button');
      btn.className = 'filter-chip' + (cat === _activeCategory ? ' filter-chip--active' : '');
      btn.textContent = label;
      btn.setAttribute('aria-pressed', cat === _activeCategory ? 'true' : 'false');
      btn.addEventListener('click', function () {
        _activeCategory = cat;
        container.querySelectorAll('.filter-chip').forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('filter-chip--active', active);
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        renderAll();
      });
      container.appendChild(btn);
    });
  }

  // ── PACKAGE CARD ───────────────────────────────────────────
  function buildPackageCard(pkg) {
    var name    = t(pkg, 'name');
    var tagline = t(pkg, 'tagline');
    var cat     = t(pkg, 'category');
    var price   = pkg.price || 0;
    var mrp     = pkg.mrp || 0;
    var slug    = pkg.slug || pkg.id || '';
    var hc      = pkg.homeCollection || false;
    var discount = (mrp && mrp > price) ? Math.round(((mrp - price) / mrp) * 100) : 0;

    var testsArr = pkg.profiles || [];
    var allTests = [];
    testsArr.forEach(function (g) { (g.tests || []).forEach(function (tt) { allTests.push(tt); }); });
    var chips = allTests.slice(0, 4);
    var extra = allTests.length - 4;

    var card = document.createElement('div');
    card.className = 'shop-pkg-card';
    card.setAttribute('role', 'article');

    var imgHtml = pkg.image
      ? '<img src="public/assets/packages/' + esc(pkg.image) + '" alt="' + esc(name) + '" loading="lazy" decoding="async" />'
      : '<div class="shop-pkg-card__img-placeholder" aria-hidden="true">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" width="64" height="64">' +
          '<rect width="64" height="64" rx="12" fill="rgba(13,59,62,0.06)"/>' +
          '<path d="M10 48l12-16 10 10 8-10 14 16H10z" fill="rgba(13,59,62,0.14)"/>' +
          '<circle cx="44" cy="20" r="6" fill="rgba(13,59,62,0.14)"/>' +
          '</svg></div>';

    card.innerHTML =
      '<div class="shop-pkg-card__img-wrap">' + imgHtml +
        (discount > 0 ? '<span class="shop-pkg-card__discount-badge">' + discount + '% OFF</span>' : '') +
        (hc ? '<span class="shop-pkg-card__hc-badge"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="10" height="10"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>Home</span>' : '') +
      '</div>' +
      '<div class="shop-pkg-card__body">' +
        (cat ? '<p class="shop-pkg-card__category">' + esc(cat) + '</p>' : '') +
        '<h3 class="shop-pkg-card__name">' + esc(name) + '</h3>' +
        (tagline ? '<p class="shop-pkg-card__tagline">' + esc(tagline) + '</p>' : '') +
        (chips.length > 0 ?
          '<div class="shop-pkg-card__chips">' +
            chips.map(function (tt) { return '<span class="shop-pkg-card__chip">' + esc(tt) + '</span>'; }).join('') +
            (extra > 0 ? '<span class="shop-pkg-card__chip">+' + extra + ' more</span>' : '') +
          '</div>' : '') +
        '<div class="shop-pkg-card__price-row">' +
          '<span class="shop-pkg-card__price">\u20b9' + price + '</span>' +
          (mrp && mrp > price ? '<span class="shop-pkg-card__mrp">\u20b9' + mrp + '</span>' : '') +
        '</div>' +
        '<div class="shop-pkg-card__actions">' +
          '<button class="btn btn--add-cart" type="button">Add to Cart</button>' +
          '<a href="packages/' + esc(slug) + '.html" class="btn btn--view-details">Details</a>' +
        '</div>' +
      '</div>';

    card.querySelector('.btn--add-cart').addEventListener('click', function () {
      if (window.SmearCart) window.SmearCart.add(pkg.id, 'package', name, price);
      else alert('Cart unavailable');
    });

    return card;
  }

  // ── TEST CARD ──────────────────────────────────────────────
  function buildTestCard(test) {
    var name     = t(test, 'name');
    var price    = test.price || 0;
    var category = t(test, 'category');
    var desc     = test.description || '';

    var card = document.createElement('div');
    card.className = 'shop-test-card';
    card.setAttribute('role', 'article');

    card.innerHTML =
      '<div class="shop-test-card__info">' +
        '<p class="shop-test-card__name">' + esc(name) + '</p>' +
        (desc ? '<p class="shop-test-card__meta">' + esc(desc) + '</p>' : '') +
      '</div>' +
      (price ? '<span class="shop-test-card__price">\u20b9' + price + '</span>' : '') +
      '<button class="shop-test-card__add btn" type="button">Add</button>';

    card.querySelector('.shop-test-card__add').addEventListener('click', function () {
      if (window.SmearCart) window.SmearCart.add(test.id, 'test', name, price);
      else alert('Cart unavailable');
    });

    return card;
  }

  // ── DATA FILTERS ───────────────────────────────────────────
  var _searchQuery = '';

  function filteredPackages() {
    var data = window.PACKAGE_DATA || [];
    var q = _searchQuery.toLowerCase();
    return data.filter(function (pkg) {
      if (_activeCategory !== 'All' && pkg.category !== _activeCategory) return false;
      if (!q) return true;
      var name    = (t(pkg, 'name') || '').toLowerCase();
      var tagline = (t(pkg, 'tagline') || '').toLowerCase();
      var cat     = (t(pkg, 'category') || '').toLowerCase();
      return name.indexOf(q) !== -1 || tagline.indexOf(q) !== -1 || cat.indexOf(q) !== -1;
    });
  }

  function filteredTests() {
    var data = window.TEST_CATALOGUE || [];
    var q = _searchQuery.toLowerCase();
    if (!q) return data;
    return data.filter(function (t2) {
      var name = (t(t2, 'name') || '').toLowerCase();
      var cat  = (t(t2, 'category') || '').toLowerCase();
      return name.indexOf(q) !== -1 || cat.indexOf(q) !== -1;
    });
  }

  // ── RENDER ─────────────────────────────────────────────────
  function renderPackages() {
    var grid = document.getElementById('shop-package-grid');
    if (!grid) return;
    var pkgs = filteredPackages();
    grid.innerHTML = '';
    if (pkgs.length === 0) {
      grid.innerHTML = '<p class="shop-no-results" style="grid-column:1/-1;color:#5a7070;padding:20px 0;">No packages found. <a href="shop.html">Clear filter</a></p>';
      return;
    }
    pkgs.forEach(function (pkg) { grid.appendChild(buildPackageCard(pkg)); });
  }

  function renderTests() {
    var grid = document.getElementById('shop-test-grid');
    if (!grid) return;
    var tests = filteredTests();
    grid.innerHTML = '';
    tests.forEach(function (test) { grid.appendChild(buildTestCard(test)); });
  }

  function renderAll() {
    renderPackages();
    renderTests();
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
        _searchQuery = val;
        renderAll();
      }, 220);
    });
  }

  // ── HOME COLLECTION BANNER ─────────────────────────────────
  function applyHCBanner() {
    var banner = document.getElementById('shop-home-coll-banner');
    if (banner && typeof HOME_COLLECTION_AVAILABLE !== 'undefined' && !HOME_COLLECTION_AVAILABLE) {
      banner.style.display = 'none';
    }
  }

  // ── LEAD CARD ──────────────────────────────────────────────
  function initLeadCard() {
    var form     = document.getElementById('shop-lead-form');
    var nameEl   = document.getElementById('lead-name');
    var phoneEl  = document.getElementById('lead-phone');
    var termsEl  = document.getElementById('lead-terms');
    var waOptEl  = document.getElementById('lead-wa-opt');
    var submitEl = document.getElementById('lead-submit-btn');
    var successEl = document.getElementById('lead-card-success');
    var callLink  = document.getElementById('lead-success-call');
    if (!form) return;

    if (callLink && typeof CONTACT_PHONE_TEL !== 'undefined') callLink.href = CONTACT_PHONE_TEL;

    function validate() {
      var ok = nameEl && nameEl.value.trim().length >= 2 &&
               phoneEl && /^\d{10}$/.test(phoneEl.value.trim()) &&
               termsEl && termsEl.checked;
      if (submitEl) submitEl.disabled = !ok;
    }

    [nameEl, phoneEl].forEach(function (el) { if (el) el.addEventListener('input', validate); });
    [termsEl, waOptEl].forEach(function (el) { if (el) el.addEventListener('change', validate); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name  = nameEl  ? nameEl.value.trim()  : '';
      var phone = phoneEl ? phoneEl.value.trim() : '';
      var waOpt = waOptEl ? waOptEl.checked : false;
      var msg = 'Hi, I am ' + name + ' (' + phone + '). I would like help booking a test at Smear Pathology.' +
                (waOpt ? ' Please send WhatsApp updates about my booking.' : '');
      var waUrl = 'https://wa.me/91' + (typeof CONTACT_PHONE !== 'undefined' ? CONTACT_PHONE : '7410745222') +
                  '?text=' + encodeURIComponent(msg);
      window.open(waUrl, '_blank', 'noopener,noreferrer');
      form.style.display = 'none';
      if (successEl) { successEl.style.display = 'flex'; successEl.style.flexDirection = 'column'; successEl.style.alignItems = 'center'; successEl.style.gap = '12px'; }
    });
  }

  // ── INIT ───────────────────────────────────────────────────
  function init() {
    var packages = window.PACKAGE_DATA || [];
    if (packages.length === 0) {
      console.warn('[shop.js] window.PACKAGE_DATA is empty or not loaded. Check packages.js script tag order.');
    }
    
    var params = new URLSearchParams(window.location.search);
    if (params.has('cat')) {
      _activeCategory = params.get('cat');
    }

    buildCategoryChips(packages);
    renderAll();
    initSearch();
    applyHCBanner();
    initLeadCard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
