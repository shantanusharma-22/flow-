import Foundation

public struct LyricsLine: Identifiable, Codable, Equatable {
    public let id: String
    public let timeMs: Int
    public let text: String
    public let romanized: String?
    public let translation: String?

    public init(id: String = UUID().uuidString, timeMs: Int, text: String, romanized: String? = null, translation: String? = null) {
        self.id = id
        self.timeMs = timeMs
        self.text = text
        self.romanized = romanized
        self.translation = translation
    }
}

public struct Track: Identifiable, Codable, Equatable {
    public let id: String
    public let title: String
    public let artist: String
    public let album: String
    public let durationSec: Int
    public let thumbnailUrl: String
    public let streamUrl: String
    public let audioFormat: String
    public let bitrateKbps: Int
    public var lyrics: [LyricsLine]?

    public init(
        id: String,
        title: String,
        artist: String,
        album: String,
        durationSec: Int,
        thumbnailUrl: String,
        streamUrl: String,
        audioFormat: String = "flac",
        bitrateKbps: Int = 1411,
        lyrics: [LyricsLine]? = nil
    ) {
        self.id = id
        self.title = title
        self.artist = artist
        self.album = album
        self.durationSec = durationSec
        self.thumbnailUrl = thumbnailUrl
        self.streamUrl = streamUrl
        self.audioFormat = audioFormat
        self.bitrateKbps = bitrateKbps
        self.lyrics = lyrics
    }
}
