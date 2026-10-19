package com.flow.player

import android.Manifest
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.ServiceConnection
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.view.View
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.core.view.WindowCompat
import com.flow.player.bridge.FlowNativeBridge
import com.flow.player.library.MediaStoreScanner
import com.flow.player.network.NetworkQualityManager
import com.flow.player.service.FlowMediaSessionService

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    var mediaService: FlowMediaSessionService? = null
        private set

    var networkQualityManager: NetworkQualityManager? = null
        private set

    private lateinit var mediaStoreScanner: MediaStoreScanner

    private val serviceConnection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            // Service connected
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            mediaService = null
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Edge-to-edge transparent system bars
        WindowCompat.setDecorFitsSystemWindows(window, false)
        window.statusBarColor = getColor(R.color.flow_background)
        window.navigationBarColor = getColor(R.color.flow_background)

        // 2. Start and bind to FlowMediaSessionService
        val serviceIntent = Intent(this, FlowMediaSessionService::class.java)
        startForegroundService(serviceIntent)
        bindService(serviceIntent, serviceConnection, Context.BIND_AUTO_CREATE)

        // 3. Initialize Helpers
        mediaStoreScanner = MediaStoreScanner(this)
        networkQualityManager = NetworkQualityManager(this) { quality ->
            runOnUiThread {
                webView.evaluateJavascript(
                    "window.dispatchEvent(new CustomEvent('flow:quality-changed', { detail: { codec: '${quality.codec}', maxBitrate: ${quality.maxBitrateKbps} } }));",
                    null
                )
            }
        }
        networkQualityManager?.startMonitoring()

        // 4. Check Audio Permissions
        checkAudioPermissions()

        // 5. Setup WebView
        setupWebView()

        // 6. Modern Back Navigation
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    moveTaskToBack(true) // Keep playing in background
                }
            }
        })
    }

    private fun setupWebView() {
        webView = WebView(this).apply {
            layoutParams = android.view.ViewGroup.LayoutParams(
                android.view.ViewGroup.LayoutParams.MATCH_PARENT,
                android.view.ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(getColor(R.color.flow_background))
        }
        setContentView(webView)

        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            cacheMode = WebSettings.LOAD_DEFAULT
            mediaPlaybackRequiresUserGesture = false
            allowFileAccess = true
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        }

        // Attach Kotlin Native Bridge
        webView.addJavascriptInterface(
            FlowNativeBridge(this, mediaStoreScanner),
            "FlowAndroidBridge"
        )

        webView.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                // Inform React frontend that native Android Kotlin bridge is active
                webView.evaluateJavascript(
                    "window.__FLOW_ANDROID_NATIVE__ = true; window.dispatchEvent(new Event('flow:native-ready'));",
                    null
                )
            }
        }

        webView.webChromeClient = WebChromeClient()

        // Load Flow web UI (points to local loopback or packaged production assets)
        webView.loadUrl("http://10.0.2.2:4173")
    }

    fun notifyWebLocalTracks(tracksJson: String) {
        runOnUiThread {
            webView.evaluateJavascript(
                "window.dispatchEvent(new CustomEvent('flow:android-local-tracks', { detail: $tracksJson }));",
                null
            )
        }
    }

    private fun checkAudioPermissions() {
        val permissions = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            arrayOf(Manifest.permission.READ_MEDIA_AUDIO)
        } else {
            arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE)
        }

        val needed = permissions.filter {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }

        if (needed.isNotEmpty()) {
            ActivityCompat.requestPermissions(this, needed.toTypedArray(), 101)
        }
    }

    override fun onDestroy() {
        networkQualityManager?.stopMonitoring()
        try {
            unbindService(serviceConnection)
        } catch (_: Exception) {}
        super.onDestroy()
    }
}
