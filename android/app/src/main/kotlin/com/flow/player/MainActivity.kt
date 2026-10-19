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
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import androidx.lifecycle.lifecycleScope
import com.flow.player.audio.FlowAudioEngine
import com.flow.player.library.LocalTrack
import com.flow.player.library.MediaStoreScanner
import com.flow.player.service.FlowMediaSessionService
import com.flow.player.ui.FlowMusicApp
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private lateinit var audioEngine: FlowAudioEngine
    private lateinit var mediaStoreScanner: MediaStoreScanner
    private var localTracks by mutableStateOf<List<LocalTrack>>(emptyList())

    var mediaService: FlowMediaSessionService? = null
        private set

    private val serviceConnection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            // Service connected for background foreground execution
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            mediaService = null
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // 1. Apple Music-style Edge-to-edge transparent system bars
        enableEdgeToEdge()

        // 2. Start and bind FlowMediaSessionService for robust background audio
        val serviceIntent = Intent(this, FlowMediaSessionService::class.java)
        startForegroundService(serviceIntent)
        bindService(serviceIntent, serviceConnection, Context.BIND_AUTO_CREATE)

        // 3. Initialize Audiophile Audio Engine with Float32 DAC and FlowNeuro
        audioEngine = FlowAudioEngine(applicationContext)

        // 4. Initialize Local MediaStore Scanner
        mediaStoreScanner = MediaStoreScanner(this)
        checkAudioPermissions()

        // 5. Modern Back Navigation handling
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                moveTaskToBack(true) // Keep audiophile music playing in background
            }
        })

        // 6. Set Jetpack Compose Apple Music UI
        setContent {
            FlowMusicApp(
                audioEngine = audioEngine,
                localTracks = localTracks
            )
        }
    }

    private val permissionLauncher = registerForActivityResult(
        androidx.activity.result.contract.ActivityResultContracts.RequestMultiplePermissions()
    ) { results ->
        if (results.values.any { it }) {
            scanLocalMedia()
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
            permissionLauncher.launch(needed.toTypedArray())
        } else {
            scanLocalMedia()
        }
    }

    private fun scanLocalMedia() {
        lifecycleScope.launch {
            val tracks = mediaStoreScanner.scanLocalTracks()
            localTracks = tracks
        }
    }

    override fun onDestroy() {
        try {
            unbindService(serviceConnection)
        } catch (_: Exception) {}
        audioEngine.release()
        super.onDestroy()
    }
}
