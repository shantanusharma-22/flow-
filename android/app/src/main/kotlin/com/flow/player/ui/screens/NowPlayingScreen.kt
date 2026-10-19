package com.flow.player.ui.screens

import android.graphics.Bitmap
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.gestures.draggable
import androidx.compose.foundation.gestures.rememberDraggableState
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.QueueMusic
import androidx.compose.material.icons.automirrored.rounded.VolumeDown
import androidx.compose.material.icons.automirrored.rounded.VolumeUp
import androidx.compose.material.icons.rounded.Airplay
import androidx.compose.material.icons.rounded.Audiotrack
import androidx.compose.material.icons.rounded.Close
import androidx.compose.material.icons.rounded.CloudDownload
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material.icons.rounded.FavoriteBorder
import androidx.compose.material.icons.rounded.GraphicEq
import androidx.compose.material.icons.rounded.KeyboardArrowDown
import androidx.compose.material.icons.rounded.MoreHoriz
import androidx.compose.material.icons.rounded.Pause
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Repeat
import androidx.compose.material.icons.rounded.RepeatOne
import androidx.compose.material.icons.rounded.Shuffle
import androidx.compose.material.icons.rounded.SkipNext
import androidx.compose.material.icons.rounded.SkipPrevious
import androidx.compose.material.icons.rounded.Sync
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Slider
import androidx.compose.material3.SliderDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.media3.common.Player
import coil.compose.AsyncImage
import coil.imageLoader
import coil.request.ImageRequest
import coil.request.SuccessResult
import com.flow.player.data.model.LyricLine
import com.flow.player.data.model.MusicTrack
import com.flow.player.lyrics.LrcLibClient
import com.flow.player.ui.components.appleFrostedGlass
import com.flow.player.ui.palette.ExtractedColors
import com.flow.player.ui.palette.PaletteExtractor
import com.flow.player.ui.theme.AppleMusicCard
import com.flow.player.ui.theme.AppleMusicPillTrack
import com.flow.player.ui.theme.AppleMusicRed
import com.flow.player.ui.theme.AppleMusicTextPrimary
import com.flow.player.ui.theme.AppleMusicTextSecondary
import com.flow.player.ui.theme.AppleMusicTextTertiary
import dev.chrisbanes.haze.HazeState
import kotlinx.coroutines.launch
import java.util.Locale
import kotlin.math.roundToInt

import com.flow.player.audio.AudioRoute
import com.flow.player.audio.AudioRoutingManager
import androidx.compose.material.icons.rounded.Check
import androidx.compose.runtime.collectAsState

@Composable
fun NowPlayingScreen(
    currentTrack: MusicTrack?,
    isPlaying: Boolean,
    currentPositionMs: Long,
    durationMs: Long,
    volume: Float,
    isShuffle: Boolean,
    repeatMode: Int,
    hazeState: HazeState? = null,
    audioRoutingManager: AudioRoutingManager? = null,
    crossfadeSeconds: Int = 4,
    onCrossfadeChange: (Int) -> Unit = {},
    onDismiss: () -> Unit,
    onPlayPauseClick: () -> Unit,
    onSeek: (Long) -> Unit,
    onSkipNext: () -> Unit,
    onSkipPrevious: () -> Unit,
    onToggleShuffle: () -> Unit,
    onToggleRepeat: () -> Unit,
    onVolumeChange: (Float) -> Unit,
    modifier: Modifier = Modifier
) {
    if (currentTrack == null) return

    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()

    // 1. Dynamic Palette Color Extraction from Album Artwork
    var extractedColors by remember { mutableStateOf(ExtractedColors()) }
    LaunchedEffect(currentTrack.artworkUrl) {
        val request = ImageRequest.Builder(context)
            .data(currentTrack.artworkUrl)
            .allowHardware(false)
            .build()
        val result = context.imageLoader.execute(request)
        if (result is SuccessResult) {
            val bitmap = (result.drawable as? android.graphics.drawable.BitmapDrawable)?.bitmap
            extractedColors = PaletteExtractor.extractColorsFromBitmap(bitmap)
        }
    }

    // 2. Fetch Word-by-Word Synced Lyrics from LRCLIB API
    var activeLyrics by remember(currentTrack.id) { mutableStateOf(currentTrack.lyrics) }
    var isLoadingLyrics by remember(currentTrack.id) { mutableStateOf(false) }

    LaunchedEffect(currentTrack.id) {
        if (currentTrack.lyrics.isEmpty()) {
            isLoadingLyrics = true
            val fetched = LrcLibClient.fetchSyncedLyrics(
                title = currentTrack.title,
                artist = currentTrack.artist,
                album = currentTrack.album,
                durationSec = currentTrack.durationMs / 1000L
            )
            if (fetched.isNotEmpty()) {
                activeLyrics = fetched
            }
            isLoadingLyrics = false
        } else {
            activeLyrics = currentTrack.lyrics
        }
    }

    // 3. Apple Music Spring-drag gesture for dismissal with rubber-band resistance
    val offsetY = remember { Animatable(0f) }
    val dismissThreshold = 300f

    val draggableState = rememberDraggableState { delta ->
        coroutineScope.launch {
            val current = offsetY.value
            val resistance = if (current < 0) 0.35f else 1.0f
            val newOffset = (current + delta * resistance).coerceAtLeast(-80f)
            offsetY.snapTo(newOffset)
        }
    }

    // 4. View mode: Full-Bleed Album Art vs Word-Synced Karaoke Lyrics
    var showLyrics by remember { mutableStateOf(false) }
    var showAudioRoutingDialog by remember { mutableStateOf(false) }

    // Album art scale animation (spring bounces when playing vs paused)
    val albumArtScale by animateFloatAsState(
        targetValue = if (isPlaying && !showLyrics) 1.0f else 0.86f,
        animationSpec = spring(dampingRatio = 0.75f, stiffness = 300f),
        label = "art_scale"
    )

    Box(
        modifier = modifier
            .fillMaxSize()
            .offset { IntOffset(0, offsetY.value.roundToInt()) }
            .draggable(
                state = draggableState,
                orientation = Orientation.Vertical,
                onDragStopped = { velocity ->
                    if (offsetY.value > dismissThreshold || velocity > 1000f) {
                        coroutineScope.launch {
                            offsetY.animateTo(
                                targetValue = 1800f,
                                animationSpec = spring(dampingRatio = 0.85f, stiffness = 350f)
                            )
                            onDismiss()
                            offsetY.snapTo(0f)
                        }
                    } else {
                        coroutineScope.launch {
                            offsetY.animateTo(
                                targetValue = 0f,
                                animationSpec = spring(dampingRatio = 0.75f, stiffness = 400f)
                            )
                        }
                    }
                }
            )
            // Frosted glass translucent blur combined with dynamic ambient radial gradient
            .appleFrostedGlass(
                hazeState = hazeState,
                shape = RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp),
                tint = Color(0x99101014)
            )
            .background(extractedColors.ambientRadialBrush)
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(horizontal = 24.dp)
    ) {
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Bar & Drag Handle
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Pill drag indicator
                Box(
                    modifier = Modifier
                        .padding(top = 8.dp, bottom = 12.dp)
                        .size(width = 40.dp, height = 4.dp)
                        .clip(CircleShape)
                        .background(Color(0x66FFFFFF))
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    IconButton(onClick = onDismiss) {
                        Icon(
                            imageVector = Icons.Rounded.KeyboardArrowDown,
                            contentDescription = "Dismiss",
                            tint = AppleMusicTextSecondary,
                            modifier = Modifier.size(30.dp)
                        )
                    }

                    // Format Tier Pill (e.g. "Hi-Res Lossless 24/192")
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0x33000000))
                            .padding(horizontal = 10.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = currentTrack.formatTier.label.uppercase(),
                            color = AppleMusicTextSecondary,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            letterSpacing = 1.sp
                        )
                    }

                    IconButton(onClick = {}) {
                        Icon(
                            imageVector = Icons.Rounded.MoreHoriz,
                            contentDescription = "Options",
                            tint = AppleMusicTextSecondary,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }
            }

            // Main Content: Full-Bleed Album Art OR Karaoke Word-Synced Lyrics
            Box(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                if (!showLyrics) {
                    // Full-Bleed Album Artwork with rounded corners and ambient shadow
                    AsyncImage(
                        model = currentTrack.artworkUrl,
                        contentDescription = currentTrack.title,
                        contentScale = ContentScale.Crop,
                        modifier = Modifier
                            .fillMaxWidth(0.92f)
                            .aspectRatio(1f)
                            .scale(albumArtScale)
                            .shadow(
                                elevation = 32.dp,
                                shape = RoundedCornerShape(26.dp),
                                spotColor = extractedColors.vibrant
                            )
                            .clip(RoundedCornerShape(26.dp))
                    )
                } else {
                    // Integrated Word-by-Word Synced Karaoke Lyrics Viewer
                    WordSyncedLyricsViewer(
                        lyrics = activeLyrics,
                        isLoading = isLoadingLyrics,
                        currentPositionMs = currentPositionMs,
                        onSeekToLine = onSeek,
                        activeColor = extractedColors.lightVibrant
                    )
                }
            }

            // Bottom Player Section
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 8.dp)
            ) {
                // Title, Artist, & Favorite Heart
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = currentTrack.title,
                            color = AppleMusicTextPrimary,
                            fontSize = 22.sp,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = currentTrack.artist,
                            color = AppleMusicTextSecondary,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Medium,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }

                    IconButton(onClick = {}) {
                        Icon(
                            imageVector = if (currentTrack.isLiked) Icons.Rounded.Favorite else Icons.Rounded.FavoriteBorder,
                            contentDescription = "Favorite",
                            tint = if (currentTrack.isLiked) AppleMusicRed else AppleMusicTextSecondary,
                            modifier = Modifier.size(24.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(14.dp))

                // Fluid Scrubber Bar
                FluidScrubber(
                    currentPositionMs = currentPositionMs,
                    durationMs = durationMs,
                    onSeek = onSeek,
                    activeTrackColor = extractedColors.lightVibrant
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Minimalist Control Cluster
                AppleMusicControlCluster(
                    isPlaying = isPlaying,
                    isShuffle = isShuffle,
                    repeatMode = repeatMode,
                    onPlayPause = onPlayPauseClick,
                    onSkipNext = onSkipNext,
                    onSkipPrevious = onSkipPrevious,
                    onToggleShuffle = onToggleShuffle,
                    onToggleRepeat = onToggleRepeat
                )

                Spacer(modifier = Modifier.height(18.dp))

                // Apple Music Pill Volume Slider
                AppleMusicPillVolumeSlider(
                    volume = volume,
                    onVolumeChange = onVolumeChange
                )

                Spacer(modifier = Modifier.height(14.dp))

                // Bottom Utilities (Lyrics Toggle, AirPlay/Audio Route, Queue)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceAround,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Lyrics Toggle Button with Red Highlight when active
                    IconButton(onClick = { showLyrics = !showLyrics }) {
                        Icon(
                            imageVector = Icons.Rounded.Audiotrack,
                            contentDescription = "Lyrics",
                            tint = if (showLyrics) AppleMusicRed else AppleMusicTextTertiary,
                            modifier = Modifier.size(22.dp)
                        )
                    }

                    // AirPlay / Audiophile DAC route
                    IconButton(onClick = { showAudioRoutingDialog = true }) {
                        Icon(
                            imageVector = Icons.Rounded.Airplay,
                            contentDescription = "Audio Output Route",
                            tint = if (showAudioRoutingDialog) AppleMusicRed else AppleMusicTextTertiary,
                            modifier = Modifier.size(22.dp)
                        )
                    }

                    // Queue button
                    IconButton(onClick = {}) {
                        Icon(
                            imageVector = Icons.AutoMirrored.Rounded.QueueMusic,
                            contentDescription = "Queue",
                            tint = AppleMusicTextTertiary,
                            modifier = Modifier.size(22.dp)
                        )
                    }
                }
            }
        }

        // Apple Music Audio Output & DSP Routing Dialog
        if (showAudioRoutingDialog) {
            AppleMusicAudioRoutingModal(
                audioRoutingManager = audioRoutingManager,
                crossfadeSeconds = crossfadeSeconds,
                onCrossfadeChange = onCrossfadeChange,
                onDismiss = { showAudioRoutingDialog = false }
            )
        }
    }
}

/**
 * Word-synced and line-synced karaoke lyrics viewer with dynamic font-weight bouncing and auto-scrolling
 */
@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun WordSyncedLyricsViewer(
    lyrics: List<LyricLine>,
    isLoading: Boolean,
    currentPositionMs: Long,
    onSeekToLine: (Long) -> Unit,
    activeColor: Color,
    modifier: Modifier = Modifier
) {
    if (isLoading) {
        Box(
            modifier = modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                CircularProgressIndicator(
                    color = activeColor,
                    modifier = Modifier.size(36.dp),
                    strokeWidth = 3.dp
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "Syncing with LRCLIB...",
                    color = AppleMusicTextSecondary,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
        return
    }

    if (lyrics.isEmpty()) {
        Box(
            modifier = modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Icon(
                    imageVector = Icons.Rounded.Audiotrack,
                    contentDescription = null,
                    tint = AppleMusicTextTertiary,
                    modifier = Modifier.size(44.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = "No Synced Lyrics Available",
                    color = AppleMusicTextSecondary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Medium
                )
            }
        }
        return
    }

    val listState = rememberLazyListState()

    // Determine current active lyric line
    val activeIndex = remember(currentPositionMs, lyrics) {
        val idx = lyrics.indexOfLast { it.timeMs <= currentPositionMs }
        if (idx == -1) 0 else idx
    }

    // Auto-scroll to smoothly keep active line centered
    LaunchedEffect(activeIndex) {
        if (activeIndex in lyrics.indices) {
            listState.animateScrollToItem(
                index = activeIndex,
                scrollOffset = -200
            )
        }
    }

    Column(modifier = modifier.fillMaxSize()) {
        LazyColumn(
            state = listState,
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
                .padding(horizontal = 8.dp),
            verticalArrangement = Arrangement.spacedBy(22.dp)
        ) {
            item {
                Spacer(modifier = Modifier.height(40.dp))
            }

            itemsIndexed(lyrics) { index, line ->
                val isActive = index == activeIndex
                val isPassed = index < activeIndex

                val lineScale by animateFloatAsState(
                    targetValue = if (isActive) 1.05f else 1.0f,
                    animationSpec = spring(dampingRatio = 0.7f),
                    label = "line_scale"
                )

                val lineAlpha by animateFloatAsState(
                    targetValue = when {
                        isActive -> 1.0f
                        isPassed -> 0.38f
                        else -> 0.22f
                    },
                    label = "line_alpha"
                )

                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .scale(lineScale)
                        .clickable { onSeekToLine(line.timeMs) }
                ) {
                    if (isActive && line.words.isNotEmpty()) {
                        // Word-by-word dynamic karaoke bouncing
                        FlowRow(
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            verticalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            line.words.forEach { word ->
                                val isWordActive = currentPositionMs in word.startMs..word.endMs
                                val isWordPassed = currentPositionMs >= word.startMs

                                val wordScale by animateFloatAsState(
                                    targetValue = if (isWordActive) 1.12f else 1.0f,
                                    animationSpec = spring(dampingRatio = 0.65f, stiffness = 450f),
                                    label = "w_scale"
                                )

                                val wordColor by animateColorAsState(
                                    targetValue = when {
                                        isWordActive -> activeColor
                                        isWordPassed -> Color.White
                                        else -> Color.White.copy(alpha = 0.45f)
                                    },
                                    label = "w_color"
                                )

                                Text(
                                    text = word.word,
                                    color = wordColor,
                                    fontSize = 26.sp,
                                    fontWeight = if (isWordActive || isWordPassed) FontWeight.ExtraBold else FontWeight.Bold,
                                    modifier = Modifier.scale(wordScale)
                                )
                            }
                        }
                    } else {
                        // Standard line view for non-active lines
                        Text(
                            text = line.text,
                            color = if (isActive) activeColor else AppleMusicTextPrimary.copy(alpha = lineAlpha),
                            fontSize = if (isActive) 26.sp else 22.sp,
                            fontWeight = if (isActive) FontWeight.ExtraBold else FontWeight.SemiBold,
                            lineHeight = 32.sp
                        )
                    }
                }
            }

            item {
                Spacer(modifier = Modifier.height(100.dp))
            }
        }

        // LRCLIB Credit Footer
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.Center,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Rounded.Sync,
                contentDescription = null,
                tint = AppleMusicTextTertiary,
                modifier = Modifier.size(13.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = "Synced Karaoke via LRCLIB",
                color = AppleMusicTextTertiary,
                fontSize = 11.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

/**
 * Fluid Apple Music-style Scrubber bar
 */
@Composable
private fun FluidScrubber(
    currentPositionMs: Long,
    durationMs: Long,
    onSeek: (Long) -> Unit,
    activeTrackColor: Color,
    modifier: Modifier = Modifier
) {
    var isDragging by remember { mutableStateOf(false) }
    var dragPositionMs by remember { mutableFloatStateOf(0f) }

    val safeDuration = durationMs.coerceAtLeast(1L)
    val displayPosition = if (isDragging) dragPositionMs.toLong() else currentPositionMs

    Column(modifier = modifier.fillMaxWidth()) {
        Slider(
            value = displayPosition.toFloat().coerceIn(0f, safeDuration.toFloat()),
            onValueChange = {
                isDragging = true
                dragPositionMs = it
            },
            onValueChangeFinished = {
                isDragging = false
                onSeek(dragPositionMs.toLong())
            },
            valueRange = 0f..safeDuration.toFloat(),
            colors = SliderDefaults.colors(
                thumbColor = Color.White,
                activeTrackColor = activeTrackColor,
                inactiveTrackColor = Color(0x33FFFFFF)
            ),
            modifier = Modifier.fillMaxWidth()
        )

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = formatDuration(displayPosition),
                color = AppleMusicTextSecondary,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )
            val remainingMs = (safeDuration - displayPosition).coerceAtLeast(0L)
            Text(
                text = "-${formatDuration(remainingMs)}",
                color = AppleMusicTextSecondary,
                fontSize = 12.sp,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

/**
 * Minimalist Apple Music Control Cluster
 */
@Composable
private fun AppleMusicControlCluster(
    isPlaying: Boolean,
    isShuffle: Boolean,
    repeatMode: Int,
    onPlayPause: () -> Unit,
    onSkipNext: () -> Unit,
    onSkipPrevious: () -> Unit,
    onToggleShuffle: () -> Unit,
    onToggleRepeat: () -> Unit,
    modifier: Modifier = Modifier
) {
    val playPauseScale by animateFloatAsState(
        targetValue = if (isPlaying) 1.08f else 1.0f,
        animationSpec = spring(),
        label = "cluster_play_scale"
    )

    Row(
        modifier = modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Shuffle Toggle
        IconButton(onClick = onToggleShuffle) {
            Icon(
                imageVector = Icons.Rounded.Shuffle,
                contentDescription = "Shuffle",
                tint = if (isShuffle) AppleMusicRed else AppleMusicTextSecondary,
                modifier = Modifier.size(22.dp)
            )
        }

        // Previous
        IconButton(
            onClick = onSkipPrevious,
            modifier = Modifier.size(48.dp)
        ) {
            Icon(
                imageVector = Icons.Rounded.SkipPrevious,
                contentDescription = "Previous",
                tint = AppleMusicTextPrimary,
                modifier = Modifier.size(36.dp)
            )
        }

        // Centered Oversized Play/Pause
        Box(
            modifier = Modifier
                .size(72.dp)
                .scale(playPauseScale)
                .clip(CircleShape)
                .background(Color.White)
                .clickable { onPlayPause() },
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = if (isPlaying) Icons.Rounded.Pause else Icons.Rounded.PlayArrow,
                contentDescription = if (isPlaying) "Pause" else "Play",
                tint = Color.Black,
                modifier = Modifier.size(38.dp)
            )
        }

        // Next
        IconButton(
            onClick = onSkipNext,
            modifier = Modifier.size(48.dp)
        ) {
            Icon(
                imageVector = Icons.Rounded.SkipNext,
                contentDescription = "Next",
                tint = AppleMusicTextPrimary,
                modifier = Modifier.size(36.dp)
            )
        }

        // Repeat Toggle
        IconButton(onClick = onToggleRepeat) {
            val (icon, color) = when (repeatMode) {
                Player.REPEAT_MODE_ONE -> Icons.Rounded.RepeatOne to AppleMusicRed
                Player.REPEAT_MODE_ALL -> Icons.Rounded.Repeat to AppleMusicRed
                else -> Icons.Rounded.Repeat to AppleMusicTextSecondary
            }
            Icon(
                imageVector = icon,
                contentDescription = "Repeat",
                tint = color,
                modifier = Modifier.size(22.dp)
            )
        }
    }
}

/**
 * Apple Music-style Pill Volume Slider with speaker glyphs and rounded capsule track
 */
@Composable
private fun AppleMusicPillVolumeSlider(
    volume: Float,
    onVolumeChange: (Float) -> Unit,
    modifier: Modifier = Modifier
) {
    Row(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 4.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = Icons.AutoMirrored.Rounded.VolumeDown,
            contentDescription = "Volume Down",
            tint = AppleMusicTextTertiary,
            modifier = Modifier.size(18.dp)
        )

        Slider(
            value = volume.coerceIn(0f, 1f),
            onValueChange = onVolumeChange,
            valueRange = 0f..1f,
            colors = SliderDefaults.colors(
                thumbColor = Color.White,
                activeTrackColor = Color.White,
                inactiveTrackColor = Color(0x33FFFFFF)
            ),
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 12.dp)
        )

        Icon(
            imageVector = Icons.AutoMirrored.Rounded.VolumeUp,
            contentDescription = "Volume Up",
            tint = AppleMusicTextTertiary,
            modifier = Modifier.size(18.dp)
        )
    }
}

private fun formatDuration(ms: Long): String {
    val totalSeconds = (ms / 1000).coerceAtLeast(0)
    val minutes = totalSeconds / 60
    val seconds = totalSeconds % 60
    return String.format(Locale.getDefault(), "%d:%02d", minutes, seconds)
}

/**
 * Apple Music Audio Routing and Hi-Res DSP Modal Dialog
 */
@Composable
private fun AppleMusicAudioRoutingModal(
    audioRoutingManager: AudioRoutingManager?,
    crossfadeSeconds: Int,
    onCrossfadeChange: (Int) -> Unit,
    onDismiss: () -> Unit
) {
    val routesState = audioRoutingManager?.availableRoutes?.collectAsState()
    val availableRoutes = routesState?.value ?: listOf(
        AudioRoute(
            id = -1,
            name = "System Default Audio Output",
            type = android.media.AudioDeviceInfo.TYPE_BUILTIN_SPEAKER,
            isHiResDac = false,
            isBluetooth = false,
            isSelected = true,
            sampleRateInfo = "System Adaptive Routing"
        ),
        AudioRoute(
            id = 2,
            name = "USB Audio Class 2.0 DAC",
            type = android.media.AudioDeviceInfo.TYPE_USB_DEVICE,
            isHiResDac = true,
            isBluetooth = false,
            isSelected = false,
            sampleRateInfo = "32-bit Float / 192kHz Bit-Perfect"
        ),
        AudioRoute(
            id = 3,
            name = "3.5mm Headphone Jack (Direct DAC)",
            type = android.media.AudioDeviceInfo.TYPE_WIRED_HEADPHONES,
            isHiResDac = true,
            isBluetooth = false,
            isSelected = false,
            sampleRateInfo = "Direct Hi-Res Analog Output"
        )
    )

    androidx.compose.ui.window.Dialog(
        onDismissRequest = onDismiss,
        properties = androidx.compose.ui.window.DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0x80000000))
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    onClick = onDismiss
                ),
            contentAlignment = Alignment.BottomCenter
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(topStart = 28.dp, topEnd = 28.dp))
                    .background(Color(0xF018181D))
                    .clickable(
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        onClick = {} // Consume click
                    )
                    .navigationBarsPadding()
                    .padding(horizontal = 24.dp, vertical = 20.dp)
            ) {
                // Drag handle
                Box(
                    modifier = Modifier
                        .align(Alignment.CenterHorizontally)
                        .size(width = 36.dp, height = 4.dp)
                        .clip(CircleShape)
                        .background(Color(0x44FFFFFF))
                )

                Spacer(modifier = Modifier.height(16.dp))

                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Rounded.Airplay,
                            contentDescription = null,
                            tint = AppleMusicRed,
                            modifier = Modifier.size(24.dp)
                        )
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(
                                text = "Audio Routing & DSP",
                                color = AppleMusicTextPrimary,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "BitChord Audiophile Pipeline",
                                color = AppleMusicTextSecondary,
                                fontSize = 12.sp
                            )
                        }
                    }

                    IconButton(onClick = onDismiss) {
                        Icon(
                            imageVector = Icons.Rounded.Close,
                            contentDescription = "Close",
                            tint = AppleMusicTextSecondary,
                            modifier = Modifier.size(20.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Hi-Res Float32 Banner
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(Color(0x2238EF7D))
                        .padding(horizontal = 14.dp, vertical = 10.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(Color(0xFF38EF7D))
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Column {
                            Text(
                                text = "Float32 DAC Direct Rendering: ACTIVE",
                                color = Color(0xFF38EF7D),
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold
                            )
                            Text(
                                text = "ExoPlayer DefaultRenderersFactory PCM Float32 (192kHz/384kHz)",
                                color = AppleMusicTextSecondary,
                                fontSize = 11.sp
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Equal-Power Crossfade Slider
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(14.dp))
                        .background(Color(0x18FFFFFF))
                        .padding(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Equal-Power Crossfade",
                            color = AppleMusicTextPrimary,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.SemiBold
                        )
                        Text(
                            text = if (crossfadeSeconds == 0) "0s (True Gapless)" else "${crossfadeSeconds}s",
                            color = AppleMusicRed,
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    Spacer(modifier = Modifier.height(4.dp))

                    Text(
                        text = "Constant acoustic energy (P = cos²θ + sin²θ = 1.0) between tracks",
                        color = AppleMusicTextSecondary,
                        fontSize = 11.sp
                    )

                    Slider(
                        value = crossfadeSeconds.toFloat(),
                        onValueChange = { onCrossfadeChange(it.toInt()) },
                        valueRange = 0f..12f,
                        steps = 11,
                        colors = SliderDefaults.colors(
                            thumbColor = AppleMusicRed,
                            activeTrackColor = AppleMusicRed,
                            inactiveTrackColor = Color(0x33FFFFFF)
                        ),
                        modifier = Modifier.fillMaxWidth()
                    )
                }

                Spacer(modifier = Modifier.height(18.dp))

                // Output Destination Section
                Text(
                    text = "OUTPUT DESTINATIONS",
                    color = AppleMusicTextSecondary,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp,
                    modifier = Modifier.padding(start = 4.dp, bottom = 8.dp)
                )

                LazyColumn(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(availableRoutes) { route ->
                        val isSelected = route.isSelected
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(12.dp))
                                .background(if (isSelected) Color(0x28FA2D48) else Color(0x14FFFFFF))
                                .clickable {
                                    audioRoutingManager?.setPreferredRoute(route)
                                }
                                .padding(horizontal = 14.dp, vertical = 12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier.weight(1f)
                            ) {
                                Icon(
                                    imageVector = if (route.isHiResDac) {
                                        Icons.Rounded.GraphicEq
                                    } else if (route.isBluetooth) {
                                        Icons.Rounded.Sync
                                    } else {
                                        Icons.AutoMirrored.Rounded.VolumeUp
                                    },
                                    contentDescription = null,
                                    tint = if (isSelected) AppleMusicRed else AppleMusicTextSecondary,
                                    modifier = Modifier.size(22.dp)
                                )

                                Spacer(modifier = Modifier.width(12.dp))

                                Column {
                                    Text(
                                        text = route.name,
                                        color = if (isSelected) AppleMusicTextPrimary else AppleMusicTextSecondary,
                                        fontSize = 14.sp,
                                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                                    )
                                    Text(
                                        text = route.sampleRateInfo,
                                        color = AppleMusicTextTertiary,
                                        fontSize = 11.sp
                                    )
                                }
                            }

                            if (isSelected) {
                                Icon(
                                    imageVector = Icons.Rounded.Check,
                                    contentDescription = "Selected",
                                    tint = AppleMusicRed,
                                    modifier = Modifier.size(20.dp)
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}

/**
 * Translucent frosted glass PlayerSheet modal matching Apple Music layout
 */
@Composable
fun PlayerSheet(
    currentTrack: MusicTrack?,
    isPlaying: Boolean,
    currentPositionMs: Long,
    durationMs: Long,
    volume: Float,
    isShuffle: Boolean,
    repeatMode: Int,
    hazeState: HazeState? = null,
    audioRoutingManager: AudioRoutingManager? = null,
    crossfadeSeconds: Int = 4,
    onCrossfadeChange: (Int) -> Unit = {},
    onDismiss: () -> Unit,
    onPlayPauseClick: () -> Unit,
    onSeek: (Long) -> Unit,
    onSkipNext: () -> Unit,
    onSkipPrevious: () -> Unit,
    onToggleShuffle: () -> Unit,
    onToggleRepeat: () -> Unit,
    onVolumeChange: (Float) -> Unit,
    modifier: Modifier = Modifier
) {
    NowPlayingScreen(
        currentTrack = currentTrack,
        isPlaying = isPlaying,
        currentPositionMs = currentPositionMs,
        durationMs = durationMs,
        volume = volume,
        isShuffle = isShuffle,
        repeatMode = repeatMode,
        hazeState = hazeState,
        audioRoutingManager = audioRoutingManager,
        crossfadeSeconds = crossfadeSeconds,
        onCrossfadeChange = onCrossfadeChange,
        onDismiss = onDismiss,
        onPlayPauseClick = onPlayPauseClick,
        onSeek = onSeek,
        onSkipNext = onSkipNext,
        onSkipPrevious = onSkipPrevious,
        onToggleShuffle = onToggleShuffle,
        onToggleRepeat = onToggleRepeat,
        onVolumeChange = onVolumeChange,
        modifier = modifier
    )
}
