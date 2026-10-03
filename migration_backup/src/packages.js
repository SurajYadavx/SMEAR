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

  /* Category emojis/icons for visual variety */
  var CAT_ICONS = {
    'allergy'     : '🤧',
    'anemia'      : '🩸',
    'arthritis'   : '🦴',
    'cancer'      : '🎗️',
    'cardiac'     : '❤️',
    'child'       : '👶',
    'detox'       : '🌿',
    'diabetes'    : '💉',
    'drug'        : '🧪',
    'employee'    : '🏢',
    'female'      : '👩',
    'fever'       : '🌡️',
    'food'        : '🥗',
    'full'        : '🏥',
    'glp'         : '💊',
    'gut'         : '🫁',
    'hair'        : '💇',
    'hepatitis'   : '🦠',
    'hormonal'    : '⚗️',
    'immunity'    : '🛡️',
    'mens'        : '👨',
    'metropolis'  : '🏙️',
    'monsoon'     : '🌧️',
    'orange'      : '🍊',
    'pcod'        : '🔬',
    'pcos'        : '🔬',
    'pregnancy'   : '🤰',
    'premarital'  : '💍',
    'preoperative': '🩺',
    'senior'      : '👴',
    'skin'        : '✨',
    'sports'      : '🏃',
    'std'         : '🏥',
    'summer'      : '☀️',
    'thyrocare'   : '🔬',
    'thyroid'     : '🦋',
    'truhealth'   : '💚',
    'tuberculosis': '🫁',
    'tumour'      : '🔬',
    'vitamin'     : '💊',
  };

  var CAT_COLORS = [
    '#0d3b3e','#1a6b6e','#2aa8b0','#1a7d50',
    '#2563eb','#7c3aed','#d97706','#dc2626',
    '#0891b2','#059669','#8b5cf6','#f97316',
    '#6b7280','#10b981','#3b82f6','#ef4444'
  ];

  function getCatIcon(id) {
    var lower = id.toLowerCase();
    for (var key in CAT_ICONS) {
      if (lower.indexOf(key) > -1) return CAT_ICONS[key];
    }
    return '🏥';
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

  /* ── Category Cards ───────────────────────────────────────── */
  function renderCategoryCards() {
    _activeCategory = null;
    _searchQuery = '';

    var grid = getGrid();
    if (!grid) return;

    var heading = getHeading();
    if (heading) heading.textContent = 'Package Categories';

    var searchSection = getSearchSection();
    if (searchSection) searchSection.style.display = '';

    removeBackBtn();
    updateResultCount(null);

    // Switch grid class
    grid.className = 'pkg-category-grid';
    grid.innerHTML = '';

    var subEl = document.getElementById('shop-packages-heading');
    var subDesc = document.getElementById('packages-subtitle');
    if (subDesc) subDesc.textContent = 'Browse ' + _categories.length + ' categories of comprehensive diagnostic packages.';

    _categories.forEach(function(cat, idx) {
      if (cat.packageCount === 0) return;
      var color = getCatColor(idx);
      var icon  = getCatIcon(cat.id);
      var card  = document.createElement('div');
      card.className = 'pkg-cat-card';
      card.setAttribute('style', '--cat-color:' + color);
      card.setAttribute('tabindex', '0');
      card.setAttribute('role', 'button');
      card.setAttribute('aria-label', 'Explore ' + cat.name + ' packages');

      card.innerHTML =
        '<div class="pkg-cat-card__icon">' + icon + '</div>' +
        '<div class="pkg-cat-card__name">' + esc(cat.name) + '</div>' +
        '<div class="pkg-cat-card__count">' + cat.packageCount + ' Package' + (cat.packageCount !== 1 ? 's' : '') + '</div>' +
        '<div class="pkg-cat-card__explore">Explore →</div>';

      card.addEventListener('click', function() {
        _activeCategory = cat.id;
        setURLState(cat.id, '');
        renderPackagesForCategory();
      });
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
      grid.appendChild(card);
    });

    setURLState('', '');
  }

  /* ── Package Cards for Category ───────────────────────────── */
  function renderPackagesForCategory(searchOverride) {
    var grid = getGrid();
    if (!grid) return;

    var cat = _categories.find(function(c) { return c.id === _activeCategory; });
    if (!cat) { renderCategoryCards(); return; }

    var heading = getHeading();
    if (heading) heading.textContent = cat.name;

    // Show search section
    var searchSection = getSearchSection();
    if (searchSection) searchSection.style.display = '';

    // Back button
    removeBackBtn();
    var headContainer = getHeadContainer();
    if (headContainer) {
      var backBtn = document.createElement('button');
      backBtn.id = 'back-to-categories';
      backBtn.className = 'back-nav-btn';
      backBtn.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
        'All Categories';
      backBtn.addEventListener('click', function() {
        _activeCategory = null;
        renderCategoryCards();
        setURLState('', '');
      });
      headContainer.insertBefore(backBtn, headContainer.firstChild);
    }

    var query = searchOverride !== undefined ? searchOverride : _searchQuery;
    var qNorm = query.toLowerCase().trim();

    var filtered = _packages.filter(function(pkg) {
      if (pkg.categoryId !== _activeCategory) return false;
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
      var price    = extractPrice(pkg.sourceData && pkg.sourceData.preview_content);
      var discount = extractDiscount(pkg.sourceData && pkg.sourceData.preview_content);
      var imgUrl   = pkg.sourceData && pkg.sourceData.preview_image_url;

      var card = document.createElement('div');
      card.className = 'pkg-card';

      var imgHtml = imgUrl
        ? '<img src="' + esc(imgUrl) + '" alt="' + esc(pkg.name) + '" loading="lazy" />'
        : '<div class="pkg-card__placeholder"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="12" fill="rgba(13,59,62,0.06)"/><path d="M10 48l12-16 10 10 8-10 14 16H10z" fill="rgba(13,59,62,0.12)"/><circle cx="44" cy="20" r="6" fill="rgba(13,59,62,0.12)"/></svg></div>';

      card.innerHTML =
        '<div class="pkg-card__img-wrap">' +
          imgHtml +
          (discount > 0 ? '<span class="pkg-card__badge">' + discount + '% OFF</span>' : '') +
        '</div>' +
        '<div class="pkg-card__body">' +
          '<div class="pkg-card__category">' + esc(cat.name) + '</div>' +
          '<div class="pkg-card__name">' + esc(pkg.name) + '</div>' +
          (price > 0 ? '<div class="pkg-card__price">₹' + price + '</div>' : '') +
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
    if (_activeCategory) {
      _searchQuery = q;
      renderPackagesForCategory(q);
    } else {
      // On category view: search all packages and show flat results
      _searchQuery = q;
      var qNorm = q.toLowerCase().trim();
      var grid = getGrid();
      if (!grid) return;

      if (!qNorm) { renderCategoryCards(); return; }

      grid.className = 'pkg-card-grid';
      grid.innerHTML = '';

      var searchSection = getSearchSection();
      if (searchSection) searchSection.style.display = '';

      var heading = getHeading();
      if (heading) heading.textContent = 'Search Results';

      removeBackBtn();
      var headContainer = getHeadContainer();
      if (headContainer) {
        var backBtn = document.createElement('button');
        backBtn.id = 'back-to-categories';
        backBtn.className = 'back-nav-btn';
        backBtn.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
          'All Categories';
        backBtn.addEventListener('click', function() {
          _activeCategory = null;
          _searchQuery = '';
          var inp = document.getElementById('shop-search-input');
          if (inp) inp.value = '';
          renderCategoryCards();
          setURLState('', '');
        });
        headContainer.insertBefore(backBtn, headContainer.firstChild);
      }

      var filtered = _packages.filter(function(pkg) {
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
        var price    = extractPrice(pkg.sourceData && pkg.sourceData.preview_content);
        var discount = extractDiscount(pkg.sourceData && pkg.sourceData.preview_content);
        var imgUrl   = pkg.sourceData && pkg.sourceData.preview_image_url;
        var catObj   = _categories.find(function(c) { return c.id === pkg.categoryId; });

        var card = document.createElement('div');
        card.className = 'pkg-card';
        var imgHtml = imgUrl
          ? '<img src="' + esc(imgUrl) + '" alt="' + esc(pkg.name) + '" loading="lazy" />'
          : '<div class="pkg-card__placeholder"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="12" fill="rgba(13,59,62,0.06)"/><path d="M10 48l12-16 10 10 8-10 14 16H10z" fill="rgba(13,59,62,0.12)"/><circle cx="44" cy="20" r="6" fill="rgba(13,59,62,0.12)"/></svg></div>';

        card.innerHTML =
          '<div class="pkg-card__img-wrap">' + imgHtml +
            (discount > 0 ? '<span class="pkg-card__badge">' + discount + '% OFF</span>' : '') +
          '</div>' +
          '<div class="pkg-card__body">' +
            '<div class="pkg-card__category">' + esc(catObj ? catObj.name : pkg.categoryId) + '</div>' +
            '<div class="pkg-card__name">' + esc(pkg.name) + '</div>' +
            (price > 0 ? '<div class="pkg-card__price">₹' + price + '</div>' : '') +
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
      if (_activeCategory) renderPackagesForCategory('');
      else renderCategoryCards();
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
    if (state.category) {
      _activeCategory = state.category;
      renderPackagesForCategory();
    } else {
      _activeCategory = null;
      renderCategoryCards();
    }
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
      // Expose to global search
      if (window.SmearSearch) window.SmearSearch.init();
      window.dispatchEvent(new CustomEvent('smear:packagesLoaded', { detail: _packages }));

      // Check URL state
      var urlState = readURLState();
      if (urlState.category) {
        _activeCategory = urlState.category;
        renderPackagesForCategory();
      } else {
        renderCategoryCards();
      }

      initSearch();

      // Update hero stats if elements exist
      var catCountEl = document.getElementById('pkg-stat-cats');
      var pkgCountEl = document.getElementById('pkg-stat-total');
      if (catCountEl) catCountEl.textContent = _categories.length;
      if (pkgCountEl) pkgCountEl.textContent = _packages.length;
    }

    if (window.SMEAR_CATEGORIES && window.SMEAR_PACKAGES) {
      _categories = window.SMEAR_CATEGORIES;
      _packages   = window.SMEAR_PACKAGES;
      afterLoad();
    } else {
      Promise.all([
        fetch('./public/data/package-categories.json').then(function(r){ return r.json(); }),
        fetch('./public/data/packages.json').then(function(r){ return r.json(); })
      ]).then(function(values) {
        _categories = values[0];
        _packages   = values[1];
        afterLoad();
      }).catch(function() {
        var grid2 = getGrid();
        if (grid2) {
          grid2.innerHTML =
            '<div class="error-state">' +
              '<h3>Unable to load packages</h3>' +
              '<p>Please ensure you are using a local web server (e.g. VS Code Live Server).</p>' +
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
