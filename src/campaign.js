/**
 * ============================================================
 *  SHRI SHANKAR PATHOLOGY — PRICING & SPECIAL OFFERS UTILITY
 *  src/campaign.js
 *  Single source of truth for:
 *  - Standard promotional pricing:
 *      * Health Packages: Flat 40% OFF (discounted = original * 0.60)
 *      * Individual Blood Tests: Flat 20% OFF (discounted = original * 0.80)
 *  - Paise precision currency formatting (INR)
 *  - Consistent pricing across listings, detail pages, search, and cart
 * ============================================================
 */

(function (window) {
  'use strict';

  // ── STANDARD OFFER CONFIGURATION ────────────────────────────
  var PRICING_CONFIG = {
    brandName: 'Shri Shankar Pathology',
    packageDiscountPercent: 40,
    testDiscountPercent: 20
  };

  // ── PRICE FORMATTING (INR with exact paise precision) ──────
  function formatINR(amount) {
    if (amount === null || amount === undefined || isNaN(amount)) return '';
    var n = Number(amount);
    if (n % 1 === 0) {
      return '₹' + n.toLocaleString('en-IN');
    }
    return '₹' + n.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  // ── CENTRALISED PRICING UTILITY ─────────────────────────────
  /**
   * Central pricing function consumed by packages, blood-tests, cart, etc.
   *
   * @param {number|string|null} basePrice
   * @param {'package'|'test'} [itemType='package']
   * @returns {Object}
   */
  function calculatePrice(basePrice, itemType) {
    itemType = itemType || 'package';
    var discountPercent = (itemType === 'package')
      ? PRICING_CONFIG.packageDiscountPercent
      : PRICING_CONFIG.testDiscountPercent;

    // Handle null, undefined, invalid, or non-numeric prices
    if (basePrice === null || basePrice === undefined || basePrice === '' || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
      return {
        originalPrice: null,
        discountPercentage: discountPercent,
        finalPrice: null,
        isActive: false,
        hasNumericPrice: false,
        formattedOriginalPrice: '',
        formattedFinalPrice: 'Price available at lab',
        badgeText: discountPercent + '% OFF',
        enquiryNotice: ''
      };
    }

    var numBase = Number(basePrice);
    var multiplier = (100 - discountPercent) / 100;
    // Calculate exact sale price with paise precision (rounded to 2 decimal places)
    var salePrice = Math.round(numBase * multiplier * 100) / 100;

    return {
      originalPrice: numBase,
      discountPercentage: discountPercent,
      finalPrice: salePrice,
      isActive: false,
      hasNumericPrice: true,
      formattedOriginalPrice: formatINR(numBase),
      formattedFinalPrice: formatINR(salePrice),
      badgeText: discountPercent + '% OFF',
      enquiryNotice: ''
    };
  }

  // ── GLOBAL EXPOSURE (Retains backward-compatible namespace) ──
  window.SmearCampaign = {
    config: PRICING_CONFIG,
    getStatus: function () { return 'normal'; },
    isActive: function () { return false; },
    isPreview: function () { return false; },
    isExpired: function () { return false; },
    calculatePrice: calculatePrice,
    formatINR: formatINR
  };

  // Modern alias
  window.ShriShankarPricing = window.SmearCampaign;

})(window);
