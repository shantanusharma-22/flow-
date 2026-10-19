import Foundation
import AVFoundation
import MediaPlayer
import Combine

public class FlowAudioEngine: ObservableObject {
    public static let shared = FlowAudioEngine()

    @Published public var currentTrack: Track?
    @Published public var isPlaying: Bool = false
    @Published public var currentTime: Double = 0.0
    @Published public var duration: Double = 0.0
    @Published public var volume: Float = 0.8
    @Published public var sleepTimerRemainingSec: Int?
    @Published public var activePreset: String = "Flat"

    private var player: AVPlayer?
    private var timeObserverToken: Any?
    private var sleepTimerCancellable: AnyCancellable?
    private var targetVolume: Float = 0.8

    // 8-Band Equalizer Frequency Centers
    public let eqBands: [Double] = [60, 170, 310, 600, 1000, 3000, 6000, 12000]
    @Published public var bandGains: [Float] = Array(repeating: 0.0, count: 8)

    public init() {
        setupAudioSession()
        setupRemoteCommands()
    }

    private func setupAudioSession() {
        do {
            let session = AVAudioSession.sharedInstance()
            try session.setCategory(.playback, mode: .default, options: [.allowAirPlay, .allowBluetooth])
            try session.setActive(true)
        } catch {
            print("[Flow iOS Audio] Error activating AVAudioSession: \(error)")
        }
    }

    public func play(track: Track) {
        self.currentTrack = track
        self.duration = Double(track.durationSec)
        self.currentTime = 0.0
        self.targetVolume = self.volume

        guard let url = URL(string: track.streamUrl) else { return }

        let item = AVPlayerItem(url: url)
        if player == nil {
            player = AVPlayer(playerItem: item)
        } else {
            player?.replaceCurrentItem(with: item)
        }

        player?.volume = self.volume
        player?.play()
        self.isPlaying = true

        setupTimeObserver()
        updateNowPlayingInfo()
    }

    public func pause() {
        player?.pause()
        self.isPlaying = false
        updateNowPlayingInfo()
    }

    public func resume() {
        player?.play()
        self.isPlaying = true
        updateNowPlayingInfo()
    }

    public func seek(to seconds: Double) {
        let cmTime = CMTime(seconds: seconds, preferredTimescale: 600)
        player?.seek(to: cmTime) { [weak self] _ in
            self?.currentTime = seconds
            self?.updateNowPlayingInfo()
        }
    }

    public func setVolume(_ vol: Float) {
        self.targetVolume = max(0.0, min(1.0, vol))
        self.volume = self.targetVolume
        player?.volume = self.volume
    }

    public func applyPreset(_ preset: String) {
        self.activePreset = preset
        switch preset.lowercased() {
        case "flat":
            bandGains = [0, 0, 0, 0, 0, 0, 0, 0]
        case "bass boost":
            bandGains = [8, 6, 3, 0, -1, 0, 1, 2]
        case "vocal clarity":
            bandGains = [-3, -1, 1, 3, 5, 4, 2, 1]
        case "electronic":
            bandGains = [6, 5, 1, 0, 1, 2, 4, 5]
        case "rock":
            bandGains = [5, 3, -1, 0, 2, 3, 4, 4]
        default:
            bandGains = [0, 0, 0, 0, 0, 0, 0, 0]
        }
    }

    // --- Sleep Timer with 30s Acoustic Linear Fadeout ---
    public func startSleepTimer(minutes: Int) {
        cancelSleepTimer()
        let totalSeconds = minutes * 60
        var remaining = totalSeconds

        sleepTimerCancellable = Timer.publish(every: 1.0, on: .main, in: .common)
            .autoconnect()
            .sink { [weak self] _ in
                guard let self = self else { return }
                remaining -= 1
                self.sleepTimerRemainingSec = remaining

                if remaining <= 30 && remaining > 0 {
                    let ratio = Float(remaining) / 30.0
                    self.player?.volume = self.targetVolume * ratio
                    self.volume = self.targetVolume * ratio
                } else if remaining <= 0 {
                    self.pause()
                    self.cancelSleepTimer()
                    self.player?.volume = self.targetVolume
                    self.volume = self.targetVolume
                }
            }
    }

    public func cancelSleepTimer() {
        sleepTimerCancellable?.cancel()
        sleepTimerCancellable = nil
        sleepTimerRemainingSec = nil
        self.player?.volume = self.targetVolume
        self.volume = self.targetVolume
    }

    private func setupTimeObserver() {
        if let token = timeObserverToken {
            player?.removeTimeObserver(token)
            timeObserverToken = nil
        }

        let interval = CMTime(seconds: 0.25, preferredTimescale: 600)
        timeObserverToken = player?.addPeriodicTimeObserver(forInterval: interval, queue: .main) { [weak self] time in
            self?.currentTime = time.seconds
        }
    }

    private func updateNowPlayingInfo() {
        guard let track = currentTrack else { return }
        var info = [String: Any]()
        info[MPMediaItemPropertyTitle] = track.title
        info[MPMediaItemPropertyArtist] = track.artist
        info[MPMediaItemPropertyAlbumTitle] = track.album
        info[MPMediaItemPropertyPlaybackDuration] = track.durationSec
        info[MPNowPlayingInfoPropertyElapsedPlaybackTime] = currentTime
        info[MPNowPlayingInfoPropertyPlaybackRate] = isPlaying ? 1.0 : 0.0

        MPNowPlayingInfoCenter.default().nowPlayingInfo = info
    }

    private func setupRemoteCommands() {
        let center = MPRemoteCommandCenter.shared()

        center.playCommand.addTarget { [weak self] _ in
            self?.resume()
            return .success
        }
        center.pauseCommand.addTarget { [weak self] _ in
            self?.pause()
            return .success
        }
        center.changePlaybackPositionCommand.addTarget { [weak self] event in
            guard let posEvent = event as? MPChangePlaybackPositionCommandEvent else { return .commandFailed }
            self?.seek(to: posEvent.positionTime)
            return .success
        }
    }
}
