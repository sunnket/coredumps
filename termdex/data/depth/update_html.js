const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Find all existing depth script tags in index.html
const existingMatches = [...html.matchAll(/<script src="data\/depth\/(\d+[^"]+\.js)"><\/script>/g)];
if (existingMatches.length === 0) {
  console.error('No depth script tags found in index.html');
  process.exit(1);
}

// Find the last depth script tag currently present
const lastMatch = existingMatches[existingMatches.length - 1];
const lastFile = lastMatch[1];
const targetTag = lastMatch[0];

const allFiles = fs.readdirSync(__dirname)
  .filter(f => /^\d+.*\.js$/.test(f))
  .sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

const missingFiles = allFiles.filter(f => !html.includes(`data/depth/${f}`));

if (missingFiles.length > 0) {
  const tags = missingFiles.map(f => `  <script src="data/depth/${f}"></script>`).join('\n');
  html = html.replace(targetTag, targetTag + '\n' + tags);
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log(`Successfully inserted ${missingFiles.length} script tags into index.html after ${lastFile}:`, missingFiles);
} else {
  console.log('All depth scripts already present in index.html');
}
