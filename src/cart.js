/**
 * ============================================================
 *  SMEAR PATHOLOGY — CART.JS v5
 *  Client-side cart state in localStorage.
 *  No backend, no payment. Cart items → WhatsApp message.
 * ============================================================
 */

(function () {
  'use strict';

  var CART_KEY = 'smear_cart_v1';
  var LANG_KEY = 'smear_lang';

  // ── STATE ──────────────────────────────────────────────────
  function loadCart() {
    try {
      var raw = localStorage.getItem(CART_KEY);
      var arr = raw ? JSON.parse(raw) : [];
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (e) { /* storage blocked — silent fail */ }
    // Refresh badge everywhere
    if (typeof window.refreshCartBadge === 'function') window.refreshCartBadge();
  }

  // ── PUBLIC API ─────────────────────────────────────────────

  /**
   * Add an item. type = 'package' | 'test'
   * Returns the new cart array.
   */
  function addToCart(id, type, name, price) {
    var cart = loadCart();
    var existing = cart.find(function (i) { return i.id === id && i.type === type; });
    if (existing) {
      existing.qty = (existing.qty || 1) + 1;
    } else {
      cart.push({ id: id, type: type, name: name || id, price: price || 0, qty: 1 });
    }
    saveCart(cart);
    showToast(name);
    return cart;
  }

  /**
   * Remove one item completely (regardless of qty).
   */
  function removeFromCart(id, type) {
    var cart = loadCart().filter(function (i) { return !(i.id === id && i.type === type); });
    saveCart(cart);
    return cart;
  }

  /**
   * Clear all items.
   */
  function clearCart() {
    saveCart([]);
  }

  /**
   * Get full cart array.
   */
  function getCart() { return loadCart(); }

  /**
   * Total item count (sum of qty values).
   */
  function cartCount() {
    return loadCart().reduce(function (n, i) { return n + (i.qty || 1); }, 0);
  }

  /**
   * Approximate price total.
   */
  function cartTotal() {
    return loadCart().reduce(function (n, i) { return n + ((i.price || 0) * (i.qty || 1)); }, 0);
  }

  // ── TOAST NOTIFICATION ─────────────────────────────────────
  function showToast(name) {
    // Remove existing toast
    var old = document.getElementById('cart-toast');
    if (old) old.remove();

    var lang;
    try { lang = localStorage.getItem(LANG_KEY) || 'en'; } catch (e) { lang = 'en'; }
    var msg = lang === 'mr'
      ? '\u201c' + (name || '') + '\u201d \u092f\u093e\u0926\u0940\u0924 \u091c\u094b\u0921\u0932\u0947' // "added to list" in Marathi — needs native review
      : '\u201c' + (name || 'Item') + '\u201d added to cart';

    var toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.className = 'cart-toast';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = '' +
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>' +
      '<span>' + String(msg).replace(/</g, '&lt;') + '</span>';
    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(function () {
      toast.classList.add('cart-toast--visible');
    });

    // Auto-remove after 3s
    setTimeout(function () {
      toast.classList.remove('cart-toast--visible');
      setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 400);
    }, 3000);
  }

  // ── WHATSAPP MESSAGE BUILDER ────────────────────────────────
  function buildWhatsAppMessage(cart) {
    if (!cart || cart.length === 0) return '';
    var lines = cart.map(function (item) {
      return '\u2022 ' + item.name + (item.qty > 1 ? ' \u00d7' + item.qty : '') + ' \u2014 \u20b9' + (item.price * (item.qty || 1));
    });
    var total = cartTotal();
    var msg = 'Hi, I would like to book the following tests at Smear Pathology:\n\n' +
      lines.join('\n') +
      '\n\nApproximate total: \u20b9' + total +
      '\n\nPlease confirm availability and final charges. Thank you.';
    return msg;
  }

  // ── EXPOSE GLOBALLY ─────────────────────────────────────────
  window.SmearCart = {
    add: addToCart,
    remove: removeFromCart,
    clear: clearCart,
    get: getCart,
    count: cartCount,
    total: cartTotal,
    buildWhatsAppMessage: buildWhatsAppMessage,
    showToast: showToast
  };

}());
