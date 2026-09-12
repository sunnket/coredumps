const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && f !== 'count_terms.js').sort();
let total = 0;
const allSlugs = [];

files.forEach(f => {
  const c = fs.readFileSync(path.join(dir, f), 'utf8');
  const m = c.match(/slug:\s*"([^"]+)"/g) || [];
  const slugs = m.map(s => s.match(/"([^"]+)"/)[1]);
  total += slugs.length;
  allSlugs.push(...slugs);
  console.log(f + ': ' + slugs.length + ' => ' + slugs.join(', '));
});

console.log('\nTOTAL DEPTH TERMS: ' + total);

// Now count terms in main data files
const mainDir = dir.replace(/[\\/]depth$/, '');
const mainFiles = fs.readdirSync(mainDir).filter(f => /^\d+.*\.js$/.test(f)).sort();
let mainTotal = 0;
const mainSlugs = [];

mainFiles.forEach(f => {
  const c = fs.readFileSync(path.join(mainDir, f), 'utf8');
  const m = c.match(/slug:\s*"([^"]+)"/g) || [];
  const slugs = m.map(s => s.match(/"([^"]+)"/)[1]);
  mainTotal += slugs.length;
  mainSlugs.push(...slugs);
});

console.log('\nTOTAL MAIN TERMS: ' + mainTotal);

// Find terms that are in main but NOT in depth
const depthSet = new Set(allSlugs);
const missing = mainSlugs.filter(s => !depthSet.has(s));
console.log('\nMISSING FROM DEPTH (' + missing.length + '):');
missing.forEach(s => console.log('  ' + s));
