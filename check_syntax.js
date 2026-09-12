const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, 'termdex', 'index.html'), 'utf8');
const scriptRegex = /<script src="([^"]+)"><\/script>/g;
let match;
let errors = 0;
let checked = 0;

while ((match = scriptRegex.exec(html)) !== null) {
  const relPath = match[1];
  const fullPath = path.join(__dirname, 'termdex', relPath);
  checked++;
  try {
    const code = fs.readFileSync(fullPath, 'utf8');
    new vm.Script(code, { filename: relPath });
  } catch (e) {
    console.error(`Syntax error in ${relPath}:`, e.message);
    errors++;
  }
}

console.log(`Checked ${checked} scripts. Total syntax errors: ${errors}`);
