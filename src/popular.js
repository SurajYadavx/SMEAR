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

    var style = getGradient(idx);
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
    var discountPercent = isPkg ? 40 : 20;
    var price = oldPrice > 0 ? Math.round(oldPrice * (1 - discountPercent/100)) : 0;
    
    var iconHtml = isPkg 
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 0 4-4V6a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1-2 2h-7a3 3 0 0 1-3-3"/></svg>';
    
    var catName = item.categoryName || (isPkg ? 'Health Package' : 'Laboratory Test');
    var desc = isPkg ? (item.parameters_count ? item.parameters_count + ' parameters included' : 'Comprehensive Panel') : (item.specimen ? 'Sample: ' + item.specimen : 'Standard Blood Test');
    var btnText = isPkg ? 'View Package' : 'Book Test';

    card.innerHTML = 
      '<div class="pop-card-header">' +
        '<div class="pop-icon-box" style="background: ' + style.bg + '; color: ' + style.color + ';">' + iconHtml + '</div>' +
        '<div class="pop-badge">' + discountPercent + '% OFF</div>' +
      '</div>' +
      '<h3 class="pop-title" title="' + esc(item.name) + '">' + esc(item.name) + '</h3>' +
      '<div class="pop-desc">' + esc(desc) + '</div>' +
      '<div class="pop-price-row">' +
        '<div>' +
          (price > 0 
            ? '<span class="pop-old-price">₹' + oldPrice + '</span><span class="pop-price">₹' + price + '</span>'
            : '<span class="pop-price" style="font-size:1.1rem; color:var(--color-text-mid);">Price available at lab</span>') +
        '</div>' +
        '<button class="pop-btn">' + btnText + '</button>' +
      '</div>';
    
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
