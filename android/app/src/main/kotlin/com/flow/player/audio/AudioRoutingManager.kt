package com.flow.player.audio

import android.content.Context
import android.media.AudioDeviceCallback
import android.media.AudioDeviceInfo
import android.media.AudioManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import androidx.annotation.OptIn
import androidx.media3.common.util.UnstableApi
import androidx.media3.exoplayer.ExoPlayer
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

data class AudioRoute(
    val id: Int,
    val name: String,
    val type: Int,
    val isHiResDac: Boolean,
    val isBluetooth: Boolean,
    val isSelected: Boolean,
    val rawDeviceInfo: AudioDeviceInfo? = null,
    val sampleRateInfo: String = "32-bit Float Hi-Res"
)

/**
 * AudioRoutingManager
 * Discovers, monitors, and routes audio to device output endpoints:
 * - Internal 32-bit DAC & Hi-Res USB Audio Class 2.0 DACs
 * - Bluetooth A2DP & LE Audio Auracast
 * - 3.5mm wired analog headphones
 * - Internal stereo speakers
 */
class AudioRoutingManager(
    private val context: Context,
    private val player: ExoPlayer
) {
    private val audioManager = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager
    private var deviceCallback: AudioDeviceCallback? = null

    private val _availableRoutes = MutableStateFlow<List<AudioRoute>>(emptyList())
    val availableRoutes: StateFlow<List<AudioRoute>> = _availableRoutes.asStateFlow()

    private val _activeRoute = MutableStateFlow<AudioRoute?>(null)
    val activeRoute: StateFlow<AudioRoute?> = _activeRoute.asStateFlow()

    init {
        refreshRoutes()
        setupDeviceCallback()
    }

    private fun setupDeviceCallback() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val callback = object : AudioDeviceCallback() {
                override fun onAudioDevicesAdded(addedDevices: Array<out AudioDeviceInfo>?) {
                    refreshRoutes()
                }

                override fun onAudioDevicesRemoved(removedDevices: Array<out AudioDeviceInfo>?) {
                    refreshRoutes()
                }
            }
            audioManager.registerAudioDeviceCallback(callback, Handler(Looper.getMainLooper()))
            deviceCallback = callback
        }
    }

    fun refreshRoutes() {
        val routes = mutableListOf<AudioRoute>()
        val currentSelectedId = _activeRoute.value?.id

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val devices = audioManager.getDevices(AudioManager.GET_DEVICES_OUTPUTS)
            for (device in devices) {
                val isDac = device.type == AudioDeviceInfo.TYPE_USB_DEVICE ||
                            device.type == AudioDeviceInfo.TYPE_USB_HEADSET ||
                            device.type == AudioDeviceInfo.TYPE_WIRED_HEADPHONES

                val isBt = device.type == AudioDeviceInfo.TYPE_BLUETOOTH_A2DP ||
                           (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S && device.type == AudioDeviceInfo.TYPE_BLE_HEADSET)

                val name = when (device.type) {
                    AudioDeviceInfo.TYPE_BUILTIN_SPEAKER -> "Internal Stereo Speakers"
                    AudioDeviceInfo.TYPE_WIRED_HEADPHONES -> "3.5mm Headphone Jack (Direct DAC)"
                    AudioDeviceInfo.TYPE_WIRED_HEADSET -> "Wired Headset"
                    AudioDeviceInfo.TYPE_USB_DEVICE -> "USB Audio Class 2.0 DAC"
                    AudioDeviceInfo.TYPE_USB_HEADSET -> "USB-C Audio DAC"
                    AudioDeviceInfo.TYPE_BLUETOOTH_A2DP -> "Bluetooth A2DP Audio (${device.productName})"
                    else -> device.productName?.toString() ?: "Audio Output Endpoint"
                }

                val rateInfo = if (isDac) {
                    "32-bit Float / 192kHz Bit-Perfect"
                } else if (isBt) {
                    "Bluetooth High-Definition Audio"
                } else {
                    "Internal DAC Stereo Audio"
                }

                val isSelected = if (currentSelectedId != null) {
                    device.id == currentSelectedId
                } else {
                    device.type == AudioDeviceInfo.TYPE_USB_DEVICE ||
                    device.type == AudioDeviceInfo.TYPE_USB_HEADSET ||
                    device.type == AudioDeviceInfo.TYPE_WIRED_HEADPHONES ||
                    device.type == AudioDeviceInfo.TYPE_BUILTIN_SPEAKER
                }

                routes.add(
                    AudioRoute(
                        id = device.id,
                        name = name,
                        type = device.type,
                        isHiResDac = isDac,
                        isBluetooth = isBt,
                        isSelected = isSelected,
                        rawDeviceInfo = device,
                        sampleRateInfo = rateInfo
                    )
                )
            }
        }

        // Add System Default entry
        val defaultRoute = AudioRoute(
            id = -1,
            name = "System Default Audio Output",
            type = AudioDeviceInfo.TYPE_BUILTIN_SPEAKER,
            isHiResDac = false,
            isBluetooth = false,
            isSelected = routes.none { it.isSelected },
            rawDeviceInfo = null,
            sampleRateInfo = "System Adaptive Routing"
        )
        routes.add(0, defaultRoute)

        // Ensure exactly one route is marked selected
        val selected = routes.firstOrNull { it.isSelected } ?: routes.first()
        val finalRoutes = routes.map { it.copy(isSelected = it.id == selected.id) }

        _availableRoutes.value = finalRoutes
        _activeRoute.value = selected
    }

    @OptIn(UnstableApi::class)
    fun setPreferredRoute(route: AudioRoute) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            try {
                player.setPreferredAudioDevice(route.rawDeviceInfo)
                _activeRoute.value = route
                _availableRoutes.value = _availableRoutes.value.map {
                    it.copy(isSelected = it.id == route.id)
                }
            } catch (e: Exception) {
                android.util.Log.w("AudioRoutingManager", "Failed to set preferred audio device: ${e.message}")
            }
        }
    }

    fun release() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && deviceCallback != null) {
            audioManager.unregisterAudioDeviceCallback(deviceCallback)
            deviceCallback = null
        }
    }
}
