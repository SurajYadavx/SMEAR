/**
 * ============================================================
 *  SMEAR PATHOLOGY — PACKAGES.JS v2
 *  Powers packages.html
 *  - Premium category cards
 *  - Premium package cards
 *  - Package search (real dataset)
 *  - URL state preservation (?category=..., ?pkg=...)
 *  - Back-to-categories button
 *  - Loading/empty/error states
 *  - Centralized Smear WhatsApp
 * ============================================================
 */
(function () {
  'use strict';

  var _packages   = [];
  var _categories = [];
  var _activeCategory = null;
  var _searchQuery = '';
  var _debounce = null;

  
  var CAT_COLORS = [
    '#0d3b3e','#1a6b6e','#2aa8b0','#1a7d50',
    '#2563eb','#7c3aed','#d97706','#dc2626',
    '#0891b2','#059669','#8b5cf6','#f97316',
    '#6b7280','#10b981','#3b82f6','#ef4444'
  ];

  function getCatIcon(id) {
    if (window.SmearVisuals) return window.SmearVisuals.getIconSVG(id);
    return '';
  }

  function getCatColor(index) {
    return CAT_COLORS[index % CAT_COLORS.length];
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function extractPrice(previewContent) {
    if (!previewContent) return 0;
    // Format: "?,1 2370" or "₹ 2370" — grab the last 3-5 digit number after a comma-1 pattern
    // Primary: look for ",1 NNNN" pattern (scraped rupee symbol gets corrupted)
    var commaMatch = previewContent.match(/,1\s*(\d{3,6})/g);
    if (commaMatch && commaMatch.length > 0) {
      // First occurrence is usually MRP, second is discounted — prefer second if available
      var last = commaMatch[commaMatch.length > 1 ? commaMatch.length - 1 : 0];
      var numMatch = last.match(/(\d{3,6})/);
      return numMatch ? parseInt(numMatch[1], 10) : 0;
    }
    // Fallback: look for rupee character
    var rsMatch = previewContent.match(/[₹$£]\s*(\d+)/);
    if (rsMatch) return parseInt(rsMatch[1], 10);
    return 0;
  }

  function extractDiscount(previewContent) {
    if (!previewContent) return 0;
    var match = previewContent.match(/(\d+)%\s*OFF/i);
    return match ? parseInt(match[1], 10) : 0;
  }

  /* ── URL State ────────────────────────────────────────────── */
  function readURLState() {
    var params = new URLSearchParams(window.location.search);
    var cat    = params.get('category');
    var q      = params.get('q') || params.get('search') || '';
    return { category: cat, query: q };
  }

  function setURLState(cat, q) {
    var params = new URLSearchParams();
    if (cat) params.set('category', cat);
    if (q)   params.set('q', q);
    var url = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.replaceState({ category: cat, query: q }, '', url);
  }

  /* ── Skeleton Loading ─────────────────────────────────────── */
  function renderSkeleton(grid) {
    grid.innerHTML = '';
    for (var i = 0; i < 8; i++) {
      var card = document.createElement('div');
      card.className = 'skeleton-card';
      card.innerHTML =
        '<div class="skeleton-img"></div>' +
        '<div class="skeleton-body">' +
          '<div class="skeleton-line skeleton-line--short"></div>' +
          '<div class="skeleton-line skeleton-line--medium"></div>' +
          '<div class="skeleton-line skeleton-line--short"></div>' +
        '</div>';
      grid.appendChild(card);
    }
  }

  /* ── Section UI helpers ───────────────────────────────────── */
  function getGrid() { return document.getElementById('shop-package-grid'); }
  function getSearchSection() { return document.querySelector('.shop-search-section'); }
  function getHeading() { return document.getElementById('shop-packages-heading'); }
  function getHeadContainer() { return document.querySelector('.catalogue-section__head'); }

  function removeBackBtn() {
    var b = document.getElementById('back-to-categories');
    if (b) b.remove();
  }

  function updateResultCount(count, searchQuery) {
    var existing = document.getElementById('result-count-bar');
    if (existing) existing.remove();
    if (!count && count !== 0) return;

    var bar = document.createElement('div');
    bar.id = 'result-count-bar';
    bar.className = 'search-meta-bar';
    var countEl = document.createElement('span');
    countEl.className = 'search-meta-bar__count';
    if (searchQuery) {
      countEl.innerHTML = 'Found <strong>' + count + '</strong> result' + (count !== 1 ? 's' : '') + ' for "' + esc(searchQuery) + '"';
    } else {
      countEl.innerHTML = '<strong>' + count + '</strong> package' + (count !== 1 ? 's' : '');
    }
    bar.appendChild(countEl);
    if (searchQuery) {
      var clearBtn = document.createElement('button');
      clearBtn.className = 'search-meta-bar__clear';
      clearBtn.textContent = '✕ Clear';
      clearBtn.addEventListener('click', function() {
        var inp = document.getElementById('shop-search-input');
        if (inp) { inp.value = ''; inp.dispatchEvent(new Event('input',{bubbles:true})); }
      });
      bar.appendChild(clearBtn);
    }
    var grid = getGrid();
    if (grid && grid.parentNode) grid.parentNode.insertBefore(bar, grid);
  }

  /* ── Category Tabs ───────────────────────────────────────── */
  function renderCategoryTabs() {
    var filtersContainer = document.getElementById('shop-category-filters');
    if (!filtersContainer) return;
    
    filtersContainer.innerHTML = '';
    
    // Add "All" tab
    var allTab = document.createElement('button');
    allTab.className = 'shop-filter-btn' + (!_activeCategory ? ' active' : '');
    allTab.textContent = 'All';
    allTab.addEventListener('click', function() {
      _activeCategory = null;
      renderCategoryTabs();
      setURLState('', '');
      renderPackagesForCategory();
    });
    filtersContainer.appendChild(allTab);

    var catCounts = {};
    _packages.forEach(function(p) {
      if(p.categoryId) catCounts[p.categoryId] = (catCounts[p.categoryId] || 0) + 1;
    });

    _categories.forEach(function(cat) {
      var count = catCounts[cat.categoryId] || 0;
      if (count === 0) return;
      
      var tab = document.createElement('button');
      tab.className = 'shop-filter-btn' + (_activeCategory === cat.categoryId ? ' active' : '');
      tab.textContent = cat.categoryName;
      tab.addEventListener('click', function() {
        _activeCategory = cat.categoryId;
        renderCategoryTabs();
        setURLState(cat.categoryId, '');
        renderPackagesForCategory();
      });
      filtersContainer.appendChild(tab);
    });
  }

  /* ── Package Cards for Category ───────────────────────────── */
  function renderPackagesForCategory(searchOverride) {
    var grid = getGrid();
    if (!grid) return;

    var cat = _activeCategory ? _categories.find(function(c) { return c.categoryId === _activeCategory; }) : null;

    var heading = document.getElementById('shop-packages-heading');
    
    if (heading) heading.textContent = cat ? cat.categoryName : 'All Packages';


    // Show search section
    var searchSection = getSearchSection();
    if (searchSection) searchSection.style.display = '';

    // Back button
    removeBackBtn();

    var query = searchOverride !== undefined ? searchOverride : _searchQuery;
    var qNorm = query.toLowerCase().trim();

    var filtered = _packages.filter(function(pkg) {
      
    if (_activeCategory && pkg.categoryId !== _activeCategory) return false;

      if (!qNorm) return true;
      var name = (pkg.name || '').toLowerCase();
      return name.indexOf(qNorm) > -1;
    });

    // Switch grid class
    grid.className = 'pkg-card-grid';
    grid.innerHTML = '';
    updateResultCount(filtered.length, qNorm || null);

    if (filtered.length === 0) {
      grid.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>' +
          '<h3>No packages found</h3>' +
          '<p>' + (qNorm ? 'No packages match "' + esc(qNorm) + '".' : 'No packages in this category.') + '</p>' +
          '<button class="btn btn--outline-primary" onclick="var inp=document.getElementById(\'shop-search-input\');if(inp){inp.value=\'\';inp.dispatchEvent(new Event(\'input\',{bubbles:true}));}" style="margin: 0 auto;">Clear Search</button>' +
        '</div>';
      return;
    }

    filtered.forEach(function(pkg) {
      var oldPrice = typeof pkg.price === 'number' ? pkg.price : extractPrice(pkg.sourceData && pkg.sourceData.preview_content);
      var price    = oldPrice > 0 ? Math.round(oldPrice * 0.60) : 0;
      var discount = 40;
      var imgUrl   = pkg.image_url || (pkg.sourceData && pkg.sourceData.preview_image_url);
      var catObj   = _categories.find(function(c) { return c.categoryId === pkg.categoryId; });

      var card = document.createElement('div');
      card.className = 'pkg-card';

      var catLabel = catObj ? catObj.categoryName : (pkg.categoryId || 'Health Package');
      var imgHtml = imgUrl
        ? '<img src="' + esc(imgUrl) + '" alt="' + esc(pkg.name) + '" loading="lazy" />'
        : '<div class="pkg-card__placeholder"><span class="pkg-card__placeholder-label">' + esc(catLabel) + '</span></div>';

      card.innerHTML =
        '<div class="pkg-card__img-wrap">' +
          imgHtml +
          '<span class="pkg-card__badge" style="top: 8px; right: 8px; left: auto; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; box-shadow: 0 2px 6px rgba(255,165,0,0.4);">40% OFF</span>' +
        '</div>' +
        '<div class="pkg-card__body">' +
          '<div class="pkg-card__category">' + esc(catObj ? catObj.categoryName : pkg.categoryId) + '</div>' +
          '<div class="pkg-card__name">' + esc(pkg.name) + '</div>' +
          (price > 0 ? '<div class="pkg-card__price"><span style="text-decoration: line-through; color: var(--color-text-muted); font-size: 0.85em; font-weight: 500; margin-right: 6px;">₹' + oldPrice + '</span>₹' + price + '</div>' : '') +
          '<div class="pkg-card__ctas">' +
            '<button class="btn btn--outline-primary view-pkg-btn" data-id="' + esc(pkg.id) + '">View Details</button>' +
            '<button class="btn btn--primary add-pkg-btn" data-id="' + esc(pkg.id) + '" data-name="' + esc(pkg.name) + '" data-price="' + price + '">Add to Cart</button>' +
          '</div>' +
        '</div>';

      grid.appendChild(card);
    });

    // Events
    grid.querySelectorAll('.view-pkg-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = btn.getAttribute('data-id');
        openPackageDetail(id);
      });
    });
    grid.querySelectorAll('.add-pkg-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id    = btn.getAttribute('data-id');
        var name  = btn.getAttribute('data-name');
        var price = parseInt(btn.getAttribute('data-price'), 10) || 0;
        if (window.SmearCart) window.SmearCart.add(id, 'package', name, price);
      });
    });

    setURLState(_activeCategory, qNorm);
  }

  /* ── Open Package Detail ───────────────────────────────────── */
  function openPackageDetail(id) {
    var pkg = _packages.find(function(p) { return p.id === id; });
    if (!pkg) return;
    // Navigate to single dynamic detail page.
    window.location.href = 'package-detail.html?id=' + encodeURIComponent(pkg.id);
  }

  /* ── Global Search (from header or cross-page) ─────────────── */
  function handleGlobalSearch(q) {
    _searchQuery = q;
    var qNorm = q.toLowerCase().trim();
    var grid = getGrid();
    if (!grid) return;

    grid.className = 'pkg-card-grid';
    grid.innerHTML = '';

    var searchSection = getSearchSection();
    if (searchSection) searchSection.style.display = '';

    var heading = getHeading();
    if (heading) heading.textContent = qNorm ? 'Search Results' : (_activeCategory ? (_categories.find(function(c){ return c.categoryId === _activeCategory;})||{}).categoryName : 'All Packages');

    var filtered = _packages.filter(function(pkg) {
      if (_activeCategory && pkg.categoryId !== _activeCategory) return false;
      if (!qNorm) return true;
      var name  = (pkg.name || '').toLowerCase();
      var catId = (pkg.categoryId || '').toLowerCase();
      return name.indexOf(qNorm) > -1 || catId.indexOf(qNorm) > -1;
    });

    updateResultCount(filtered.length, qNorm);

    if (filtered.length === 0) {
      grid.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>' +
          '<h3>No packages found</h3>' +
          '<p>No packages match "' + esc(qNorm) + '". Try a different search.</p>' +
          '<button class="btn btn--outline-primary" onclick="var inp=document.getElementById(\'shop-search-input\');if(inp){inp.value=\'\';inp.dispatchEvent(new Event(\'input\',{bubbles:true}));}" style="margin: 0 auto;">Clear Search</button>' +
        '</div>';
      return;
    }

      filtered.slice(0, 60).forEach(function(pkg) {
        var oldPrice = typeof pkg.price === 'number' ? pkg.price : extractPrice(pkg.sourceData && pkg.sourceData.preview_content);
        var price    = oldPrice > 0 ? Math.round(oldPrice * 0.60) : 0;
        var discount = 40;
        var imgUrl   = pkg.image_url || (pkg.sourceData && pkg.sourceData.preview_image_url);
        var catObj   = _categories.find(function(c) { return c.categoryId === pkg.categoryId; });

        var card = document.createElement('div');
        card.className = 'pkg-card';
        var catLabel2 = catObj ? catObj.categoryName : (pkg.categoryId || 'Health Package');
        var imgHtml = imgUrl
          ? '<img src="' + esc(imgUrl) + '" alt="' + esc(pkg.name) + '" loading="lazy" />'
          : '<div class="pkg-card__placeholder"><span class="pkg-card__placeholder-label">' + esc(catLabel2) + '</span></div>';

        card.innerHTML =
          '<div class="pkg-card__img-wrap">' + imgHtml +
            '<span class="pkg-card__badge" style="top: 8px; right: 8px; left: auto; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; box-shadow: 0 2px 6px rgba(255,165,0,0.4);">40% OFF</span>' +
          '</div>' +
          '<div class="pkg-card__body">' +
            '<div class="pkg-card__category">' + esc(catObj ? catObj.categoryName : pkg.categoryId) + '</div>' +
            '<div class="pkg-card__name">' + esc(pkg.name) + '</div>' +
            (price > 0 ? '<div class="pkg-card__price"><span style="text-decoration: line-through; color: var(--color-text-muted); font-size: 0.85em; font-weight: 500; margin-right: 6px;">₹' + oldPrice + '</span>₹' + price + '</div>' : '') +
            '<div class="pkg-card__ctas">' +
              '<button class="btn btn--outline-primary view-pkg-btn" data-id="' + esc(pkg.id) + '">View Details</button>' +
              '<button class="btn btn--primary add-pkg-btn" data-id="' + esc(pkg.id) + '" data-name="' + esc(pkg.name) + '" data-price="' + price + '">Add to Cart</button>' +
            '</div>' +
          '</div>';
        grid.appendChild(card);
      });

      grid.querySelectorAll('.view-pkg-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          openPackageDetail(btn.getAttribute('data-id'));
        });
      });
      grid.querySelectorAll('.add-pkg-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          if (window.SmearCart) {
            window.SmearCart.add(btn.getAttribute('data-id'), 'package', btn.getAttribute('data-name'), parseInt(btn.getAttribute('data-price'),10)||0);
          }
        });
      });
  }


  /* ── Search Input Wiring ───────────────────────────────────── */
  function initSearch() {
    var input = document.getElementById('shop-search-input');
    if (!input) return;

    // Add clear button
    var wrapper = input.parentNode;
    var clearBtn = document.createElement('button');
    clearBtn.type = 'button';
    clearBtn.className = 'shop-search-clear-btn';
    clearBtn.setAttribute('aria-label', 'Clear search');
    clearBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    wrapper.appendChild(clearBtn);

    clearBtn.addEventListener('click', function() {
      input.value = '';
      clearBtn.classList.remove('visible');
      _searchQuery = '';
      renderPackagesForCategory();
    });

    input.addEventListener('input', function() {
      var q = input.value;
      clearBtn.classList.toggle('visible', q.length > 0);
      clearTimeout(_debounce);
      _debounce = setTimeout(function() {
        handleGlobalSearch(q);
      }, 200);
    });

    // Handle URL ?q= param
    var urlState = readURLState();
    if (urlState.query) {
      input.value = urlState.query;
      clearBtn.classList.add('visible');
      handleGlobalSearch(urlState.query);
    }
  }

  /* ── Browser Back Button ───────────────────────────────────── */
  window.addEventListener('popstate', function(e) {
    var state = e.state || {};
    _activeCategory = state.category || null;
    renderCategoryTabs();
    renderPackagesForCategory();
  });

  /* ── Init ──────────────────────────────────────────────────── */
  function init() {
    // Modal close (legacy support)
    var closeBtn = document.getElementById('modal-close');
    var modal    = document.getElementById('test-modal');
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

    // Upgrade hero section if present
    var hero = document.querySelector('.shop-hero');
    if (hero && !hero.classList.contains('pkg-page-hero')) {
      hero.classList.add('pkg-page-hero');
      hero.classList.remove('shop-hero');
    }

    // Upgrade skeleton while loading
    var grid = getGrid();
    if (grid) {
      grid.className = 'skeleton-grid';
      renderSkeleton(grid);
    }

    function afterLoad() {
      try {
        _packages = _packages.filter(function(p) { return typeof p.price === 'number' && p.price > 0; });
        _categories = _categories.filter(function(c) {
          return _packages.some(function(p) { return p.categoryId === c.categoryId; });
        });
        // Expose to global search
        if (window.SmearSearch) window.SmearSearch.init();
        window.dispatchEvent(new CustomEvent('smear:packagesLoaded', { detail: _packages }));

        // Check URL state
        var urlState = readURLState();
        _activeCategory = urlState.category || null;
        renderCategoryTabs();
        renderPackagesForCategory();

        initSearch();

        // Update hero stats if elements exist
        var catCountEl = document.getElementById('pkg-stat-cats');
        var pkgCountEl = document.getElementById('pkg-stat-total');
        if (catCountEl) catCountEl.textContent = _categories.length;
        if (pkgCountEl) pkgCountEl.textContent = _packages.length;
      } catch (err) {
        console.error("PACKAGES CRASH:", err);
        var h = document.getElementById('shop-packages-heading');
        if (h) h.textContent = "Error: " + err.message;
        var g = document.getElementById('shop-package-grid');
        if (g) g.innerHTML = "<div style='color:red;padding:20px;'>" + err.stack + "</div>";
      }
    }

    if (window.SMEAR_CATEGORIES && window.SMEAR_PACKAGES) {
      _categories = window.SMEAR_CATEGORIES;
      _packages   = window.SMEAR_PACKAGES;
      afterLoad();
    } else {
      Promise.all([
        fetch('./public/data/smear-categories.json').then(function(r){ return r.json(); }),
        fetch('./public/data/smear-packages.json').then(function(r){ return r.json(); })
      ]).then(function(values) {
        _categories = values[0];
        _packages   = values[1];
        afterLoad();
      }).catch(function(err) { console.error('PACKAGES ERROR:', err);
        var grid2 = getGrid();
        if (grid2) {
          grid2.innerHTML =
            '<div class="error-state" style="padding: 40px 20px; background: #fff0f0; border: 1px solid #ffcccc; border-radius: 12px; margin-top: 40px;">' +
  '<h3>Local File Access Denied</h3>' +
  '<p style="color: #333; margin-bottom: 16px; font-size: 1.1rem;">Modern browsers block loading JSON files directly from your computer.</p>' +
  '<p style="color: #333; font-weight: bold; font-size: 1.1rem;">Please open the website using the local server we started:</p>' +
  '<div style="background: #fff; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 1.2rem; color: #000; display: inline-block; border: 1px solid #ccc; margin-top: 10px;">' +
    '' +
  '</div>' +
'</div>';
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

  // Expose for home-collection use
  window.SmearPackages = {
    getPackages: function() { return _packages; },
    getCategories: function() { return _categories; }
  };

})();
