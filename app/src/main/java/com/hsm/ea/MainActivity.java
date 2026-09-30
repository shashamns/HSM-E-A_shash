package com.hsm.ea;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ContentValues;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.core.content.FileProvider;
import androidx.webkit.WebViewAssetLoader;

import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;

public class MainActivity extends Activity {

    private static final String APP_HOST = "appassets.androidplatform.net";
    private static final String START_URL = "https://" + APP_HOST + "/assets/www/index.html";
    private static final int PICK_FILE = 41;

    private WebView webView;
    private ValueCallback<Uri[]> fileCallback;

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .setDomain(APP_HOST)
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(this))
                .build();

        // No remote debugging / inspection of the app's pages
        WebView.setWebContentsDebuggingEnabled(false);

        webView = new WebView(this);
        WebSettings s = webView.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(false);
        s.setTextZoom(100);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                Uri uri = request.getUrl();
                if (APP_HOST.equals(uri.getHost())) return false;
                openExternal(uri);
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            // <input type="file"> support (uploading SOP documents)
            @Override
            public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                if (fileCallback != null) fileCallback.onReceiveValue(null);
                fileCallback = callback;
                try {
                    startActivityForResult(params.createIntent(), PICK_FILE);
                } catch (Exception e) {
                    fileCallback = null;
                    return false;
                }
                return true;
            }
        });

        webView.addJavascriptInterface(new NativeBridge(), "HSMNative");
        setContentView(webView);

        if (savedInstanceState != null) webView.restoreState(savedInstanceState);
        else webView.loadUrl(START_URL);
    }

    private void openExternal(Uri uri) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (Exception e) {
            Toast.makeText(this, "No app found to open this", Toast.LENGTH_SHORT).show();
        }
    }

    /** Called from the web app: window.HSMNative.* */
    class NativeBridge {
        /** Saves a file to Downloads/HSM EA and optionally opens the share sheet (Gmail, Outlook, WhatsApp…). */
        @JavascriptInterface
        public String saveFile(String base64, String fileName, String mime, boolean share) {
            try {
                byte[] data = Base64.decode(base64, Base64.DEFAULT);
                String safe = fileName.replaceAll("[\\\\/:*?\"<>|]", "_");

                // 1) Copy in Downloads so it can be found later
                String savedWhere;
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentValues v = new ContentValues();
                    v.put(MediaStore.MediaColumns.DISPLAY_NAME, safe);
                    v.put(MediaStore.MediaColumns.MIME_TYPE, mime);
                    v.put(MediaStore.MediaColumns.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/HSM EA");
                    Uri u = getContentResolver().insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, v);
                    try (OutputStream os = getContentResolver().openOutputStream(u)) { os.write(data); }
                    savedWhere = "Downloads/HSM EA";
                } else {
                    File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DOWNLOADS), "HSM EA");
                    File out;
                    try {
                        dir.mkdirs();
                        out = new File(dir, safe);
                        try (FileOutputStream fo = new FileOutputStream(out)) { fo.write(data); }
                        savedWhere = "Downloads/HSM EA";
                    } catch (Exception e) {
                        File d2 = getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                        out = new File(d2, safe);
                        try (FileOutputStream fo = new FileOutputStream(out)) { fo.write(data); }
                        savedWhere = out.getParent();
                    }
                }

                // 2) Share sheet (attach to mail)
                if (share) {
                    File dir = new File(getCacheDir(), "exports");
                    dir.mkdirs();
                    File f = new File(dir, safe);
                    try (FileOutputStream fo = new FileOutputStream(f)) { fo.write(data); }
                    final Uri uri = FileProvider.getUriForFile(MainActivity.this, "com.hsm.ea.files", f);
                    final Intent send = new Intent(Intent.ACTION_SEND);
                    send.setType(mime);
                    send.putExtra(Intent.EXTRA_STREAM, uri);
                    send.putExtra(Intent.EXTRA_SUBJECT, safe.replaceAll("\\.xlsx$", ""));
                    send.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    runOnUiThread(() -> startActivity(Intent.createChooser(send, "Send " + safe)));
                }
                return "ok:" + savedWhere;
            } catch (Exception e) {
                return "error:" + e.getMessage();
            }
        }

        /** Stable per-phone id (same across app updates signed with the same key). */
        @JavascriptInterface
        public String deviceId() {
            String id = Settings.Secure.getString(getContentResolver(), Settings.Secure.ANDROID_ID);
            return id == null ? "" : "and-" + id;
        }

        @JavascriptInterface
        public String deviceName() {
            String m = Build.MANUFACTURER == null ? "" : Build.MANUFACTURER;
            String model = Build.MODEL == null ? "" : Build.MODEL;
            String n = model.toLowerCase().startsWith(m.toLowerCase()) ? model : (m + " " + model);
            return n.substring(0, 1).toUpperCase() + n.substring(1) + " (Android " + Build.VERSION.RELEASE + ")";
        }

        @JavascriptInterface
        public void openUrl(String url) {
            runOnUiThread(() -> openExternal(Uri.parse(url)));
        }

        @JavascriptInterface
        public void email(String to, String subject, String body) {
            Intent i = new Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:"));
            i.putExtra(Intent.EXTRA_EMAIL, new String[]{to});
            i.putExtra(Intent.EXTRA_SUBJECT, subject);
            i.putExtra(Intent.EXTRA_TEXT, body);
            runOnUiThread(() -> {
                try { startActivity(i); }
                catch (Exception e) { Toast.makeText(MainActivity.this, "No email app found", Toast.LENGTH_SHORT).show(); }
            });
        }
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == PICK_FILE && fileCallback != null) {
            fileCallback.onReceiveValue(WebChromeClient.FileChooserParams.parseResult(resultCode, data));
            fileCallback = null;
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        webView.saveState(outState);
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        webView.evaluateJavascript("(window.hsmBack && window.hsmBack()) ? 'y' : 'n'", value -> {
            if (value == null || !value.contains("y")) MainActivity.super.onBackPressed();
        });
    }
}
