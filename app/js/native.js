/* Solo actúa dentro de la app Android (WebView): guardar archivos en Descargas e imprimir. */
(function () {
  if (!window.AndroidBridge) return;
  document.documentElement.classList.add('nativa');
  window.print = function () { try { AndroidBridge.print(document.title); } catch (e) { } };
  const click = HTMLAnchorElement.prototype.click;
  HTMLAnchorElement.prototype.click = function () {
    if (this.download && this.href && this.href.indexOf('blob:') === 0) {
      const name = this.download;
      fetch(this.href).then(r => r.blob()).then(b => new Promise(res => { const f = new FileReader(); f.onload = () => res([b.type, String(f.result).split(',')[1]]); f.readAsDataURL(b); })).then(([t, d]) => AndroidBridge.save(name, t || 'application/octet-stream', d));
      return;
    }
    return click.call(this);
  };
})();
