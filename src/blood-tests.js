(function () {
  'use strict';

  var _tests = [];
  var _currentPage = 1;
  var _itemsPerPage = 50;
  var _searchQuery = '';

  function esc(s) {
    return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function extractPrice(priceStr) {
    if (!priceStr) return 0;
    var match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }

  function renderTests() {
    var grid = document.getElementById('shop-test-grid');
    if (!grid) {
      grid = document.createElement('div');
      grid.id = 'shop-test-grid';
      grid.className = 'shop-package-grid'; 
      
      var hero = document.querySelector('.shop-hero');
      if (hero) {
        var container = document.createElement('div');
        container.className = 'container';
        container.style.marginTop = '40px';
        container.style.marginBottom = '80px';
        
        var searchHtml = '<div class="shop-search-wrapper" style="margin-bottom:30px; max-width:600px; margin-left:auto; margin-right:auto; display:flex; align-items:center; background:#fff; border-radius:8px; padding:10px 20px; box-shadow:0 2px 10px rgba(0,0,0,0.05);">' +
                         '<svg viewBox="0 0 24 24" width="20" height="20" stroke="var(--color-primary)" stroke-width="2" fill="none" style="margin-right:10px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>' +
                         '<input type="text" id="test-search-input" class="shop-search-input" placeholder="Search thousands of blood tests..." style="border:none; outline:none; width:100%; font-size:1rem;">' +
                         '</div>';
        
        container.innerHTML = searchHtml;
        container.appendChild(grid);
        hero.parentNode.insertBefore(container, hero.nextSibling);
        
        var searchInput = document.getElementById('test-search-input');
        if (searchInput) {
          searchInput.addEventListener('input', function(e) {
            _searchQuery = e.target.value.trim().toLowerCase();
            _currentPage = 1;
            renderTests();
          });
        }
      } else {
        return;
      }
    }

    grid.innerHTML = '';
    
    var filtered = _tests.filter(function(t) {
      return _searchQuery === '' || t.test_name.toLowerCase().indexOf(_searchQuery) > -1;
    });
    
    if (filtered.length === 0) {
      grid.innerHTML = '<p style="color:#5a7070;grid-column:1/-1;text-align:center;">No tests found matching your search.</p>';
      renderPagination(0);
      return;
    }

    var totalPages = Math.ceil(filtered.length / _itemsPerPage);
    var startIdx = (_currentPage - 1) * _itemsPerPage;
    var paginated = filtered.slice(startIdx, startIdx + _itemsPerPage);

    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
    grid.style.gap = '20px';

    paginated.forEach(function(test, idx) {
      var card = document.createElement('div');
      card.className = 'shop-pkg-card';
      card.style.padding = '20px';
      card.style.display = 'flex';
      card.style.flexDirection = 'column';
      card.style.justifyContent = 'space-between';
      
      var price = extractPrice(test.price);
      var id = 'test_' + (startIdx + idx);
      test._id = id; // attach id for modal
      
      var ctas = '<div class="shop-pkg-card__ctas" style="margin-top: 15px; display: flex; gap: 10px;">' +
        '<button class="btn btn--outline-primary view-test-btn" data-id="' + id + '" style="flex:1;">View Details</button>' +
        '<button class="btn btn--primary add-test-btn" data-id="' + id + '" data-name="' + esc(test.test_name) + '" data-price="' + price + '" style="flex:1;">Add to Cart</button>' +
        '</div>';
        
      card.innerHTML = 
        '<div class="shop-pkg-card__body" style="padding: 0;">' +
          '<div class="shop-pkg-card__cat" style="color:var(--color-primary);font-weight:600;font-size:0.8rem;margin-bottom:8px;">' + esc(test.lab) + '</div>' +
          '<h3 class="shop-pkg-card__title" style="font-size:1.1rem;margin-bottom:10px;">' + esc(test.test_name) + '</h3>' +
          '<div class="shop-pkg-card__price" style="font-size:1.25rem;">₹' + price + '</div>' +
          ctas +
        '</div>';
        
      grid.appendChild(card);
    });
    
    // Attach cart events
    grid.querySelectorAll('.add-test-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        if (window.SmearCart) {
          var id = e.currentTarget.getAttribute('data-id');
          var name = e.currentTarget.getAttribute('data-name');
          var price = parseInt(e.currentTarget.getAttribute('data-price'), 10);
          window.SmearCart.add(id, 'test', name, price);
        }
      });
    });

    // Attach view details events
    grid.querySelectorAll('.view-test-btn').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        var id = e.currentTarget.getAttribute('data-id');
        openTestModal(id);
      });
    });

    renderPagination(totalPages);
  }

  function openTestModal(id) {
    var test = _tests.find(function(t) { return t._id === id; });
    if (!test) return;
    
    var modal = document.getElementById('test-modal');
    if (!modal) return;
    
    var titleEl = document.getElementById('modal-title');
    var descEl = document.getElementById('modal-desc');
    var priceEl = document.getElementById('modal-price');
    var imgEl = document.getElementById('modal-img');
    var placeEl = document.getElementById('modal-img-placeholder');
    
    if (titleEl) titleEl.textContent = test.test_name;
    
    var cleanHtml = '<div style="max-height: 400px; overflow-y: auto; padding-right: 10px; text-align: left; font-size: 0.95rem; line-height: 1.6;">';
    cleanHtml += '<h4 style="margin-bottom: 10px; color: var(--color-primary-dark); border-bottom: 1px solid #eee; padding-bottom: 5px;">Test Details</h4>';
    cleanHtml += '<p><strong>Test Name:</strong> ' + esc(test.test_name) + '</p>';
    cleanHtml += '<p><strong>Laboratory:</strong> ' + esc(test.lab) + '</p>';
    cleanHtml += '<p><strong>Price:</strong> ' + esc(test.price) + '</p>';
    cleanHtml += '<p style="margin-top: 15px; color: #5a7070;">This is an individual diagnostic test. Please add it to your cart or contact us directly on WhatsApp to book a slot for sample collection.</p>';
    cleanHtml += '</div>';
    
    if (descEl) descEl.innerHTML = cleanHtml;
    
    var price = extractPrice(test.price);
    if (priceEl) priceEl.textContent = price > 0 ? '₹' + price : '';
    
    if (imgEl) imgEl.style.display = 'none';
    if (placeEl) placeEl.style.display = 'flex';
    
    var waBtn = document.getElementById('modal-wa-btn');
    if (waBtn) {
      var waMsg = 'Hi, I want to book the following blood test: ' + test.test_name;
      var waUrl = 'https://wa.me/91' + (window.CONTACT_PHONE || '7410745222') + '?text=' + encodeURIComponent(waMsg);
      waBtn.href = waUrl;
    }
    
    modal.classList.add('modal-overlay--visible');
    modal.setAttribute('aria-hidden', 'false');
  }
  
  function renderPagination(totalPages) {
    var oldPagination = document.getElementById('test-pagination');
    if (oldPagination) oldPagination.remove();
    
    if (totalPages <= 1) return;
    
    var container = document.getElementById('shop-test-grid').parentNode;
    var pagination = document.createElement('div');
    pagination.id = 'test-pagination';
    pagination.style.display = 'flex';
    pagination.style.justifyContent = 'center';
    pagination.style.alignItems = 'center';
    pagination.style.gap = '10px';
    pagination.style.marginTop = '40px';
    
    var prevBtn = document.createElement('button');
    prevBtn.className = 'btn btn--outline-primary';
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = _currentPage === 1;
    if (_currentPage === 1) prevBtn.style.opacity = '0.5';
    prevBtn.addEventListener('click', function() {
      if (_currentPage > 1) {
        _currentPage--;
        renderTests();
        window.scrollTo({ top: document.querySelector('.shop-hero').nextSibling.offsetTop - 100, behavior: 'smooth' });
      }
    });
    
    var pageInfo = document.createElement('span');
    pageInfo.textContent = 'Page ' + _currentPage + ' of ' + totalPages;
    pageInfo.style.fontWeight = '600';
    pageInfo.style.color = 'var(--color-primary-dark)';
    
    var nextBtn = document.createElement('button');
    nextBtn.className = 'btn btn--outline-primary';
    nextBtn.textContent = 'Next';
    nextBtn.disabled = _currentPage === totalPages;
    if (_currentPage === totalPages) nextBtn.style.opacity = '0.5';
    nextBtn.addEventListener('click', function() {
      if (_currentPage < totalPages) {
        _currentPage++;
        renderTests();
        window.scrollTo({ top: document.querySelector('.shop-hero').nextSibling.offsetTop - 100, behavior: 'smooth' });
      }
    });
    
    pagination.appendChild(prevBtn);
    pagination.appendChild(pageInfo);
    pagination.appendChild(nextBtn);
    
    container.appendChild(pagination);
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

    if (window.SMEAR_TESTS) {
      _tests = window.SMEAR_TESTS;
      renderTests();
    } else {
      var fetchUrl = './public/data/health-tests.json';
      fetch(fetchUrl)
        .then(function(res) { return res.json(); })
        .then(function(data) {
          _tests = data;
          renderTests();
        })
        .catch(function(e) {
          console.error('Error loading tests:', e);
          var grid = document.getElementById('shop-test-grid');
          if (grid) grid.innerHTML = '<p style="color: red; text-align: center;">Error loading test data. Please use a local web server (e.g. VS Code Live Server) to view the pages correctly if not hosted.</p>';
        });
    }
  }

  document.addEventListener('DOMContentLoaded', init);

})();
