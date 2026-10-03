/**
 * ============================================================
 *  SMEAR PATHOLOGY — HOME-COLLECTION.JS v5
 *  Logic for home-collection.html.
 *  Reads HOME_COLLECTION_AVAILABLE from config.js.
 * ============================================================
 */

(function () {
  'use strict';

  function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function renderHCPackages(packages) {
    var grid = document.getElementById('hc-package-grid');
    if (!grid) return;
    if (!packages || packages.length === 0) {
      grid.innerHTML = '<p style="color:#5a7070;grid-column:1/-1">Home collection packages will be listed here. <a href="packages.html">Browse all packages.</a></p>';
      return;
    }
    // Take first 6 as "popular" home collection packages
    packages.slice(0, 6).forEach(function (pkg) {
      var price    = pkg.price;
      var discount = pkg.discount || 0;
      var imgUrl   = pkg.image_url;

      var card = document.createElement('div');
      card.className = 'pkg-card';

      var imgHtml = imgUrl
        ? '<img src="' + esc(imgUrl) + '" alt="' + esc(pkg.name) + '" loading="lazy" />'
        : '<div class="pkg-card__placeholder">' + (window.SmearVisuals ? window.SmearVisuals.getMotifSVG(pkg.categoryName || pkg.categoryId) : '') + '</div>';

      var priceHtml = price !== null 
        ? '<div class="pkg-card__price">₹' + Number(price).toLocaleString('en-IN') + '</div>' 
        : '<div class="pkg-card__price" style="font-size: 0.9em; color: var(--color-text-muted);">Price available at lab</div>';

      card.innerHTML =
        '<div class="pkg-card__img-wrap">' +
          imgHtml +
          (discount > 0 ? '<span class="pkg-card__badge">' + discount + '% OFF</span>' : '') +
        '</div>' +
        '<div class="pkg-card__body">' +
          '<div class="pkg-card__category">' + esc(pkg.categoryName || pkg.categoryId) + '</div>' +
          '<div class="pkg-card__name">' + esc(pkg.name) + '</div>' +
          priceHtml +
          '<div class="pkg-card__ctas">' +
            '<button class="btn btn--outline-primary view-pkg-btn" data-id="' + esc(pkg.id) + '">View Details</button>' +
            '<button class="btn btn--primary add-pkg-btn" data-id="' + esc(pkg.id) + '" data-name="' + esc(pkg.name) + '" data-price="' + (price !== null ? price : '') + '">Add to Cart</button>' +
          '</div>' +
        '</div>';

      grid.appendChild(card);
    });

    // Bind events for buttons
    grid.querySelectorAll('.view-pkg-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-id');
        var pkg = packages.find(function(p) { return p.id === id; });
        if(pkg) window.location.href = 'package-detail.html?id=' + encodeURIComponent(pkg.slug || pkg.id);
      });
    });
    grid.querySelectorAll('.add-pkg-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id    = btn.getAttribute('data-id');
        var name  = btn.getAttribute('data-name');
        var priceRaw = btn.getAttribute('data-price');
        var price = priceRaw ? parseInt(priceRaw, 10) : null;
        if (window.SmearCart) window.SmearCart.add(id, 'package', name, price);
      });
    });
  }

  function initHCButtons() {
    var waBtn       = document.getElementById('hc-wa-book');
    var callBtn     = document.getElementById('hc-call-book');
    var finalWaBtn  = document.getElementById('hc-final-wa-book');
    var finalCallBtn= document.getElementById('hc-final-call-book');
    var csWa        = document.getElementById('hc-cs-wa');
    var floatWa     = document.getElementById('whatsapp-float');
    var floatCall   = document.getElementById('call-float');
    if (waBtn)        waBtn.href        = CONTACT_WHATSAPP_URL;
    if (callBtn)      callBtn.href      = CONTACT_PHONE_TEL;
    if (finalWaBtn)   finalWaBtn.href   = CONTACT_WHATSAPP_URL;
    if (finalCallBtn) finalCallBtn.href = CONTACT_PHONE_TEL;
    if (csWa)         csWa.href         = CONTACT_WHATSAPP_URL;
    if (floatWa)      floatWa.href      = CONTACT_WHATSAPP_URL;
    if (floatCall)    floatCall.href    = CONTACT_PHONE_TEL;
  }

  function loadAndRender() {
    fetch('./public/data/smear-packages.json')
      .then(function(r){ return r.json(); })
      .then(function(packages) {
        renderHCPackages(packages);
      })
      .catch(function(e){
        console.error('[home-collection] Failed to load packages:', e);
      });
  }

  function init() {
    var activeContent  = document.getElementById('hc-active-content');
    var comingSoon     = document.getElementById('hc-coming-soon');

    if (HOME_COLLECTION_AVAILABLE) {
      if (activeContent)  activeContent.style.display = 'block';
      if (comingSoon)     comingSoon.style.display = 'none';
      loadAndRender();
    } else {
      if (activeContent)  activeContent.style.display = 'none';
      if (comingSoon)     comingSoon.style.display = 'block';
    }

    initHCButtons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
