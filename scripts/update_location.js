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
  [
    'Plot 42, Industrial Estate, Lower Parel, Mumbai, Maharashtra 400013',
    'Plot 14, Okhla Industrial Area Phase II, New Delhi, Delhi 110020',
  ],
  [
    'Karigar Studio Fulfilment Centre, Indiranagar, Bengaluru 560038',
    'Karigar Studio Fulfilment Centre, Connaught Place, New Delhi 110001',
  ],
  [
    '123, 12th Main Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038',
    '45, Inner Circle, Connaught Place, New Delhi, Delhi 110001',
  ],
  ['Indiranagar, Bengaluru studio', 'Connaught Place, New Delhi studio'],
  ['Indiranagar, Bengaluru', 'Connaught Place, New Delhi'],
  ['Indiranagar Studio', 'Connaught Place Studio'],
  ['Indiranagar studio', 'Connaught Place studio'],
  ['Indiranagar', 'Connaught Place'],
  ['Lower Parel, Mumbai', 'Okhla, New Delhi'],
  ['Bengaluru studio', 'New Delhi studio'],
  ['Bengaluru Studio', 'New Delhi Studio'],
  ['Bengaluru, Karnataka', 'New Delhi, Delhi'],
  ['Bengaluru', 'New Delhi'],
  ['29AABCK4829L1Z5', '07AABCK4829L1Z5'],
  ['+91 80 4123 9876', '+91 11 4123 9876'],
  ['intra_state_karnataka', 'intra_state_delhi'],
  ['BLR-INDIRANAGAR', 'DEL-CP'],
  ['BOM-PAREL', 'DEL-OKHLA'],
  ['warehouse.blr@karigarstore.in', 'warehouse.del@karigarstore.in'],
  ['HAL 2nd Stage', 'Connaught Place'],
  ['12th Main Road', 'Inner Circle'],
  ['12th Main', 'Inner Circle'],
  ['560038', '110001'],
  ['Karnataka', 'Delhi'],
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
    console.log('Updated location in:', filePath);
  }
}

walkDir(path.join(process.cwd(), 'src'), processFile);
if (fs.existsSync(path.join(process.cwd(), 'data.json'))) {
  processFile(path.join(process.cwd(), 'data.json'));
}
if (fs.existsSync(path.join(process.cwd(), 'docs'))) {
  walkDir(path.join(process.cwd(), 'docs'), processFile);
}
console.log('Location update complete!');
