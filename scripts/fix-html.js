const fs = require('fs');
const path = require('path');

// Fix packages.html
const pkgPath = path.join(__dirname, '..', 'packages.html');
let pkgHtml = fs.readFileSync(pkgPath, 'utf8');
const testStart = pkgHtml.indexOf('<!-- ═══════════ INDIVIDUAL TESTS GRID');
if (testStart !== -1) {
    const testEnd = pkgHtml.indexOf('</section>', testStart) + '</section>'.length;
    pkgHtml = pkgHtml.substring(0, testStart) + pkgHtml.substring(testEnd);
    fs.writeFileSync(pkgPath, pkgHtml);
    console.log('Fixed packages.html');
}

// Fix blood-tests.html
const btPath = path.join(__dirname, '..', 'blood-tests.html');
let btHtml = fs.readFileSync(btPath, 'utf8');
const pkgStart = btHtml.indexOf('<!-- ═══════════ PACKAGES GRID');
if (pkgStart !== -1) {
    const pkgEnd = btHtml.indexOf('</section>', pkgStart) + '</section>'.length;
    btHtml = btHtml.substring(0, pkgStart) + btHtml.substring(pkgEnd);
    fs.writeFileSync(btPath, btHtml);
    console.log('Fixed blood-tests.html');
}
