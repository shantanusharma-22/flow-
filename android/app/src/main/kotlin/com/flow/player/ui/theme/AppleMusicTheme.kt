package com.flow.player.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val AppleMusicRed = Color(0xFFFA2D48)
val AppleMusicPink = Color(0xFFFF375F)
val AppleMusicSurfaceDark = Color(0xFF1C1C1E)
val AppleMusicSurfaceVariant = Color(0xFF2C2C2E)
val AppleMusicBackground = Color(0xFF000000)
val AppleMusicCard = Color(0xFF18181A)
val AppleMusicTextPrimary = Color(0xFFFFFFFF)
val AppleMusicTextSecondary = Color(0xFF98989F)
val AppleMusicTextTertiary = Color(0xFF636366)
val AppleMusicPillTrack = Color(0xFF38383A)
val AppleMusicFrostedScrim = Color(0xCC121214)

private val AppleDarkColorScheme = darkColorScheme(
    primary = AppleMusicRed,
    onPrimary = Color.White,
    secondary = AppleMusicPink,
    onSecondary = Color.White,
    background = AppleMusicBackground,
    onBackground = AppleMusicTextPrimary,
    surface = AppleMusicSurfaceDark,
    onSurface = AppleMusicTextPrimary,
    surfaceVariant = AppleMusicSurfaceVariant,
    onSurfaceVariant = AppleMusicTextSecondary
)

@Composable
fun AppleMusicTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = AppleDarkColorScheme,
        content = content
    )
}
