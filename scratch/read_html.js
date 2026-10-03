const fs = require('fs');
const html = fs.readFileSync('D:/FF/Smear/blood-tests.html', 'utf8');
const lines = html.split('\n');
const idx = lines.findIndex(l => l.includes('modal-price'));
if (idx !== -1) {
  console.log(lines.slice(Math.max(0, idx - 10), idx + 10).join('\n'));
} else {
  console.log('not found');
}
