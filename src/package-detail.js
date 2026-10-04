/**
 * SMEAR PATHOLOGY - PACKAGE DETAIL LOGIC v3

 * Consumes the new normalized Smear Pathology catalog.
 */
document.addEventListener('DOMContentLoaded', function() {
  var urlParams = new URLSearchParams(window.location.search);
  var pkgId = urlParams.get('id') || urlParams.get('slug');

  fetch('./public/data/smear-packages.json')
    .then(r => r.json())
    .then(packages => {
      var _pkg = packages.find(function(p) { return p.id === pkgId || p.slug === pkgId; });

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
      
      var descEl = document.getElementById('pd-long-desc');
      var shortDescEl = document.getElementById('pd-short-desc');
      var descText = _pkg.description || "This package includes comprehensive testing across multiple parameters to give you a thorough understanding of your health.";
      
      shortDescEl.textContent = descText.length > 150 ? descText.substring(0, 150) + '...' : descText;
      document.getElementById('pd-desc-section').style.display = 'block';
      descEl.innerHTML = '<p>' + descText.split('\n').join('</p><p>') + '</p>';

      // Price
      var pOldPrice = _pkg.price;
      var pPrice = pOldPrice !== null && pOldPrice > 0 ? Math.round(pOldPrice * 0.60) : null; // 40% OFF
      var pDiscount = 40;

      if (pPrice !== null) {
        document.getElementById('pd-price').textContent = '₹' + pPrice;
      } else {
        document.getElementById('pd-price').textContent = 'Price available at lab';
        document.getElementById('pd-price').style.fontSize = '1.2rem';
        document.getElementById('pd-price').style.color = 'var(--color-text)';
      }

      if (pPrice !== null && pOldPrice > 0) {
        document.getElementById('pd-discount').textContent = '40% OFF';
        document.getElementById('pd-discount').style.display = 'inline-block';
        document.getElementById('pd-discount').style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
        document.getElementById('pd-discount').style.color = '#000';
        document.getElementById('pd-discount').style.boxShadow = '0 2px 6px rgba(255,165,0,0.4)';
        
        document.getElementById('pd-mrp').textContent = '₹' + pOldPrice;
        document.getElementById('pd-mrp').style.display = 'inline-block';
        document.getElementById('pd-mrp').style.textDecoration = 'line-through';
      }

      // Tags (Hero)
      var tagsContainer = document.getElementById('pd-tags-container');
      var tagsHtml = '';
      if (_pkg.parameters_count) {
        tagsHtml += `<div class="pd-tag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>${_pkg.parameters_count} Parameters</div>`;
      } else if (_pkg.profile_count) {
        tagsHtml += `<div class="pd-tag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>${_pkg.profile_count} Profiles</div>`;
      }

      if (_pkg.gender && _pkg.gender !== 'both') {
        var gIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
        var gText = _pkg.gender === 'male' ? 'Male' : 'Female';
        tagsHtml += `<div class="pd-tag">${gIcon} ${gText}</div>`;
      }
      
      if (_pkg.fasting && _pkg.fasting !== 'no') {
        tagsHtml += `<div class="pd-tag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Fasting Required</div>`;
      }

      if (_pkg.report_time) {
        tagsHtml += `<div class="pd-tag"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>Report: ${_pkg.report_time}</div>`;
      }
      tagsContainer.innerHTML = tagsHtml;

      // Info Cards Grid
      var infoGrid = document.getElementById('pd-info-grid');
      var infoHtml = '';
      if (_pkg.fasting) {
        infoHtml += `<div class="pd-info-card">
          <div class="pd-info-card__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M21.1 11.2a1 1 0 0 1 0 1.6l-8.3 8.3a1 1 0 0 1-1.6 0l-8.3-8.3a1 1 0 0 1 0-1.6l8.3-8.3a1 1 0 0 1 1.6 0l8.3 8.3z"></path></svg></div>
          <div class="pd-info-card__label">Fasting Required</div>
          <div class="pd-info-card__value">${_pkg.fasting === 'yes' ? 'Yes (8-10 hours)' : 'No fasting required'}</div>
        </div>`;
      }
      if (_pkg.report_time) {
        infoHtml += `<div class="pd-info-card">
          <div class="pd-info-card__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg></div>
          <div class="pd-info-card__label">Report Availability</div>
          <div class="pd-info-card__value">${_pkg.report_time}</div>
        </div>`;
      }
      
      if (infoHtml) {
        document.getElementById('pd-info-cards-section').style.display = 'block';
        infoGrid.innerHTML = infoHtml;
      }

      // Tests & Profiles Accordions
      var testsAccordionContainer = document.getElementById('pd-profiles-accordion');
      if (_pkg.profiles && _pkg.profiles.length > 0) {
        document.getElementById('pd-tests-section').style.display = 'block';
        document.getElementById('pd-tests-count-badge').textContent = _pkg.parameters_count || _pkg.profiles.reduce((sum, p) => sum + (p.parameter_count || 1), 0);
        
        var accHtml = '<div class="pd-profiles-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin-top: 24px;">';
        _pkg.profiles.forEach(function(prof) {
          var numTests = prof.parameter_count || 1;
          accHtml += `
            <div class="pd-profile-card" style="background: var(--color-surface); padding: 16px; border-radius: 12px; border: 1px solid var(--color-border); box-shadow: 0 2px 4px rgba(0,0,0,0.02); display: flex; align-items: flex-start; gap: 12px; transition: transform 0.2s, box-shadow 0.2s;">
              <div style="color: var(--color-primary); flex-shrink: 0; padding-top: 2px;">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </div>
              <div>
                <h4 style="margin: 0; font-size: 0.95rem; color: var(--color-text-dark); line-height: 1.4;">${prof.name}</h4>
                <div style="font-size: 0.85rem; color: var(--color-text-mid); margin-top: 4px;">(${numTests} ${numTests === 1 ? 'Parameter' : 'Parameters'})</div>
              </div>
            </div>
          `;
        });
        accHtml += '</div>';
        testsAccordionContainer.innerHTML = accHtml;
      }

      // FAQ Accordions (we'll just safely handle if there are FAQs in the new schema, else hide)
      var faqAccordionContainer = document.getElementById('pd-faq-accordion');
      if (_pkg.faqs && _pkg.faqs.length > 0) {
        document.getElementById('pd-faq-section').style.display = 'block';
        var faqHtml = '';
        _pkg.faqs.forEach(function(faq, index) {
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
      } else {
        document.getElementById('pd-faq-section').style.display = 'none';
      }

      // Related Packages (same category)
      var related = packages.filter(function(p) { return p.categoryId === _pkg.categoryId && p.id !== _pkg.id; });
      if (related.length > 0) {
        document.getElementById('pd-related-section').style.display = 'block';
        var rGrid = document.getElementById('pd-related-grid');
        // Take max 3
        related.slice(0, 3).forEach(function(rp) {
          var rPrice = rp.price;
          var rDisc = rp.discount || 0;
          var el = document.createElement('div');
          el.className = 'pkg-card';
          el.innerHTML = `
            <div class="pkg-card__img-wrap">
              <div class="pkg-card__placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
              </div>
              ${rDisc > 0 ? `<span class="pkg-card__badge">${rDisc}% OFF</span>` : ''}
            </div>
            <div class="pkg-card__body">
              <div class="pkg-card__category">${rp.categoryName || 'Package'}</div>
              <h3 class="pkg-card__name">${rp.name}</h3>
              <div class="pkg-card__price">
                ${rPrice !== null ? '<span class="price-val">₹' + rPrice + '</span>' : '<span style="font-size:0.9em;color:var(--color-text-muted);">Price available at lab</span>'}
              </div>
              <div class="pkg-card__ctas">
                <a href="package-detail.html?id=${encodeURIComponent(rp.slug || rp.id)}" class="btn btn--outline-primary">View Details</a>
              </div>
            </div>
          `;
          rGrid.appendChild(el);
        });
      }

      // Buttons Logic
      var addBtn = document.getElementById('pd-add-cart-btn');
      addBtn.addEventListener('click', function() {
        if (window.SmearCart) {
          window.SmearCart.add(_pkg.id, 'package', _pkg.name, pPrice);
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
      
    })
    .catch(err => {
      document.getElementById('pd-loading').style.display = 'none';
      document.getElementById('pd-error').style.display = 'block';
    });
});
