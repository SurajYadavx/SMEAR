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

  function renderHCPackages() {
    var grid = document.getElementById('hc-package-grid');
    if (!grid) return;
    var lang = getLang();
    var packages = (window.PACKAGE_DATA || []).filter(function (p) { return p.homeCollection; });
    if (packages.length === 0) {
      grid.innerHTML = '<p style="color:#5a7070;grid-column:1/-1">Home collection packages will be listed here. <a href="shop.html">Browse all packages.</a></p>';
      return;
    }
    packages.forEach(function (pkg) {
      var name  = (lang === 'mr' && pkg.nameMr) ? pkg.nameMr : (pkg.name || '');
      var price = pkg.price || 0;
      var slug  = pkg.slug || '';
      var card  = document.createElement('a');
      card.className = 'shop-pkg-card';
      card.href = slug ? 'packages/' + slug + '.html' : 'shop.html';
      card.innerHTML = '' +
        '<div class="shop-pkg-card__body">' +
          '<p class="shop-pkg-card__name">' + esc(name) + '</p>' +
          (price ? '<p class="shop-pkg-card__price">\u20b9' + price + '</p>' : '') +
        '</div>';
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
