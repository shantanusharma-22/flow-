package com.flow.player.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.rounded.PlaylistPlay
import androidx.compose.material.icons.rounded.Album
import androidx.compose.material.icons.rounded.Favorite
import androidx.compose.material.icons.rounded.Folder
import androidx.compose.material.icons.rounded.MusicNote
import androidx.compose.material.icons.rounded.SdCard
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.flow.player.data.model.AudioFormatTier
import com.flow.player.data.model.MusicTrack
import com.flow.player.library.LocalTrack
import com.flow.player.ui.theme.AppleMusicBackground
import com.flow.player.ui.theme.AppleMusicPink
import com.flow.player.ui.theme.AppleMusicRed
import com.flow.player.ui.theme.AppleMusicTextPrimary
import com.flow.player.ui.theme.AppleMusicTextSecondary

data class LibraryCategory(val title: String, val icon: ImageVector, val tint: Color)

val libraryCategories = listOf(
    LibraryCategory("Playlists", Icons.AutoMirrored.Rounded.PlaylistPlay, AppleMusicRed),
    LibraryCategory("Artists", Icons.Rounded.MusicNote, AppleMusicPink),
    LibraryCategory("Albums", Icons.Rounded.Album, Color(0xFF5856D6)),
    LibraryCategory("Songs", Icons.Rounded.MusicNote, Color(0xFF007AFF)),
    LibraryCategory("Device Storage (Local FLAC/Hi-Res)", Icons.Rounded.SdCard, Color(0xFF34C759))
)

@Composable
fun LibraryScreen(
    allTracks: List<MusicTrack>,
    localTracks: List<LocalTrack>,
    currentTrack: MusicTrack?,
    onTrackSelected: (MusicTrack) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier
            .fillMaxSize()
            .background(AppleMusicBackground),
        contentPadding = PaddingValues(top = 80.dp, bottom = 140.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp)
    ) {
        // Library Categories List
        items(libraryCategories) { cat ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { }
                    .padding(horizontal = 20.dp, vertical = 10.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = cat.icon,
                    contentDescription = cat.title,
                    tint = cat.tint,
                    modifier = Modifier.size(26.dp)
                )
                Spacer(modifier = Modifier.width(16.dp))
                Text(
                    text = cat.title,
                    color = AppleMusicTextPrimary,
                    fontSize = 18.sp,
                    fontWeight = FontWeight.SemiBold
                )
            }
            HorizontalDivider(
                color = Color(0x1AFFFFFF),
                thickness = 0.5.dp,
                modifier = Modifier.padding(start = 62.dp, end = 20.dp)
            )
        }

        // Local Scanned Media Section (if local tracks exist)
        if (localTracks.isNotEmpty()) {
            item {
                Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp)) {
                    Text(
                        text = "On This Device (${localTracks.size} audio files)",
                        color = AppleMusicTextPrimary,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            items(localTracks.take(10)) { localTrack ->
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            onTrackSelected(
                                MusicTrack(
                                    id = localTrack.id,
                                    title = localTrack.title,
                                    artist = localTrack.artist,
                                    album = localTrack.album,
                                    durationMs = localTrack.durationSec * 1000L,
                                    streamUrl = localTrack.contentUri,
                                    artworkUrl = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
                                    formatTier = AudioFormatTier.HI_RES_LOSSLESS
                                )
                            )
                        }
                        .padding(horizontal = 20.dp, vertical = 6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(8.dp))
                            .background(Color(0xFF2C2C2E)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.MusicNote,
                            contentDescription = null,
                            tint = Color.White,
                            modifier = Modifier.size(24.dp)
                        )
                    }

                    Spacer(modifier = Modifier.width(14.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = localTrack.title,
                            color = AppleMusicTextPrimary,
                            fontSize = 15.sp,
                            fontWeight = FontWeight.Bold,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "${localTrack.artist} • ${localTrack.mimeType}",
                            color = AppleMusicTextSecondary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Normal,
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis
                        )
                    }
                }
            }
        }

        // Liked & Hi-Res Music Section Header
        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp)) {
                Text(
                    text = "Favorited & Hi-Res Tracks",
                    color = AppleMusicTextPrimary,
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // Track items
        items(allTracks) { track ->
            val isPlaying = track.id == currentTrack?.id
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onTrackSelected(track) }
                    .padding(horizontal = 20.dp, vertical = 6.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                AsyncImage(
                    model = track.artworkUrl,
                    contentDescription = track.title,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier
                        .size(50.dp)
                        .clip(RoundedCornerShape(8.dp))
                )

                Spacer(modifier = Modifier.width(14.dp))

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

                if (track.isLiked) {
                    Icon(
                        imageVector = Icons.Rounded.Favorite,
                        contentDescription = "Liked",
                        tint = AppleMusicRed,
                        modifier = Modifier.size(18.dp)
                    )
                }
            }
        }
    }
}
