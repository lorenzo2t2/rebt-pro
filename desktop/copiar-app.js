const fs = require('fs'), path = require('path');
const src = path.join(__dirname, '..', 'app'), dst = path.join(__dirname, 'app');
fs.rmSync(dst, { recursive: true, force: true });
fs.cpSync(src, dst, { recursive: true });
console.log('app copiada');
