(function() {
  function esc(s) {
    if (!s) return '';
    return s.toString().replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  }

  function extractPrice(val) {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      var m = val.match(/₹?\s*([\d,]+)/);
      if (m) return parseInt(m[1].replace(/,/g, ''), 10);
    }
    return 0;
  }

  function getGradient(idx) {
    var gradients = [
      'linear-gradient(135deg, rgba(42, 168, 176, 0.15), rgba(42, 168, 176, 0.05))',
      'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05))',
      'linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(124, 58, 237, 0.05))',
      'linear-gradient(135deg, rgba(234, 88, 12, 0.15), rgba(234, 88, 12, 0.05))'
    ];
    var colors = [
      'var(--color-primary)',
      '#3b82f6',
      '#7c3aed',
      '#ea580c'
    ];
    return { bg: gradients[idx % gradients.length], color: colors[idx % colors.length] };
  }

  function renderCard(item, idx, containerId, isPkg) {
    var container = document.getElementById(containerId);
    if (!container) return;

    var card = document.createElement('div');
    card.className = 'pop-card';
    card.onclick = function() {
      if (isPkg) {
        window.location.href = 'package-detail.html?id=' + encodeURIComponent(item.id || item.slug);
      } else {
        window.location.href = 'blood-tests.html';
      }
    };
    
    var oldPrice = isPkg ? (item.price || 0) : extractPrice(item.price);
    // Use item discount if available, fallback to 40 for packages, 20 for tests
    var discountPercent = item.discount ? parseInt(item.discount, 10) : (isPkg ? 40 : 20);
    var price = oldPrice > 0 ? Math.round(oldPrice * (1 - discountPercent/100)) : 0;
    
    // Value indicator
    var valNum = isPkg ? (item.parameters_count || (item.profiles ? item.profiles.length : 0) || 0) : 1;
    var valText = isPkg ? 'Tests' : 'Test';
    var valueBadgeHtml = '<div class="pop-value-badge"><span class="pop-val-num">' + valNum + '</span><span class="pop-val-text">' + valText + '</span></div>';

    // Tests List
    var testsListHtml = '';
    if (isPkg && item.profiles && item.profiles.length > 0) {
      var maxDisplay = 4;
      var displayed = item.profiles.slice(0, maxDisplay);
      var remaining = item.profiles.length - maxDisplay;
      
      testsListHtml += '<div class="pop-tests-grid">';
      displayed.forEach(function(p) {
        testsListHtml += '<div class="pop-test-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> <span>' + esc(p.name) + '</span></div>';
      });
      testsListHtml += '</div>';
      
      if (remaining > 0) {
        testsListHtml += '<div class="pop-test-more">+' + remaining + ' more included</div>';
      }
    } else {
      var detail = item.specimen ? 'Sample: ' + item.specimen : 'Standard Blood Test';
      testsListHtml += '<div class="pop-tests-grid" style="grid-template-columns: 1fr;"><div class="pop-test-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> <span>' + esc(detail) + '</span></div></div>';
    }

    // Pricing
    var discountBadge = discountPercent > 0 ? '<div class="pop-discount-tag">' + discountPercent + '% OFF</div>' : '<div></div>';
    var pricingHtml = '<div class="pop-price-section">' +
                        discountBadge + 
                        '<div class="pop-price-wrap">' +
                          (price > 0 && oldPrice > price ? '<span class="pop-old-price">₹' + oldPrice + '</span>' : '') +
                          (price > 0 ? '<span class="pop-price">₹' + price + '</span>' : '<span class="pop-price" style="font-size:1.1rem; color:var(--color-text-mid);">Price at lab</span>') +
                        '</div>' +
                      '</div>';

    // Action button
    var btnText = isPkg ? 'Book Package' : 'Book Test';
    var actionHtml = '<div class="pop-action-wrap"><button class="pop-btn-primary">' + btnText + '</button></div>';

    // Services
    var reportTime = item.report_time || '24 Hrs';
    var servicesHtml = '<div class="pop-services-list">' +
                         '<div class="pop-service-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> Home Collection</div>' +
                         '<div class="pop-service-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg> Digital Report</div>' +
                         '<div class="pop-service-item" style="display:none;"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ' + esc(reportTime) + '</div>' +
                       '</div>';

    card.innerHTML = 
      '<div class="pop-card-top-header">' +
        '<h3 class="pop-title" title="' + esc(item.name) + '">' + esc(item.name) + '</h3>' +
      '</div>' +
      valueBadgeHtml +
      '<div class="pop-card-body">' +
        testsListHtml +
        pricingHtml +
        actionHtml +
      '</div>' +
      servicesHtml;
    
    container.appendChild(card);
  }

  Promise.all([
    fetch('./public/data/smear-packages.json').then(function(r) { return r.json(); }).catch(function() { return []; }),
    fetch('./public/data/smear-tests.json').then(function(r) { return r.json(); }).catch(function() { return []; })
  ]).then(function(results) {
    var packages = results[0].filter(function(p) { return (p.price || 0) > 0; }).slice(0, 3);
    var tests = results[1].filter(function(t) { return extractPrice(t.price) > 0; }).slice(0, 3);
    
    packages.forEach(function(pkg, idx) {
      renderCard(pkg, idx, 'popular-packages-container', true);
    });

    tests.forEach(function(test, idx) {
      renderCard(test, idx, 'popular-tests-container', false);
    });
  });
})();
