const fs = require('fs');
const path = require('path');

const mainDir = 'c:/Users/aryan/OneDrive/Desktop/New folder (3)/termdex/data';
const depthDir = path.join(mainDir, 'depth');

const depthFiles = fs.readdirSync(depthDir).filter(f => f.endsWith('.js') && !f.startsWith('count')).sort();
const depthSlugs = new Set();
depthFiles.forEach(f => {
  const c = fs.readFileSync(path.join(depthDir, f), 'utf8');
  const m = c.match(/slug:\s*"([^"]+)"/g) || [];
  m.forEach(s => depthSlugs.add(s.match(/"([^"]+)"/)[1]));
});

function toSlug(name) {
  return name.toLowerCase()
    .replace(/['']/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Files 01, 02, 03, 04
[
  '01-programming-languages.js',
  '02-databases.js', 
  '03-ai-ml-core.js',
  '04-deep-learning.js',
  '05-genai-llm.js'
].forEach(f => {
  const c = fs.readFileSync(path.join(mainDir, f), 'utf8');
  const m = c.match(/\bt:"([^"]+)"/g) || [];
  const terms = m.map(s => s.match(/"([^"]+)"/)[1]);
  const missing = terms.filter(t => !depthSlugs.has(toSlug(t)));
  console.log('\n=== ' + f + ' ===');
  missing.forEach((t, i) => console.log((i+1) + '. ' + t + ' -> ' + toSlug(t)));
});
