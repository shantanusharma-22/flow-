import Foundation
import MediaPlayer

public class AppleMusicScanner {
    public static func requestAndScan(completion: @escaping ([Track]) -> Void) {
        MPMediaLibrary.requestAuthorization { status in
            guard status == .authorized else {
                completion([])
                return
            }

            DispatchQueue.global(qos: .userInitiated).async {
                let query = MPMediaQuery.songs()
                guard let items = query.items else {
                    DispatchQueue.main.async { completion([]) }
                    return
                }

                var scannedTracks: [Track] = []
                for item in items {
                    guard let assetUrl = item.assetURL else { continue }
                    let title = item.title ?? "Unknown Title"
                    let artist = item.artist ?? "Local Artist"
                    let album = item.albumTitle ?? "Apple Music Collection"
                    let duration = Int(item.playbackDuration)

                    let track = Track(
                        id: "ios-\(item.persistentID)",
                        title: title,
                        artist: artist,
                        album: album,
                        durationSec: max(1, duration),
                        thumbnailUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80",
                        streamUrl: assetUrl.absoluteString,
                        audioFormat: "alac",
                        bitrateKbps: 1411
                    )
                    scannedTracks.append(track)
                }

                DispatchQueue.main.async {
                    completion(scannedTracks)
                }
            }
        }
    }
}
