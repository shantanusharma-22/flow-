package com.flow.player.lyrics

import android.util.Log
import com.flow.player.data.model.LyricLine
import com.google.gson.Gson
import com.google.gson.JsonObject
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.HttpUrl.Companion.toHttpUrlOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit

object LrcLibClient {

    private const val TAG = "LRCLIB"
    private const val BASE_URL = "https://lrclib.net/api/get"
    private const val SEARCH_URL = "https://lrclib.net/api/search"

    private val client = OkHttpClient.Builder()
        .connectTimeout(6, TimeUnit.SECONDS)
        .readTimeout(6, TimeUnit.SECONDS)
        .build()

    private val gson = Gson()
    private val lyricsCache = ConcurrentHashMap<String, List<LyricLine>>()

    /**
     * Fetches and parses word-by-word synced lyrics from LRCLIB API
     */
    suspend fun fetchSyncedLyrics(
        title: String,
        artist: String,
        album: String = "",
        durationSec: Long = 0L
    ): List<LyricLine> = withContext(Dispatchers.IO) {
        val cacheKey = "${title.lowercase().trim()} - ${artist.lowercase().trim()}"
        lyricsCache[cacheKey]?.let { return@withContext it }

        try {
            // 1. Try exact match lookup
            val urlBuilder = BASE_URL.toHttpUrlOrNull()?.newBuilder()
                ?.addQueryParameter("track_name", cleanTitle(title))
                ?.addQueryParameter("artist_name", cleanArtist(artist))

            if (album.isNotBlank()) {
                urlBuilder?.addQueryParameter("album_name", album)
            }
            if (durationSec > 0) {
                urlBuilder?.addQueryParameter("duration", durationSec.toString())
            }

            val requestUrl = urlBuilder?.build() ?: return@withContext emptyList()
            val request = Request.Builder()
                .url(requestUrl)
                .header("User-Agent", "FlowMusicPlayer/1.0.0 (https://github.com/shantanusharma-22/flow)")
                .build()

            client.newCall(request).execute().use { response ->
                if (response.isSuccessful) {
                    val bodyString = response.body?.string()
                    if (!bodyString.isNullOrBlank()) {
                        val json = gson.fromJson(bodyString, JsonObject::class.java)
                        val syncedLrc = json.get("syncedLyrics")?.asString

                        if (!syncedLrc.isNullOrBlank()) {
                            val parsed = LrcParser.parse(syncedLrc)
                            if (parsed.isNotEmpty()) {
                                lyricsCache[cacheKey] = parsed
                                Log.d(TAG, "Successfully fetched ${parsed.size} synced lyric lines for $title")
                                return@withContext parsed
                            }
                        }
                    }
                }
            }

            // 2. Fallback to search if exact match returned 404
            val searchUrlBuilder = SEARCH_URL.toHttpUrlOrNull()?.newBuilder()
                ?.addQueryParameter("q", "${cleanTitle(title)} ${cleanArtist(artist)}")

            val searchUrl = searchUrlBuilder?.build() ?: return@withContext emptyList()
            val searchRequest = Request.Builder()
                .url(searchUrl)
                .header("User-Agent", "FlowMusicPlayer/1.0.0 (https://github.com/shantanusharma-22/flow)")
                .build()

            client.newCall(searchRequest).execute().use { searchResponse ->
                if (searchResponse.isSuccessful) {
                    val searchBody = searchResponse.body?.string()
                    if (!searchBody.isNullOrBlank()) {
                        val resultsArray = gson.fromJson(searchBody, com.google.gson.JsonArray::class.java)
                        for (element in resultsArray) {
                            val item = element.asJsonObject
                            val syncedLrc = item.get("syncedLyrics")?.asString
                            if (!syncedLrc.isNullOrBlank()) {
                                val parsed = LrcParser.parse(syncedLrc)
                                if (parsed.isNotEmpty()) {
                                    lyricsCache[cacheKey] = parsed
                                    Log.d(TAG, "Search fallback matched ${parsed.size} lines for $title")
                                    return@withContext parsed
                                }
                            }
                        }
                    }
                }
            }
        } catch (e: Exception) {
            Log.w(TAG, "Could not retrieve LRCLIB lyrics for $title by $artist: ${e.message}")
        }

        emptyList()
    }

    private fun cleanTitle(title: String): String {
        return title
            .replace(Regex("\\(feat\\..*?\\)", RegexOption.IGNORE_CASE), "")
            .replace(Regex("\\[.*?\\]"), "")
            .replace(Regex(" - .*$"), "")
            .trim()
    }

    private fun cleanArtist(artist: String): String {
        return artist.split(",", "&", "feat.", "ft.")[0].trim()
    }
}
