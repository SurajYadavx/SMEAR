(function () {
  'use strict';

  var _packages = [];
  var _categories = [];
  var _activeCategory = null;

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function extractPrice(previewContent) {
    if (!previewContent) return 0;
    var match = previewContent.match(/₹\s*(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  }
  
  function extractDiscount(previewContent) {
    if (!previewContent) return 0;
    var match = previewContent.match(/(\d+)%\s*OFF/);
    return match ? parseInt(match[1], 10) : 0;
  }

  function renderCategoryCards() {
    var grid = document.getElementById('shop-package-grid');
    if (!grid) return;
    
    // Change heading
    var heading = document.getElementById('shop-packages-heading');
    if (heading) heading.textContent = 'Package Categories';
    
    // Hide search & filter chips
    var searchSection = document.querySelector('.shop-search-section');
    if (searchSection) searchSection.style.display = 'none';
    
    // Reset back button if any
    var backBtn = document.getElementById('back-to-categories');
    if (backBtn) backBtn.remove();
    
    grid.innerHTML = '';
    
    _categories.forEach(function (cat) {
      if (cat.packageCount === 0) return;
      
      var card = document.createElement('div');
      card.className = 'shop-pkg-card';
      card.style.cursor = 'pointer';
      
      card.innerHTML = 
        '<div class="shop-pkg-card__body" style="text-align: center; padding: 40px 20px;">' +
          '<h3 class="shop-pkg-card__title" style="font-size: 1.4rem; color: var(--color-primary-dark); margin-bottom: 15px;">' + esc(cat.name) + '</h3>' +
          '<div style="color: #5a7070; margin-bottom: 25px; font-weight: 500;">' + cat.packageCount + ' Packages</div>' +
          '<span class="btn btn--outline-primary" style="display:inline-flex;">Explore Packages &rarr;</span>' +
        '</div>';
        
      card.addEventListener('click', function() {
        _activeCategory = cat.id;
        renderPackagesForCategory();
      });
        
      grid.appendChild(card);
    });
  }

  function renderPackagesForCategory() {
    var grid = document.getElementById('shop-package-grid');
    if (!grid) return;
    
    var cat = _categories.find(c => c.id === _activeCategory);
    if (!cat) return;
    
    var heading = document.getElementById('shop-packages-heading');
    if (heading) heading.textContent = cat.name;
    
    // Show back button
    var headContainer = document.querySelector('.catalogue-section__head');
    if (headContainer && !document.getElementById('back-to-categories')) {
      var backBtn = document.createElement('button');
      backBtn.id = 'back-to-categories';
      backBtn.className = 'btn btn--outline-primary';
      backBtn.style.marginBottom = '20px';
      backBtn.innerHTML = '&larr; Back to Categories';
      backBtn.addEventListener('click', function() {
        _activeCategory = null;
        renderCategoryCards();
      });
      headContainer.insertBefore(backBtn, headContainer.firstChild);
    }
    
    grid.innerHTML = '';
    
    var filtered = _packages.filter(function(pkg) {
      return pkg.categoryId === _activeCategory;
    });
    
    filtered.forEach(function(pkg) {
      var card = document.createElement('div');
      card.className = 'shop-pkg-card';
      
      var price = extractPrice(pkg.sourceData.preview_content);
      var discount = extractDiscount(pkg.sourceData.preview_content);
      
      var imgHtml = pkg.sourceData.preview_image_url
        ? '<img src="' + esc(pkg.sourceData.preview_image_url) + '" alt="' + esc(pkg.name) + '" loading="lazy" />'
        : '<div class="shop-pkg-card__img-placeholder"><svg viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="12" fill="rgba(13,59,62,0.06)"/><path d="M10 48l12-16 10 10 8-10 14 16H10z" fill="rgba(13,59,62,0.14)"/><circle cx="44" cy="20" r="6" fill="rgba(13,59,62,0.14)"/></svg></div>';
      
      var ctas = '<div class="shop-pkg-card__ctas">' +
        '<button class="btn btn--outline-primary view-pkg-btn" data-id="' + pkg.id + '">View Details</button>' +
        '<button class="btn btn--primary add-pkg-btn" data-id="' + pkg.id + '">Add to Cart</button>' +
        '</div>';
        
      var priceHtml = price > 0 ? '<div class="shop-pkg-card__price">₹' + price + '</div>' : '';
      
      card.innerHTML = 
        '<div class="shop-pkg-card__img-wrap">' + imgHtml + 
          (discount > 0 ? '<span class="shop-pkg-card__discount-badge">' + discount + '% OFF</span>' : '') +
        '</div>' +
        '<div class="shop-pkg-card__body">' +
          '<h3 class="shop-pkg-card__title">' + esc(pkg.name) + '</h3>' +
          priceHtml +
          ctas +
        '</div>';
        
      grid.appendChild(card);
    });
    
    // Attach events
    grid.querySelectorAll('.view-pkg-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        openPackageModal(e.currentTarget.getAttribute('data-id'));
      });
    });
    
    grid.querySelectorAll('.add-pkg-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var id = e.currentTarget.getAttribute('data-id');
        var pkg = _packages.find(function(p) { return p.id === id; });
        if (pkg && window.SmearCart) {
          var price = extractPrice(pkg.sourceData.preview_content);
          window.SmearCart.add(pkg.id, 'package', pkg.name, price);
        }
      });
    });
  }
  
  function openPackageModal(id) {
    var pkg = _packages.find(function(p) { return p.id === id; });
    if (!pkg) return;
    window.location.href = 'package-details/' + pkg.id + '.html';
  }

  function init() {
    var closeBtn = document.getElementById('modal-close');
    var modal = document.getElementById('test-modal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', function() {
        modal.classList.remove('modal-overlay--visible');
        modal.setAttribute('aria-hidden', 'true');
      });
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.classList.remove('modal-overlay--visible');
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    }

    if (window.SMEAR_CATEGORIES && window.SMEAR_PACKAGES) {
      _categories = window.SMEAR_CATEGORIES;
      _packages = window.SMEAR_PACKAGES;
      renderCategoryCards();
    } else {
      Promise.all([
        fetch('./public/data/package-categories.json').then(res => res.json()),
        fetch('./public/data/packages.json').then(res => res.json())
      ]).then(function(values) {
        _categories = values[0];
        _packages = values[1];
        renderCategoryCards();
      }).catch(function(e) {
        var grid = document.getElementById('shop-package-grid');
        if (grid) grid.innerHTML = '<p style="color: red; text-align: center;">Error loading package data. Please use a local web server (e.g. VS Code Live Server) to view the pages correctly if not hosted.</p>';
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

})();
