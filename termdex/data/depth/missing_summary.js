const fs = require('fs');
const path = require('path');

const mainDir = 'c:/Users/aryan/OneDrive/Desktop/New folder (3)/termdex/data';
const mainFiles = fs.readdirSync(mainDir).filter(f => /^\d+.*\.js$/.test(f)).sort();
const depthDir = path.join(mainDir, 'depth');
const depthFiles = fs.readdirSync(depthDir).filter(f => f.endsWith('.js') && !f.startsWith('count') && !f.startsWith('missing') && f !== 'tally.js').sort();

const depthSlugs = new Set();
depthFiles.forEach(f => {
  const c = fs.readFileSync(path.join(depthDir, f), 'utf8');
  const m = c.match(/slug:\s*"([^"]+)"/g) || [];
  m.forEach(s => {
    const slugMatch = s.match(/"([^"]+)"/);
    if (slugMatch) depthSlugs.add(slugMatch[1]);
  });
});

function toSlug(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

let totalMain = 0;
let totalMissing = 0;

mainFiles.forEach(f => {
  const c = fs.readFileSync(path.join(mainDir, f), 'utf8');
  const m = c.match(/\bt:"([^"]+)"/g) || [];
  const terms = m.map(s => s.match(/"([^"]+)"/)[1]);
  totalMain += terms.length;
  const missing = terms.filter(t => !depthSlugs.has(toSlug(t)));
  totalMissing += missing.length;
  if (missing.length > 0) {
    console.log(`${f}: ${missing.length} missing out of ${terms.length}`);
  } else {
    console.log(`${f}: 0 missing (DONE)`);
  }
});

console.log(`\nTotal Main: ${totalMain}, Total Depth: ${depthSlugs.size}, Total Missing: ${totalMissing}`);
