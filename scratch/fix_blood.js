const fs = require('fs');
let code = fs.readFileSync('D:/FF/Smear/src/blood-tests.js', 'utf8');

const errRegex = /<div class="error-state">[\s\S]*?<\/div>/g;
const newErr = `<div class="error-state" style="padding: 40px 20px; background: #fff0f0; border: 1px solid #ffcccc; border-radius: 12px; margin-top: 40px;">
  <h3 style="color: #d32f2f; margin-bottom: 12px; font-size: 1.5rem;">Security Block: Cannot Load Data from file:///</h3>
  <p style="color: #333; margin-bottom: 16px; font-size: 1.1rem;">Modern browsers block loading JSON data files when you open the HTML directly from your computer (using the <b>file:///</b> protocol).</p>
  <p style="color: #333; font-weight: bold; font-size: 1.1rem;">To fix this, please open the website using the local server we started:</p>
  <div style="background: #fff; padding: 16px; border-radius: 8px; font-family: monospace; font-size: 1.2rem; color: #000; display: inline-block; border: 1px solid #ccc; margin-top: 10px;">
    <a href="http://localhost:8000/blood-tests.html" style="color: #2563eb; text-decoration: none;">http://localhost:8000/blood-tests.html</a>
  </div>
</div>`;
code = code.replace(errRegex, newErr);
fs.writeFileSync('D:/FF/Smear/src/blood-tests.js', code);
console.log('Fixed blood-tests.js');
