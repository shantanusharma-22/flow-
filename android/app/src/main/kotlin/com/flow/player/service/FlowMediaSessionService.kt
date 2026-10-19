package com.flow.player.service

import android.app.PendingIntent
import android.content.Intent
import android.os.Bundle
import androidx.annotation.OptIn
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.PlaybackParameters
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import com.flow.player.MainActivity
import com.flow.player.audio.SystemEqualizerManager
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

/**
 * FlowMediaSessionService
 * High-performance foreground Android Media3 session service providing:
 * - Background audio playback surviving screen locks and low-memory conditions
 * - Notification drawer controls with active album artwork & seekbar
 * - Headset and Bluetooth media button routing
 * - Native sleep timer with 30s linear volume acoustic fadeout
 */
class FlowMediaSessionService : MediaSessionService() {

    private var mediaSession: MediaSession? = null
    lateinit var player: ExoPlayer
        private set

    var equalizerManager: SystemEqualizerManager? = null
        private set

    private val serviceScope = CoroutineScope(Dispatchers.Main + Job())
    private var sleepTimerJob: Job? = null
    private var originalVolume: Float = 1.0f

    @OptIn(UnstableApi::class)
    override fun onCreate() {
        super.onCreate()

        // 1. Initialize DefaultRenderersFactory for Float32 Hi-Res DAC audio output
        val renderersFactory = object : androidx.media3.exoplayer.DefaultRenderersFactory(this) {
            override fun buildAudioSink(
                context: android.content.Context,
                enableFloatOutput: Boolean,
                enableAudioTrackPlaybackParams: Boolean
            ): androidx.media3.exoplayer.audio.AudioSink {
                return androidx.media3.exoplayer.audio.DefaultAudioSink.Builder(context)
                    .setEnableFloatOutput(true)
                    .setEnableAudioTrackPlaybackParams(enableAudioTrackPlaybackParams)
                    .build()
            }
        }.apply {
            setExtensionRendererMode(androidx.media3.exoplayer.DefaultRenderersFactory.EXTENSION_RENDERER_MODE_PREFER)
            setEnableAudioFloatOutput(true)
        }

        // 2. Configure DefaultLoadControl for gapless pre-buffering
        val loadControl = androidx.media3.exoplayer.DefaultLoadControl.Builder()
            .setBufferDurationsMs(
                /* minBufferMs = */ 60_000,
                /* maxBufferMs = */ 120_000,
                /* bufferForPlaybackMs = */ 1_500,
                /* bufferForPlaybackAfterRebufferMs = */ 3_000
            )
            .setPrioritizeTimeOverSizeThresholds(true)
            .build()

        // 3. Initialize ExoPlayer with Hi-Res Audio Attributes and Gapless Playback
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(C.USAGE_MEDIA)
            .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
            .build()

        player = ExoPlayer.Builder(this, renderersFactory)
            .setLoadControl(loadControl)
            .setAudioAttributes(audioAttributes, true)
            .setHandleAudioBecomingNoisy(true)
            .setWakeMode(C.WAKE_MODE_LOCAL)
            .build()

        // Enable gapless playback
        player.pauseAtEndOfMediaItems = false

        // 2. Initialize System Equalizer using the native AudioSessionId
        equalizerManager = SystemEqualizerManager(player.audioSessionId)

        // 3. Build PendingIntent to reopen MainActivity on notification click
        val intent = Intent(this, MainActivity::class.java)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT
        )

        // 4. Register MediaSession
        mediaSession = MediaSession.Builder(this, player)
            .setSessionActivity(pendingIntent)
            .setCallback(CustomMediaSessionCallback())
            .build()
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession? {
        return mediaSession
    }

    /**
     * Start playing a track with full metadata and high-resolution stream URL
     */
    fun playTrack(
        streamUrl: String,
        title: String,
        artist: String,
        album: String,
        artworkUri: String? = null
    ) {
        val metadata = MediaMetadata.Builder()
            .setTitle(title)
            .setArtist(artist)
            .setAlbumTitle(album)
            .apply {
                if (artworkUri != null) {
                    setArtworkUri(android.net.Uri.parse(artworkUri))
                }
            }
            .build()

        val mediaItem = MediaItem.Builder()
            .setUri(streamUrl)
            .setMediaMetadata(metadata)
            .build()

        player.setMediaItem(mediaItem)
        player.prepare()
        player.play()
    }

    /**
     * Adjust playback speed while preserving natural vocal pitch
     */
    fun setPlaybackSpeed(speed: Float) {
        player.playbackParameters = PlaybackParameters(speed, 1.0f)
    }

    /**
     * Engage Sleep Timer with 30-second linear volume fadeout
     */
    fun startSleepTimer(minutes: Int) {
        sleepTimerJob?.cancel()
        originalVolume = player.volume

        sleepTimerJob = serviceScope.launch {
            val totalSeconds = minutes * 60
            for (remainingSec in totalSeconds downTo 0) {
                if (!isActive) break

                if (remainingSec in 1..30) {
                    // Linear attenuation curve: volume = original * (remaining / 30)
                    val fadeRatio = remainingSec / 30f
                    player.volume = originalVolume * fadeRatio
                } else if (remainingSec == 0) {
                    player.pause()
                    player.volume = originalVolume
                    break
                }
                delay(1000)
            }
        }
    }

    fun cancelSleepTimer() {
        sleepTimerJob?.cancel()
        sleepTimerJob = null
        if (::player.isInitialized) {
            player.volume = originalVolume
        }
    }

    override fun onDestroy() {
        sleepTimerJob?.cancel()
        equalizerManager?.release()
        mediaSession?.run {
            player.release()
            release()
            mediaSession = null
        }
        super.onDestroy()
    }

    private inner class CustomMediaSessionCallback : MediaSession.Callback {
        override fun onCustomCommand(
            session: MediaSession,
            controller: MediaSession.ControllerInfo,
            customCommand: androidx.media3.session.SessionCommand,
            args: Bundle
        ): com.google.common.util.concurrent.ListenableFuture<androidx.media3.session.SessionResult> {
            return super.onCustomCommand(session, controller, customCommand, args)
        }
    }
}
