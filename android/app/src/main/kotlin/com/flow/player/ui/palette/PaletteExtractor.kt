package com.flow.player.ui.palette

import android.graphics.Bitmap
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.palette.graphics.Palette
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

@Immutable
data class ExtractedColors(
    val vibrant: Color = Color(0xFFFA2D48),
    val darkMuted: Color = Color(0xFF1E1424),
    val dominant: Color = Color(0xFF2A101C),
    val lightVibrant: Color = Color(0xFFFF6482),
    val background: Color = Color(0xFF0A0A0C)
) {
    /**
     * Ambient radial gradient for Apple Music-style Now Playing backdrop
     */
    val ambientRadialBrush: Brush
        get() = Brush.radialGradient(
            colors = listOf(
                vibrant.copy(alpha = 0.65f),
                darkMuted.copy(alpha = 0.55f),
                dominant.copy(alpha = 0.45f),
                background
            ),
            radius = 1400f
        )
}

object PaletteExtractor {

    suspend fun extractColorsFromBitmap(bitmap: Bitmap?): ExtractedColors = withContext(Dispatchers.Default) {
        if (bitmap == null) return@withContext ExtractedColors()

        val palette = Palette.from(bitmap)
            .maximumColorCount(24)
            .generate()

        val vibrantInt = palette.vibrantSwatch?.rgb
            ?: palette.dominantSwatch?.rgb
            ?: 0xFFFA2D48.toInt()

        val darkMutedInt = palette.darkMutedSwatch?.rgb
            ?: palette.mutedSwatch?.rgb
            ?: 0xFF1C1422.toInt()

        val dominantInt = palette.dominantSwatch?.rgb
            ?: 0xFF2A121F.toInt()

        val lightVibrantInt = palette.lightVibrantSwatch?.rgb
            ?: palette.vibrantSwatch?.rgb
            ?: 0xFFFF607C.toInt()

        ExtractedColors(
            vibrant = Color(vibrantInt),
            darkMuted = Color(darkMutedInt),
            dominant = Color(dominantInt),
            lightVibrant = Color(lightVibrantInt),
            background = Color(0xFF08080A)
        )
    }
}
