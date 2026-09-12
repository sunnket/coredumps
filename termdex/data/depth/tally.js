const fs = require('fs');
const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js') && !f.startsWith('count') && !f.startsWith('missing') && f !== 'tally.js');
let total = 0;
const newFiles = ['50-languages-2.js','51-languages-3.js','52-languages-4.js','53-db-foundations.js','54-db-keys-joins.js','55-db-schema-nosql.js','56-db-nosql-perf.js'];
let newTotal = 0;
files.forEach(f => {
  const c = fs.readFileSync(require('path').join(dir, f), 'utf8');
  const s = (c.match(/slug:\s*"/g) || []);
  total += s.length;
  if (newFiles.includes(f)) {
    newTotal += s.length;
    console.log(`  ${f}: ${s.length} terms`);
  }
});
console.log(`\nNew terms this session: ${newTotal}`);
console.log(`Total depth terms: ${total}`);
