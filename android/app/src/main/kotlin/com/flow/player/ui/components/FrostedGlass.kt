package com.flow.player.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Shape
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import dev.chrisbanes.haze.HazeDefaults
import dev.chrisbanes.haze.HazeState
import dev.chrisbanes.haze.HazeStyle
import dev.chrisbanes.haze.hazeChild
import dev.chrisbanes.haze.materials.ExperimentalHazeMaterialsApi
import dev.chrisbanes.haze.materials.HazeMaterials

/**
 * Compatible hazeEffect extension function mapping to HazeChild using composed scope
 */
@OptIn(ExperimentalHazeMaterialsApi::class)
fun Modifier.hazeEffect(
    state: HazeState,
    shape: Shape = RoundedCornerShape(0.dp),
    style: HazeStyle? = null
): Modifier = composed {
    val resolvedStyle = style ?: HazeMaterials.ultraThin()
    this.hazeChild(
        state = state,
        shape = shape,
        style = resolvedStyle
    )
}

/**
 * Apple Music Frosted Glass Modifier.
 * Combines hardware-accelerated Haze backdrop blur effect via hazeEffect() with translucent Apple dark scrim,
 * specular inner light border, and smooth rounded corners.
 */
@OptIn(ExperimentalHazeMaterialsApi::class)
fun Modifier.appleFrostedGlass(
    hazeState: HazeState? = null,
    shape: Shape = RoundedCornerShape(0.dp),
    tint: Color = Color(0xCC1A1A1E),
    borderWidth: Dp = 0.5.dp,
    borderColor: Color = Color(0x2BFFFFFF)
): Modifier = composed {
    val hazeMod = if (hazeState != null) {
        this.hazeChild(
            state = hazeState,
            shape = shape,
            style = HazeMaterials.ultraThin()
        )
    } else {
        this
    }

    hazeMod
        .clip(shape)
        .background(tint)
        .border(
            width = borderWidth,
            brush = Brush.verticalGradient(
                colors = listOf(
                    borderColor,
                    Color(0x05FFFFFF)
                )
            ),
            shape = shape
        )
}
