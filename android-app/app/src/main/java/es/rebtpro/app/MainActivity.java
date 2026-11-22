package es.rebtpro.app;

import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.print.PrintAttributes;
import android.print.PrintManager;
import android.provider.MediaStore;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.MimeTypeMap;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.OutputStream;

/** Contenedor mínimo: sirve los ficheros de assets/ desde https://rebt.local/ (sin red). */
public class MainActivity extends Activity {
    private static final String HOST = "rebt.local";
    private WebView web;

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        limpiarOta();
        web = new WebView(this);
        setContentView(web);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        web.addJavascriptInterface(new Bridge(), "AndroidBridge");
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if (!HOST.equals(u.getHost())) return null;
                String p = u.getPath();
                if (p == null || p.equals("/")) p = "/index.html";
                try {
                    String rel = p.substring(1);
                    File of = new File(new File(getFilesDir(), "ota"), rel);
                    InputStream in = (okPath(rel) && of.isFile()) ? new FileInputStream(of) : getAssets().open(rel);
                    String ext = MimeTypeMap.getFileExtensionFromUrl(p);
                    String mime = "txt".equals(ext) ? "text/plain" : "webmanifest".equals(ext) ? "application/manifest+json" : "js".equals(ext) ? "text/javascript" : MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
                    return new WebResourceResponse(mime == null ? "application/octet-stream" : mime, "UTF-8", in);
                } catch (Exception e) {
                    return new WebResourceResponse("text/plain", "UTF-8", 404, "No encontrado", null, null);
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView v, WebResourceRequest r) {
                Uri u = r.getUrl();
                if (HOST.equals(u.getHost())) return false;
                try { startActivity(new Intent(Intent.ACTION_VIEW, u)); } catch (Exception ignored) { }
                return true;
            }
        });
        if (b != null) web.restoreState(b); else web.loadUrl("https://" + HOST + "/index.html");
    }

    @Override
    protected void onSaveInstanceState(Bundle o) { super.onSaveInstanceState(o); web.saveState(o); }

    @Override
    public void onBackPressed() {
        web.evaluateJavascript("(function(){var h=location.hash||'#/';if(h==='#/'||h==='')return 'salir';history.back();return 'atras'})()", v -> {
            if (v != null && v.contains("salir")) finish();
        });
    }

    private static boolean okPath(String p) {
        return p != null && p.matches("[A-Za-z0-9_][A-Za-z0-9_./-]*") && !p.contains("..");
    }

    private int apkCode() {
        try { return (int) getPackageManager().getPackageInfo(getPackageName(), 0).getLongVersionCode(); } catch (Exception e) { return 0; }
    }

    private static void borrar(File f) {
        File[] k = f.listFiles();
        if (k != null) for (File c : k) borrar(c);
        f.delete();
    }

    /** Si la APK es otra versión que la que guardó las actualizaciones, se descartan. */
    private void limpiarOta() {
        try {
            File mark = new File(getFilesDir(), "ota_apk");
            String cur = String.valueOf(apkCode());
            String old = mark.isFile() ? new String(java.nio.file.Files.readAllBytes(mark.toPath())).trim() : "";
            if (!cur.equals(old)) {
                borrar(new File(getFilesDir(), "ota"));
                borrar(new File(getFilesDir(), "ota_tmp"));
                java.nio.file.Files.write(mark.toPath(), cur.getBytes());
            }
        } catch (Exception ignored) { }
    }

    class Bridge {
        @JavascriptInterface
        public int apkCode() { return MainActivity.this.apkCode(); }

        @JavascriptInterface
        public void otaPut(String path, String base64) {
            try {
                if (!okPath(path)) return;
                File f = new File(new File(getFilesDir(), "ota_tmp"), path);
                f.getParentFile().mkdirs();
                try (OutputStream o = new java.io.FileOutputStream(f)) { o.write(Base64.decode(base64, Base64.DEFAULT)); }
            } catch (Exception ignored) { }
        }

        @JavascriptInterface
        public boolean otaCommit() {
            try {
                File tmp = new File(getFilesDir(), "ota_tmp"), dst = new File(getFilesDir(), "ota");
                copiar(tmp, dst);
                borrar(tmp);
                return true;
            } catch (Exception e) { return false; }
        }

        private void copiar(File a, File b) throws Exception {
            if (a.isDirectory()) {
                b.mkdirs();
                File[] k = a.listFiles();
                if (k != null) for (File c : k) copiar(c, new File(b, c.getName()));
            } else {
                java.nio.file.Files.copy(a.toPath(), b.toPath(), java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            }
        }

        @JavascriptInterface
        public void save(String name, String mime, String base64) {
            try {
                byte[] data = Base64.decode(base64, Base64.DEFAULT);
                ContentValues cv = new ContentValues();
                cv.put(MediaStore.MediaColumns.DISPLAY_NAME, name);
                cv.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                if (Build.VERSION.SDK_INT >= 29) cv.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS);
                Uri uri = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, cv);
                try (OutputStream o = getContentResolver().openOutputStream(uri)) { o.write(data); }
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "Guardado en Descargas: " + name, Toast.LENGTH_LONG).show());
            } catch (Exception e) {
                runOnUiThread(() -> Toast.makeText(MainActivity.this, "No se pudo guardar el archivo", Toast.LENGTH_LONG).show());
            }
        }

        @JavascriptInterface
        public void print(String title) {
            runOnUiThread(() -> {
                PrintManager pm = (PrintManager) getSystemService(PRINT_SERVICE);
                String t = (title == null || title.isEmpty()) ? "REBT Pro" : title;
                pm.print(t, web.createPrintDocumentAdapter(t), new PrintAttributes.Builder().build());
            });
        }
    }
}
