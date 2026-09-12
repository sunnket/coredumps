const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, 'termdex');
const dataDir = path.join(root, 'data');

// Helper to safely read file
function readFile(relPath) {
  const fullPath = path.join(root, relPath);
  return `/* ${relPath} */\n` + fs.readFileSync(fullPath, 'utf8') + '\n';
}

// 1. Core Encyclopedia Bundle (~4.5MB uncompressed, ~750KB gzipped)
const coreFiles = [];
// categories first
coreFiles.push('data/categories.js');
// 33 topic files
for (let i = 1; i <= 33; i++) {
  const prefix = String(i).padStart(2, '0');
  const found = fs.readdirSync(dataDir).find(f => f.startsWith(prefix + '-') && f.endsWith('.js'));
  if (found) coreFiles.push(`data/${found}`);
}

// Subdirectories needed for full catalog
const subdirs = ['journeys', 'careers', 'logic', 'speed', 'research', 'code', 'studies', 'projects', 'interviews'];
for (const sub of subdirs) {
  const dirPath = path.join(dataDir, sub);
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.js')).sort();
    for (const f of files) {
      coreFiles.push(`data/${sub}/${f}`);
    }
  }
}

const coreContent = coreFiles.map(readFile).join('\n');
const coreBundlePath = path.join(dataDir, 'core.bundle.js');
fs.writeFileSync(coreBundlePath, coreContent, 'utf8');
console.log(`core.bundle.js: ${(coreContent.length / 1024 / 1024).toFixed(2)} MB (${coreFiles.length} files)`);
new vm.Script(coreContent, { filename: 'core.bundle.js' });

// 2. Learn Bundle (~5.4MB uncompressed, ~900KB gzipped)
const learnFiles = [];
function walkDir(dir, relPrefix) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    const rel = `${relPrefix}/${ent.name}`;
    if (ent.isDirectory()) {
      walkDir(full, rel);
    } else if (ent.name.endsWith('.js')) {
      learnFiles.push(rel);
    }
  }
}
walkDir(path.join(dataDir, 'learn'), 'data/learn');
learnFiles.sort();
const learnContent = learnFiles.map(readFile).join('\n');
const learnBundlePath = path.join(dataDir, 'learn.bundle.js');
fs.writeFileSync(learnBundlePath, learnContent, 'utf8');
console.log(`learn.bundle.js: ${(learnContent.length / 1024 / 1024).toFixed(2)} MB (${learnFiles.length} files)`);
new vm.Script(learnContent, { filename: 'learn.bundle.js' });

// 3. Depth Bundle (~8.1MB uncompressed, ~1.3MB gzipped)
const depthFiles = fs.readdirSync(path.join(dataDir, 'depth'))
  .filter(f => /^\d+.*\.js$/.test(f))
  .sort()
  .map(f => `data/depth/${f}`);
const depthContent = depthFiles.map(readFile).join('\n');
const depthBundlePath = path.join(dataDir, 'depth.bundle.js');
fs.writeFileSync(depthBundlePath, depthContent, 'utf8');
console.log(`depth.bundle.js: ${(depthContent.length / 1024 / 1024).toFixed(2)} MB (${depthFiles.length} files)`);
new vm.Script(depthContent, { filename: 'depth.bundle.js' });

// 4. Extras & Guides Bundle (~1.8MB uncompressed, ~250KB gzipped)
const extraFiles = [];
if (fs.existsSync(path.join(dataDir, 'guides.js'))) extraFiles.push('data/guides.js');
if (fs.existsSync(path.join(dataDir, 'extras'))) {
  const extras = fs.readdirSync(path.join(dataDir, 'extras')).filter(f => f.endsWith('.js')).sort();
  for (const f of extras) extraFiles.push(`data/extras/${f}`);
}
const extrasContent = extraFiles.map(readFile).join('\n');
const extrasBundlePath = path.join(dataDir, 'extras.bundle.js');
fs.writeFileSync(extrasBundlePath, extrasContent, 'utf8');
console.log(`extras.bundle.js: ${(extrasContent.length / 1024 / 1024).toFixed(2)} MB (${extraFiles.length} files)`);
new vm.Script(extrasContent, { filename: 'extras.bundle.js' });

console.log('All 4 bundles created and verified successfully!');
