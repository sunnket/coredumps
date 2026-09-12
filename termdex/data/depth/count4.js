const fs = require('fs');
const path = require('path');

const mainDir = 'c:/Users/aryan/OneDrive/Desktop/New folder (3)/termdex/data';
const depthDir = path.join(mainDir, 'depth');

// Get all depth slugs
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

// Get terms from each main file and check missing
const mainFiles = fs.readdirSync(mainDir).filter(f => /^\d+.*\.js$/.test(f)).sort();
let totalMissing = 0;

mainFiles.forEach(f => {
  const c = fs.readFileSync(path.join(mainDir, f), 'utf8');
  const m = c.match(/\bt:"([^"]+)"/g) || [];
  const terms = m.map(s => s.match(/"([^"]+)"/)[1]);
  const missing = terms.filter(t => !depthSlugs.has(toSlug(t)));
  
  if (missing.length > 0) {
    console.log('\n=== ' + f + ' (' + missing.length + '/' + terms.length + ' missing) ===');
    missing.forEach(t => console.log('  ' + t));
    totalMissing += missing.length;
  }
});

console.log('\n\nTOTAL MISSING: ' + totalMissing);
