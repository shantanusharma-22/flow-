package com.flow.player.library

import android.content.ContentUris
import android.content.Context
import android.net.Uri
import android.provider.MediaStore
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

data class LocalTrack(
    val id: String,
    val title: String,
    val artist: String,
    val album: String,
    val durationSec: Int,
    val contentUri: String,
    val mimeType: String,
    val sizeBytes: Long
)

/**
 * MediaStoreScanner
 * Queries Android's MediaStore database to index device audio files
 * (.flac, .mp3, .wav, .m4a, .opus, .ogg).
 */
class MediaStoreScanner(private val context: Context) {

    suspend fun scanLocalTracks(): List<LocalTrack> = withContext(Dispatchers.IO) {
        val trackList = mutableListOf<LocalTrack>()
        val collection: Uri = MediaStore.Audio.Media.EXTERNAL_CONTENT_URI

        val projection = arrayOf(
            MediaStore.Audio.Media._ID,
            MediaStore.Audio.Media.TITLE,
            MediaStore.Audio.Media.ARTIST,
            MediaStore.Audio.Media.ALBUM,
            MediaStore.Audio.Media.DURATION,
            MediaStore.Audio.Media.MIME_TYPE,
            MediaStore.Audio.Media.SIZE
        )

        val selection = "${MediaStore.Audio.Media.IS_MUSIC} != 0"
        val sortOrder = "${MediaStore.Audio.Media.TITLE} ASC"

        try {
            context.contentResolver.query(
                collection,
                projection,
                selection,
                null,
                sortOrder
            )?.use { cursor ->
                val idCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media._ID)
                val titleCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.TITLE)
                val artistCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ARTIST)
                val albumCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.ALBUM)
                val durationCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.DURATION)
                val mimeCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.MIME_TYPE)
                val sizeCol = cursor.getColumnIndexOrThrow(MediaStore.Audio.Media.SIZE)

                while (cursor.moveToNext()) {
                    val id = cursor.getLong(idCol)
                    val title = cursor.getString(titleCol) ?: "Unknown Title"
                    val artist = cursor.getString(artistCol) ?: "Unknown Artist"
                    val album = cursor.getString(albumCol) ?: "Local Collection"
                    val durationMs = cursor.getInt(durationCol)
                    val mimeType = cursor.getString(mimeCol) ?: "audio/mpeg"
                    val size = cursor.getLong(sizeCol)

                    val contentUri = ContentUris.withAppendedId(collection, id).toString()

                    trackList.add(
                        LocalTrack(
                            id = "android-$id",
                            title = title,
                            artist = artist,
                            album = album,
                            durationSec = (durationMs / 1000).coerceAtLeast(1),
                            contentUri = contentUri,
                            mimeType = mimeType,
                            sizeBytes = size
                        )
                    )
                }
            }
        } catch (e: Exception) {
            android.util.Log.e("MediaStoreScanner", "Error querying MediaStore: ${e.message}")
        }

        trackList
    }
}
