/**
 * ============================================================
 *  SMEAR PATHOLOGY — DIWALI FESTIVE HEALTH OFFER 2026
 *  src/campaign.js
 *  Single source of truth for:
 *  - Campaign dates & Asia/Kolkata timezone automatic activation/expiry
 *  - Sitewide flat 50% pricing calculation & paise precision formatting
 *  - Social media canvas poster generation (1080x1350 & 1080x1920)
 *  - Social share / download modal
 *  - Homepage hero promotional panel hydration
 * ============================================================
 */

(function (window, document) {
  'use strict';

  // ── CENTRAL CAMPAIGN CONFIGURATION ──────────────────────────
  var CAMPAIGN_CONFIG = {
    name: 'Diwali Health Celebration 2026',
    smallLabel: 'SMEAR PATHOLOGY PRESENTS',
    heading: 'DIWALI HEALTH CELEBRATION',
    mainOffer: 'FLAT 50% OFF',
    supportingLine: 'On All Health Packages & Blood Tests',
    datesDisplay: '1 – 15 November 2026',
    supportingMessage: 'Celebrate the festival of lights with a special offer on health packages and blood tests.',
    pkgOfferLabel: 'FLAT 50% OFF',
    testOfferLabel: 'FLAT 50% OFF',
    pkgHref: 'packages.html',
    testHref: 'blood-tests.html',
    websiteUrl: 'https://smearpathology.in/',

    // Exact IST timestamps:
    // Start: 1 November 2026 00:00:00 IST -> 2026-10-31T18:30:00.000Z
    // End exclusive: 16 November 2026 00:00:00 IST (covers 15 Nov 23:59:59 IST) -> 2026-11-15T18:30:00.000Z
    startDateISO: '2026-11-01T00:00:00+05:30',
    endDateISO: '2026-11-16T00:00:00+05:30',
    discountPercent: 50,
    timezone: 'Asia/Kolkata'
  };

  var START_TIMESTAMP = new Date(CAMPAIGN_CONFIG.startDateISO).getTime();
  var END_TIMESTAMP   = new Date(CAMPAIGN_CONFIG.endDateISO).getTime();

  // ── URL PARAMETER OVERRIDE (FOR TESTING & VERIFICATION) ─────
  function getURLCampaignOverride() {
    // Allow overrides only on trusted development hostnames (localhost, 127.0.0.1, ::1)
    var allowedHosts = ['localhost', '127.0.0.1', '::1'];
    if (allowedHosts.indexOf(window.location.hostname) === -1) {
      return null; // ignore any override on production hosts
    }
    try {
      var params = new URLSearchParams(window.location.search);
      var val = params.get('campaign');
      if (val) val = val.toLowerCase().trim();
      if (val === 'active' || val === 'preview' || val === 'expired' || val === 'off' || val === 'normal') {
        return val;
      }
    } catch (e) { /* ignore */ }
    return null;
  }

  // ── CAMPAIGN STATUS ─────────────────────────────────────────
  /**
   * Returns:
   *  'preview'  -> before 1 Nov 2026 00:00:00 IST
   *  'active'   -> 1 Nov 2026 00:00:00 IST to 15 Nov 2026 23:59:59 IST
   *  'expired'  -> 16 Nov 2026 00:00:00 IST onwards
   */
  function getCampaignStatus() {
    var override = getURLCampaignOverride();
    if (override === 'active') return 'active';
    if (override === 'preview') return 'preview';
    if (override === 'expired' || override === 'off' || override === 'normal') return 'expired';

    var now = Date.now();
    if (now < START_TIMESTAMP) {
      return 'preview';
    } else if (now >= START_TIMESTAMP && now < END_TIMESTAMP) {
      return 'active';
    } else {
      return 'expired';
    }
  }

  function isCampaignActive() {
    return getCampaignStatus() === 'active';
  }

  function isCampaignPreview() {
    return getCampaignStatus() === 'preview';
  }

  function isCampaignExpired() {
    return getCampaignStatus() === 'expired';
  }

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

  // ── REUSABLE CAMPAIGN PRICING UTILITY ───────────────────────
  /**
   * Central pricing function consumed by packages, blood-tests, cart, etc.
   *
   * @param {number|string|null} basePrice
   * @param {'package'|'test'} [itemType='package']
   * @param {boolean} [forceActive=null]
   * @returns {Object}
   */
  function calculatePrice(basePrice, itemType, forceActive) {
    var active = (forceActive !== undefined && forceActive !== null) ? Boolean(forceActive) : isCampaignActive();
    itemType = itemType || 'package';

    // Handle null, undefined, invalid, or non-numeric prices
    if (basePrice === null || basePrice === undefined || basePrice === '' || isNaN(Number(basePrice)) || Number(basePrice) <= 0) {
      return {
        originalPrice: null,
        discountPercentage: active ? CAMPAIGN_CONFIG.discountPercent : 0,
        finalPrice: null,
        isActive: active,
        hasNumericPrice: false,
        formattedOriginalPrice: '',
        formattedFinalPrice: 'Price available at lab',
        badgeText: active ? '50% OFF' : '',
        enquiryNotice: active ? 'Diwali offer on enquiry' : ''
      };
    }

    var numBase = Number(basePrice);

    if (active) {
      // Exactly 50% discount with paise precision (salePrice = basePrice * 0.50)
      // Math.round to 2 decimal places to avoid floating point anomalies (e.g. 999 * 0.5 -> 499.5)
      var salePrice = Math.round(numBase * 50) / 100;
      return {
        originalPrice: numBase,
        discountPercentage: 50,
        finalPrice: salePrice,
        isActive: true,
        hasNumericPrice: true,
        formattedOriginalPrice: formatINR(numBase),
        formattedFinalPrice: formatINR(salePrice),
        badgeText: '50% OFF',
        enquiryNotice: ''
      };
    } else {
      // Pre-campaign standard pricing
      var standardDiscount = 50;
      var standardFinal = Math.round(numBase * 0.50);
      return {
        originalPrice: numBase,
        discountPercentage: standardDiscount,
        finalPrice: standardFinal,
        isActive: false,
        hasNumericPrice: true,
        formattedOriginalPrice: formatINR(numBase),
        formattedFinalPrice: formatINR(standardFinal),
        badgeText: standardDiscount + '% OFF',
        enquiryNotice: ''
      };
    }
  }

  // ── INLINE DIYA SVG ─────────────────────────────────────────
  function getDiyaSVG() {
    return '' +
      '<svg class="diwali-diya-svg" viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
        '<defs>' +
          '<radialGradient id="flameGrad" cx="50%" cy="80%" r="70%">' +
            '<stop offset="0%" stop-color="#fff5c0" />' +
            '<stop offset="25%" stop-color="#ffd700" />' +
            '<stop offset="60%" stop-color="#ff7a00" />' +
            '<stop offset="100%" stop-color="#d62828" stop-opacity="0.2" />' +
          '</radialGradient>' +
          '<linearGradient id="clayGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#ffd700" />' +
            '<stop offset="45%" stop-color="#d4af37" />' +
            '<stop offset="100%" stop-color="#8a6d1b" />' +
          '</linearGradient>' +
        '</defs>' +
        '<!-- Flame -->' +
        '<g class="diwali-flame">' +
          '<path d="M50 8 C43 24 38 34 38 46 C38 56 43 62 50 62 C57 62 62 56 62 46 C62 34 57 24 50 8 Z" fill="url(#flameGrad)" />' +
          '<path d="M50 20 C46 30 43 36 43 45 C43 51 46 55 50 55 C54 55 57 51 57 45 C57 36 54 30 50 20 Z" fill="#ffffff" opacity="0.85" />' +
        '</g>' +
        '<!-- Diya Bowl -->' +
        '<path d="M14 52 C26 72 74 72 86 52 C89 48 83 45 74 47 C62 50 38 50 26 47 C17 45 11 48 14 52 Z" fill="url(#clayGrad)" stroke="#ffd700" stroke-width="1.2" />' +
        '<!-- Base Stand -->' +
        '<path d="M34 68 Q50 75 66 68 L62 74 Q50 77 38 74 Z" fill="#b8860b" />' +
      '</svg>';
  }

  // ── HOMEPAGE HERO PROMO PANEL HYDRATION ─────────────────────
  function hydrateHeroCampaignCard() {
    var slot = document.getElementById('hero-campaign-slot');
    if (!slot) return;

    var status = getCampaignStatus();

    // EXPIRED STATE: restore exact pre-campaign Special Offers panel
    if (status === 'expired') {
      slot.innerHTML = '' +
        '<div class="premium-promo-card">' +
          '<h3 style="color: #FFD700; font-size: 1.25rem; font-family: \'Outfit\', sans-serif; font-weight: 700; letter-spacing: 0.08em; margin: 0 0 16px; text-transform: uppercase; text-shadow: 0 2px 6px rgba(0,0,0,0.4);">' +
            '✨ Special Offers ✨' +
          '</h3>' +
          '<a href="packages.html" class="promo-btn promo-btn--pkg">' +
            '<span class="promo-val">50% OFF</span>' +
            '<span class="promo-txt">On All Health Packages</span>' +
          '</a>' +
          '<a href="blood-tests.html" class="promo-btn promo-btn--test">' +
            '<span class="promo-val">50% OFF</span>' +
            '<span class="promo-txt">On All Blood Tests</span>' +
          '</a>' +
        '</div>';
      return;
    }

    // ACTIVE OR PREVIEW STATE: render Diwali campaign
    var isPreview = (status === 'preview');
    var datesHtml = isPreview
      ? '<div class="diwali-preview-banner"><span>✨ Offer starts 1 November 2026</span></div>' +
        '<div class="diwali-dates-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> <span>1 – 15 November 2026</span></div>'
      : '<div class="diwali-dates-pill"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> <span>1 – 15 November 2026</span></div>';

    slot.innerHTML = '' +
      '<div class="diwali-card">' +
        '<div class="diwali-card__bg-pattern" aria-hidden="true"></div>' +
        '<div class="diwali-card__corner diwali-card__corner--tl" aria-hidden="true"></div>' +
        '<div class="diwali-card__corner diwali-card__corner--tr" aria-hidden="true"></div>' +
        '<div class="diwali-card__corner diwali-card__corner--bl" aria-hidden="true"></div>' +
        '<div class="diwali-card__corner diwali-card__corner--br" aria-hidden="true"></div>' +

        '<div class="diwali-eyebrow">' +
          '<span class="diwali-sparkle" aria-hidden="true">✦</span>' +
          '<span>' + CAMPAIGN_CONFIG.smallLabel + '</span>' +
          '<span class="diwali-sparkle" aria-hidden="true">✦</span>' +
        '</div>' +

        '<div class="diwali-diya-wrap">' +
          '<div class="diwali-diya-glow"></div>' +
          getDiyaSVG() +
        '</div>' +

        '<h3 class="diwali-title">' + CAMPAIGN_CONFIG.heading + '</h3>' +

        '<div class="diwali-offer-hero">' +
          '<span class="diwali-main-val">' + CAMPAIGN_CONFIG.mainOffer + '</span>' +
          '<span class="diwali-main-sub">' + CAMPAIGN_CONFIG.supportingLine + '</span>' +
        '</div>' +

        datesHtml +

        '<p class="diwali-message">' + CAMPAIGN_CONFIG.supportingMessage + '</p>' +

        '<a href="' + CAMPAIGN_CONFIG.pkgHref + '" class="diwali-btn diwali-btn--pkg">' +
          '<span class="diwali-btn__val">' + CAMPAIGN_CONFIG.pkgOfferLabel + '</span>' +
          '<span class="diwali-btn__cta">EXPLORE HEALTH PACKAGES →</span>' +
        '</a>' +

        '<a href="' + CAMPAIGN_CONFIG.testHref + '" class="diwali-btn diwali-btn--test">' +
          '<span class="diwali-btn__val">' + CAMPAIGN_CONFIG.testOfferLabel + '</span>' +
          '<span class="diwali-btn__cta">EXPLORE BLOOD TESTS →</span>' +
        '</a>' +

        '<button type="button" class="diwali-share-btn" id="diwali-open-poster-btn" aria-label="Share Diwali Offer Artwork">' +
          '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle>' +
            '<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>' +
          '</svg>' +
          '<span>SHARE DIWALI OFFER</span>' +
        '</button>' +
      '</div>';

    var shareBtn = document.getElementById('diwali-open-poster-btn');
    if (shareBtn) {
      shareBtn.addEventListener('click', function (e) {
        e.preventDefault();
        openPosterModal();
      });
    }
  }

  // ── SOCIAL MEDIA POSTER CANVAS GENERATION (Section 9) ───────
  /**
   * Generates a high-resolution, social-media-ready promotional poster.
   *
   * Formats:
   *  'portrait' -> 1080 x 1350 px (Instagram / Facebook Portrait)
   *  'story'    -> 1080 x 1920 px (Instagram Story / WhatsApp Status)
   */
  function generatePosterCanvas(format, callback) {
    var width  = 1080;
    var height = (format === 'story') ? 1920 : 1350;

    var canvas = document.createElement('canvas');
    canvas.width  = width;
    canvas.height = height;
    var ctx = canvas.getContext('2d');

    // 1. Rich Festive Background Gradient
    var bgGrad = ctx.createLinearGradient(0, 0, 0, height);
    bgGrad.addColorStop(0, '#1c0626');   // Deep midnight plum
    bgGrad.addColorStop(0.35, '#12051a'); // Dark aubergine
    bgGrad.addColorStop(0.7, '#071f1c');  // Deep emerald
    bgGrad.addColorStop(1, '#051412');   // Rich dark teal
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Radial Light Pools
    var topGlow = ctx.createRadialGradient(width / 2, 220, 10, width / 2, 220, 480);
    topGlow.addColorStop(0, 'rgba(212, 175, 55, 0.16)');
    topGlow.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.fillStyle = topGlow;
    ctx.fillRect(0, 0, width, height);

    var midGlow = ctx.createRadialGradient(width / 2, height * 0.52, 20, width / 2, height * 0.52, 520);
    midGlow.addColorStop(0, 'rgba(245, 158, 11, 0.12)');
    midGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = midGlow;
    ctx.fillRect(0, 0, width, height);

    // 3. Sacred Mandala Geometry Watermark
    ctx.save();
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.07;
    var cx = width / 2;
    var cy = height * 0.48;
    for (var r = 80; r <= 420; r += 60) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    // 12-ray star pattern
    for (var a = 0; a < 12; a++) {
      var angle = (a * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 70, cy + Math.sin(angle) * 70);
      ctx.lineTo(cx + Math.cos(angle) * 440, cy + Math.sin(angle) * 440);
      ctx.stroke();
    }
    ctx.restore();

    // 4. Elegant Double Gold Border with Corner Brackets
    var inset1 = 36;
    var inset2 = 46;

    ctx.save();
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.strokeRect(inset1, inset1, width - inset1 * 2, height - inset1 * 2);

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(inset2, inset2, width - inset2 * 2, height - inset2 * 2);

    // Corner decorative brackets
    function drawCorner(x, y, dx, dy) {
      ctx.save();
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(x + dx * 28, y);
      ctx.lineTo(x, y);
      ctx.lineTo(x, y + dy * 28);
      ctx.stroke();

      // Corner diamond dot
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(x + dx * 14, y + dy * 14, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    drawCorner(inset1, inset1, 1, 1);
    drawCorner(width - inset1, inset1, -1, 1);
    drawCorner(inset1, height - inset1, 1, -1);
    drawCorner(width - inset1, height - inset1, -1, -1);
    ctx.restore();

    // 5. Draw Content (Logo, Text, Badges)
    var logo = new Image();
    logo.crossOrigin = 'anonymous';

    function renderPosterContent() {
      var yOffset = (format === 'story') ? 140 : 80;

      // Logo
      try {
        if (logo.complete && logo.naturalWidth > 0) {
          var logoW = 120;
          var logoH = (logo.naturalHeight / logo.naturalWidth) * logoW;
          ctx.drawImage(logo, (width - logoW) / 2, yOffset, logoW, logoH);
          yOffset += logoH + 24;
        } else {
          yOffset += 40;
        }
      } catch (e) {
        yOffset += 40;
      }

      // Small Eyebrow: SMEAR PATHOLOGY PRESENTS
      ctx.save();
      ctx.font = '700 24px "Outfit", "Inter", sans-serif';
      ctx.fillStyle = '#fce494';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '4px';
      ctx.fillText('✦  ' + CAMPAIGN_CONFIG.smallLabel + '  ✦', width / 2, yOffset);
      ctx.restore();

      yOffset += (format === 'story') ? 60 : 44;

      // Diya Vector Drawing
      drawDiyaIllustration(ctx, width / 2, yOffset);
      yOffset += 75;

      // Campaign Heading: DIWALI HEALTH CELEBRATION
      ctx.save();
      ctx.font = '800 ' + (format === 'story' ? '56px' : '48px') + ' "Outfit", sans-serif';
      ctx.fillStyle = '#fff9f0';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '2px';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
      ctx.shadowBlur = 12;
      ctx.fillText(CAMPAIGN_CONFIG.heading, width / 2, yOffset);
      ctx.restore();

      yOffset += (format === 'story') ? 50 : 38;

      // Gold Divider Line with Central Star
      drawGoldDivider(ctx, width / 2, yOffset, 280);
      yOffset += (format === 'story') ? 70 : 50;

      // Main Offer Card Container
      var offerBoxW = width - 160;
      var offerBoxH = (format === 'story') ? 250 : 200;
      var offerBoxX = 80;
      var offerBoxY = yOffset;

      ctx.save();
      var cardGrad = ctx.createLinearGradient(offerBoxX, offerBoxY, offerBoxX + offerBoxW, offerBoxY + offerBoxH);
      cardGrad.addColorStop(0, 'rgba(212, 175, 55, 0.22)');
      cardGrad.addColorStop(0.5, 'rgba(255, 215, 0, 0.12)');
      cardGrad.addColorStop(1, 'rgba(212, 175, 55, 0.18)');
      ctx.fillStyle = cardGrad;
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2.5;

      roundRect(ctx, offerBoxX, offerBoxY, offerBoxW, offerBoxH, 22);
      ctx.fill();
      ctx.stroke();

      // Offer Text: FLAT 50% OFF
      ctx.font = '900 ' + (format === 'story' ? '92px' : '78px') + ' "Outfit", sans-serif';
      var textGrad = ctx.createLinearGradient(0, offerBoxY + 30, 0, offerBoxY + 110);
      textGrad.addColorStop(0, '#ffffff');
      textGrad.addColorStop(0.3, '#fff4b8');
      textGrad.addColorStop(0.7, '#ffd700');
      textGrad.addColorStop(1, '#e5a71a');
      ctx.fillStyle = textGrad;
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 10;
      ctx.fillText(CAMPAIGN_CONFIG.mainOffer, width / 2, offerBoxY + (format === 'story' ? 105 : 90));

      // Supporting Line: On All Health Packages & Blood Tests
      ctx.font = '600 ' + (format === 'story' ? '32px' : '28px') + ' "Outfit", sans-serif';
      ctx.fillStyle = '#fff9f0';
      ctx.shadowBlur = 4;
      ctx.fillText(CAMPAIGN_CONFIG.supportingLine, width / 2, offerBoxY + (format === 'story' ? 180 : 155));
      ctx.restore();

      yOffset += offerBoxH + ((format === 'story') ? 60 : 44);

      // Two Symmetrical Offer Badges
      var pillW = (width - 200) / 2;
      var pillH = (format === 'story') ? 85 : 72;
      var pillY = yOffset;

      // Badge 1: Health Packages: FLAT 50% OFF
      drawCategoryBadge(ctx, 90, pillY, pillW, pillH, 'HEALTH PACKAGES', 'FLAT 50% OFF', '#10423d', '#2aa8b0');
      // Badge 2: Blood Tests: FLAT 50% OFF
      drawCategoryBadge(ctx, 90 + pillW + 20, pillY, pillW, pillH, 'BLOOD TESTS', 'FLAT 50% OFF', '#2e1240', '#d4af37');

      yOffset += pillH + ((format === 'story') ? 60 : 42);

      // Campaign Dates Capsule
      var datePillW = 460;
      var datePillH = 56;
      var datePillX = (width - datePillW) / 2;
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 1.5;
      roundRect(ctx, datePillX, yOffset, datePillW, datePillH, 28);
      ctx.fill();
      ctx.stroke();

      ctx.font = '700 24px "Outfit", sans-serif';
      ctx.fillStyle = '#ffd700';
      ctx.textAlign = 'center';
      ctx.fillText('🗓  ' + CAMPAIGN_CONFIG.datesDisplay, width / 2, yOffset + 36);
      ctx.restore();

      yOffset += datePillH + ((format === 'story') ? 50 : 34);

      // Supporting Message
      ctx.save();
      ctx.font = '400 ' + (format === 'story' ? '24px' : '21px') + ' "Inter", sans-serif';
      ctx.fillStyle = 'rgba(255, 249, 240, 0.9)';
      ctx.textAlign = 'center';
      wrapText(ctx, CAMPAIGN_CONFIG.supportingMessage, width / 2, yOffset, width - 240, 32);
      ctx.restore();

      // Footer / Verified Lab Credentials
      var footerY = height - ((format === 'story') ? 220 : 170);

      drawGoldDivider(ctx, width / 2, footerY - 24, 340);

      ctx.save();
      ctx.textAlign = 'center';

      ctx.font = '700 24px "Outfit", sans-serif';
      ctx.fillStyle = '#ffd700';
      ctx.fillText('The Most Trusted Laboratory of Indapur', width / 2, footerY + 10);

      ctx.font = '500 21px "Inter", sans-serif';
      ctx.fillStyle = '#fff9f0';
      ctx.fillText('Call / WhatsApp: +91 74107 45222  •  Indapur, Pune', width / 2, footerY + 44);

      ctx.font = '600 22px "Outfit", sans-serif';
      ctx.fillStyle = '#2aa8b0';
      ctx.fillText('https://smearpathology.in/', width / 2, footerY + 78);
      ctx.restore();

      if (typeof callback === 'function') {
        callback(canvas);
      }
    }

    logo.onload = renderPosterContent;
    logo.onerror = function () {
      renderPosterContent();
    };
    logo.src = './public/assets/logo/logo.png';
  }

  // ── CANVAS DRAWING HELPERS ──────────────────────────────────
  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function drawGoldDivider(ctx, cx, y, length) {
    ctx.save();
    var grad = ctx.createLinearGradient(cx - length / 2, y, cx + length / 2, y);
    grad.addColorStop(0, 'rgba(212, 175, 55, 0)');
    grad.addColorStop(0.5, '#ffd700');
    grad.addColorStop(1, 'rgba(212, 175, 55, 0)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - length / 2, y);
    ctx.lineTo(cx + length / 2, y);
    ctx.stroke();

    // Central diamond
    ctx.fillStyle = '#ffd700';
    ctx.beginPath();
    ctx.moveTo(cx, y - 5);
    ctx.lineTo(cx + 5, y);
    ctx.lineTo(cx, y + 5);
    ctx.lineTo(cx - 5, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawDiyaIllustration(ctx, cx, cy) {
    ctx.save();
    // Ambient Flame Glow
    var flameGlow = ctx.createRadialGradient(cx, cy - 14, 4, cx, cy - 14, 42);
    flameGlow.addColorStop(0, 'rgba(255, 215, 0, 0.7)');
    flameGlow.addColorStop(0.4, 'rgba(255, 122, 0, 0.35)');
    flameGlow.addColorStop(1, 'rgba(255, 122, 0, 0)');
    ctx.fillStyle = flameGlow;
    ctx.beginPath();
    ctx.arc(cx, cy - 14, 42, 0, Math.PI * 2);
    ctx.fill();

    // Flame outer
    ctx.fillStyle = '#ff7a00';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 42);
    ctx.bezierCurveTo(cx - 16, cy - 20, cx - 18, cy, cx, cy);
    ctx.bezierCurveTo(cx + 18, cy, cx + 16, cy - 20, cx, cy - 42);
    ctx.fill();

    // Flame core
    ctx.fillStyle = '#fff4b8';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 32);
    ctx.bezierCurveTo(cx - 8, cy - 16, cx - 10, cy - 2, cx, cy - 2);
    ctx.bezierCurveTo(cx + 10, cy - 2, cx + 8, cy - 16, cx, cy - 32);
    ctx.fill();

    // Clay Diya Bowl
    var bowlGrad = ctx.createLinearGradient(cx - 40, cy, cx + 40, cy + 24);
    bowlGrad.addColorStop(0, '#ffd700');
    bowlGrad.addColorStop(0.5, '#d4af37');
    bowlGrad.addColorStop(1, '#8b6508');
    ctx.fillStyle = bowlGrad;
    ctx.strokeStyle = '#fff2a8';
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(cx - 38, cy - 2);
    ctx.bezierCurveTo(cx - 26, cy + 24, cx + 26, cy + 24, cx + 38, cy - 2);
    ctx.bezierCurveTo(cx + 26, cy + 3, cx - 26, cy + 3, cx - 38, cy - 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Diya rim highlight
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 34, 4, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  function drawCategoryBadge(ctx, x, y, w, h, category, offer, darkColor, accentColor) {
    ctx.save();
    var bg = ctx.createLinearGradient(x, y, x + w, y + h);
    bg.addColorStop(0, darkColor);
    bg.addColorStop(1, '#0c1b18');
    ctx.fillStyle = bg;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, w, h, 14);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'center';
    ctx.font = '700 17px "Outfit", sans-serif';
    ctx.fillStyle = 'rgba(255, 249, 240, 0.85)';
    ctx.fillText(category, x + w / 2, y + 28);

    ctx.font = '800 28px "Outfit", sans-serif';
    ctx.fillStyle = '#ffd700';
    ctx.fillText(offer, x + w / 2, y + 60);
    ctx.restore();
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
    var line = '';
    for (var n = 0; n < words.length; n++) {
      var testLine = line + words[n] + ' ';
      var metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && n > 0) {
        ctx.fillText(line.trim(), x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line.trim(), x, y);
  }

  // ── POSTER MODAL UI (Section 9) ─────────────────────────────
  var _activePosterCanvas = null;
  var _activeFormat = 'portrait';

  function ensurePosterModal() {
    var modal = document.getElementById('diwali-poster-modal');
    if (modal) return modal;

    modal = document.createElement('div');
    modal.id = 'diwali-poster-modal';
    modal.className = 'diwali-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Diwali Campaign Artwork');

    modal.innerHTML = '' +
      '<div class="diwali-modal">' +
        '<button type="button" class="diwali-modal__close" id="diwali-modal-close-btn" aria-label="Close dialog">✕</button>' +

        '<div class="diwali-modal__header">' +
          '<div class="diwali-eyebrow"><span class="diwali-sparkle">✦</span> OFFICIAL CAMPAIGN ARTWORK <span class="diwali-sparkle">✦</span></div>' +
          '<h3 class="diwali-modal__title">Diwali Festive Offer Poster</h3>' +
          '<p class="diwali-modal__sub">Download or share high-resolution campaign artwork for social media.</p>' +
        '</div>' +

        '<div class="diwali-format-tabs" role="tablist">' +
          '<button type="button" class="diwali-tab-btn is-active" id="diwali-tab-portrait" role="tab" aria-selected="true">Portrait (1080×1350) • Post</button>' +
          '<button type="button" class="diwali-tab-btn" id="diwali-tab-story" role="tab" aria-selected="false">Story (1080×1920) • Status</button>' +
        '</div>' +

        '<div class="diwali-preview-frame">' +
          '<canvas id="diwali-preview-canvas" class="diwali-preview-canvas" width="1080" height="1350"></canvas>' +
        '</div>' +

        '<div class="diwali-modal__actions">' +
          '<button type="button" class="diwali-action-btn diwali-action-btn--primary" id="diwali-download-btn">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
              '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>' +
              '<polyline points="7 10 12 15 17 10"></polyline>' +
              '<line x1="12" y1="15" x2="12" y2="3"></line>' +
            '</svg>' +
            '<span>DOWNLOAD POSTER (PNG)</span>' +
          '</button>' +

          '<button type="button" class="diwali-action-btn diwali-action-btn--secondary" id="diwali-share-native-btn">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle>' +
              '<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>' +
            '</svg>' +
            '<span>SHARE VIA WHATSAPP / SOCIAL</span>' +
          '</button>' +

          '<button type="button" class="diwali-action-btn diwali-action-btn--secondary" id="diwali-copy-link-btn">' +
            '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
              '<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>' +
              '<path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>' +
            '</svg>' +
            '<span>COPY CAMPAIGN LINK</span>' +
          '</button>' +

          '<div class="diwali-action-feedback" id="diwali-action-feedback"></div>' +
        '</div>' +
      '</div>';

    document.body.appendChild(modal);

    // Wire close actions
    var closeBtn = modal.querySelector('#diwali-modal-close-btn');
    closeBtn.addEventListener('click', closePosterModal);
    modal.addEventListener('click', function (e) {
      if (e.target === modal) closePosterModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-active')) {
        closePosterModal();
      }
    });

    // Wire tab format switching
    var tabPortrait = modal.querySelector('#diwali-tab-portrait');
    var tabStory    = modal.querySelector('#diwali-tab-story');

    tabPortrait.addEventListener('click', function () {
      if (_activeFormat === 'portrait') return;
      _activeFormat = 'portrait';
      tabPortrait.classList.add('is-active');
      tabPortrait.setAttribute('aria-selected', 'true');
      tabStory.classList.remove('is-active');
      tabStory.setAttribute('aria-selected', 'false');
      renderPosterPreview('portrait');
    });

    tabStory.addEventListener('click', function () {
      if (_activeFormat === 'story') return;
      _activeFormat = 'story';
      tabStory.classList.add('is-active');
      tabStory.setAttribute('aria-selected', 'true');
      tabPortrait.classList.remove('is-active');
      tabPortrait.setAttribute('aria-selected', 'false');
      renderPosterPreview('story');
    });

    // Wire Download Action
    var dlBtn = modal.querySelector('#diwali-download-btn');
    dlBtn.addEventListener('click', function () {
      if (!_activePosterCanvas) return;
      try {
        var filename = 'smear-pathology-diwali-2026-' + _activeFormat + '.png';
        var link = document.createElement('a');
        link.download = filename;
        link.href = _activePosterCanvas.toDataURL('image/png');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showFeedback('✓ Poster downloaded successfully!');
      } catch (err) {
        showFeedback('Download initiated.');
      }
    });

    // Wire Web Share Action
    var shareNativeBtn = modal.querySelector('#diwali-share-native-btn');
    shareNativeBtn.addEventListener('click', function () {
      if (!_activePosterCanvas) return;
      var shareText = 'Smear Pathology Diwali Health Celebration 2026: Flat 50% OFF on all health packages & blood tests (1–15 Nov 2026). Visit: ' + CAMPAIGN_CONFIG.websiteUrl;

      if (_activePosterCanvas.toBlob && navigator.share && navigator.canShare) {
        _activePosterCanvas.toBlob(function (blob) {
          try {
            var file = new File([blob], 'smear-diwali-offer.png', { type: 'image/png' });
            if (navigator.canShare({ files: [file] })) {
              navigator.share({
                title: 'Smear Pathology Diwali Offer',
                text: shareText,
                files: [file]
              }).catch(function () {});
              return;
            }
          } catch (e) { /* fallback */ }

          // Fallback to URL share or WhatsApp intent
          fallbackShare(shareText);
        }, 'image/png');
      } else {
        fallbackShare(shareText);
      }
    });

    // Wire Copy Link Action
    var copyBtn = modal.querySelector('#diwali-copy-link-btn');
    copyBtn.addEventListener('click', function () {
      var url = CAMPAIGN_CONFIG.websiteUrl;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () {
          showFeedback('✓ Campaign link copied to clipboard!');
        }).catch(function () {
          fallbackCopy(url);
        });
      } else {
        fallbackCopy(url);
      }
    });

    return modal;
  }

  function fallbackShare(shareText) {
    if (navigator.share) {
      navigator.share({
        title: 'Smear Pathology Diwali Offer',
        text: shareText,
        url: CAMPAIGN_CONFIG.websiteUrl
      }).catch(function () {});
    } else {
      var waUrl = 'https://wa.me/?text=' + encodeURIComponent(shareText);
      window.open(waUrl, '_blank');
      showFeedback('Opening WhatsApp...');
    }
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showFeedback('✓ Link copied to clipboard!');
    } catch (e) {
      showFeedback('Link: ' + text);
    }
    document.body.removeChild(ta);
  }

  function showFeedback(msg) {
    var fb = document.getElementById('diwali-action-feedback');
    if (fb) {
      fb.textContent = msg;
      setTimeout(function () { fb.textContent = ''; }, 3500);
    }
  }

  function renderPosterPreview(format) {
    var previewCanvas = document.getElementById('diwali-preview-canvas');
    if (!previewCanvas) return;

    generatePosterCanvas(format, function (srcCanvas) {
      _activePosterCanvas = srcCanvas;
      previewCanvas.width  = srcCanvas.width;
      previewCanvas.height = srcCanvas.height;
      var ctx = previewCanvas.getContext('2d');
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      ctx.drawImage(srcCanvas, 0, 0);
    });
  }

  function openPosterModal() {
    var modal = ensurePosterModal();
    modal.classList.add('is-active');
    renderPosterPreview(_activeFormat);
  }

  function closePosterModal() {
    var modal = document.getElementById('diwali-poster-modal');
    if (modal) modal.classList.remove('is-active');
  }

  // ── INITIALIZATION ──────────────────────────────────────────
  function init() {
    hydrateHeroCampaignCard();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── GLOBAL EXPOSURE ─────────────────────────────────────────
  window.SmearCampaign = {
    config: CAMPAIGN_CONFIG,
    getStatus: getCampaignStatus,
    isActive: isCampaignActive,
    isPreview: isCampaignPreview,
    isExpired: isCampaignExpired,
    calculatePrice: calculatePrice,
    formatINR: formatINR,
    generatePosterCanvas: generatePosterCanvas,
    openPosterModal: openPosterModal,
    closePosterModal: closePosterModal
  };

})(window, document);

