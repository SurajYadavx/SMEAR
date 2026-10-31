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
    packages.forEach(function (pkg) {
      var pricing = (window.SmearCampaign && window.SmearCampaign.calculatePrice)
        ? window.SmearCampaign.calculatePrice(pkg.price, 'package')
        : {
            originalPrice: pkg.price,
            discountPercentage: 0,
            finalPrice: pkg.price,
            hasNumericPrice: (pkg.price !== null && pkg.price > 0),
            formattedOriginalPrice: pkg.price ? '₹' + pkg.price : '',
            formattedFinalPrice: pkg.price ? '₹' + pkg.price : 'Price available at lab',
            badgeText: '',
            isActive: false
          };
      var imgUrl   = pkg.image_url;

      var card = document.createElement('div');
      card.className = 'pkg-card';

      var imgHtml = imgUrl
        ? '<img src="' + esc(imgUrl) + '" alt="' + esc(pkg.name) + '" loading="lazy" />'
        : '<div class="pkg-card__placeholder">' + (window.SmearVisuals ? window.SmearVisuals.getMotifSVG(pkg.categoryName || pkg.categoryId) : '') + '</div>';

      var priceHtml = pricing.hasNumericPrice 
        ? '<div class="pkg-card__price"><span style="text-decoration: line-through; color: var(--color-text-muted); font-size: 0.85em; font-weight: 500; margin-right: 6px;">' + pricing.formattedOriginalPrice + '</span>' + pricing.formattedFinalPrice + '</div>' 
        : '<div class="pkg-card__price" style="font-size: 0.9em; color: var(--color-text-muted);">Price available at lab</div>';

      var badgeClass = pricing.isActive ? 'pkg-card__badge diwali-badge-pill' : 'pkg-card__badge';
      var badgeHtml = pricing.badgeText ? '<span class="' + badgeClass + '">' + pricing.badgeText + '</span>' : '';

      card.innerHTML =
        '<div class="pkg-card__img-wrap">' +
          imgHtml +
          badgeHtml +
        '</div>' +
        '<div class="pkg-card__body">' +
          '<div class="pkg-card__category">' + esc(pkg.categoryName || pkg.categoryId) + '</div>' +
          '<div class="pkg-card__name">' + esc(pkg.name) + '</div>' +
          priceHtml +
          '<div class="pkg-card__ctas">' +
            '<button class="btn btn--outline-primary view-pkg-btn" data-id="' + esc(pkg.id) + '">View Details</button>' +
            '<button class="btn btn--primary add-pkg-btn" data-id="' + esc(pkg.id) + '" data-name="' + esc(pkg.name) + '" data-price="' + (pricing.finalPrice !== null ? pricing.finalPrice : '') + '">' + (pricing.hasNumericPrice ? 'Add to Cart' : 'Enquire') + '</button>' +
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
        var price = (priceRaw !== '' && !isNaN(Number(priceRaw))) ? Number(priceRaw) : null;
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
