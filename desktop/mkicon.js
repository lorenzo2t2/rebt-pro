// icono .ico (PNG 256) generado desde cero sin dependencias
const fs = require('fs'), zlib = require('zlib');
const N = 256, px = Buffer.alloc(N * N * 4);
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
  const i = (y * N + x) * 4, dx = x - 128, dy = y - 128, inR = Math.abs(dx) < 112 && Math.abs(dy) < 112 && (Math.abs(dx) ** 4 + Math.abs(dy) ** 4) < 112 ** 4 * 1.0;
  let c = [0, 0, 0, 0];
  if (inR) { const t = (x + y) / 512; c = [Math.round(217 + (180 - 217) * t), Math.round(119 + (83 - 119) * t), Math.round(6 + (9 - 6) * t), 255]; }
  // rayo
  const poly = [[140, 30], [70, 140], [118, 140], [100, 226], [190, 104], [140, 104], [160, 30]];
  let ins = false; for (let a = 0, b = poly.length - 1; a < poly.length; b = a++) { const [xi, yi] = poly[a], [xj, yj] = poly[b]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) ins = !ins; }
  if (inR && ins) c = [255, 255, 255, 255];
  px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2]; px[i + 3] = c[3];
}
const raw = Buffer.alloc((N * 4 + 1) * N); for (let y = 0; y < N; y++) { raw[y * (N * 4 + 1)] = 0; px.copy(raw, y * (N * 4 + 1) + 1, y * N * 4, (y + 1) * N * 4); }
const crcT = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; return c; });
const crc = b => { let c = -1; for (const v of b) c = crcT[(c ^ v) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
const chunk = (t, d) => { const l = Buffer.alloc(4); l.writeUInt32BE(d.length); const td = Buffer.concat([Buffer.from(t), d]); const c = Buffer.alloc(4); c.writeUInt32BE(crc(td)); return Buffer.concat([l, td, c]); };
const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(N, 0); ihdr.writeUInt32BE(N, 4); ihdr[8] = 8; ihdr[9] = 6;
const png = Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
const hd = Buffer.alloc(22); hd.writeUInt16LE(0, 0); hd.writeUInt16LE(1, 2); hd.writeUInt16LE(1, 4); hd[6] = 0; hd[7] = 0; hd.writeUInt16LE(1, 10); hd.writeUInt16LE(32, 12); hd.writeUInt32LE(png.length, 14); hd.writeUInt32LE(22, 18);
fs.writeFileSync(__dirname + '/icon.ico', Buffer.concat([hd, png])); fs.writeFileSync(__dirname + '/icon.png', png); console.log('icono ok');
