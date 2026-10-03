/**
 * ============================================================
 *  SMEAR PATHOLOGY — BLOOD-TESTS.JS v2
 *  Powers blood-tests.html
 *  - Premium test cards
 *  - Full dataset search (debounced)
 *  - Proper pagination
 *  - Loading/empty/error states
 *  - Smear-only WhatsApp
 *  - Modal with proper scroll lock
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

  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function extractPrice(priceStr) {
    if (!priceStr) return 0;
    var match = priceStr.match(/\d+/);
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
      var name = (t.test_name || '').toLowerCase();
      var lab  = (t.lab || '').toLowerCase();
      return name.indexOf(q) > -1 || lab.indexOf(q) > -1;
    });
  }

  /* ── Skeleton ─────────────────────────────────────────────── */
  function renderSkeleton(grid) {
    grid.className = 'test-card-grid';
    grid.innerHTML = '';
    for (var i = 0; i < 12; i++) {
      var card = document.createElement('div');
      card.className = 'skeleton-card';
      card.innerHTML =
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
      var price = extractPrice(test.price);
      var uid   = startIdx + idx;
      test._uid = uid;

      var card = document.createElement('div');
      card.className = 'test-card';

      card.innerHTML =
        '<div class="test-card__lab">' + esc(test.lab || 'Laboratory Test') + '</div>' +
        '<div class="test-card__name">' + esc(test.test_name) + '</div>' +
        (price > 0 ? '<div class="test-card__price">₹' + price + '</div>' : '<div class="test-card__price" style="color:var(--color-text-muted);font-size:0.9rem;">Price on request</div>') +
        '<div class="test-card__ctas">' +
          '<button class="btn btn--outline-primary view-test-btn" data-uid="' + uid + '">Details</button>' +
          '<button class="btn btn--primary book-test-btn" data-name="' + esc(test.test_name) + '">Book</button>' +
        '</div>';

      grid.appendChild(card);
    });

    // Events
    grid.querySelectorAll('.view-test-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var uid = parseInt(btn.getAttribute('data-uid'), 10);
        var test = _tests.find(function(t){ return t._uid === uid; });
        if (!test) { /* fallback: find by index in paginated */
          var idx2 = uid - startIdx;
          test = paginated[idx2];
        }
        if (test) openTestModal(test);
      });
    });

    grid.querySelectorAll('.book-test-btn').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var name = btn.getAttribute('data-name');
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
    var imgEl   = document.getElementById('modal-img');
    var placeEl = document.getElementById('modal-img-placeholder');
    var callBtn = document.getElementById('modal-call-btn');
    var waBtn   = document.getElementById('modal-wa-btn');

    var price = extractPrice(test.price);

    if (titleEl) titleEl.textContent = test.test_name;
    if (priceEl) priceEl.textContent = price > 0 ? '₹' + price : 'Price on request';
    if (imgEl)   imgEl.style.display = 'none';
    if (placeEl) placeEl.style.display = 'flex';

    if (descEl) {
      descEl.innerHTML =
        '<div style="font-size:0.92rem;line-height:1.7;text-align:left;">' +
        '<p style="margin-bottom:8px;"><strong>Test Name:</strong> ' + esc(test.test_name) + '</p>' +
        '<p style="margin-bottom:8px;"><strong>Laboratory:</strong> ' + esc(test.lab || 'Smear Pathology') + '</p>' +
        '<p style="margin-bottom:8px;"><strong>Price:</strong> ' + (price > 0 ? '₹' + price : 'Contact for price') + '</p>' +
        '<p style="margin-top:14px;color:var(--color-text-muted);">Book this test via WhatsApp or call our lab directly. Prices are approximate and confirmed before sample collection.</p>' +
        '</div>';
    }

    var phone   = (typeof CONTACT_PHONE !== 'undefined') ? CONTACT_PHONE : '7410745222';
    var telUrl  = (typeof CONTACT_PHONE_TEL !== 'undefined') ? CONTACT_PHONE_TEL : ('tel:+91' + phone);
    var waMsg   = 'Hello, I would like to enquire about / book the following blood test:\n\n' + test.test_name;
    var waUrl   = 'https://wa.me/91' + phone + '?text=' + encodeURIComponent(waMsg);

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
    // The HTML already has #shop-search-input; also check for legacy test input
    var input = document.getElementById('shop-search-input');
    if (!input) return;

    input.placeholder = 'Search blood tests (e.g. Hemoglobin, Thyroid, Vitamin D)…';

    // Add clear button
    var wrapper = input.parentNode;
    if (wrapper) {
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
      window.dispatchEvent(new CustomEvent('smear:testsLoaded', { detail: _tests }));
      initSearch();
      renderTests();
    }

    if (window.SMEAR_TESTS) {
      _tests = window.SMEAR_TESTS;
      afterLoad();
    } else {
      fetch('./public/data/health-tests.json')
        .then(function(r){ return r.json(); })
        .then(function(data) {
          _tests = data;
          afterLoad();
        })
        .catch(function() {
          var g = document.getElementById('shop-test-grid');
          if (g) {
            g.className = '';
            g.innerHTML =
              '<div class="error-state">' +
                '<h3>Unable to load blood tests</h3>' +
                '<p>Please ensure you are using a local web server (e.g. VS Code Live Server).</p>' +
              '</div>';
          }
        });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

})();
