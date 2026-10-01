const fs = require('fs');
const path = require('path');

function injectScripts(filename, scriptTags) {
    const p = path.join(__dirname, '..', filename);
    let content = fs.readFileSync(p, 'utf8');
    const target = '<!-- Scripts: data first, then logic -->';
    if (content.includes(target) && !content.includes(scriptTags)) {
        content = content.replace(target, target + '\n' + scriptTags);
        fs.writeFileSync(p, content);
        console.log('Injected ' + filename);
    }
}

injectScripts('packages.html', '    <script src="./public/data/package-categories.js"></script>\n    <script src="./public/data/packages.js"></script>');
injectScripts('blood-tests.html', '    <script src="./public/data/health-tests.js"></script>');
