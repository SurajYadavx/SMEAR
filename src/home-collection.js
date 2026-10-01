/**
 * ============================================================
 *  SMEAR PATHOLOGY — HOME-COLLECTION.JS v5
 *  Logic for home-collection.html.
 *  Reads HOME_COLLECTION_AVAILABLE from config.js.
 * ============================================================
 */

(function () {
  'use strict';

  function getLang() { try { return localStorage.getItem('smear_lang') || 'en'; } catch (e) { return 'en'; } }
  function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function extractPrice(previewContent) {
    if (!previewContent) return null;
    var commaMatch = previewContent.match(/,1\s*(\d{3,6})/g);
    if (commaMatch && commaMatch.length > 0) {
      var last = commaMatch[commaMatch.length > 1 ? commaMatch.length - 1 : 0];
      var numMatch = last.match(/(\d{3,6})/);
      return numMatch ? parseInt(numMatch[1], 10) : null;
    }
    var match = previewContent.match(/[\u20b9$£]\s*(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  function extractDiscount(previewContent) {
    if (!previewContent) return 0;
    var match = previewContent.match(/(\d+)%\s*OFF/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  function renderHCPackages() {
    var grid = document.getElementById('hc-package-grid');
    if (!grid) return;
    var packages = window.SMEAR_PACKAGES || [];
    if (packages.length === 0) {
      grid.innerHTML = '<p style="color:#5a7070;grid-column:1/-1">Home collection packages will be listed here. <a href="packages.html">Browse all packages.</a></p>';
      return;
    }
    // Take first 6 as "popular" home collection packages
    packages.slice(0, 6).forEach(function (pkg) {
      var price = extractPrice(pkg.sourceData ? pkg.sourceData.preview_content : null);
      var discount = extractDiscount(pkg.sourceData ? pkg.sourceData.preview_content : null);
      var card = document.createElement('a');
      card.className = 'pkg-card';
      card.href = 'package-detail.html?id=' + encodeURIComponent(pkg.id);
      card.innerHTML = `
        <div class="pkg-card__img-wrap">
          <div class="pkg-card__placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          ${discount ? '<span class="pkg-card__badge">' + discount + '% OFF</span>' : ''}
        </div>
        <div class="pkg-card__body">
          <div class="pkg-card__category">${pkg.categoryName || 'Package'}</div>
          <h3 class="pkg-card__name">${pkg.name}</h3>
          <div class="pkg-card__price">
            <span class="price-val">₹${price || '--'}</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function initHCButtons() {
    var waBtn   = document.getElementById('hc-wa-book');
    var callBtn = document.getElementById('hc-call-book');
    var csWa    = document.getElementById('hc-cs-wa');
    var floatWa = document.getElementById('whatsapp-float');
    var floatCall = document.getElementById('call-float');
    if (waBtn)    waBtn.href    = CONTACT_WHATSAPP_URL;
    if (callBtn)  callBtn.href  = CONTACT_PHONE_TEL;
    if (csWa)     csWa.href     = CONTACT_WHATSAPP_URL;
    if (floatWa)  floatWa.href  = CONTACT_WHATSAPP_URL;
    if (floatCall) floatCall.href = CONTACT_PHONE_TEL;
  }

  function init() {
    var activeContent  = document.getElementById('hc-active-content');
    var comingSoon     = document.getElementById('hc-coming-soon');

    if (HOME_COLLECTION_AVAILABLE) {
      if (activeContent)  activeContent.style.display = 'block';
      if (comingSoon)     comingSoon.style.display = 'none';
      renderHCPackages();
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
