/**
 * SMEAR PATHOLOGY - VISUAL SYSTEM
 * Professional, code-generated SVG icons and motifs for medical categories.
 */
(function() {
  'use strict';

  var _svgs = {
    // Icons (small, line art)
    diabetes: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`, // modified glucose
    thyroid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    liver: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14c0 4.418 3.582 8 8 8 2 0 4-1 5-2l5-5c1-1 2-2 1-4-1-2-4-2-6-1l-3 2-2-1c-1-1-2-1-4-1s-4 2-4 4z"/></svg>`,
    kidney: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 14c-2.76 0-5-2.24-5-5s2.24-5 5-5c2.14 0 4 1.34 4.7 3.23.1.28.37.47.66.47h3.28c.29 0 .56-.19.66-.47C15 5.34 16.86 4 19 4c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5c0-.82.2-1.58.55-2.26-.06-.01-.12-.02-.19-.02h-4.72c-.07 0-.13.01-.19.02C9.8 12.42 10 13.18 10 14c0 2.76-2.24 5-5 5z"/></svg>`,
    vitamins: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
    blood: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
    hormones: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>`,
    women: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M12 13v9"/><path d="M9 18h6"/></svg>`,
    men: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="14" r="5"/><path d="M13.5 10.5L21 3"/><path d="M16 3h5v5"/></svg>`,
    cancer: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 17.5L3 6v12h12.5a3.5 3.5 0 1 0 0-7H9"/><path d="M9 11l12 10"/></svg>`,
    default: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>`
  };

  function normalize(cat) {
    cat = (cat || '').toLowerCase();
    if (cat.indexOf('diabet') > -1) return 'diabetes';
    if (cat.indexOf('thyroid') > -1) return 'thyroid';
    if (cat.indexOf('heart') > -1 || cat.indexOf('cardiac') > -1) return 'heart';
    if (cat.indexOf('liver') > -1) return 'liver';
    if (cat.indexOf('kidney') > -1 || cat.indexOf('renal') > -1) return 'kidney';
    if (cat.indexOf('vitamin') > -1 || cat.indexOf('nutrition') > -1) return 'vitamins';
    if (cat.indexOf('blood') > -1 || cat.indexOf('anemia') > -1 || cat.indexOf('hemato') > -1) return 'blood';
    if (cat.indexOf('hormon') > -1 || cat.indexOf('pcos') > -1 || cat.indexOf('pcod') > -1) return 'hormones';
    if (cat.indexOf('women') > -1 || cat.indexOf('female') > -1 || cat.indexOf('pregnancy') > -1) return 'women';
    if (cat.indexOf('men') > -1 || cat.indexOf('male') > -1) return 'men';
    if (cat.indexOf('cancer') > -1 || cat.indexOf('tumor') > -1 || cat.indexOf('marker') > -1) return 'cancer';
    return 'default';
  }

  function getIconSVG(categoryName) {
    var key = normalize(categoryName);
    return _svgs[key] || _svgs.default;
  }

  function getMotifSVG(categoryName) {
    var key = normalize(categoryName);
    // Return a subtle repeating pattern or abstract motif for backgrounds
    var paths = {
      diabetes: `<pattern id="p-diab" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="rgba(0,150,136,0.1)"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-diab)"/>`,
      thyroid: `<pattern id="p-thy" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20 0 Q40 20 20 40 Q0 20 20 0" fill="none" stroke="rgba(156,39,176,0.05)" stroke-width="1"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-thy)"/>`,
      heart: `<pattern id="p-hrt" x="0" y="0" width="60" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 L10 10 L15 0 L25 20 L30 10 L60 10" fill="none" stroke="rgba(244,67,54,0.05)" stroke-width="1"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-hrt)"/>`,
      liver: `<pattern id="p-liv" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><polygon points="15,0 30,15 15,30 0,15" fill="none" stroke="rgba(121,85,72,0.05)" stroke-width="1"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-liv)"/>`,
      kidney: `<pattern id="p-kid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M5 15 A 10 10 0 0 0 25 15 A 10 10 0 0 0 5 15" fill="none" stroke="rgba(33,150,243,0.05)" stroke-width="1"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-kid)"/>`,
      vitamins: `<pattern id="p-vit" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="2" fill="rgba(255,152,0,0.05)"/><circle cx="15" cy="15" r="3" fill="rgba(255,152,0,0.05)"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-vit)"/>`,
      blood: `<pattern id="p-bld" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="20" cy="20" r="10" fill="rgba(229,57,53,0.03)"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-bld)"/>`,
      hormones: `<pattern id="p-hrm" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M0 15 L30 15 M15 0 L15 30" stroke="rgba(103,58,183,0.03)" stroke-width="1"/><circle cx="15" cy="15" r="5" fill="none" stroke="rgba(103,58,183,0.05)" stroke-width="1"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-hrm)"/>`,
      women: `<pattern id="p-wom" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M20 0 Q40 40 0 40 Q20 20 20 0" fill="none" stroke="rgba(233,30,99,0.04)" stroke-width="1"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-wom)"/>`,
      men: `<pattern id="p-men" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M0 0 L40 40 M40 0 L0 40" stroke="rgba(33,150,243,0.03)" stroke-width="1"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-men)"/>`,
      cancer: `<pattern id="p-canc" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M0 10 Q10 20 20 10 T40 10" fill="none" stroke="rgba(0,188,212,0.05)" stroke-width="1"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-canc)"/>`,
      default: `<pattern id="p-def" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="rgba(0,0,0,0.03)"/></pattern><rect x="0" y="0" width="100%" height="100%" fill="url(#p-def)"/>`
    };
    
    var path = paths[key] || paths.default;
    return `<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" style="position:absolute;top:0;left:0;z-index:0;pointer-events:none;">${path}</svg>`;
  }

  window.SmearVisuals = {
    getIconSVG: getIconSVG,
    getMotifSVG: getMotifSVG
  };

}());
