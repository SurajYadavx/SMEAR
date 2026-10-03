/**
 * ============================================================
 *  SMEAR PATHOLOGY — CART-PAGE.JS v5
 *  Renders cart.html — shows items, summary, WhatsApp booking.
 * ============================================================
 */

(function () {
  'use strict';

  function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  function render() {
    var cart = window.SmearCart ? window.SmearCart.get() : [];
    var empty   = document.getElementById('cart-empty-state');
    var hasItems = document.getElementById('cart-has-items');
    var itemsList = document.getElementById('cart-items-list');
    var countEl   = document.getElementById('cart-item-count');
    var totalEl   = document.getElementById('cart-total-display');
    var waBtn     = document.getElementById('cart-wa-book-btn');

    if (!empty || !hasItems) return;

    if (cart.length === 0) {
      empty.style.display = 'flex';
      hasItems.style.display = 'none';
      return;
    }

    empty.style.display = 'none';
    hasItems.style.display = 'block';

    // Render line items
    if (itemsList) {
      itemsList.innerHTML = '';
      cart.forEach(function (item) {
        var li = document.createElement('div');
        li.className = 'cart-item';
        li.setAttribute('role', 'listitem');
        li.innerHTML = '' +
          '<div class="cart-item__icon">' +
            '<span>' + esc(item.type === 'package' ? 'PKG' : 'TST') + '</span>' +
          '</div>' +
          '<div class="cart-item__info">' +
            '<p class="cart-item__name">' + esc(item.name) + '</p>' +
            '<p class="cart-item__type">' + esc(item.type) + (item.qty > 1 ? ' \u00d7' + item.qty : '') + '</p>' +
          '</div>' +
          (item.price ? '<span class="cart-item__price">\u20b9' + (item.price * (item.qty || 1)) + '</span>' : '') +
          '<button class="cart-item__remove" data-id="' + esc(item.id) + '" data-type="' + esc(item.type) + '" aria-label="Remove ' + esc(item.name) + '">' +
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="18" height="18"><path d="M18 6 6 18M6 6l12 12"/></svg>' +
          '</button>';

        li.querySelector('.cart-item__remove').addEventListener('click', function () {
          window.SmearCart.remove(item.id, item.type);
          render();
        });

        itemsList.appendChild(li);
      });
    }

    // Summary
    var count = window.SmearCart.count();
    var total = window.SmearCart.total();
    if (countEl) countEl.textContent = count;
    if (totalEl) totalEl.textContent = '\u20b9' + total;

    // WhatsApp booking
    if (waBtn) {
      var msg = window.SmearCart.buildWhatsAppMessage(cart);
      waBtn.href = 'https://wa.me/91' + CONTACT_PHONE + '?text=' + encodeURIComponent(msg);
    }
  }

  function init() {
    render();
    // Re-render on storage changes (cart modified in another tab)
    window.addEventListener('storage', function (e) {
      if (e.key === 'smear_cart_v1') render();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
