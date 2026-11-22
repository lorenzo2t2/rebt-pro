# REBT Pro · app de estudio y cálculo para instalador en baja tensión

Abrir: doble clic en `abrir-app.bat` (servidor local en http://localhost:5188).
Sin dependencias ni internet; funciona como PWA. El progreso se guarda en el navegador.

- `app/` aplicación (HTML/CSS/JS): `js/calc.js` cálculo, `temario.js`, `preguntas.js`, `docs.js`.
- `docs-oficiales/` REBT consolidado del BOE (PDF + texto `rd842.txt`).
- Tablas de ITC-BT-19 (intensidades) e ITC-BT-21 (tubos) transcritas del BOE consolidado.

## Actualizar la app
- En la app: menú **Actualizar** compara `app/version.json` con el de GitHub (rama `main`) y descarga solo los archivos cambiados.
- Publicar una versión nueva: `node gen-version.js 1.2.0`, commit y push. Para cambios nativos (Java) hay que subir también la APK a *Releases* y poner `"minApk": <versionCode>` en `version.json`.
- APK: `./compilar-apk.sh` (usa la versión de `app/version.json`).
