/**
 * ============================================================
 *  SMEAR PATHOLOGY — GLOBAL SEARCH v1
 *  Searches packages AND blood tests from loaded datasets.
 *  Works on all pages. Loads data lazily if not already in window.
 *
 *  Dependencies: config.js must be loaded before this.
 *  Self-contained: no framework required.
 * ============================================================
 */
(function () {
  'use strict';

  /* ── Config ────────────────────────────────────────────── */
  var MAX_RESULTS_PER_TYPE = 5;
  var DEBOUNCE_MS = 220;

  /* ── State ─────────────────────────────────────────────── */
  var _packages  = null; // loaded lazily
  var _tests     = null; // loaded lazily
  var _debounce  = null;
  var _activeInput = null;
  var _activeDropdown = null;

  /* ── Helpers ───────────────────────────────────────────── */
  function esc(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function extractPrice(previewContent) {
    if (!previewContent) return null;
    // Handle scraped format: ",1 NNNN" where rupee symbol is corrupted
    var commaMatch = previewContent.match(/,1\s*(\d{3,6})/g);
    if (commaMatch && commaMatch.length > 0) {
      var last = commaMatch[commaMatch.length > 1 ? commaMatch.length - 1 : 0];
      var numMatch = last.match(/(\d{3,6})/);
      return numMatch ? parseInt(numMatch[1], 10) : null;
    }
    var match = previewContent.match(/[\u20b9$]\s*(\d+)/);
    return match ? parseInt(match[1], 10) : null;
  }

  function extractTestPrice(priceStr) {
    if (!priceStr) return null;
    var match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : null;
  }

  function normalize(s) {
    return String(s || '').toLowerCase().trim();
  }

  function searchPackages(query) {
    if (!_packages || !query) return [];
    var q = normalize(query);
    var results = [];
    for (var i = 0; i < _packages.length && results.length < MAX_RESULTS_PER_TYPE; i++) {
      var pkg = _packages[i];
      var name = normalize(pkg.name || '');
      var catId = normalize(pkg.categoryId || '');
      if (name.indexOf(q) > -1 || catId.indexOf(q) > -1) {
        results.push(pkg);
      }
    }
    return results;
  }

  function searchTests(query) {
    if (!_tests || !query) return [];
    var q = normalize(query);
    var results = [];
    for (var i = 0; i < _tests.length && results.length < MAX_RESULTS_PER_TYPE; i++) {
      var t = _tests[i];
      var name = normalize(t.test_name || '');
      var lab  = normalize(t.lab || '');
      if (name.indexOf(q) > -1 || lab.indexOf(q) > -1) {
        results.push(t);
      }
    }
    return results;
  }

  /* ── Data Loading ──────────────────────────────────────── */
  function loadData(cb) {
    if (_packages && _tests) { cb(); return; }
    var pkgDone  = !!_packages;
    var testDone = !!_tests;

    function check() {
      if (pkgDone && testDone) cb();
    }

    if (!_packages) {
      if (window.SMEAR_PACKAGES) {
        _packages = window.SMEAR_PACKAGES;
        pkgDone = true;
        check();
      } else {
        fetch('./public/data/packages.json')
          .then(function(r){ return r.json(); })
          .then(function(d){ _packages = d; pkgDone = true; check(); })
          .catch(function(){ _packages = []; pkgDone = true; check(); });
      }
    }

    if (!_tests) {
      if (window.SMEAR_TESTS) {
        _tests = window.SMEAR_TESTS;
        testDone = true;
        check();
      } else {
        fetch('./public/data/health-tests.json')
          .then(function(r){ return r.json(); })
          .then(function(d){ _tests = d; testDone = true; check(); })
          .catch(function(){ _tests = []; testDone = true; check(); });
      }
    }
  }

  /* ── Dropdown Rendering ─────────────────────────────────── */
  var PKG_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>';
  var TEST_ICON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5h0c-1.4 0-2.5-1.1-2.5-2.5V2"/><path d="M8.5 2h7"/><path d="M14.5 16h-5"/></svg>';

  function renderDropdown(dropdown, query, pkgResults, testResults) {
    dropdown.innerHTML = '';
    var hasResults = pkgResults.length > 0 || testResults.length > 0;

    if (!hasResults) {
      dropdown.innerHTML = '<div class="search-dropdown-empty">No results for "<strong>' + esc(query) + '</strong>"</div>';
      return;
    }

    if (pkgResults.length > 0) {
      var section = document.createElement('div');
      section.className = 'search-dropdown-section';
      var label = document.createElement('div');
      label.className = 'search-dropdown-label';
      label.textContent = 'Packages';
      section.appendChild(label);

      pkgResults.forEach(function(pkg) {
        var price = extractPrice(pkg.sourceData && pkg.sourceData.preview_content);
        var item = document.createElement('button');
        item.type = 'button';
        item.className = 'search-dropdown-item';
        item.innerHTML =
          '<span class="search-dropdown-item__icon">' + PKG_ICON + '</span>' +
          '<span class="search-dropdown-item__text">' +
            '<span class="search-dropdown-item__name">' + esc(pkg.name) + '</span>' +
            '<span class="search-dropdown-item__meta">' + esc(pkg.categoryId ? pkg.categoryId.replace(/-/g,' ') : 'Package') + (price ? ' · ₹' + price : '') + '</span>' +
          '</span>';
        item.addEventListener('click', function() {
          // Navigate to package details
          window.location.href = 'packages.html?category=' + encodeURIComponent(pkg.categoryId) + '&pkg=' + encodeURIComponent(pkg.id);
        });
        section.appendChild(item);
      });
      dropdown.appendChild(section);
    }

    if (pkgResults.length > 0 && testResults.length > 0) {
      var div = document.createElement('div');
      div.className = 'search-dropdown-divider';
      dropdown.appendChild(div);
    }

    if (testResults.length > 0) {
      var section2 = document.createElement('div');
      section2.className = 'search-dropdown-section';
      var label2 = document.createElement('div');
      label2.className = 'search-dropdown-label';
      label2.textContent = 'Blood Tests';
      section2.appendChild(label2);

      testResults.forEach(function(test) {
        var price = extractTestPrice(test.price);
        var item = document.createElement('button');
        item.type = 'button';
        item.className = 'search-dropdown-item';
        item.innerHTML =
          '<span class="search-dropdown-item__icon" style="background:rgba(42,168,176,0.1);">' + TEST_ICON + '</span>' +
          '<span class="search-dropdown-item__text">' +
            '<span class="search-dropdown-item__name">' + esc(test.test_name) + '</span>' +
            '<span class="search-dropdown-item__meta">' + esc(test.lab || 'Test') + (price ? ' · ₹' + price : '') + '</span>' +
          '</span>';
        item.addEventListener('click', function() {
          window.location.href = 'blood-tests.html?search=' + encodeURIComponent(test.test_name);
        });
        section2.appendChild(item);
      });
      dropdown.appendChild(section2);
    }

    // "View all" footer
    var footer = document.createElement('a');
    footer.href = 'packages.html?q=' + encodeURIComponent(query);
    footer.className = 'search-dropdown-footer';
    footer.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>View all results for "' + esc(query) + '"';
    dropdown.appendChild(footer);
  }

  function showLoading(dropdown) {
    dropdown.innerHTML = '<div class="search-dropdown-loading"><span class="spin"></span> Searching...</div>';
  }

  /* ── Core Search Handler ────────────────────────────────── */
  function performSearch(query, dropdown) {
    if (!query || query.trim().length < 2) {
      dropdown.classList.remove('is-open');
      return;
    }

    dropdown.classList.add('is-open');
    showLoading(dropdown);

    loadData(function() {
      var pkgs  = searchPackages(query);
      var tests = searchTests(query);
      renderDropdown(dropdown, query, pkgs, tests);
    });
  }

  /* ── Desktop Header Search ──────────────────────────────── */
  function initDesktopSearch() {
    var wrap = document.getElementById('header-search-wrap');
    if (!wrap) return;

    var input    = wrap.querySelector('.header-search-input');
    var clearBtn = wrap.querySelector('.header-search-clear');
    var dropdown = wrap.querySelector('.global-search-dropdown');
    if (!input || !dropdown) return;

    _activeInput    = input;
    _activeDropdown = dropdown;

    input.addEventListener('input', function() {
      var q = input.value.trim();
      if (clearBtn) clearBtn.classList.toggle('visible', q.length > 0);
      clearTimeout(_debounce);
      _debounce = setTimeout(function() { performSearch(q, dropdown); }, DEBOUNCE_MS);
    });

    input.addEventListener('focus', function() {
      var q = input.value.trim();
      if (q.length >= 2) performSearch(q, dropdown);
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', function() {
        input.value = '';
        clearBtn.classList.remove('visible');
        dropdown.classList.remove('is-open');
        input.focus();
      });
    }

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!wrap.contains(e.target)) {
        dropdown.classList.remove('is-open');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') dropdown.classList.remove('is-open');
    });
  }

  /* ── Mobile Search Overlay ──────────────────────────────── */
  function initMobileSearch() {
    var overlay = document.getElementById('mobile-search-overlay');
    var mobileBtn = document.getElementById('header-search-mobile-btn');
    if (!overlay) return;

    var input    = overlay.querySelector('.mobile-search-input');
    var cancelBtn = overlay.querySelector('.mobile-search-cancel');
    var results  = overlay.querySelector('.mobile-search-results');
    var iconPrefix = overlay.querySelector('.header-search-icon-prefix');

    function openOverlay() {
      overlay.classList.add('is-open');
      if (input) { setTimeout(function(){ input.focus(); }, 80); }
    }
    function closeOverlay() {
      overlay.classList.remove('is-open');
      if (input) input.value = '';
      if (results) results.innerHTML = '';
    }

    if (mobileBtn) mobileBtn.addEventListener('click', openOverlay);
    if (cancelBtn) cancelBtn.addEventListener('click', closeOverlay);

    if (input && results) {
      input.addEventListener('input', function() {
        var q = input.value.trim();
        clearTimeout(_debounce);
        if (!q || q.length < 2) {
          results.innerHTML = '';
          return;
        }
        results.innerHTML = '<div class="search-dropdown-loading"><span class="spin"></span> Searching...</div>';
        _debounce = setTimeout(function() {
          loadData(function() {
            var pkgs  = searchPackages(q);
            var tests = searchTests(q);
            results.innerHTML = '';
            renderDropdown(results, q, pkgs, tests);
            // Fix item width for mobile overlay
            results.querySelectorAll('.search-dropdown-item').forEach(function(btn) {
              btn.style.width = '100%';
            });
          });
        }, DEBOUNCE_MS);
      });
    }
  }

  /* ── Expose shared search for page-level use ────────────── */
  window.SmearSearch = {
    searchPackages: searchPackages,
    searchTests: searchTests,
    loadData: loadData,
    init: function() {
      // Pre-warm data from window globals if available
      if (window.SMEAR_PACKAGES) _packages = window.SMEAR_PACKAGES;
      if (window.SMEAR_TESTS)    _tests    = window.SMEAR_TESTS;
    }
  };

  /* ── Boot ───────────────────────────────────────────────── */
  function boot() {
    // Pre-warm
    if (window.SMEAR_PACKAGES) _packages = window.SMEAR_PACKAGES;
    if (window.SMEAR_TESTS)    _tests    = window.SMEAR_TESTS;
    initDesktopSearch();
    initMobileSearch();

    // Handle URL search param on packages/blood-tests pages
    var urlParams = new URLSearchParams(window.location.search);
    var qParam = urlParams.get('q') || urlParams.get('search');
    if (qParam) {
      // Set in page search inputs if present
      var inputs = document.querySelectorAll('#shop-search-input, .shop-search-input, #test-search-input');
      inputs.forEach(function(inp) {
        inp.value = qParam;
        inp.dispatchEvent(new Event('input', { bubbles: true }));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Re-warm when packages/tests load (for pages that load them dynamically)
  window.addEventListener('smear:packagesLoaded', function(e) {
    _packages = e.detail || window.SMEAR_PACKAGES;
  });
  window.addEventListener('smear:testsLoaded', function(e) {
    _tests = e.detail || window.SMEAR_TESTS;
  });

}());
