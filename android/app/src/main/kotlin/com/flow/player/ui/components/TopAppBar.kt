package com.flow.player.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.GraphicEq
import androidx.compose.material.icons.rounded.Person
import androidx.compose.material.icons.rounded.Psychology
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.flow.player.ui.theme.AppleMusicPink
import com.flow.player.ui.theme.AppleMusicRed
import com.flow.player.ui.theme.AppleMusicTextPrimary
import com.flow.player.ui.theme.AppleMusicTextSecondary
import dev.chrisbanes.haze.HazeState

@Composable
fun FlowTopAppBar(
    title: String,
    subtitle: String? = null,
    hazeState: HazeState? = null,
    onProfileClick: () -> Unit = {},
    onEqClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .appleFrostedGlass(
                hazeState = hazeState,
                shape = RoundedCornerShape(bottomStart = 0.dp, bottomEnd = 0.dp),
                tint = Color(0xDD0D0D10)
            )
            .statusBarsPadding()
            .padding(horizontal = 20.dp, vertical = 12.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                if (subtitle != null) {
                    Text(
                        text = subtitle.uppercase(),
                        color = AppleMusicRed,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 1.2.sp
                    )
                }
                Text(
                    text = title,
                    color = AppleMusicTextPrimary,
                    fontSize = 28.sp,
                    fontWeight = FontWeight.ExtraBold,
                    letterSpacing = (-0.5).sp
                )
            }

            Row(verticalAlignment = Alignment.CenterVertically) {
                // FlowNeuro Engine Status Pill
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color(0x25FA2D48))
                        .padding(horizontal = 10.dp, vertical = 5.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            imageVector = Icons.Rounded.Psychology,
                            contentDescription = "FlowNeuro Active",
                            tint = AppleMusicPink,
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "NEURO",
                            color = AppleMusicPink,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }

                Spacer(modifier = Modifier.width(10.dp))

                // Equalizer / Audio DSP button
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(Color(0x22FFFFFF))
                        .clickable { onEqClick() },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Rounded.GraphicEq,
                        contentDescription = "DSP Equalizer",
                        tint = AppleMusicTextPrimary,
                        modifier = Modifier.size(18.dp)
                    )
                }

                Spacer(modifier = Modifier.width(8.dp))

                // Profile Avatar button
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(CircleShape)
                        .background(Color(0x22FFFFFF))
                        .clickable { onProfileClick() },
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Rounded.Person,
                        contentDescription = "Profile",
                        tint = AppleMusicTextPrimary,
                        modifier = Modifier.size(20.dp)
                    )
                }
            }
        }
    }
}

/**
 * Frosted glass TopBar component matching Apple Music aesthetic
 */
@Composable
fun TopBar(
    title: String,
    subtitle: String? = null,
    hazeState: HazeState? = null,
    onProfileClick: () -> Unit = {},
    onEqClick: () -> Unit = {},
    modifier: Modifier = Modifier
) {
    FlowTopAppBar(
        title = title,
        subtitle = subtitle,
        hazeState = hazeState,
        onProfileClick = onProfileClick,
        onEqClick = onEqClick,
        modifier = modifier
    )
}

