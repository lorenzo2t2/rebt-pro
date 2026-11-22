const { app, BrowserWindow, shell, Menu } = require('electron');
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, 'app');
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8' };
function serve() {
  return new Promise(res => {
    const s = http.createServer((q, r) => {
      let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
      const f = path.normalize(path.join(root, p));
      if (!f.startsWith(root)) { r.writeHead(403); return r.end(); }
      fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); return r.end('No encontrado'); } r.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(d); });
    });
    s.listen(0, '127.0.0.1', () => res(s.address().port));
  });
}
app.whenReady().then(async () => {
  Menu.setApplicationMenu(null);
  const port = await serve();
  const w = new BrowserWindow({ width: 1280, height: 860, minWidth: 420, title: 'REBT Pro', backgroundColor: '#0b1020', autoHideMenuBar: true, webPreferences: { contextIsolation: true } });
  w.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url) && !url.startsWith('http://127.0.0.1')) shell.openExternal(url); return { action: 'deny' }; });
  w.loadURL('http://127.0.0.1:' + port + '/index.html');
});
app.on('window-all-closed', () => app.quit());
