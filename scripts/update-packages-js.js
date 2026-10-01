const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, '..', 'src', 'packages.js');
let content = fs.readFileSync(filepath, 'utf8');

const regex = /function openPackageModal\(id\) \{[\s\S]*?modal\.setAttribute\('aria-hidden', 'false'\);\s*\}/;

const replacement = `function openPackageModal(id) {
    var pkg = _packages.find(function(p) { return p.id === id; });
    if (!pkg) return;
    window.location.href = 'package-details/' + pkg.id + '.html';
  }`;

if (regex.test(content)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filepath, content);
    console.log("Successfully replaced openPackageModal in packages.js");
} else {
    console.log("Could not find openPackageModal");
}
