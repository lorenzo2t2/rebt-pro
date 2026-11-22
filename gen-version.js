// Genera app/version.json con el hash de cada archivo (excepto sw.js y el propio manifest).
// Uso: node gen-version.js 1.2.0
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.join(__dirname, 'app');
const version = process.argv[2] || JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8')).version;
const prev = JSON.parse(fs.readFileSync(path.join(root, 'version.json'), 'utf8'));
const files = {};
(function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f), rel = path.relative(root, p).split(path.sep).join('/');
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (rel !== 'version.json' && rel !== 'sw.js') files[rel] = crypto.createHash('sha1').update(fs.readFileSync(p)).digest('hex').slice(0, 12);
  }
})(root);
fs.writeFileSync(path.join(root, 'version.json'), JSON.stringify({ version, minApk: prev.minApk, files }, null, 1) + '\n');
console.log('version.json ->', version, Object.keys(files).length, 'archivos');
