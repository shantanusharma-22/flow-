package com.flow.player.audio

import android.content.Context
import androidx.annotation.OptIn
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.PlaybackParameters
import androidx.media3.common.Player
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.DefaultLoadControl
import androidx.media3.exoplayer.DefaultRenderersFactory
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.audio.AudioSink
import androidx.media3.exoplayer.audio.DefaultAudioSink
import com.flow.player.data.mock.SampleMusicData
import com.flow.player.data.model.MusicTrack
import com.flow.player.neuro.FlowNeuroEngine
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin

data class PlaybackState(
    val currentTrack: MusicTrack? = null,
    val isPlaying: Boolean = false,
    val currentPositionMs: Long = 0L,
    val durationMs: Long = 0L,
    val queue: List<MusicTrack> = emptyList(),
    val currentIndex: Int = 0,
    val isShuffle: Boolean = false,
    val repeatMode: Int = Player.REPEAT_MODE_OFF,
    val volume: Float = 1.0f,
    val crossfadeSeconds: Int = 4,
    val isCrossfadeEnabled: Boolean = true,
    val isHiResFloatOutputActive: Boolean = true
)

@OptIn(UnstableApi::class)
class FlowAudioEngine(
    private val context: Context,
    val neuroEngine: FlowNeuroEngine = FlowNeuroEngine()
) {

    private val scope = CoroutineScope(Dispatchers.Main + Job())
    private var progressJob: Job? = null
    private var crossfadeJob: Job? = null

    private val _playbackState = MutableStateFlow(
        PlaybackState(
            currentTrack = SampleMusicData.sampleTracks.firstOrNull(),
            queue = SampleMusicData.sampleTracks,
            durationMs = SampleMusicData.sampleTracks.firstOrNull()?.durationMs ?: 0L
        )
    )
    val playbackState: StateFlow<PlaybackState> = _playbackState.asStateFlow()

    // Audiophile ExoPlayer instance with 32-bit Float Hi-Res output and gapless buffer
    val player: ExoPlayer
    val routingManager: AudioRoutingManager

    init {
        // 1. Configure DefaultRenderersFactory with 32-bit Floating Point PCM AudioSink
        val renderersFactory = object : DefaultRenderersFactory(context) {
            override fun buildAudioSink(
                context: Context,
                enableFloatOutput: Boolean,
                enableAudioTrackPlaybackParams: Boolean
            ): AudioSink {
                return DefaultAudioSink.Builder(context)
                    .setEnableFloatOutput(true) // Enables 32-bit Float32 PCM output to hardware DAC
                    .setEnableAudioTrackPlaybackParams(enableAudioTrackPlaybackParams)
                    .build()
            }
        }.apply {
            setExtensionRendererMode(DefaultRenderersFactory.EXTENSION_RENDERER_MODE_PREFER)
            setEnableAudioFloatOutput(true)
        }

        // 2. Configure DefaultLoadControl for gapless pre-buffering
        val loadControl = DefaultLoadControl.Builder()
            .setBufferDurationsMs(
                /* minBufferMs = */ 60_000,
                /* maxBufferMs = */ 120_000,
                /* bufferForPlaybackMs = */ 1_500,
                /* bufferForPlaybackAfterRebufferMs = */ 3_000
            )
            .setPrioritizeTimeOverSizeThresholds(true)
            .build()

        // 3. Configure AudioAttributes for Audiophile Content
        val audioAttributes = AudioAttributes.Builder()
            .setUsage(C.USAGE_MEDIA)
            .setContentType(C.AUDIO_CONTENT_TYPE_MUSIC)
            .build()

        player = ExoPlayer.Builder(context, renderersFactory)
            .setLoadControl(loadControl)
            .setAudioAttributes(audioAttributes, true)
            .setHandleAudioBecomingNoisy(true)
            .setWakeMode(C.WAKE_MODE_LOCAL)
            .build()

        // 4. Gapless playback: ensure player transitions continuously across playlist items
        player.pauseAtEndOfMediaItems = false

        routingManager = AudioRoutingManager(context, player)

        setupPlayerListeners()
        startProgressTracking()

        // Initialize with default sample queue
        loadQueue(SampleMusicData.sampleTracks, 0, autoPlay = false)
    }

    private fun setupPlayerListeners() {
        player.addListener(object : Player.Listener {
            override fun onIsPlayingChanged(isPlaying: Boolean) {
                _playbackState.value = _playbackState.value.copy(isPlaying = isPlaying)
            }

            override fun onPlaybackStateChanged(playbackState: Int) {
                if (playbackState == Player.STATE_READY) {
                    val duration = if (player.duration > 0) player.duration else _playbackState.value.currentTrack?.durationMs ?: 0L
                    _playbackState.value = _playbackState.value.copy(durationMs = duration)
                } else if (playbackState == Player.STATE_ENDED) {
                    skipToNext()
                }
            }

            override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
                val newIndex = player.currentMediaItemIndex
                val currentQueue = _playbackState.value.queue
                if (newIndex in currentQueue.indices) {
                    val track = currentQueue[newIndex]
                    _playbackState.value = _playbackState.value.copy(
                        currentTrack = track,
                        currentIndex = newIndex,
                        durationMs = track.durationMs
                    )
                    neuroEngine.recordFeedback(track, listenedRatio = 1.0f, wasSkipped = false, isLiked = track.isLiked)
                    checkAndRefillQueue()
                }
            }
        })
    }

    private fun startProgressTracking() {
        progressJob?.cancel()
        progressJob = scope.launch {
            while (isActive) {
                if (player.isPlaying) {
                    val pos = player.currentPosition
                    val duration = if (player.duration > 0) player.duration else _playbackState.value.durationMs
                    _playbackState.value = _playbackState.value.copy(
                        currentPositionMs = pos,
                        durationMs = duration
                    )

                    // Equal-Power Crossfade Trigger near end of track
                    val crossfadeMs = _playbackState.value.crossfadeSeconds * 1000L
                    if (_playbackState.value.isCrossfadeEnabled && crossfadeMs > 0 && duration > crossfadeMs) {
                        val remainingMs = duration - pos
                        if (remainingMs in 1..crossfadeMs && crossfadeJob == null) {
                            executeEqualPowerCrossfade()
                        }
                    }
                }
                delay(150)
            }
        }
    }

    /**
     * BitChord Equal-Power Sinusoidal Crossfade Transition:
     * Maintains total acoustic power constant: P = cos^2(t * pi/2) + sin^2(t * pi/2) = 1.0
     */
    private fun executeEqualPowerCrossfade() {
        val crossfadeSec = _playbackState.value.crossfadeSeconds
        if (crossfadeSec <= 0) return

        crossfadeJob?.cancel()
        crossfadeJob = scope.launch {
            val steps = 24
            val delayStep = (crossfadeSec * 1000L) / (steps * 2)
            val baseVol = _playbackState.value.volume

            // Phase 1: Sinusoidal fade-out (V_down = cos(t * pi/2))
            for (step in 0..steps) {
                val fraction = step.toFloat() / steps
                val powerRatio = cos(fraction * (PI / 2.0)).toFloat()
                player.volume = (baseVol * powerRatio).coerceIn(0f, 1f)
                delay(delayStep)
            }

            // Gapless advance to next item within the pre-buffered pipeline
            if (player.hasNextMediaItem()) {
                player.seekToNextMediaItem()
            } else {
                skipToNext()
            }

            // Phase 2: Sinusoidal fade-in (V_up = sin(t * pi/2))
            for (step in 0..steps) {
                val fraction = step.toFloat() / steps
                val powerRatio = sin(fraction * (PI / 2.0)).toFloat()
                player.volume = (baseVol * powerRatio).coerceIn(0f, 1f)
                delay(delayStep)
            }

            player.volume = baseVol
            crossfadeJob = null
        }
    }

    fun playTrack(track: MusicTrack) {
        val currentQueue = _playbackState.value.queue.toMutableList()
        val index = currentQueue.indexOfFirst { it.id == track.id }
        if (index != -1) {
            playTrackAtIndex(index)
        } else {
            currentQueue.add(0, track)
            loadQueue(currentQueue, 0, autoPlay = true)
        }
    }

    fun playTrackAtIndex(index: Int) {
        val queue = _playbackState.value.queue
        if (index in queue.indices) {
            val track = queue[index]
            _playbackState.value = _playbackState.value.copy(
                currentTrack = track,
                currentIndex = index,
                durationMs = track.durationMs
            )

            // If ExoPlayer already has the entire queue loaded, seek seamlessly without rebuilding pipeline
            if (player.mediaItemCount == queue.size) {
                player.seekTo(index, 0L)
                player.play()
            } else {
                val mediaItems = queue.map { createMediaItem(it) }
                player.setMediaItems(mediaItems, index, 0L)
                player.prepare()
                player.play()
            }
        }
    }

    fun loadQueue(tracks: List<MusicTrack>, startIndex: Int = 0, autoPlay: Boolean = true) {
        if (tracks.isEmpty()) return
        _playbackState.value = _playbackState.value.copy(
            queue = tracks,
            currentIndex = startIndex.coerceIn(0, tracks.size - 1),
            currentTrack = tracks[startIndex.coerceIn(0, tracks.size - 1)],
            durationMs = tracks[startIndex.coerceIn(0, tracks.size - 1)].durationMs
        )

        val mediaItems = tracks.map { createMediaItem(it) }
        player.setMediaItems(mediaItems, startIndex, 0L)
        player.prepare()
        if (autoPlay) {
            player.play()
        }
    }

    fun togglePlayPause() {
        if (player.isPlaying) {
            player.pause()
        } else {
            if (player.playbackState == Player.STATE_IDLE || player.currentMediaItem == null) {
                _playbackState.value.currentTrack?.let { playTrack(it) }
            } else {
                player.play()
            }
        }
    }

    fun seekTo(positionMs: Long) {
        player.seekTo(positionMs)
        _playbackState.value = _playbackState.value.copy(currentPositionMs = positionMs)
    }

    fun skipToNext() {
        val queue = _playbackState.value.queue
        val currentIdx = _playbackState.value.currentIndex
        val nextIdx = if (_playbackState.value.isShuffle) {
            queue.indices.random()
        } else {
            (currentIdx + 1) % queue.size
        }
        playTrackAtIndex(nextIdx)
    }

    fun skipToPrevious() {
        val pos = player.currentPosition
        if (pos > 3000L) {
            seekTo(0L)
        } else {
            val queue = _playbackState.value.queue
            val currentIdx = _playbackState.value.currentIndex
            val prevIdx = if (currentIdx > 0) currentIdx - 1 else queue.size - 1
            playTrackAtIndex(prevIdx)
        }
    }

    fun toggleShuffle() {
        val newShuffle = !_playbackState.value.isShuffle
        _playbackState.value = _playbackState.value.copy(isShuffle = newShuffle)
    }

    fun toggleRepeat() {
        val nextMode = when (_playbackState.value.repeatMode) {
            Player.REPEAT_MODE_OFF -> Player.REPEAT_MODE_ALL
            Player.REPEAT_MODE_ALL -> Player.REPEAT_MODE_ONE
            else -> Player.REPEAT_MODE_OFF
        }
        player.repeatMode = nextMode
        _playbackState.value = _playbackState.value.copy(repeatMode = nextMode)
    }

    fun setVolume(vol: Float) {
        val clamped = vol.coerceIn(0f, 1f)
        player.volume = clamped
        _playbackState.value = _playbackState.value.copy(volume = clamped)
    }

    fun setCrossfadeSeconds(seconds: Int) {
        _playbackState.value = _playbackState.value.copy(
            crossfadeSeconds = seconds.coerceIn(0, 12),
            isCrossfadeEnabled = seconds > 0
        )
    }

    /**
     * FlowNeuro Auto-Refill: When queue approaches the end, query FlowNeuroEngine to append
     * on-device neural recommendations seamlessly without interrupting playback.
     */
    private fun checkAndRefillQueue() {
        val state = _playbackState.value
        val remaining = state.queue.size - 1 - state.currentIndex
        if (remaining <= 2) {
            val currentIds = state.queue.map { it.id }.toSet()
            val recommended = neuroEngine.generatePersonalizedQueue(
                candidatePool = SampleMusicData.sampleTracks,
                count = 4,
                excludeIds = currentIds
            )
            if (recommended.isNotEmpty()) {
                val newQueue = state.queue + recommended
                _playbackState.value = state.copy(queue = newQueue)
                recommended.forEach { track ->
                    player.addMediaItem(createMediaItem(track))
                }
            }
        }
    }

    private fun createMediaItem(track: MusicTrack): MediaItem {
        val metadata = MediaMetadata.Builder()
            .setTitle(track.title)
            .setArtist(track.artist)
            .setAlbumTitle(track.album)
            .setArtworkUri(android.net.Uri.parse(track.artworkUrl))
            .build()

        return MediaItem.Builder()
            .setMediaId(track.id)
            .setUri(track.streamUrl)
            .setMediaMetadata(metadata)
            .build()
    }

    fun release() {
        progressJob?.cancel()
        crossfadeJob?.cancel()
        routingManager.release()
        player.release()
    }
}
