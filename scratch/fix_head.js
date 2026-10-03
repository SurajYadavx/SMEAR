const fs = require('fs');

let pkgs = fs.readFileSync('D:/FF/Smear/src/packages.js', 'utf8');

// Fix category properties
pkgs = pkgs.replace(/cat\.id/g, 'cat.categoryId');
pkgs = pkgs.replace(/cat\.name/g, 'cat.categoryName');

// Fix packageCount calculation
pkgs = pkgs.replace(/_categories\.forEach\(function\(cat, idx\) \{[\s\S]*?if \(cat\.packageCount === 0\) return;/, `
    var catCounts = {};
    _packages.forEach(function(p) {
      if(p.categoryId) catCounts[p.categoryId] = (catCounts[p.categoryId] || 0) + 1;
    });

    _categories.forEach(function(cat, idx) {
      var count = catCounts[cat.categoryId] || 0;
      if (count === 0) return;
`);

pkgs = pkgs.replace(/cat\.packageCount/g, 'count');

// Fix renderPackagesForCategory when no active category
pkgs = pkgs.replace(/var cat = _categories\.find\(function\(c\) \{ return c\.categoryId === _activeCategory; \}\);\s*if \(!cat\) \{ renderCategoryCards\(\); return; \}/, `
    var cat = _activeCategory ? _categories.find(function(c) { return c.categoryId === _activeCategory; }) : null;
    if (!_activeCategory && !_searchQuery) { renderCategoryCards(); return; }
`);

pkgs = pkgs.replace(/if \(heading\) heading\.textContent = cat\.categoryName;/, `
    if (heading) heading.textContent = cat ? cat.categoryName : 'All Packages';
`);

pkgs = pkgs.replace(/if \(pkg\.categoryId !== _activeCategory\) return false;/, `
    if (_activeCategory && pkg.categoryId !== _activeCategory) return false;
`);

// Add safe error message
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
blood = blood.replace(/nameEl\.textContent = test\.test_name;/g, 'nameEl.textContent = test.test_name; nameEl.style.color = "var(--color-text-dark)";');

fs.writeFileSync('D:/FF/Smear/src/blood-tests.js', blood);

console.log("Fixed packages and blood tests");
