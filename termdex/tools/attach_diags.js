const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, '..', 'data', 'guides.js');
let content = fs.readFileSync(file, 'utf8');

const replacements = [
  ['id: "push-from-antigravity",\n      t:', 'id: "push-from-antigravity",\n      diag: "git",\n      t:'],
  ['id: "push-from-vscode",\n      t:', 'id: "push-from-vscode",\n      diag: "vscode",\n      t:'],
  ['id: "push-terminal-deep",\n      t:', 'id: "push-terminal-deep",\n      diag: "git",\n      t:'],
  ['id: "git-interactive-rebase",\n      t:', 'id: "git-interactive-rebase",\n      diag: "rebase",\n      t:'],
  ['id: "jwt-auth-flow",\n      t:', 'id: "jwt-auth-flow",\n      diag: "jwt",\n      t:'],
  ['id: "docker-multistage-build",\n      t:', 'id: "docker-multistage-build",\n      diag: "docker_multi",\n      t:']
];

for (const [target, replacement] of replacements) {
  if (content.includes(target)) {
    content = content.replace(target, replacement);
  } else {
    console.warn('Target not found:', target);
  }
}

fs.writeFileSync(file, content, 'utf8');
console.log('Successfully attached diags to guides!');
