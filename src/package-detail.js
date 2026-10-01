/**
 * SMEAR PATHOLOGY - PACKAGE DETAIL LOGIC
 * Replaces old BookMyTest scraped HTML pages with a clean, dynamic UI.
 */
document.addEventListener('DOMContentLoaded', function() {
  var urlParams = new URLSearchParams(window.location.search);
  var pkgId = urlParams.get('id');

  var _packages = window.SMEAR_PACKAGES || [];
  var _pkg = _packages.find(function(p) { return p.id === pkgId; });

  if (!_pkg) {
    document.getElementById('pd-loading').style.display = 'none';
    document.getElementById('pd-error').style.display = 'block';
    return;
  }

  // Hide loading, show main content
  var pdLoading = document.getElementById('pd-loading');
  if (pdLoading) pdLoading.style.display = 'none';
  var pdMain = document.getElementById('package-detail-main');
  if (pdMain) pdMain.style.display = 'block';

  // Set page title
  document.title = _pkg.name + ' | Smear Pathology Indapur';

  // Parse scraped content
  var parsedData = parseDetailedContent(_pkg.name, _pkg.sourceData ? _pkg.sourceData.detailed_content : '');

  // Render breadcrumbs
  var bcCategory = document.getElementById('breadcrumb-category');
  if (_pkg.categoryId) {
    bcCategory.textContent = _pkg.categoryName || _pkg.categoryId;
    bcCategory.href = 'packages.html?category=' + encodeURIComponent(_pkg.categoryId);
    bcCategory.style.display = 'inline';
    document.getElementById('breadcrumb-sep-2').style.display = 'inline';
  }
  document.getElementById('breadcrumb-current').textContent = _pkg.name;

  // Render Hero
  document.getElementById('pd-category-badge').textContent = _pkg.categoryName || 'Health Package';
  document.getElementById('pd-title').textContent = _pkg.name;
  
  // Description
  var descEl = document.getElementById('pd-long-desc');
  var shortDescEl = document.getElementById('pd-short-desc');
  var descText = parsedData.description || 'Comprehensive health checkup package provided by Smear Pathology, Indapur.';
  
  if (descText) {
    shortDescEl.textContent = descText.length > 150 ? descText.substring(0, 150) + '...' : descText;
    document.getElementById('pd-desc-section').style.display = 'block';
    descEl.innerHTML = '<p>' + descText.split('\n').join('</p><p>') + '</p>';
  }

  // Price
  var pPrice = extractPrice(_pkg.sourceData ? _pkg.sourceData.preview_content : null);
  if (pPrice) {
    document.getElementById('pd-price').textContent = '₹' + pPrice;
  } else {
    document.getElementById('pd-price').textContent = 'Enquire for Price';
  }
  var pDiscount = extractDiscount(_pkg.sourceData ? _pkg.sourceData.preview_content : null);
  if (pDiscount) {
    document.getElementById('pd-discount').textContent = pDiscount + '% OFF';
    document.getElementById('pd-discount').style.display = 'inline-block';
    // Calculate fake MRP for display based on discount
    var mrp = Math.round(pPrice / (1 - pDiscount / 100));
    document.getElementById('pd-mrp').textContent = '₹' + mrp;
    document.getElementById('pd-mrp').style.display = 'inline-block';
  }

  // Tags (Hero)
  var tagsContainer = document.getElementById('pd-tags-container');
  var tagsHtml = '';
  if (parsedData.testsCount) {
    tagsHtml += `<div class="pd-tag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>${parsedData.testsCount} Tests</div>`;
  }
  if (parsedData.sample) {
    tagsHtml += `<div class="pd-tag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg>${parsedData.sample}</div>`;
  }
  if (parsedData.fasting) {
    tagsHtml += `<div class="pd-tag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>${parsedData.fasting}</div>`;
  }
  tagsContainer.innerHTML = tagsHtml;

  // Info Cards Grid
  var infoGrid = document.getElementById('pd-info-grid');
  var infoHtml = '';
  if (parsedData.sample) {
    infoHtml += `<div class="pd-info-card">
      <div class="pd-info-card__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"></path></svg></div>
      <div class="pd-info-card__label">Sample Type</div>
      <div class="pd-info-card__value">${parsedData.sample}</div>
    </div>`;
  }
  if (parsedData.fasting) {
    infoHtml += `<div class="pd-info-card">
      <div class="pd-info-card__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M21.1 11.2a1 1 0 0 1 0 1.6l-8.3 8.3a1 1 0 0 1-1.6 0l-8.3-8.3a1 1 0 0 1 0-1.6l8.3-8.3a1 1 0 0 1 1.6 0l8.3 8.3z"></path></svg></div>
      <div class="pd-info-card__label">Fasting Required</div>
      <div class="pd-info-card__value">${parsedData.fasting}</div>
    </div>`;
  }
  infoHtml += `<div class="pd-info-card">
    <div class="pd-info-card__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
    <div class="pd-info-card__label">Report Availability</div>
    <div class="pd-info-card__value">24–48 Hours</div>
  </div>`;
  
  if (infoHtml) {
    document.getElementById('pd-info-cards-section').style.display = 'block';
    infoGrid.innerHTML = infoHtml;
  }

  // Tests & Profiles Accordions
  var testsAccordionContainer = document.getElementById('pd-profiles-accordion');
  if (parsedData.profiles && parsedData.profiles.length > 0) {
    document.getElementById('pd-tests-section').style.display = 'block';
    document.getElementById('pd-tests-count-badge').textContent = parsedData.testsCount || parsedData.profiles.reduce((sum, p) => sum + p.tests.length, 0);
    
    var accHtml = '';
    parsedData.profiles.forEach(function(prof, index) {
      // open the first one by default
      var isOpen = index === 0 ? 'is-open' : '';
      var numTests = prof.tests.length;
      accHtml += `
        <div class="pd-accordion ${isOpen}">
          <button class="pd-accordion__header" type="button" aria-expanded="${index === 0}">
            <span>${prof.name} (${numTests} ${numTests === 1 ? 'Test' : 'Tests'})</span>
            <svg class="pd-accordion__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="pd-accordion__body">
            <div class="pd-accordion__content">
              <ul class="pd-accordion__test-list">
                ${prof.tests.map(t => `<li class="pd-accordion__test-item">${t}</li>`).join('')}
              </ul>
            </div>
          </div>
        </div>
      `;
    });
    testsAccordionContainer.innerHTML = accHtml;

    // Attach listeners
    testsAccordionContainer.querySelectorAll('.pd-accordion__header').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var acc = this.parentElement;
        var isOpen = acc.classList.contains('is-open');
        // close all
        testsAccordionContainer.querySelectorAll('.pd-accordion').forEach(function(a) {
          a.classList.remove('is-open');
          a.querySelector('.pd-accordion__header').setAttribute('aria-expanded', 'false');
        });
        if (!isOpen) {
          acc.classList.add('is-open');
          this.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  // FAQ Accordions
  var faqAccordionContainer = document.getElementById('pd-faq-accordion');
  if (parsedData.faqs && parsedData.faqs.length > 0) {
    document.getElementById('pd-faq-section').style.display = 'block';
    var faqHtml = '';
    parsedData.faqs.forEach(function(faq, index) {
      // Don't open any by default to save space
      faqHtml += `
        <div class="pd-accordion">
          <button class="pd-accordion__header" type="button" aria-expanded="false">
            <span>${faq.q}</span>
            <svg class="pd-accordion__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="pd-accordion__body">
            <div class="pd-accordion__content">${faq.a.split('\n').join('<br/>')}</div>
          </div>
        </div>
      `;
    });
    faqAccordionContainer.innerHTML = faqHtml;

    faqAccordionContainer.querySelectorAll('.pd-accordion__header').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var acc = this.parentElement;
        acc.classList.toggle('is-open');
        this.setAttribute('aria-expanded', acc.classList.contains('is-open'));
      });
    });
  }

  // Related Packages (same category)
  var related = _packages.filter(function(p) { return p.categoryId === _pkg.categoryId && p.id !== _pkg.id; });
  if (related.length > 0) {
    document.getElementById('pd-related-section').style.display = 'block';
    var rGrid = document.getElementById('pd-related-grid');
    // Take max 3
    related.slice(0, 3).forEach(function(rp) {
      var rPrice = extractPrice(rp.sourceData ? rp.sourceData.preview_content : null);
      var rDisc = extractDiscount(rp.sourceData ? rp.sourceData.preview_content : null);
      var el = document.createElement('div');
      el.className = 'pkg-card';
      el.innerHTML = `
        <div class="pkg-card__img-wrap">
          <div class="pkg-card__placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
          </div>
          ${rDisc ? `<span class="pkg-card__badge">${rDisc}% OFF</span>` : ''}
        </div>
        <div class="pkg-card__body">
          <div class="pkg-card__category">${rp.categoryName || 'Package'}</div>
          <h3 class="pkg-card__name">${rp.name}</h3>
          <div class="pkg-card__price">
            <span class="price-val">₹${rPrice || '--'}</span>
          </div>
          <div class="pkg-card__ctas">
            <a href="package-detail.html?id=${encodeURIComponent(rp.id)}" class="btn btn--outline-primary">View Details</a>
          </div>
        </div>
      `;
      rGrid.appendChild(el);
    });
  }

  // Buttons Logic
  var addBtn = document.getElementById('pd-add-cart-btn');
  addBtn.addEventListener('click', function() {
    if (window.addToCart) {
      window.addToCart(_pkg.id, _pkg.name, pPrice, 'package');
      var ogText = addBtn.textContent;
      addBtn.textContent = 'Added to Cart ✓';
      addBtn.style.backgroundColor = '#10b981';
      addBtn.style.borderColor = '#10b981';
      addBtn.style.color = '#fff';
      setTimeout(function() {
        addBtn.textContent = ogText;
        addBtn.style = '';
      }, 2000);
    }
  });

  var waBtn = document.getElementById('pd-wa-book-btn');
  var phone = (typeof CONTACT_PHONE !== 'undefined') ? CONTACT_PHONE : '7410745222';
  var msg = "Hello, I would like to enquire about the following health package:\n\n*" + _pkg.name + "*";
  waBtn.href = "https://wa.me/91" + phone + "?text=" + encodeURIComponent(msg);
});

/**
 * PARSER LOGIC
 * Extracts structured data from raw BookMyTest scraped text dump.
 */
function parseDetailedContent(pkgName, content) {
  var result = {
    description: '',
    testsCount: null,
    sample: null,
    fasting: null,
    profiles: [],
    faqs: []
  };
  if (!content) return result;

  var lines = content.split(/\r?\n/).map(s => s.trim()).filter(s => s.length > 0);
  
  var state = 'START';
  var currentProfile = null;
  var currentFaq = null;

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];

    // Clean up generic BookMyTest noise
    if (line.match(/Bookmytest|bookmytest/i)) continue;
    if (line.match(/17 Crores\+ Samples Processed|World Class Technology Labs|25\+ Years of Trust/i)) continue;
    if (line.match(/Home|Offers|Thyrocare Package|Blood Test @ Home|Diagnostic Centres|Popular Search/i)) continue;
    if (line.match(/₹|Rs\.|Price:|Booked This Week/i)) continue;

    // Detect state changes
    if (line.match(/List of Profiles Included:/i)) {
      state = 'PROFILES';
      continue;
    }
    if (line.match(/Frequently Asked Questions:/i) || line.match(/FAQ/i)) {
      state = 'FAQ';
      continue;
    }

    if (state === 'START') {
      // Look for sample type
      if (line.match(/Sample Type:/i)) {
        if (lines[i+1]) {
          result.sample = lines[i+1].trim();
          i++; // skip next
        }
        continue;
      }
      // Look for fasting
      if (line.match(/fasting/i) && !line.match(/fasting blood sugar/i)) {
        result.fasting = line;
        continue;
      }
      
      // Look for tests count e.g. "127 Tests"
      var tMatch = line.match(/(\d+)\s+Tests/i);
      if (tMatch && !result.testsCount) {
        result.testsCount = tMatch[1];
      }

      // Collect description (anything that seems like a proper sentence)
      if (line.length > 30 && line.indexOf('.') !== -1 && !line.match(/Rs\./)) {
        result.description += line + ' ';
      }
    } 
    else if (state === 'PROFILES') {
      // Profile headers look like: THYROID (3 Tests)
      var profMatch = line.match(/^([A-Z0-9\s\-\&\/]+)(?:\(\d+\s*Tests\))?$/i);
      
      // If it's all caps or ends with (X Tests), treat as profile header
      if (line.match(/\(\d+\s*Tests\)/i) || (line === line.toUpperCase() && line.length > 3 && !line.match(/^[0-9]+$/))) {
        currentProfile = {
          name: line.replace(/\(\d+\s*Tests\)/i, '').trim(),
          tests: []
        };
        result.profiles.push(currentProfile);
      } else if (currentProfile) {
        // It's a test within the profile
        if (line !== 'VIEW SAMPLE REPORT') {
          currentProfile.tests.push(line);
        }
      }
    }
    else if (state === 'FAQ') {
      if (line.endsWith('?')) {
        currentFaq = { q: line, a: '' };
        result.faqs.push(currentFaq);
      } else if (currentFaq) {
        currentFaq.a += line + '\n';
      }
    }
  }

  // Clean description
  result.description = result.description.replace(/\s+/g, ' ').trim();
  
  // Clean FAQ answers
  result.faqs.forEach(f => f.a = f.a.trim());

  // Filter out empty profiles
  result.profiles = result.profiles.filter(p => p.tests.length > 0);

  return result;
}

/**
 * Utility: extract price (reused logic)
 */
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

/**
 * Utility: extract discount (reused logic)
 */
function extractDiscount(previewContent) {
  if (!previewContent) return 0;
  var match = previewContent.match(/(\d+)%\s*OFF/i);
  return match ? parseInt(match[1], 10) : 0;
}
