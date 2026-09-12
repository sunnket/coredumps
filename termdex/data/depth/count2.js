const fs = require('fs');
const path = require('path');

// Count main data file terms (they use t:"Name" format)
const mainDir = 'c:/Users/aryan/OneDrive/Desktop/New folder (3)/termdex/data';
const mainFiles = fs.readdirSync(mainDir).filter(f => /^\d+.*\.js$/.test(f)).sort();
let mainTotal = 0;
const mainTerms = [];

mainFiles.forEach(f => {
  const c = fs.readFileSync(path.join(mainDir, f), 'utf8');
  // Match t:"Name" pattern for term titles
  const m = c.match(/\bt:"([^"]+)"/g) || [];
  const terms = m.map(s => s.match(/"([^"]+)"/)[1]);
  mainTotal += terms.length;
  terms.forEach(t => mainTerms.push({ name: t, file: f }));
  console.log(f + ': ' + terms.length + ' terms');
});

console.log('\nTOTAL MAIN TERMS: ' + mainTotal);

// Count depth terms (they use slug:"name" format)
const depthDir = path.join(mainDir, 'depth');
const depthFiles = fs.readdirSync(depthDir).filter(f => f.endsWith('.js') && !f.startsWith('count')).sort();
let depthTotal = 0;
const depthSlugs = new Set();

depthFiles.forEach(f => {
  const c = fs.readFileSync(path.join(depthDir, f), 'utf8');
  const m = c.match(/slug:\s*"([^"]+)"/g) || [];
  const slugs = m.map(s => s.match(/"([^"]+)"/)[1]);
  depthTotal += slugs.length;
  slugs.forEach(s => depthSlugs.add(s));
});

console.log('TOTAL DEPTH TERMS: ' + depthTotal);

// Convert term name to slug format for comparison
function toSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Find missing
const missing = mainTerms.filter(t => !depthSlugs.has(toSlug(t.name)));
console.log('\nMISSING FROM DEPTH (' + missing.length + '):');
missing.forEach(t => console.log('  [' + t.file + '] ' + t.name + ' (slug: ' + toSlug(t.name) + ')'));
