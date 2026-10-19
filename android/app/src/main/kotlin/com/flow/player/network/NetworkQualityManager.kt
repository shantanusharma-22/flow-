package com.flow.player.network

import android.content.Context
import android.net.ConnectivityManager
import android.net.Network
import android.net.NetworkCapabilities
import android.net.NetworkRequest

enum class QualityCeiling(val codec: String, val maxBitrateKbps: Int) {
    LOSSLESS_FLAC("flac", 1411),
    HIGH_OPUS("opus", 320),
    DATA_SAVER_OPUS("opus", 160)
}

/**
 * NetworkQualityManager
 * Dynamically determines audio streaming quality ceiling based on active network:
 * - Wi-Fi / Ethernet: Bit-perfect 24-bit Studio FLAC
 * - Mobile Data: High-Density Opus (320 kbps) or Data-Saver (160 kbps)
 */
class NetworkQualityManager(
    context: Context,
    private val onQualityChanged: (QualityCeiling) -> Unit
) {

    private val connectivityManager =
        context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager

    private var currentCeiling: QualityCeiling = QualityCeiling.HIGH_OPUS

    private val networkCallback = object : ConnectivityManager.NetworkCallback() {
        override fun onCapabilitiesChanged(network: Network, capabilities: NetworkCapabilities) {
            val isWifi = capabilities.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                         capabilities.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET)

            val newCeiling = if (isWifi) {
                QualityCeiling.LOSSLESS_FLAC
            } else {
                QualityCeiling.HIGH_OPUS
            }

            if (newCeiling != currentCeiling) {
                currentCeiling = newCeiling
                onQualityChanged(newCeiling)
            }
        }
    }

    fun startMonitoring() {
        val request = NetworkRequest.Builder()
            .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
            .build()
        connectivityManager.registerNetworkCallback(request, networkCallback)
    }

    fun stopMonitoring() {
        try {
            connectivityManager.unregisterNetworkCallback(networkCallback)
        } catch (_: Exception) {}
    }

    fun getCurrentQuality(): QualityCeiling = currentCeiling
}
