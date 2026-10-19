package com.flow.player.ui

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.flow.player.audio.FlowAudioEngine
import com.flow.player.data.mock.SampleMusicData
import com.flow.player.library.LocalTrack
import com.flow.player.ui.components.FlowBottomNavigationBar
import com.flow.player.ui.components.FlowMiniPlayer
import com.flow.player.ui.components.FlowTopAppBar
import com.flow.player.ui.components.NavigationTab
import com.flow.player.ui.screens.ExploreScreen
import com.flow.player.ui.screens.HomeScreen
import com.flow.player.ui.screens.LibraryScreen
import com.flow.player.ui.screens.NowPlayingScreen
import com.flow.player.ui.screens.SearchScreen
import com.flow.player.ui.theme.AppleMusicBackground
import com.flow.player.ui.theme.AppleMusicTheme
import dev.chrisbanes.haze.HazeState
import dev.chrisbanes.haze.haze

@Composable
fun FlowMusicApp(
    audioEngine: FlowAudioEngine,
    localTracks: List<LocalTrack> = emptyList()
) {
    AppleMusicTheme {
        val hazeState = remember { HazeState() }
        var currentTab by remember { mutableStateOf(NavigationTab.HOME) }
        var isNowPlayingExpanded by remember { mutableStateOf(false) }

        val playbackState by audioEngine.playbackState.collectAsState()
        val allTracks = SampleMusicData.sampleTracks

        val progressFraction = remember(playbackState.currentPositionMs, playbackState.durationMs) {
            if (playbackState.durationMs > 0) {
                playbackState.currentPositionMs.toFloat() / playbackState.durationMs.toFloat()
            } else 0f
        }

        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(AppleMusicBackground)
        ) {
            // Main Content Area with Haze blur source capture
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .haze(state = hazeState)
            ) {
                when (currentTab) {
                    NavigationTab.HOME -> HomeScreen(
                        allTracks = allTracks,
                        currentTrack = playbackState.currentTrack,
                        neuroEngine = audioEngine.neuroEngine,
                        onTrackSelected = { audioEngine.playTrack(it) }
                    )
                    NavigationTab.EXPLORE -> ExploreScreen(
                        allTracks = allTracks,
                        currentTrack = playbackState.currentTrack,
                        onTrackSelected = { audioEngine.playTrack(it) }
                    )
                    NavigationTab.LIBRARY -> LibraryScreen(
                        allTracks = allTracks,
                        localTracks = localTracks,
                        currentTrack = playbackState.currentTrack,
                        onTrackSelected = { audioEngine.playTrack(it) }
                    )
                    NavigationTab.SEARCH -> SearchScreen(
                        allTracks = allTracks,
                        currentTrack = playbackState.currentTrack,
                        onTrackSelected = { audioEngine.playTrack(it) }
                    )
                }
            }

            // Frosted Glass TopBar
            com.flow.player.ui.components.TopBar(
                title = currentTab.title,
                subtitle = "Apple Music Audio Engine",
                hazeState = hazeState,
                modifier = Modifier.align(Alignment.TopCenter)
            )

            // Bottom Floating Controls: Frosted Mini-Player + Frosted BottomBar
            Column(
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .fillMaxWidth()
            ) {
                // Frosted Mini-Player floating directly above the bottom tab bar
                FlowMiniPlayer(
                    currentTrack = playbackState.currentTrack,
                    isPlaying = playbackState.isPlaying,
                    progressFraction = progressFraction,
                    hazeState = hazeState,
                    onExpandNowPlaying = { isNowPlayingExpanded = true },
                    onPlayPauseClick = { audioEngine.togglePlayPause() },
                    onSkipNextClick = { audioEngine.skipToNext() }
                )

                // Translucent Frosted Glass BottomBar
                com.flow.player.ui.components.BottomBar(
                    currentTab = currentTab,
                    onTabSelected = { currentTab = it },
                    hazeState = hazeState
                )
            }

            // Full-Bleed Apple Music PlayerSheet modal overlay with translucent frosted glass
            AnimatedVisibility(
                visible = isNowPlayingExpanded,
                enter = slideInVertically(
                    initialOffsetY = { it },
                    animationSpec = androidx.compose.animation.core.spring(
                        dampingRatio = 0.82f,
                        stiffness = 380f
                    )
                ) + fadeIn(),
                exit = slideOutVertically(
                    targetOffsetY = { it },
                    animationSpec = androidx.compose.animation.core.spring(
                        dampingRatio = 0.85f,
                        stiffness = 400f
                    )
                ) + fadeOut()
            ) {
                com.flow.player.ui.screens.PlayerSheet(
                    currentTrack = playbackState.currentTrack,
                    isPlaying = playbackState.isPlaying,
                    currentPositionMs = playbackState.currentPositionMs,
                    durationMs = playbackState.durationMs,
                    volume = playbackState.volume,
                    isShuffle = playbackState.isShuffle,
                    repeatMode = playbackState.repeatMode,
                    hazeState = hazeState,
                    audioRoutingManager = audioEngine.routingManager,
                    crossfadeSeconds = playbackState.crossfadeSeconds,
                    onCrossfadeChange = { audioEngine.setCrossfadeSeconds(it) },
                    onDismiss = { isNowPlayingExpanded = false },
                    onPlayPauseClick = { audioEngine.togglePlayPause() },
                    onSeek = { audioEngine.seekTo(it) },
                    onSkipNext = { audioEngine.skipToNext() },
                    onSkipPrevious = { audioEngine.skipToPrevious() },
                    onToggleShuffle = { audioEngine.toggleShuffle() },
                    onToggleRepeat = { audioEngine.toggleRepeat() },
                    onVolumeChange = { audioEngine.setVolume(it) }
                )
            }
        }
    }
}
