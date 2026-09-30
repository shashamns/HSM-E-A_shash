# Keep the methods the web app calls through window.HSMNative
-keepattributes JavascriptInterface
-keepclassmembers class com.hsm.ea.MainActivity$NativeBridge {
    @android.webkit.JavascriptInterface <methods>;
}
