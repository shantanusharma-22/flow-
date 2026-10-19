package com.flow.player.neuro

import com.flow.player.data.model.AcousticFeatures
import com.flow.player.data.model.MusicTrack
import kotlin.math.abs
import kotlin.math.sqrt

/**
 * FlowNeuroEngine
 * Flow's on-device neural acoustic recommendation engine.
 * Computes multidimensional vector distance across acoustic traits (tempo, energy, valence, danceability, acousticness)
 * and continuously updates user affinities based on listening behavior.
 */
class FlowNeuroEngine {

    // User's evolving dynamic acoustic preference vector
    var userProfile = AcousticFeatures(
        tempo = 125f,
        energy = 0.75f,
        valence = 0.65f,
        danceability = 0.70f,
        acousticness = 0.15f
    )
        private set

    private val playHistory = mutableListOf<String>()
    private val artistAffinity = mutableMapOf<String, Float>()

    /**
     * Updates user's neural profile dynamically when listening events occur
     */
    fun recordFeedback(track: MusicTrack, listenedRatio: Float, wasSkipped: Boolean, isLiked: Boolean) {
        playHistory.add(track.id)
        if (playHistory.size > 50) playHistory.removeAt(0)

        // Compute weight multiplier:
        // Completed track (+1.0), Liked (+2.0), Skipped early (-1.5)
        val weight = when {
            isLiked -> 0.25f
            wasSkipped && listenedRatio < 0.25f -> -0.15f
            listenedRatio > 0.8f -> 0.12f
            else -> 0.05f
        }

        val feat = track.acousticFeatures
        val artist = track.artist

        // Adjust artist affinity
        val currentArtistAff = artistAffinity.getOrDefault(artist, 1.0f)
        artistAffinity[artist] = (currentArtistAff + weight).coerceIn(0.2f, 3.0f)

        // Shift user vector towards or away from track features
        userProfile = AcousticFeatures(
            tempo = (userProfile.tempo + (feat.tempo - userProfile.tempo) * (weight * 0.2f)).coerceIn(60f, 200f),
            energy = (userProfile.energy + (feat.energy - userProfile.energy) * weight).coerceIn(0f, 1f),
            valence = (userProfile.valence + (feat.valence - userProfile.valence) * weight).coerceIn(0f, 1f),
            danceability = (userProfile.danceability + (feat.danceability - userProfile.danceability) * weight).coerceIn(0f, 1f),
            acousticness = (userProfile.acousticness + (feat.acousticness - userProfile.acousticness) * weight).coerceIn(0f, 1f)
        )
    }

    /**
     * Calculates acoustic affinity score between 0.0 and 1.0 using Euclidean distance in normalized feature space
     */
    fun calculateAffinity(track: MusicTrack): Float {
        val f = track.acousticFeatures
        val u = userProfile

        val dTempo = abs(f.tempo - u.tempo) / 140f // normalized
        val dEnergy = abs(f.energy - u.energy)
        val dValence = abs(f.valence - u.valence)
        val dDance = abs(f.danceability - u.danceability)
        val dAcoustic = abs(f.acousticness - u.acousticness)

        val distance = sqrt(
            (dTempo * dTempo) +
            (dEnergy * dEnergy * 1.5f) +
            (dValence * dValence * 1.2f) +
            (dDance * dDance * 1.3f) +
            (dAcoustic * dAcoustic)
        )

        val artistMultiplier = artistAffinity.getOrDefault(track.artist, 1.0f)
        val baseScore = (1.0f / (1.0f + distance)) * artistMultiplier

        return baseScore.coerceIn(0f, 1f)
    }

    /**
     * Recommends the next best track from candidate pool, avoiding recent history
     */
    fun recommendNextTrack(
        candidatePool: List<MusicTrack>,
        excludeIds: Set<String>
    ): MusicTrack? {
        val candidates = candidatePool.filter { it.id !in excludeIds }
        if (candidates.isEmpty()) return candidatePool.firstOrNull()

        return candidates.maxByOrNull { calculateAffinity(it) }
    }

    /**
     * Generates a curated queue of recommended tracks
     */
    fun generatePersonalizedQueue(
        candidatePool: List<MusicTrack>,
        count: Int = 5,
        excludeIds: Set<String> = emptySet()
    ): List<MusicTrack> {
        val available = candidatePool.filter { it.id !in excludeIds }.toMutableList()
        val result = mutableListOf<MusicTrack>()

        for (i in 0 until count) {
            if (available.isEmpty()) break
            val best = available.maxByOrNull { calculateAffinity(it) } ?: break
            result.add(best)
            available.remove(best)
        }

        return result
    }

    /**
     * Groups recommendations into themed FlowNeuro clusters for the Home screen
     */
    fun getPersonalizedClusters(allTracks: List<MusicTrack>): Map<String, List<MusicTrack>> {
        val highEnergy = allTracks.filter { it.acousticFeatures.energy >= 0.7f }
        val chillAmbient = allTracks.filter { it.acousticFeatures.energy < 0.5f || it.acousticFeatures.acousticness > 0.5f }
        val feelGood = allTracks.filter { it.acousticFeatures.valence >= 0.6f }
        val topPicks = allTracks.sortedByDescending { calculateAffinity(it) }

        return mapOf(
            "FlowNeuro: Recommended For You" to topPicks.take(6),
            "Neural Energy Uplift" to highEnergy.take(6),
            "Late Night Ambient & Chill" to chillAmbient.take(6),
            "Feel Good Dopamine Mix" to feelGood.take(6)
        )
    }
}
