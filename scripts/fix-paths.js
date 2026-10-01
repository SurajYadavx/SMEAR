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

            // Compute relative depth to root to fix paths
            const relativeToRoot = path.relative(path.dirname(fullPath), __dirname + '/..');
            const prefix = relativeToRoot === '' ? '' : relativeToRoot.replace(/\\/g, '/') + '/';

            // Fix absolute paths starting with /
            const fixAbsoluteRegex = /href="\/packages\.html"/g;
            if (fixAbsoluteRegex.test(content)) {
                content = content.replace(fixAbsoluteRegex, `href="${prefix}packages.html"`);
                updated = true;
            }
            
            const fixAbsoluteBloodRegex = /href="\/blood-tests\.html"/g;
            if (fixAbsoluteBloodRegex.test(content)) {
                content = content.replace(fixAbsoluteBloodRegex, `href="${prefix}blood-tests.html"`);
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(fullPath, content);
                console.log('Fixed paths in ' + fullPath);
            }
        }
    }
}

processHtmlFiles(path.join(__dirname, '..'));
