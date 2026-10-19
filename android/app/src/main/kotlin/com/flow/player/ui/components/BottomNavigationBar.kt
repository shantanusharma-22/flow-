package com.flow.player.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.Explore
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.LibraryMusic
import androidx.compose.material.icons.rounded.Search
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.flow.player.ui.theme.AppleMusicRed
import com.flow.player.ui.theme.AppleMusicTextSecondary
import dev.chrisbanes.haze.HazeState

enum class NavigationTab(val title: String, val icon: ImageVector) {
    HOME("Home", Icons.Rounded.Home),
    EXPLORE("Explore", Icons.Rounded.Explore),
    LIBRARY("Library", Icons.Rounded.LibraryMusic),
    SEARCH("Search", Icons.Rounded.Search)
}

@Composable
fun FlowBottomNavigationBar(
    currentTab: NavigationTab,
    onTabSelected: (NavigationTab) -> Unit,
    hazeState: HazeState? = null,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .fillMaxWidth()
            .appleFrostedGlass(
                hazeState = hazeState,
                shape = RoundedCornerShape(topStart = 0.dp, topEnd = 0.dp),
                tint = Color(0xDD0D0D10),
                borderWidth = 0.5.dp,
                borderColor = Color(0x22FFFFFF)
            )
            .navigationBarsPadding()
            .padding(vertical = 6.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceAround,
            verticalAlignment = Alignment.CenterVertically
        ) {
            NavigationTab.values().forEach { tab ->
                val isSelected = tab == currentTab
                val contentColor by animateColorAsState(
                    targetValue = if (isSelected) AppleMusicRed else AppleMusicTextSecondary,
                    animationSpec = spring(),
                    label = "tab_color"
                )

                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null
                        ) {
                            onTabSelected(tab)
                        }
                        .padding(horizontal = 16.dp, vertical = 4.dp)
                ) {
                    Icon(
                        imageVector = tab.icon,
                        contentDescription = tab.title,
                        tint = contentColor,
                        modifier = Modifier.size(24.dp)
                    )
                    Text(
                        text = tab.title,
                        color = contentColor,
                        fontSize = 11.sp,
                        fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal,
                        modifier = Modifier.padding(top = 2.dp)
                    )
                }
            }
        }
    }
}

/**
 * Translucent frosted glass BottomBar matching Apple Music aesthetic
 */
@Composable
fun BottomBar(
    currentTab: NavigationTab,
    onTabSelected: (NavigationTab) -> Unit,
    hazeState: HazeState? = null,
    modifier: Modifier = Modifier
) {
    FlowBottomNavigationBar(
        currentTab = currentTab,
        onTabSelected = onTabSelected,
        hazeState = hazeState,
        modifier = modifier
    )
}

