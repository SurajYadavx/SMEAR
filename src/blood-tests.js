/**
 * ============================================================
 *  SMEAR PATHOLOGY — BLOOD-TESTS.JS v3
 *  Powers blood-tests.html
 *  - Premium test cards with colorful gradient visual headers
 *  - Full dataset search (debounced)
 *  - Proper pagination
 *  - Loading/empty/error states
 *  - Smear-only WhatsApp
 *  - Modal with CORRECT test lookup (stable ID, not positional UID)
 * ============================================================
 */
(function () {
  'use strict';

  var _tests       = [];
  var _currentPage = 1;
  var _perPage     = 48;
  var _searchQuery = '';
  var _debounce    = null;
  var _modalSavedScroll = 0;

  /* ── Gradient palette for card visual headers ── */
  var CARD_GRADIENTS = [
    'linear-gradient(135deg, #0d3b3e 0%, #1a6b6e 60%, #2aa8b0 100%)',
    'linear-gradient(135deg, #1a3a5c 0%, #1d6fa0 60%, #38b2ac 100%)',
    'linear-gradient(135deg, #1a3730 0%, #2f6b5a 60%, #48bb78 100%)',
    'linear-gradient(135deg, #2d1b4e 0%, #553c9a 60%, #9f7aea 100%)',
    'linear-gradient(135deg, #3d1a1a 0%, #9b2c2c 60%, #fc8181 100%)',
    'linear-gradient(135deg, #1a2a4a 0%, #2563eb 60%, #60a5fa 100%)',
    'linear-gradient(135deg, #1a3320 0%, #2d6a4f 60%, #52b788 100%)',
    'linear-gradient(135deg, #3b1a00 0%, #b45309 60%, #fcd34d 100%)',
  ];

  var CAT_GRADIENT_MAP = {
    'infection': 0,
    'blood': 1,
    'cardiac': 5,
    'diabetes': 2,
    'thyroid': 3,
    'vitamins': 6,
    'kidney': 7,
    'liver': 2,
    'cancer': 4,
    'allergy': 3,
    'hormones': 3,
    'other': 0,
  };

  function getGradient(test, absIdx) {
    var catId = (test.categoryId || '').toLowerCase();
    if (CAT_GRADIENT_MAP.hasOwnProperty(catId)) {
      return CARD_GRADIENTS[CAT_GRADIENT_MAP[catId]];
    }
    return CARD_GRADIENTS[absIdx % CARD_GRADIENTS.length];
  }

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function extractPrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return 0;
    var match = String(priceStr).match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  /* ── URL State ────────────────────────────────────────────── */
  function readSearchParam() {
    var params = new URLSearchParams(window.location.search);
    return params.get('search') || params.get('q') || '';
  }

  function setSearchParam(q) {
    var params = new URLSearchParams(window.location.search);
    if (q) params.set('search', q);
    else params.delete('search');
    var url = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    history.replaceState(null, '', url);
  }

  /* ── Filtered tests ───────────────────────────────────────── */
  function getFiltered() {
    if (!_searchQuery) return _tests;
    var q = _searchQuery.toLowerCase();
    return _tests.filter(function(t) {
      var name = (t.name || '').toLowerCase();
      var cat  = (t.categoryName || t.categoryId || '').toLowerCase();
      return name.indexOf(q) > -1 || cat.indexOf(q) > -1;
    });
  }

  /* ── Skeleton ─────────────────────────────────────────────── */
  function renderSkeleton(grid) {
    grid.className = 'test-card-grid';
    grid.innerHTML = '';
    for (var i = 0; i < 12; i++) {
      var card = document.createElement('div');
      card.className = 'skeleton-card tc-premium';
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

  /* ── Render Tests ─────────────────────────────────────────── */
  function renderTests() {
    var grid = document.getElementById('shop-test-grid');
    if (!grid) return;

    var filtered   = getFiltered();
    var totalPages = Math.ceil(filtered.length / _perPage);
    if (_currentPage > totalPages) _currentPage = 1;

    var startIdx   = (_currentPage - 1) * _perPage;
    var paginated  = filtered.slice(startIdx, startIdx + _perPage);

    // Update result count bar
    var existingBar = document.getElementById('result-count-bar');
    if (existingBar) existingBar.remove();

    var bar = document.createElement('div');
    bar.id  = 'result-count-bar';
    bar.className = 'search-meta-bar';
    var countEl = document.createElement('span');
    countEl.className = 'search-meta-bar__count';
    if (_searchQuery) {
      countEl.innerHTML = 'Found <strong>' + filtered.length + '</strong> test' + (filtered.length !== 1 ? 's' : '') + ' for "' + esc(_searchQuery) + '"';
    } else {
      countEl.innerHTML = '<strong>' + filtered.length + '</strong> test' + (filtered.length !== 1 ? 's' : '') + ' available';
    }
    bar.appendChild(countEl);
    if (_searchQuery) {
      var clearBtn2 = document.createElement('button');
      clearBtn2.className = 'search-meta-bar__clear';
      clearBtn2.textContent = '✕ Clear';
      clearBtn2.addEventListener('click', function() {
        var inp = document.getElementById('shop-search-input');
        if (inp) { inp.value = ''; inp.dispatchEvent(new Event('input', { bubbles: true })); }
      });
      bar.appendChild(clearBtn2);
    }
    if (grid.parentNode) grid.parentNode.insertBefore(bar, grid);

    // Render cards
    grid.className = 'test-card-grid';
    grid.innerHTML = '';

    if (paginated.length === 0) {
      grid.innerHTML =
        '<div class="empty-state">' +
          '<div class="empty-state__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>' +
          '<h3>No tests found</h3>' +
          '<p>' + (_searchQuery ? 'No tests match "' + esc(_searchQuery) + '".' : 'No tests available.') + '</p>' +
          '<button class="btn btn--outline-primary" onclick="var inp=document.getElementById(\'shop-search-input\');if(inp){inp.value=\'\';inp.dispatchEvent(new Event(\'input\',{bubbles:true}));}" style="margin:0 auto;">Clear Search</button>' +
        '</div>';
      renderPagination(0, 0);
      return;
    }

    paginated.forEach(function(test, idx) {
      var oldPrice = extractPrice(test.price);
      var price    = oldPrice > 0 ? Math.round(oldPrice * 0.70) : 0; // 30% OFF
      var absIdx   = startIdx + idx;
      var gradient = getGradient(test, absIdx);
      var catLabel = test.categoryName || test.categoryId || 'Laboratory Test';

      /* Stable ID for correct modal lookup — no more positional UIDs! */
      var stableId = test.id || test.slug || ('idx-' + absIdx);

      var card = document.createElement('div');
      card.className = 'test-card tc-premium';

      card.innerHTML =
        /* ── Colorful gradient visual header ── */
        '<div class="tc-visual-header" style="background:' + gradient + ';">' +
          '<div class="tc-visual-overlay"></div>' +
          '<span class="tc-visual-label">' + esc(catLabel) + '</span>' +
          '<span class="pkg-card__badge" style="top: 8px; right: 8px; left: auto; background: linear-gradient(135deg, #FFD700, #FFA500); color: #000; box-shadow: 0 2px 6px rgba(255,165,0,0.4);">30% OFF</span>' +
        '</div>' +
        /* ── Card body ── */
        '<div class="test-card__body-wrap">' +
          '<div class="test-card__lab">Laboratory Test</div>' +
          '<div class="test-card__name">' + esc(test.name) + '</div>' +
          (price > 0
            ? '<div class="test-card__price"><span style="text-decoration: line-through; color: var(--color-text-muted); font-size: 0.85em; font-weight: 500; margin-right: 6px;">₹' + oldPrice + '</span>₹' + price + '</div>'
            : '<div class="test-card__price" style="color:var(--color-text-muted);font-size:0.9rem;">Price on request</div>') +
          '<div class="test-card__ctas">' +
            '<button class="btn btn--outline-primary view-test-btn" data-id="' + esc(stableId) + '">Details</button>' +
            '<button class="btn btn--primary book-test-btn" data-name="' + esc(test.name) + '">Book</button>' +
          '</div>' +
        '</div>';

      grid.appendChild(card);
    });

    /* Events — use data-id (STABLE) not data-uid (POSITIONAL, was buggy) */
    grid.querySelectorAll('.view-test-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var sid  = btn.getAttribute('data-id');
        /* Find by id first, then by slug, then by generated idx- key */
        var test = _tests.find(function(t) { return t.id === sid; });
        if (!test) test = _tests.find(function(t) { return t.slug === sid; });
        if (!test && sid.indexOf('idx-') === 0) {
          test = _tests[parseInt(sid.replace('idx-', ''), 10)];
        }
        if (test) openTestModal(test);
      });
    });

    grid.querySelectorAll('.book-test-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var name  = btn.getAttribute('data-name');
        var waMsg = 'Hello, I would like to enquire about / book the following blood test:\n\n' + name;
        var phone = (typeof CONTACT_PHONE !== 'undefined') ? CONTACT_PHONE : '7410745222';
        window.open('https://wa.me/91' + phone + '?text=' + encodeURIComponent(waMsg), '_blank');
      });
    });

    renderPagination(totalPages, filtered.length);
  }

  /* ── Modal ────────────────────────────────────────────────── */
  function lockScrollForModal() {
    _modalSavedScroll = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = '-' + _modalSavedScroll + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.overflow = 'hidden';
  }
  function unlockScrollForModal() {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.overflow = '';
    window.scrollTo(0, _modalSavedScroll);
  }

  function openTestModal(test) {
    var modal   = document.getElementById('test-modal');
    if (!modal) return;
    var titleEl = document.getElementById('modal-title');
    var descEl  = document.getElementById('modal-desc');
    var priceEl = document.getElementById('modal-price');
    var callBtn = document.getElementById('modal-call-btn');
    var waBtn   = document.getElementById('modal-wa-btn');
    var oldPrice = extractPrice(test.price);
    var price    = oldPrice > 0 ? Math.round(oldPrice * 0.70) : 0; // 30% OFF

    if (titleEl) {
      titleEl.textContent = test.name;
      titleEl.style.color = '#000';
    }
    if (priceEl) {
      if (price > 0) {
        priceEl.innerHTML = '<span style="text-decoration: line-through; color: var(--color-text-muted); font-size: 0.85em; font-weight: 500; margin-right: 6px;">₹' + oldPrice + '</span>₹' + price;
      } else {
        priceEl.textContent = 'Price on request';
      }
    }

    if (descEl) {
      var labName = test.lab || test.labName || 'Smear Pathology';
      descEl.innerHTML =
        '<div style="font-size:0.92rem;line-height:1.7;text-align:left;">' +
        '<p style="margin-bottom:8px;"><strong>Test Name:</strong> ' + esc(test.name) + '</p>' +
        '<p style="margin-bottom:8px;"><strong>Laboratory:</strong> ' + esc(labName) + '</p>' +
        '<p style="margin-bottom:8px;"><strong>Price:</strong> ' + (price > 0 ? '<span style="text-decoration: line-through; color: var(--color-text-muted); margin-right: 6px;">₹' + oldPrice + '</span>₹' + price : 'Contact for price') + '</p>' +
        (test.specimen ? '<p style="margin-bottom:8px;"><strong>Specimen:</strong> ' + esc(test.specimen) + '</p>' : '') +
        (test.report_time ? '<p style="margin-bottom:8px;"><strong>Report Time:</strong> ' + esc(test.report_time) + '</p>' : '') +
        (test.fasting && test.fasting !== 'no' ? '<p style="margin-bottom:8px;"><strong>Fasting:</strong> ' + esc(test.fasting) + '</p>' : '') +
        '<p style="margin-top:14px;color:var(--color-text-muted);">Book this test via WhatsApp or call our lab directly. Prices are approximate and confirmed before sample collection.</p>' +
        '</div>';
    }

    var phone  = (typeof CONTACT_PHONE !== 'undefined') ? CONTACT_PHONE : '7410745222';
    var telUrl = (typeof CONTACT_PHONE_TEL !== 'undefined') ? CONTACT_PHONE_TEL : ('tel:+91' + phone);
    var waMsg  = 'Hello, I would like to enquire about / book the following blood test:\n\n' + test.name;
    var waUrl  = 'https://wa.me/91' + phone + '?text=' + encodeURIComponent(waMsg);

    if (callBtn) { callBtn.href = telUrl; }
    if (waBtn)   { waBtn.href = waUrl; waBtn.target = '_blank'; waBtn.rel = 'noopener noreferrer'; }

    modal.classList.add('modal-overlay--visible');
    modal.setAttribute('aria-hidden', 'false');
    lockScrollForModal();
  }

  function closeModal() {
    var modal = document.getElementById('test-modal');
    if (!modal) return;
    modal.classList.remove('modal-overlay--visible');
    modal.setAttribute('aria-hidden', 'true');
    unlockScrollForModal();
  }

  /* ── Pagination ───────────────────────────────────────────── */
  function renderPagination(totalPages, totalItems) {
    var old = document.getElementById('test-pagination');
    if (old) old.remove();
    if (totalPages <= 1) return;

    var grid = document.getElementById('shop-test-grid');
    if (!grid || !grid.parentNode) return;

    var bar = document.createElement('div');
    bar.id = 'test-pagination';
    bar.className = 'pagination-bar';

    // Prev
    var prev = document.createElement('button');
    prev.className = 'pagination-btn';
    prev.innerHTML = '&larr; Prev';
    prev.disabled = _currentPage === 1;
    prev.addEventListener('click', function() {
      if (_currentPage > 1) {
        _currentPage--;
        renderTests();
        var section = document.querySelector('.shop-section--alt') || document.querySelector('.shop-section');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    // Page info
    var info = document.createElement('span');
    info.className = 'pagination-info';
    info.textContent = 'Page ' + _currentPage + ' of ' + totalPages;

    // Next
    var next = document.createElement('button');
    next.className = 'pagination-btn';
    next.innerHTML = 'Next &rarr;';
    next.disabled = _currentPage === totalPages;
    next.addEventListener('click', function() {
      if (_currentPage < totalPages) {
        _currentPage++;
        renderTests();
        var section = document.querySelector('.shop-section--alt') || document.querySelector('.shop-section');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    bar.appendChild(prev);
    bar.appendChild(info);
    bar.appendChild(next);
    grid.parentNode.insertBefore(bar, grid.nextSibling);
  }

  /* ── Search Wiring ────────────────────────────────────────── */
  function initSearch() {
    var input = document.getElementById('shop-search-input');
    if (!input) return;

    input.placeholder = 'Search blood tests (e.g. Hemoglobin, Thyroid, Vitamin D)…';

    // Add clear button
    var wrapper = input.parentNode;
    var clearBtn;
    if (wrapper) {
      clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      clearBtn.className = 'shop-search-clear-btn';
      clearBtn.setAttribute('aria-label', 'Clear search');
      clearBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
      wrapper.appendChild(clearBtn);

      clearBtn.addEventListener('click', function() {
        input.value = '';
        clearBtn.classList.remove('visible');
        _searchQuery = '';
        _currentPage = 1;
        setSearchParam('');
        renderTests();
      });
    }

    input.addEventListener('input', function() {
      var q = input.value;
      if (clearBtn) clearBtn.classList.toggle('visible', q.length > 0);
      clearTimeout(_debounce);
      _debounce = setTimeout(function() {
        _searchQuery = q.trim();
        _currentPage = 1;
        setSearchParam(_searchQuery);
        renderTests();
      }, 220);
    });

    // Handle ?search= URL param
    var initial = readSearchParam();
    if (initial) {
      input.value = initial;
      if (clearBtn) clearBtn.classList.add('visible');
      _searchQuery = initial.trim();
    }
  }

  /* ── Init ──────────────────────────────────────────────────── */
  function init() {
    // Modal events
    var closeBtn = document.getElementById('modal-close');
    var modal    = document.getElementById('test-modal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', function(e) {
        if (e.target === modal) closeModal();
      });
    }
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeModal();
    });

    // Skeleton while loading
    var grid = document.getElementById('shop-test-grid');
    if (grid) renderSkeleton(grid);

    function afterLoad() {
      _tests = _tests.filter(function(t) { return typeof t.price === 'number' && t.price > 0; });
      window.dispatchEvent(new CustomEvent('smear:testsLoaded', { detail: _tests }));
      initSearch();
      renderTests();
    }

    if (window.SMEAR_TESTS) {
      _tests = window.SMEAR_TESTS;
      afterLoad();
    } else {
      fetch('./public/data/smear-tests.json')
        .then(function(r){ return r.json(); })
        .then(function(data) {
          _tests = data;
          afterLoad();
        })
        .catch(function(err) { console.error('BLOOD ERROR:', err);
          var g = document.getElementById('shop-test-grid');
          if (g) {
            g.className = '';
            g.innerHTML =
              '<div class="error-state" style="padding: 40px 20px; background: #fff0f0; border: 1px solid #ffcccc; border-radius: 12px; margin-top: 40px;">' +
  '<h3 style="color: #d32f2f; margin-bottom: 12px; font-size: 1.5rem;">Security Block: Cannot Load Data from file:///</h3>' +
  '<p style="color: #333; margin-bottom: 16px; font-size: 1.1rem;">Modern browsers block loading JSON files directly from your computer.</p>' +
  '<p style="color: #333; font-weight: bold; font-size: 1.1rem;">Please open the website using the local server we started:</p>' +
  '<div style="background: #fff; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 1.2rem; color: #000; display: inline-block; border: 1px solid #ccc; margin-top: 10px;">' +
    '<a href="http://localhost:8000/blood-tests.html" style="color: #2563eb; text-decoration: none;">http://localhost:8000/blood-tests.html</a>' +
  '</div>' +
'</div>';
          }
        });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

})();
