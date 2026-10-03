const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== '.next' && f !== '.git') {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

const replacements = [
  ['Karigar Everyday Apparel & Goods Pvt. Ltd.', 'Whole/retail Name Pvt. Ltd.'],
  ['KARIGAR & CO.', 'WHOLE/RETAIL NAME'],
  ['Karigar & Co.', 'Whole/retail Name'],
  ['Karigar Studio', 'Whole/retail Name Studio'],
  ['Karigar', 'Whole/retail Name'],
];

function processFile(filePath) {
  if (
    !filePath.endsWith('.ts') &&
    !filePath.endsWith('.tsx') &&
    !filePath.endsWith('.json') &&
    !filePath.endsWith('.md')
  ) {
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = content;
  for (const [search, replace] of replacements) {
    updated = updated.split(search).join(replace);
  }
  if (updated !== content) {
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log('Updated business name in:', filePath);
  }
}

walkDir(path.join(process.cwd(), 'src'), processFile);
if (fs.existsSync(path.join(process.cwd(), 'data.json'))) {
  processFile(path.join(process.cwd(), 'data.json'));
}
if (fs.existsSync(path.join(process.cwd(), 'docs'))) {
  walkDir(path.join(process.cwd(), 'docs'), processFile);
}
console.log('Business name update complete!');
