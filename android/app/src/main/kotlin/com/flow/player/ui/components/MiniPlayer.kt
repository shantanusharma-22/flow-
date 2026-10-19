package com.flow.player.ui.components

import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Pause
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.SkipNext
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.flow.player.data.model.MusicTrack
import com.flow.player.ui.theme.AppleMusicCard
import com.flow.player.ui.theme.AppleMusicRed
import com.flow.player.ui.theme.AppleMusicTextPrimary
import com.flow.player.ui.theme.AppleMusicTextSecondary
import dev.chrisbanes.haze.HazeState

@Composable
fun FlowMiniPlayer(
    currentTrack: MusicTrack?,
    isPlaying: Boolean,
    progressFraction: Float,
    hazeState: HazeState? = null,
    onExpandNowPlaying: () -> Unit,
    onPlayPauseClick: () -> Unit,
    onSkipNextClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    if (currentTrack == null) return

    val playButtonScale by animateFloatAsState(
        targetValue = if (isPlaying) 1.05f else 1.0f,
        animationSpec = spring(),
        label = "mini_play_scale"
    )

    Box(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 6.dp)
            .appleFrostedGlass(
                hazeState = hazeState,
                shape = RoundedCornerShape(16.dp),
                tint = Color(0xF018181C),
                borderWidth = 0.5.dp,
                borderColor = Color(0x33FFFFFF)
            )
            .clickable { onExpandNowPlaying() }
    ) {
        Column {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                // Album Art thumbnail with rounded corners
                AsyncImage(
                    model = currentTrack.artworkUrl,
                    contentDescription = currentTrack.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(46.dp)
                        .clip(RoundedCornerShape(8.dp))
                )

                Spacer(modifier = Modifier.width(12.dp))

                // Track details
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = currentTrack.title,
                        color = AppleMusicTextPrimary,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = currentTrack.artist,
                        color = AppleMusicTextSecondary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Normal,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                // Controls
                Row(verticalAlignment = Alignment.CenterVertically) {
                    IconButton(
                        onClick = onPlayPauseClick,
                        modifier = Modifier
                            .size(38.dp)
                            .scale(playButtonScale)
                    ) {
                        Icon(
                            imageVector = if (isPlaying) Icons.Rounded.Pause else Icons.Rounded.PlayArrow,
                            contentDescription = if (isPlaying) "Pause" else "Play",
                            tint = AppleMusicTextPrimary,
                            modifier = Modifier.size(26.dp)
                        )
                    }

                    IconButton(
                        onClick = onSkipNextClick,
                        modifier = Modifier.size(38.dp)
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.SkipNext,
                            contentDescription = "Next",
                            tint = AppleMusicTextPrimary,
                            modifier = Modifier.size(26.dp)
                        )
                    }
                }
            }

            // Slim Apple Music playback progress line at bottom of mini-player
            LinearProgressIndicator(
                progress = { progressFraction.coerceIn(0f, 1f) },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(2.dp),
                color = AppleMusicRed,
                trackColor = Color(0x1AFFFFFF)
            )
        }
    }
}
