const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const startStr = '<section id="tests" class="section-tests"';
const start = html.indexOf(startStr);
if (start === -1) {
    console.error('Could not find section id="tests"');
    process.exit(1);
}
const endStr = '</section>';
const end = html.indexOf(endStr, start) + endStr.length;

const newSection = `<section id="tests" class="section-tests" aria-labelledby="tests-heading" style="text-align: center; padding: 80px 20px;">
    <div class="container">
      <div class="section-header fade-in">
        <span class="section-eyebrow" data-i18n="tests.eyebrow">Diagnostic Services</span>
        <h2 id="tests-heading" class="section-title">
          Health Packages & Blood Tests
        </h2>
        <p class="section-subtitle">
          Browse our wide range of health checkup packages and tests by category.
        </p>
        <div style="margin-top: 30px; display: flex; gap: 15px; justify-content: center; flex-wrap: wrap;">
          <a href="packages.html" class="btn btn--primary" style="display: inline-flex;">Explore Packages &rarr;</a>
          <a href="blood-tests.html" class="btn btn--outline-primary" style="display: inline-flex;">Search Blood Tests &rarr;</a>
        </div>
      </div>
    </div>
  </section>`;

html = html.substring(0, start) + newSection + html.substring(end);
fs.writeFileSync(indexPath, html);
console.log('Updated index.html successfully.');
