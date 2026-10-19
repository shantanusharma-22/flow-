package com.flow.player.lyrics

import com.flow.player.data.model.LyricLine
import com.flow.player.data.model.LyricWord
import java.util.regex.Pattern

object LrcParser {

    private val LINE_TIMESTAMP_PATTERN = Pattern.compile("\\[(\\d{2}):(\\d{2})\\.(\\d{2,3})\\]")
    private val WORD_TIMESTAMP_PATTERN = Pattern.compile("<(\\d{2}):(\\d{2})\\.(\\d{2,3})>([^<]+)")

    /**
     * Parses standard LRC and enhanced word-synced LRC text into structured LyricLine objects.
     */
    fun parse(lrcContent: String): List<LyricLine> {
        if (lrcContent.isBlank()) return emptyList()

        val rawLines = lrcContent.lines()
        val parsedLines = mutableListOf<LyricLine>()

        for (line in rawLines) {
            val trimmed = line.trim()
            if (trimmed.isEmpty()) continue

            val lineMatcher = LINE_TIMESTAMP_PATTERN.matcher(trimmed)
            if (lineMatcher.find()) {
                val minutes = lineMatcher.group(1)?.toLongOrNull() ?: 0L
                val seconds = lineMatcher.group(2)?.toLongOrNull() ?: 0L
                val rawMillis = lineMatcher.group(3) ?: "0"
                val millis = if (rawMillis.length == 2) rawMillis.toLong() * 10 else rawMillis.toLong()
                val lineTimeMs = (minutes * 60 + seconds) * 1000L + millis

                val textContent = trimmed.substring(lineMatcher.end()).trim()
                if (textContent.isEmpty()) continue

                // Check for enhanced word-level timestamps e.g. <00:12.30> word <00:13.10>
                val words = mutableListOf<LyricWord>()
                val wordMatcher = WORD_TIMESTAMP_PATTERN.matcher(textContent)

                while (wordMatcher.find()) {
                    val wMin = wordMatcher.group(1)?.toLongOrNull() ?: 0L
                    val wSec = wordMatcher.group(2)?.toLongOrNull() ?: 0L
                    val wRawMillis = wordMatcher.group(3) ?: "0"
                    val wMillis = if (wRawMillis.length == 2) wRawMillis.toLong() * 10 else wRawMillis.toLong()
                    val wordTimeMs = (wMin * 60 + wSec) * 1000L + wMillis
                    val wordText = wordMatcher.group(4)?.trim() ?: ""

                    words.add(LyricWord(startMs = wordTimeMs, endMs = wordTimeMs + 600L, word = wordText))
                }

                val cleanText = if (words.isNotEmpty()) {
                    words.joinToString(" ") { it.word }
                } else {
                    textContent.replace(Regex("<[^>]+>"), "").trim()
                }

                parsedLines.add(
                    LyricLine(
                        timeMs = lineTimeMs,
                        text = cleanText,
                        words = words
                    )
                )
            }
        }

        // Sort chronologically
        val sorted = parsedLines.sortedBy { it.timeMs }

        // Interpolate word-level timestamps for lines that don't have explicit word tags
        return sorted.mapIndexed { idx, line ->
            if (line.words.isNotEmpty()) {
                line
            } else {
                val nextTimeMs = if (idx + 1 < sorted.size) sorted[idx + 1].timeMs else line.timeMs + 4000L
                val lineDuration = (nextTimeMs - line.timeMs).coerceAtLeast(1000L)
                val tokens = line.text.split(Regex("\\s+")).filter { it.isNotBlank() }

                if (tokens.isNotEmpty()) {
                    val timePerWord = lineDuration / tokens.size
                    val interpolatedWords = tokens.mapIndexed { wIdx, token ->
                        val start = line.timeMs + (wIdx * timePerWord)
                        val end = start + timePerWord
                        LyricWord(startMs = start, endMs = end, word = token)
                    }
                    line.copy(words = interpolatedWords)
                } else {
                    line
                }
            }
        }
    }
}
