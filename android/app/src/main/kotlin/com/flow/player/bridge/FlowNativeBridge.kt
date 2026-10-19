package com.flow.player.bridge

import android.webkit.JavascriptInterface
import com.flow.player.MainActivity
import com.flow.player.library.MediaStoreScanner
import com.google.gson.Gson
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

/**
 * FlowNativeBridge
 * Bridges React 19 Frontend JavaScript calls to native Android Kotlin services.
 */
class FlowNativeBridge(
    private val activity: MainActivity,
    private val scanner: MediaStoreScanner
) {

    private val gson = Gson()
    private val scope = CoroutineScope(Dispatchers.Main)

    @JavascriptInterface
    fun isNativeAndroid(): Boolean = true

    @JavascriptInterface
    fun playTrack(streamUrl: String, title: String, artist: String, album: String, artworkUrl: String?) {
        activity.runOnUiThread {
            activity.mediaService?.playTrack(streamUrl, title, artist, album, artworkUrl)
        }
    }

    @JavascriptInterface
    fun pause() {
        activity.runOnUiThread {
            activity.mediaService?.player?.pause()
        }
    }

    @JavascriptInterface
    fun resume() {
        activity.runOnUiThread {
            activity.mediaService?.player?.play()
        }
    }

    @JavascriptInterface
    fun seekTo(positionMs: Long) {
        activity.runOnUiThread {
            activity.mediaService?.player?.seekTo(positionMs)
        }
    }

    @JavascriptInterface
    fun setPlaybackSpeed(speed: Float) {
        activity.runOnUiThread {
            activity.mediaService?.setPlaybackSpeed(speed)
        }
    }

    @JavascriptInterface
    fun setEqualizerPreset(presetName: String) {
        activity.runOnUiThread {
            activity.mediaService?.equalizerManager?.applyPreset(presetName)
        }
    }

    @JavascriptInterface
    fun toggleEqualizer(enabled: Boolean) {
        activity.runOnUiThread {
            activity.mediaService?.equalizerManager?.toggleEqualizer(enabled)
        }
    }

    @JavascriptInterface
    fun startSleepTimer(minutes: Int) {
        activity.runOnUiThread {
            activity.mediaService?.startSleepTimer(minutes)
        }
    }

    @JavascriptInterface
    fun cancelSleepTimer() {
        activity.runOnUiThread {
            activity.mediaService?.cancelSleepTimer()
        }
    }

    @JavascriptInterface
    fun scanLocalMusic(): String {
        var resultJson = "[]"
        scope.launch {
            val tracks = scanner.scanLocalTracks()
            resultJson = gson.toJson(tracks)
        }
        return resultJson
    }

    @JavascriptInterface
    fun getNetworkQuality(): String {
        return "LOSSLESS_FLAC"
    }
}
