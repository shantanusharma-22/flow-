package com.flow.player.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Psychology
import androidx.compose.material.icons.rounded.Waves
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.flow.player.data.model.MusicTrack
import com.flow.player.neuro.FlowNeuroEngine
import com.flow.player.ui.theme.AppleMusicBackground
import com.flow.player.ui.theme.AppleMusicCard
import com.flow.player.ui.theme.AppleMusicPink
import com.flow.player.ui.theme.AppleMusicRed
import com.flow.player.ui.theme.AppleMusicTextPrimary
import com.flow.player.ui.theme.AppleMusicTextSecondary

@Composable
fun HomeScreen(
    allTracks: List<MusicTrack>,
    currentTrack: MusicTrack?,
    neuroEngine: FlowNeuroEngine,
    onTrackSelected: (MusicTrack) -> Unit,
    modifier: Modifier = Modifier
) {
    // Generate FlowNeuro personalized clusters
    val clusters = remember(allTracks, neuroEngine.userProfile) {
        neuroEngine.getPersonalizedClusters(allTracks)
    }

    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(AppleMusicBackground),
        contentPadding = PaddingValues(top = 80.dp, bottom = 140.dp),
        verticalArrangement = Arrangement.spacedBy(28.dp)
    ) {
        // 1. Apple Music "Listen Now" Hero Card with Neural Dynamic Mix
        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                Text(
                    text = "LISTEN NOW",
                    color = AppleMusicRed,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.2.sp
                )
                Text(
                    text = "FlowNeuro Station",
                    color = AppleMusicTextPrimary,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold
                )
                Spacer(modifier = Modifier.height(14.dp))

                // Hero Featured Card
                val heroTrack = allTracks.firstOrNull()
                if (heroTrack != null) {
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(containerColor = AppleMusicCard),
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(200.dp)
                            .clickable { onTrackSelected(heroTrack) }
                    ) {
                        Box(modifier = Modifier.fillMaxSize()) {
                            AsyncImage(
                                model = heroTrack.artworkUrl,
                                contentDescription = heroTrack.title,
                                contentScale = ContentScale.Crop,
                                modifier = Modifier.fillMaxSize()
                            )
                            // Ambient gradient overlay
                            Box(
                                modifier = Modifier
                                    .fillMaxSize()
                                    .background(
                                        Brush.verticalGradient(
                                            colors = listOf(
                                                Color.Transparent,
                                                Color(0xCC000000),
                                                Color(0xFA000000)
                                            )
                                        )
                                    )
                            )
                            // Content
                            Row(
                                modifier = Modifier
                                    .align(Alignment.BottomStart)
                                    .padding(16.dp),
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(46.dp)
                                        .clip(CircleShape)
                                        .background(AppleMusicRed),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        imageVector = Icons.Rounded.PlayArrow,
                                        contentDescription = "Play",
                                        tint = Color.White,
                                        modifier = Modifier.size(28.dp)
                                    )
                                }
                                Spacer(modifier = Modifier.width(14.dp))
                                Column {
                                    Text(
                                        text = heroTrack.title,
                                        color = AppleMusicTextPrimary,
                                        fontSize = 18.sp,
                                        fontWeight = FontWeight.Bold,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                    Text(
                                        text = "${heroTrack.artist} • ${heroTrack.formatTier.label}",
                                        color = AppleMusicTextSecondary,
                                        fontSize = 13.sp,
                                        maxLines = 1,
                                        overflow = TextOverflow.Ellipsis
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // 2. FlowNeuro Personalized Recommendation Clusters
        clusters.forEach { (clusterTitle, tracks) ->
            item {
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 20.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = Icons.Rounded.Psychology,
                                contentDescription = null,
                                tint = AppleMusicPink,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = clusterTitle,
                                color = AppleMusicTextPrimary,
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 20.dp),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        items(tracks) { track ->
                            TrackCard(
                                track = track,
                                isPlaying = track.id == currentTrack?.id,
                                onClick = { onTrackSelected(track) }
                            )
                        }
                    }
                }
            }
        }

        // 3. Recently Played Horizontal Carousel
        item {
            Column {
                Text(
                    text = "Recently Played",
                    color = AppleMusicTextPrimary,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 20.dp)
                )

                Spacer(modifier = Modifier.height(14.dp))

                LazyRow(
                    contentPadding = PaddingValues(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(allTracks) { track ->
                        TrackCard(
                            track = track,
                            isPlaying = track.id == currentTrack?.id,
                            onClick = { onTrackSelected(track) }
                        )
                    }
                }
            }
        }
    }
}

@Composable
fun TrackCard(
    track: MusicTrack,
    isPlaying: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier
            .width(145.dp)
            .clickable { onClick() }
    ) {
        Box(
            modifier = Modifier
                .size(145.dp)
                .clip(RoundedCornerShape(14.dp))
        ) {
            AsyncImage(
                model = track.artworkUrl,
                contentDescription = track.title,
                contentScale = ContentScale.Crop,
                modifier = Modifier.fillMaxSize()
            )
            if (isPlaying) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .background(Color(0x66000000)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Waves,
                        contentDescription = "Playing",
                        tint = AppleMusicRed,
                        modifier = Modifier.size(32.dp)
                    )
                }
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        Text(
            text = track.title,
            color = if (isPlaying) AppleMusicRed else AppleMusicTextPrimary,
            fontSize = 13.sp,
            fontWeight = FontWeight.SemiBold,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )

        Text(
            text = track.artist,
            color = AppleMusicTextSecondary,
            fontSize = 11.sp,
            fontWeight = FontWeight.Normal,
            maxLines = 1,
            overflow = TextOverflow.Ellipsis
        )
    }
}
