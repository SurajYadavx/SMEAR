const fs = require('fs');
const path = require('path');

const shopPath = path.join(__dirname, '..', 'shop.html');
let shopHtml = fs.readFileSync(shopPath, 'utf8');

// Update Nav in shopHtml first
shopHtml = shopHtml.replace(
  /<a href="shop\.html"\s+class="nav-link"\s+data-i18n="nav\.shop">Shop<\/a>/,
  '<a href="packages.html" class="nav-link">Packages</a>\n          <a href="blood-tests.html" class="nav-link">Blood Tests</a>'
);
shopHtml = shopHtml.replace(
  /<a href="shop\.html"\s+class="mobile-nav__link"\s+data-i18n="nav\.shop">Shop<\/a>/,
  '<a href="packages.html" class="mobile-nav__link">Packages</a>\n          <a href="blood-tests.html" class="mobile-nav__link">Blood Tests</a>'
);

// Create packages.html
let packagesHtml = shopHtml.replace(
  /<title>.*<\/title>/,
  '<title>Health Packages | Smear Pathology Indapur</title>'
);
packagesHtml = packagesHtml.replace(
  /<h1 id="shop-hero-heading" class="shop-hero__title">Browse &amp; Book Health Tests<\/h1>/,
  '<h1 id="shop-hero-heading" class="shop-hero__title">Health Packages</h1>'
);
// Remove tests section
packagesHtml = packagesHtml.replace(/<div class="shop-section fade-in" aria-labelledby="shop-tests-heading"[^]*?<\/div>\s*<\/div>/, '');
// Change JS script
packagesHtml = packagesHtml.replace(/<script src="\.\/src\/shop\.js"><\/script>/, '<script src="./src/packages.js"></script>');
fs.writeFileSync(path.join(__dirname, '..', 'packages.html'), packagesHtml);


// Create blood-tests.html
let bloodTestsHtml = shopHtml.replace(
  /<title>.*<\/title>/,
  '<title>Blood Tests | Smear Pathology Indapur</title>'
);
bloodTestsHtml = bloodTestsHtml.replace(
  /<h1 id="shop-hero-heading" class="shop-hero__title">Browse &amp; Book Health Tests<\/h1>/,
  '<h1 id="shop-hero-heading" class="shop-hero__title">Search Blood Tests</h1>'
);
bloodTestsHtml = bloodTestsHtml.replace(
  /<p class="shop-hero__sub">[^<]+<\/p>/,
  '<p class="shop-hero__sub">Find and book individual blood tests instantly.</p>'
);
// Remove packages section
bloodTestsHtml = bloodTestsHtml.replace(/<div class="shop-section fade-in" aria-labelledby="shop-packages-heading"[^]*?<\/div>\s*<\/div>/, '');
bloodTestsHtml = bloodTestsHtml.replace(/<div class="shop-category-filters"[^]*?<\/div>/, '');
// Change JS script
bloodTestsHtml = bloodTestsHtml.replace(/<script src="\.\/src\/shop\.js"><\/script>/, '<script src="./src/blood-tests.js"></script>');
fs.writeFileSync(path.join(__dirname, '..', 'blood-tests.html'), bloodTestsHtml);

console.log('Created packages.html and blood-tests.html');
