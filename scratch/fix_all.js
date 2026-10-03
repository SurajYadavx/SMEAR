const fs = require('fs');

let pkgs = fs.readFileSync('D:/FF/Smear/src/packages.js', 'utf8');

// 1. Replace renderCategoryTabs with renderCategoryCards
const tabsRegex = /\/\* ── Category Tabs [\s\S]*?(?=\/\* ── Package Cards for Category)/m;
const newCardsCode = `/* ── Category Cards ─────────────────────────────────────────── */
  function renderCategoryCards() {
    var section = document.querySelector('.shop-search-section');
    var existingTabs = document.getElementById('pkg-category-tabs');
    if (existingTabs) existingTabs.remove();
    
    var grid = getGrid();
    if (!grid) return;
    
    var catCounts = {};
    _packages.forEach(function(p) {
      if(p.categoryId) catCounts[p.categoryId] = (catCounts[p.categoryId] || 0) + 1;
    });

    var activeCats = _categories.filter(function(cat) { return catCounts[cat.categoryId] > 0; });

    var heading = getHeading();
    if (heading) heading.textContent = 'Package Categories';
    
    if (section) section.style.display = 'none';

    var existingBack = document.getElementById('back-to-categories');
    if (existingBack) existingBack.remove();

    grid.innerHTML = '';
    grid.className = 'shop-package-grid';

    activeCats.forEach(function(cat) {
      var count = catCounts[cat.categoryId] || 0;
      var card = document.createElement('div');
      card.className = 'shop-pkg-card';
      card.style.cursor = 'pointer';
      
      var iconHtml = window.SmearVisuals ? window.SmearVisuals.getMotifSVG(cat.categoryName) : '';
      
      card.innerHTML = 
        '<div class="shop-pkg-card__body" style="text-align: center; padding: 40px 20px;">' +
          '<div style="width: 48px; height: 48px; margin: 0 auto 16px;">' + iconHtml + '</div>' +
          '<h3 class="shop-pkg-card__title" style="font-size: 1.4rem; color: var(--color-primary-dark); margin-bottom: 15px;">' + esc(cat.categoryName) + '</h3>' +
          '<div style="color: #5a7070; margin-bottom: 25px; font-weight: 500;">' + count + ' Packages</div>' +
          '<span class="btn btn--outline-primary" style="display:inline-flex;">Explore Packages &rarr;</span>' +
        '</div>';
        
      card.addEventListener('click', function() {
        _activeCategory = cat.categoryId;
        if (section) section.style.display = 'block'; 
        setURLState(cat.categoryId, _searchQuery);
        renderPackagesForCategory();
      });
      grid.appendChild(card);
    });
  }

  `;
pkgs = pkgs.replace(tabsRegex, newCardsCode);

// 2. Fix the "All Packages" view and Search behavior
const allPackagesViewStr = `
    var cat = _activeCategory ? _categories.find(function(c) { return c.categoryId === _activeCategory; }) : null;

    var heading = getHeading();
    if (heading) {
      heading.textContent = cat ? cat.categoryName : 'All Packages';
    }
    
    var headContainer = document.querySelector('.catalogue-section__head');
    var existingBack = document.getElementById('back-to-categories');
    if (existingBack) existingBack.remove();
    
    if (headContainer && _activeCategory) {
      var backBtn = document.createElement('button');
      backBtn.id = 'back-to-categories';
      backBtn.className = 'btn btn--outline-primary';
      backBtn.style.marginBottom = '20px';
      backBtn.innerHTML = '&larr; Back to Categories';
      backBtn.addEventListener('click', function() {
        _activeCategory = null;
        setURLState('', _searchQuery);
        renderCategoryCards();
      });
      headContainer.insertBefore(backBtn, headContainer.firstChild);
    } else if (!_activeCategory && !_searchQuery) {
       renderCategoryCards();
       return;
    }
`;
pkgs = pkgs.replace(/var cat = _activeCategory \? _categories\.find\(function\(c\) \{ return c\.id === _activeCategory; \}\) : null;[\s\S]*?var query = searchOverride !== undefined \? searchOverride : _searchQuery;/m, allPackagesViewStr + '\n    var query = searchOverride !== undefined ? searchOverride : _searchQuery;');

// 3. Fix categoryId logic in filter
pkgs = pkgs.replace(/if \(_activeCategory && pkg\.categoryId !== _activeCategory\) return false;/g, 'if (_activeCategory && pkg.categoryId !== _activeCategory) return false;');

// 4. Update init loading calls
pkgs = pkgs.replace(/renderCategoryTabs\(\);/g, '/* renderCategoryCards handled inside */');
pkgs = pkgs.replace(/renderCategoryTabs/g, 'renderCategoryCards');

// 5. Fix file:/// error blocks safely
const safeErrStr = "'<div class=\"error-state\" style=\"padding: 40px 20px; background: #fff0f0; border: 1px solid #ffcccc; border-radius: 12px; margin-top: 40px;\">' +\n" +
"  '<h3 style=\"color: #d32f2f; margin-bottom: 12px; font-size: 1.5rem;\">Security Block: Cannot Load Data from file:///</h3>' +\n" +
"  '<p style=\"color: #333; margin-bottom: 16px; font-size: 1.1rem;\">Modern browsers block loading JSON files directly from your computer.</p>' +\n" +
"  '<p style=\"color: #333; font-weight: bold; font-size: 1.1rem;\">Please open the website using the local server we started:</p>' +\n" +
"  '<div style=\"background: #fff; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 1.2rem; color: #000; display: inline-block; border: 1px solid #ccc; margin-top: 10px;\">' +\n" +
"    '<a href=\"http://localhost:8000/packages.html\" style=\"color: #2563eb; text-decoration: none;\">http://localhost:8000/packages.html</a>' +\n" +
"  '</div>' +\n" +
"'</div>';";

pkgs = pkgs.replace(/'<div class="error-state">' \+[\s\S]*?'<\/div>';/, safeErrStr);
fs.writeFileSync('D:/FF/Smear/src/packages.js', pkgs);


// NOW FIX BLOOD TESTS
let blood = fs.readFileSync('D:/FF/Smear/src/blood-tests.js', 'utf8');
const safeBloodErrStr = "'<div class=\"error-state\" style=\"padding: 40px 20px; background: #fff0f0; border: 1px solid #ffcccc; border-radius: 12px; margin-top: 40px;\">' +\n" +
"  '<h3 style=\"color: #d32f2f; margin-bottom: 12px; font-size: 1.5rem;\">Security Block: Cannot Load Data from file:///</h3>' +\n" +
"  '<p style=\"color: #333; margin-bottom: 16px; font-size: 1.1rem;\">Modern browsers block loading JSON files directly from your computer.</p>' +\n" +
"  '<p style=\"color: #333; font-weight: bold; font-size: 1.1rem;\">Please open the website using the local server we started:</p>' +\n" +
"  '<div style=\"background: #fff; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 1.2rem; color: #000; display: inline-block; border: 1px solid #ccc; margin-top: 10px;\">' +\n" +
"    '<a href=\"http://localhost:8000/blood-tests.html\" style=\"color: #2563eb; text-decoration: none;\">http://localhost:8000/blood-tests.html</a>' +\n" +
"  '</div>' +\n" +
"'</div>';";
blood = blood.replace(/'<div class="error-state">' \+[\s\S]*?'<\/div>';/, safeBloodErrStr);

// Fix blood test modal title color
// User said: "by openning the pop of of each blood test the manin name is not visible this is thier but i thing colour is same as of bg colour fix this"
// The title is in #modal-test-name. In v3-polish.css or blood-tests.js, let's just forcefully set the color.
blood = blood.replace(/nameEl\.textContent = (.*?);/, 'nameEl.textContent = $1;\n    nameEl.style.color = "var(--color-text-dark)";');

fs.writeFileSync('D:/FF/Smear/src/blood-tests.js', blood);

console.log("Fixed packages and blood tests");
