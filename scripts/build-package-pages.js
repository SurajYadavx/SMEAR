const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src');
const PACKAGES_DATA_FILE = path.join(SRC_DIR, 'content', 'packages.js');
const TEMPLATE_FILE = path.join(__dirname, 'package-template.html');
const OUT_DIR = path.join(ROOT_DIR, 'packages');
const INDEX_HTML = path.join(ROOT_DIR, 'shop.html');

// 1. Read shop.html to extract the canonical header and footer
const indexHtmlContent = fs.readFileSync(INDEX_HTML, 'utf8');

const headerMatch = indexHtmlContent.match(/<header id="site-header"[\s\S]*?<!-- END SHARED HEADER -->/);
const footerMatch = indexHtmlContent.match(/<footer class="site-footer"[\s\S]*?<!-- END SHARED FOOTER -->/);

if (!headerMatch || !footerMatch) {
  console.error("Could not find header or footer in shop.html");
  process.exit(1);
}

// Adjust links in header/footer to be relative to the 'packages/' directory
let siteHeader = headerMatch[0];
let siteFooter = footerMatch[0];

// Basic replacements for paths inside the packages subdirectory
// Need to replace href="index.html" with href="../index.html", etc.
siteHeader = siteHeader
  .replace(/href="(index|shop|home-collection|cart|terms|privacy)\.html/g, 'href="../$1.html')
  .replace(/src="\.\/public\//g, 'src="../public/');
siteFooter = siteFooter
  .replace(/href="(index|shop|home-collection|cart|terms|privacy)\.html/g, 'href="../$1.html')
  .replace(/src="\.\/public\//g, 'src="../public/');

// 2. Read packages.js and extract the data
const packagesJsContent = fs.readFileSync(PACKAGES_DATA_FILE, 'utf8');

// We can run the file in a new context to safely extract window.PACKAGE_DATA
const vm = require('vm');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(packagesJsContent, sandbox);
const packages = sandbox.window.PACKAGE_DATA;

if (!Array.isArray(packages)) {
  console.error("Failed to extract PACKAGE_DATA array from packages.js");
  process.exit(1);
}

// 3. Read template
const template = fs.readFileSync(TEMPLATE_FILE, 'utf8');

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR);
}

// 4. Generate pages
packages.forEach(pkg => {
  if (!pkg.slug) {
    console.warn(`Package "${pkg.name}" is missing a slug, skipping.`);
    return;
  }

  let html = template;

  // Header/Footer
  html = html.replace('{{site_header}}', siteHeader);
  html = html.replace('{{site_footer}}', siteFooter);

  // SEO
  html = html.replace(/{{seo_title}}/g, `${pkg.name} — Smear Pathology Indapur`);
  html = html.replace(/{{seo_desc}}/g, pkg.tagline + ` Book the ${pkg.name} package with ${pkg.paramCount} tests today.`);

  // Basic Details
  html = html.replace(/{{slug}}/g, pkg.slug);
  html = html.replace(/{{id}}/g, pkg.id);
  html = html.replace(/{{name}}/g, pkg.name);
  html = html.replace(/{{category}}/g, pkg.category);
  html = html.replace(/{{tagline}}/g, pkg.tagline);
  html = html.replace(/{{paramCount}}/g, pkg.paramCount);
  html = html.replace(/{{fasting}}/g, pkg.fasting);
  html = html.replace(/{{reportTime}}/g, pkg.reportTime);
  html = html.replace(/{{price}}/g, pkg.price);

  // MRP HTML
  let mrpHtml = '';
  if (pkg.mrp && pkg.mrp > pkg.price) {
    mrpHtml = `<span class="package-mrp" style="text-decoration: line-through; color: #666; margin-left: 10px;">&#8377;${pkg.mrp}</span>`;
  }
  html = html.replace(/{{mrp_html}}/g, mrpHtml);

  // Highlights HTML
  let highlightsHtml = '';
  if (Array.isArray(pkg.highlights) && pkg.highlights.length > 0) {
    const listItems = pkg.highlights.map(h => `<li>${h}</li>`).join('\n');
    highlightsHtml = `
      <div class="package-highlights">
        <h3>Key Highlights</h3>
        <ul>
          ${listItems}
        </ul>
      </div>
    `;
  }
  html = html.replace(/{{highlights_html}}/g, highlightsHtml);

  // Profiles HTML
  let profilesHtml = '';
  if (Array.isArray(pkg.profiles) && pkg.profiles.length > 0) {
    profilesHtml = `
      <div class="package-profiles">
        <h3>Tests Included (${pkg.paramCount})</h3>
        <div class="profiles-list">
    `;
    pkg.profiles.forEach(profile => {
      profilesHtml += `
        <div class="profile-card">
          <h4 class="profile-title">${profile.title}</h4>
      `;
      if (Array.isArray(profile.tests) && profile.tests.length > 0) {
        profilesHtml += `<ul class="profile-tests">`;
        profile.tests.forEach(test => {
          profilesHtml += `<li>${test}</li>`;
        });
        profilesHtml += `</ul>`;
      }
      profilesHtml += `</div>`;
    });
    profilesHtml += `
        </div>
      </div>
    `;
  }
  html = html.replace(/{{profiles_html}}/g, profilesHtml);

  const outPath = path.join(OUT_DIR, `${pkg.slug}.html`);
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`Generated ${outPath}`);
});

console.log("Package pages build complete.");
