const fs = require('fs');
const path = require('path');

const mainDir = 'c:/Users/aryan/OneDrive/Desktop/New folder (3)/termdex/data';
const mainFiles = fs.readdirSync(mainDir).filter(f => /^\d+.*\.js$/.test(f)).sort();
let mainTotal = 0;

mainFiles.forEach(f => {
  const c = fs.readFileSync(path.join(mainDir, f), 'utf8');
  const m = c.match(/\bt:"([^"]+)"/g) || [];
  mainTotal += m.length;
});

const depthDir = path.join(mainDir, 'depth');
const depthFiles = fs.readdirSync(depthDir).filter(f => f.endsWith('.js') && !f.startsWith('count')).sort();
let depthTotal = 0;

depthFiles.forEach(f => {
  const c = fs.readFileSync(path.join(depthDir, f), 'utf8');
  const m = c.match(/slug:\s*"([^"]+)"/g) || [];
  depthTotal += m.length;
});

// Also count the categories and number terms from the numbered files in the first 18 (non crash-course)
const coreFiles = mainFiles.filter(f => parseInt(f) <= 18);
let coreTerms = 0;
const coreNames = [];
coreFiles.forEach(f => {
  const c = fs.readFileSync(path.join(mainDir, f), 'utf8');
  const m = c.match(/\bt:"([^"]+)"/g) || [];
  coreTerms += m.length;
  m.forEach(match => coreNames.push(match.match(/"([^"]+)"/)[1]));
});

console.log('Main terms (all files): ' + mainTotal);
console.log('Core terms (files 01-18): ' + coreTerms);
console.log('Depth terms written: ' + depthTotal);
console.log('Still need depth: ' + (mainTotal - depthTotal));
