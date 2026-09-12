const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'data', 'guides.js');
let c = fs.readFileSync(filePath, 'utf8');

c = c.replace(
  '"git add .gitattributes && git commit -m \\"chore: configure Git LFS tracking\\""',
  '{ win: "git add .gitattributes; git commit -m \\"chore: configure Git LFS tracking\\"", mac: "git add .gitattributes && git commit -m \\"chore: configure Git LFS tracking\\"" }'
);

c = c.replace(
  '"git add model.onnx && git commit -m \\"feat: add quantized speech recognition model\\""',
  '{ win: "git add model.onnx; git commit -m \\"feat: add quantized speech recognition model\\"", mac: "git add model.onnx && git commit -m \\"feat: add quantized speech recognition model\\"" }'
);

c = c.replace(
  /id:\s*"model-serve"([\s\S]*?)do:\s*"Test it\."/,
  (m, g1) => 'id: "model-serve"' + g1 + 'do: "Send a test inference request using curl to verify model predictions."'
);

fs.writeFileSync(filePath, c, 'utf8');
console.log('Fixed remaining 3 items!');
