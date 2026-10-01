const fs = require('fs');
const path = require('path');

function processHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
            processHtmlFiles(fullPath);
        } else if (file.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let updated = false;

            // 1. Desktop Nav
            const desktopNavRegex = /<a href="(?:\.\.\/)?shop\.html"\s+class="nav-link" data-i18n="nav\.shop">Shop<\/a>/g;
            if (desktopNavRegex.test(content)) {
                content = content.replace(desktopNavRegex, 
                    '<a href="/packages.html" class="nav-link">Packages</a>\n          <a href="/blood-tests.html" class="nav-link">Blood Tests</a>');
                updated = true;
            }

            // 2. Mobile Nav
            const mobileNavRegex = /<a href="(?:\.\.\/)?shop\.html"\s+class="mobile-nav__link" data-i18n="nav\.shop">Shop<\/a>/g;
            if (mobileNavRegex.test(content)) {
                content = content.replace(mobileNavRegex, 
                    '<a href="/packages.html" class="mobile-nav__link">Packages</a>\n          <a href="/blood-tests.html" class="mobile-nav__link">Blood Tests</a>');
                updated = true;
            }

            // 3. Footer Nav
            const footerNavRegex = /<a href="(?:\.\.\/)?shop\.html"\s+class="footer-nav__link" data-i18n="nav\.shop">Shop<\/a>/g;
            if (footerNavRegex.test(content)) {
                content = content.replace(footerNavRegex, 
                    '<a href="/packages.html" class="footer-nav__link">Packages</a>\n        <a href="/blood-tests.html" class="footer-nav__link">Blood Tests</a>');
                updated = true;
            }

            // 4. Standalone shop links (like in breadcrumbs, or continue browsing)
            const genericShopRegex = /href="(?:\.\.\/)?shop\.html"/g;
            if (genericShopRegex.test(content)) {
                content = content.replace(genericShopRegex, 'href="/packages.html"');
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated nav in ' + fullPath);
            }
        }
    }
}

processHtmlFiles(path.join(__dirname, '..'));
