const fs = require('fs');
const path = require('path');
const vm = require('vm');

const indexPath = path.join(__dirname, 'termdex', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

// Find all data scripts in index.html
const scriptRegex = /<script src="(data\/[^"]+)"><\/script>\r?\n?/g;
let match;
const dataScripts = [];

while ((match = scriptRegex.exec(html)) !== null) {
  dataScripts.push(match[1]);
}

console.log(`Found ${dataScripts.length} data scripts.`);

if (dataScripts.length === 0) {
  console.log('No data scripts to bundle (may already be bundled).');
  process.exit(0);
}

const chunks = [];
for (const relPath of dataScripts) {
  const fullPath = path.join(__dirname, 'termdex', relPath);
  const code = fs.readFileSync(fullPath, 'utf8');
  chunks.push(`/* ${relPath} */\n${code}\n`);
}

const bundled = chunks.join('\n');
const bundlePath = path.join(__dirname, 'termdex', 'data', 'bundle.js');
fs.writeFileSync(bundlePath, bundled, 'utf8');
console.log(`Wrote ${bundlePath} (${(bundled.length / 1024 / 1024).toFixed(2)} MB).`);

// Validate bundle syntax
try {
  new vm.Script(bundled, { filename: 'data/bundle.js' });
  console.log('Bundle syntax validation PASSED!');
} catch (e) {
  console.error('Syntax error in bundle:', e.message);
  process.exit(1);
}

// Replace the 550 script tags in index.html with single script tag
const firstScriptTag = `<script src="${dataScripts[0]}"></script>`;
const firstIndex = html.indexOf(firstScriptTag);
const lastScriptTag = `<script src="${dataScripts[dataScripts.length - 1]}"></script>`;
const lastIndex = html.indexOf(lastScriptTag) + lastScriptTag.length;

if (firstIndex !== -1 && lastIndex !== -1) {
  const newHtml = html.slice(0, firstIndex) +
    '<script src="data/bundle.js"></script>' +
    html.slice(lastIndex);
  fs.writeFileSync(indexPath, newHtml, 'utf8');
  console.log('Updated index.html: replaced 550 script tags with <script src="data/bundle.js"></script>');
} else {
  console.error('Could not find slice range in index.html');
  process.exit(1);
}
