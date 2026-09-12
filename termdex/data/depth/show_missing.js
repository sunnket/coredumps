const fs = require('fs');
const path = require('path');

const fileArg = process.argv[2] || '02-databases.js';
const mainDir = 'c:/Users/aryan/OneDrive/Desktop/New folder (3)/termdex/data';
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

const c = fs.readFileSync(path.join(mainDir, fileArg), 'utf8');
const m = c.match(/\bt:"([^"]+)"/g) || [];
const terms = m.map(s => s.match(/"([^"]+)"/)[1]);
const missing = terms.filter(t => !depthSlugs.has(toSlug(t)));

console.log(`${fileArg} missing (${missing.length} / ${terms.length}):`);
missing.forEach(t => console.log(`  "${t}" -> slug: "${toSlug(t)}"`));
