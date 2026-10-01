const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'all_packages');
const bloodTestDir = path.join(__dirname, '..', 'blood_test');
const outputDir = path.join(__dirname, '..', 'public', 'data');
const pagesDir = path.join(__dirname, '..', 'package-details');

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function extractPrice(previewContent) {
  if (!previewContent) return 0;
  var match = previewContent.match(/₹\s*(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

function extractDiscount(previewContent) {
  if (!previewContent) return 0;
  var match = previewContent.match(/(\d+)%\s*OFF/);
  return match ? parseInt(match[1], 10) : 0;
}

function parseDetailedContent(rawText) {
    if (!rawText) return '';
    var paragraphs = rawText.split('\n').filter(function(line) { 
        return line.trim().length > 0 && 
               line.indexOf('Cart (') === -1 &&
               line.indexOf('Popular Search') === -1 &&
               line.indexOf('Home\n') === -1 &&
               line.indexOf('© Copyright') === -1 &&
               line.indexOf('Privacy Policy') === -1;
    });
      
    var cleanHtml = '<div class="package-parsed-content">';
    var captureMode = '';
    
    var stopParsing = false;
    paragraphs.forEach(function(p) { 
        if (stopParsing) return;
        
        p = p.trim();
        if (p === '') return;
        
        var isFaqQ = p.match(/^\d+\.\s+What/) || p.match(/^\d+\.\s+Who/) || p.match(/^\d+\.\s+How/) || p.match(/^\d+\.\s+Is /) || p.match(/^\d+\.\s+When/) || p.indexOf('?') > -1;
        
        if (p.indexOf('Pick & Quick Booking') > -1 || p.indexOf('Pick & Quick') > -1 || p === 'OUR' || p.indexOf('Feedback') === 0 || p.indexOf('Thyrocare Technologies Limited') === 0 || p.indexOf('Patient\'s Testimonials') === 0) {
            stopParsing = true;
            return;
        }

        if (p.indexOf('Booking Procedure:') > -1 || p.indexOf('List of Profiles') > -1 || p.indexOf('Frequently Asked Questions') > -1 || p.indexOf('List of Tests Included') > -1) {
            
            var icon = '📝';
            if (p.indexOf('Procedure') > -1) icon = '🗓️';
            if (p.indexOf('Questions') > -1) icon = '❓';
            if (p.indexOf('Profiles') > -1 || p.indexOf('Tests') > -1) icon = '🔬';
            
            cleanHtml += '<h3 class="package-section-title"><span>' + icon + '</span> ' + p + '</h3>';
            captureMode = p;
        } else if (p.indexOf('Rs.') === 0 || p.indexOf('₹') === 0 || p.indexOf('Book Now') > -1 || p.indexOf('17 Crores+') > -1 || p.indexOf('World Class') > -1 || p.indexOf('Price:') === 0 || p.match(/^₹\s*[\d,]+(\.\d+)?$/)) {
            // Skip noise
        } else {
            if (captureMode.indexOf('Frequently Asked') > -1) {
                if (isFaqQ) {
                    cleanHtml += '<div class="package-faq-q">' + p.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
                } else {
                    cleanHtml += '<div class="package-faq-a">' + p.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
                }
            } else if (captureMode !== '') {
                // List of profiles/tests mode
                var isCategory = p.indexOf('Tests)') > -1 || p.indexOf('PROFILE') > -1 || p.indexOf('TEST') > -1 && p.length < 50;
                
                if (isCategory && p.indexOf('(') > -1) {
                    cleanHtml += '<div class="package-faq-q" style="margin-top:15px; margin-bottom:10px;">' + p.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
                } else {
                    cleanHtml += '<div class="package-list-item">' + p.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
                }
            } else {
                cleanHtml += '<p>' + p.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</p>';
            }
        }
    });
    
    cleanHtml += '</div>';
    return cleanHtml;
}

async function processData() {
  const categories = [];
  const allPackages = [];
  const usedSlugs = new Set();
  
  let healthTestsCount = 0;
  let categoryFilesCount = 0;
  let packageRecordsCount = 0;
  let failedRecords = 0;

  // Extract header/footer from index.html
  const indexPath = path.join(__dirname, '..', 'index.html');
  let siteHeader = '';
  let siteFooter = '';
  if (fs.existsSync(indexPath)) {
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      const headerMatch = indexContent.match(/<header[^>]*>[\s\S]*?<\/header>/);
      const footerMatch = indexContent.match(/<footer[^>]*>[\s\S]*?<\/footer>/);
      if (headerMatch) siteHeader = headerMatch[0].replace(/href="([a-zA-Z0-9_-]+\.html)"/g, 'href="../$1"').replace(/src="([a-zA-Z0-9_-]+\/)/g, 'src="../$1"');
      if (footerMatch) siteFooter = footerMatch[0].replace(/href="([a-zA-Z0-9_-]+\.html)"/g, 'href="../$1"').replace(/src="([a-zA-Z0-9_-]+\/)/g, 'src="../$1"');
  }

  // Load template
  const templatePath = path.join(__dirname, 'package-template.html');
  let template = '';
  if (fs.existsSync(templatePath)) {
      template = fs.readFileSync(templatePath, 'utf8');
      template = template.replace('{{site_header}}', siteHeader).replace('{{site_footer}}', siteFooter);
  }
  
  // Process Packages
  if (fs.existsSync(packagesDir)) {
    const files = fs.readdirSync(packagesDir);
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      const filePath = path.join(packagesDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      let data;
      try {
        data = JSON.parse(content);
      } catch (e) {
        continue;
      }
      
      categoryFilesCount++;
      const categoryName = file.replace('.json', '');
      const categoryId = slugify(categoryName);
      const packagesInCategory = Array.isArray(data) ? data : (data.packages || []);
      
      categories.push({ id: categoryId, name: categoryName, packageCount: packagesInCategory.length });
      
      for (const pkg of packagesInCategory) {
        if (!pkg.package_name && !pkg.test_name) {
          failedRecords++;
          continue;
        }
        
        const pkgName = pkg.package_name || pkg.test_name;
        let pkgId = slugify(pkgName);
        let counter = 2;
        while(usedSlugs.has(pkgId)) {
            pkgId = slugify(pkgName) + '-' + counter;
            counter++;
        }
        usedSlugs.add(pkgId);
        packageRecordsCount++;
        
        allPackages.push({
          id: pkgId,
          categoryId: categoryId,
          categoryName: categoryName,
          name: pkgName,
          sourceData: pkg
        });

        // Generate HTML Page
        if (template) {
            let pageHtml = template;
            const price = extractPrice(pkg.preview_content);
            const discount = extractDiscount(pkg.preview_content);
            const title = pkg.detail_page_title || pkgName;
            
            let imgHtml = '';
            if (pkg.preview_image_url) {
                imgHtml = `<img src="${pkg.preview_image_url}" alt="${pkgName}" style="max-width: 100%; border-radius: 12px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);" />`;
            }

            const parsedContent = parseDetailedContent(pkg.detailed_content || pkg.preview_content);

            pageHtml = pageHtml
                .replace(/{{seo_title}}/g, title)
                .replace(/{{seo_desc}}/g, 'Book ' + pkgName + ' at Smear Pathology Indapur.')
                .replace(/{{slug}}/g, pkgId)
                .replace(/{{name}}/g, pkgName)
                .replace(/{{category}}/g, categoryName)
                .replace(/{{tagline}}/g, '')
                .replace(/{{paramCount}}/g, '')
                .replace(/{{fasting}}/g, pkg.detailed_content && pkg.detailed_content.toLowerCase().includes('fasting') ? 'Required' : 'Not specified')
                .replace(/{{reportTime}}/g, '24-48 Hours')
                .replace(/{{price}}/g, price || 'TBD')
                .replace(/{{mrp_html}}/g, discount ? `<span style="text-decoration: line-through; color: #888; font-size: 1.1rem; margin-left: 10px;"></span><span style="color: #e74c3c; font-weight: bold; margin-left: 10px;">${discount}% OFF</span>` : '')
                .replace(/{{id}}/g, pkgId)
                .replace(/{{highlights_html}}/g, imgHtml)
                .replace(/{{profiles_html}}/g, parsedContent);

            fs.writeFileSync(path.join(pagesDir, pkgId + '.html'), pageHtml);
        }
      }
    }
  }

  // Process Blood Tests
  if (fs.existsSync(bloodTestDir)) {
    const testFile = path.join(bloodTestDir, 'health_tests.json');
    if (fs.existsSync(testFile)) {
      const content = fs.readFileSync(testFile, 'utf8');
      try {
        const data = JSON.parse(content);
        fs.writeFileSync(path.join(outputDir, 'health-tests.json'), JSON.stringify(data));
        fs.writeFileSync(path.join(outputDir, 'health-tests.js'), 'window.SMEAR_TESTS = ' + JSON.stringify(data).replace(/</g, '\\u003c') + ';');
        healthTestsCount = data.length || 0;
      } catch(e) {}
    }
  }
  
  fs.writeFileSync(path.join(outputDir, 'package-categories.json'), JSON.stringify(categories, null, 2));
  fs.writeFileSync(path.join(outputDir, 'packages.json'), JSON.stringify(allPackages, null, 2));
  fs.writeFileSync(path.join(outputDir, 'package-categories.js'), 'window.SMEAR_CATEGORIES = ' + JSON.stringify(categories, null, 2).replace(/</g, '\\u003c') + ';');
  fs.writeFileSync(path.join(outputDir, 'packages.js'), 'window.SMEAR_PACKAGES = ' + JSON.stringify(allPackages, null, 2).replace(/</g, '\\u003c') + ';');
  
  console.log(`Successfully generated ${packageRecordsCount} package pages in /package-details/`);
}

processData();
