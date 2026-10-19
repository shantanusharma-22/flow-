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
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Equalizer
import androidx.compose.material.icons.rounded.PlayArrow
import androidx.compose.material.icons.rounded.Whatshot
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
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
import com.flow.player.ui.theme.AppleMusicBackground
import com.flow.player.ui.theme.AppleMusicCard
import com.flow.player.ui.theme.AppleMusicRed
import com.flow.player.ui.theme.AppleMusicTextPrimary
import com.flow.player.ui.theme.AppleMusicTextSecondary

data class GenreItem(val name: String, val gradient: Brush)

val sampleGenres = listOf(
    GenreItem("Hip-Hop / Rap", Brush.linearGradient(listOf(Color(0xFFE94057), Color(0xFFF27121)))),
    GenreItem("Electronic / Dance", Brush.linearGradient(listOf(Color(0xFF00C6FF), Color(0xFF0072FF)))),
    GenreItem("R&B / Soul", Brush.linearGradient(listOf(Color(0xFF8A2387), Color(0xFFE94057)))),
    GenreItem("Rock & Alt", Brush.linearGradient(listOf(Color(0xFFF857A6), Color(0xFFFF5858)))),
    GenreItem("Lo-Fi & Chill", Brush.linearGradient(listOf(Color(0xFF11998E), Color(0xFF38EF7D)))),
    GenreItem("Classical & Acoustic", Brush.linearGradient(listOf(Color(0xFF4E54C8), Color(0xFF8F94FB))))
)

@Composable
fun ExploreScreen(
    allTracks: List<MusicTrack>,
    currentTrack: MusicTrack?,
    onTrackSelected: (MusicTrack) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(AppleMusicBackground),
        contentPadding = PaddingValues(top = 80.dp, bottom = 140.dp),
        verticalArrangement = Arrangement.spacedBy(28.dp)
    ) {
        // Charts Header
        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Rounded.Whatshot,
                        contentDescription = "Trending Charts",
                        tint = AppleMusicRed,
                        modifier = Modifier.size(24.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Global Top Charts",
                        color = AppleMusicTextPrimary,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.ExtraBold
                    )
                }
                Spacer(modifier = Modifier.height(14.dp))
            }
        }

        // Top Chart Track Rows with Rank Badges
        itemsIndexed(allTracks) { index, track ->
            val isPlaying = track.id == currentTrack?.id
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onTrackSelected(track) }
                    .padding(horizontal = 20.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Rank number
                Text(
                    text = "${index + 1}",
                    color = if (isPlaying) AppleMusicRed else AppleMusicTextSecondary,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.width(28.dp)
                )

                // Artwork
                AsyncImage(
                    model = track.artworkUrl,
                    contentDescription = track.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(52.dp)
                        .clip(RoundedCornerShape(8.dp))
                )

                Spacer(modifier = Modifier.width(14.dp))

                // Title & Artist
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = track.title,
                        color = if (isPlaying) AppleMusicRed else AppleMusicTextPrimary,
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "${track.artist} • ${track.formatTier.label}",
                        color = AppleMusicTextSecondary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Normal,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }

                if (isPlaying) {
                    Icon(
                        imageVector = Icons.Rounded.Equalizer,
                        contentDescription = "Playing",
                        tint = AppleMusicRed,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }

        // Browse Categories Grid
        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp)) {
                Text(
                    text = "Browse by Genre",
                    color = AppleMusicTextPrimary,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(14.dp))

                sampleGenres.chunked(2).forEach { rowGenres ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 12.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        rowGenres.forEach { genre ->
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .height(90.dp)
                                    .clip(RoundedCornerShape(14.dp))
                                    .background(genre.gradient)
                                    .clickable { }
                                    .padding(14.dp),
                                contentAlignment = Alignment.BottomStart
                            ) {
                                Text(
                                    text = genre.name,
                                    color = Color.White,
                                    fontSize = 15.sp,
                                    fontWeight = FontWeight.Bold
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
