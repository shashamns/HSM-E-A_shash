# Keep the methods the web app calls through window.HSMNative
-keepattributes JavascriptInterface
-keepclassmembers class com.hsm.ea.MainActivity$NativeBridge {
    @android.webkit.JavascriptInterface <methods>;
}
-keep class com.hsm.ea.NotifyWorker { public <init>(android.content.Context, androidx.work.WorkerParameters); }
