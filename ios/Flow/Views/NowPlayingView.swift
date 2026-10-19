import SwiftUI

public struct NowPlayingView: View {
    @ObservedObject var audioEngine = FlowAudioEngine.shared
    @Environment(\.presentationMode) var presentationMode

    @State private var showLyrics = false
    @State private var showEqualizer = false
    @State private var showSleepTimer = false

    public init() {}

    public var body: some View {
        ZStack {
            // Ambient Backdrop Glow
            Color(hex: "#080b12").edgesIgnoringSafeArea(.all)

            Circle()
                .fill(Color(hex: "#00e5ff").opacity(0.18))
                .blur(radius: 90)
                .offset(x: -80, y: -160)

            Circle()
                .fill(Color(hex: "#a855f7").opacity(0.15))
                .blur(radius: 90)
                .offset(x: 100, y: 120)

            VStack(spacing: 24) {
                // Top Grabber & Dismiss
                HStack {
                    Button(action: { presentationMode.wrappedValue.dismiss() }) {
                        Image(systemName: "chevron.down")
                            .font(.system(size: 18, weight: .bold))
                            .foregroundColor(.white)
                    }
                    Spacer()
                    Text("NOW PLAYING")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.gray)
                        .tracking(1.5)
                    Spacer()
                    Button(action: { showEqualizer = true }) {
                        Image(systemName: "slider.vertical.3")
                            .font(.system(size: 18))
                            .foregroundColor(Color(hex: "#00e5ff"))
                    }
                }
                .padding(.horizontal, 24)
                .padding(.top, 16)

                Spacer()

                // Album Artwork
                AsyncImage(url: URL(string: audioEngine.currentTrack?.thumbnailUrl ?? "")) { phase in
                    if let image = phase.image {
                        image.resizable()
                            .aspectRatio(contentMode: .fill)
                    } else {
                        Rectangle().fill(Color(hex: "#111827"))
                    }
                }
                .frame(width: 300, height: 300)
                .cornerRadius(20)
                .shadow(color: Color.black.opacity(0.5), radius: 24, y: 12)

                Spacer()

                // Track Details & Badge
                VStack(alignment: .leading, spacing: 6) {
                    HStack {
                        VStack(alignment: .leading, spacing: 4) {
                            Text(audioEngine.currentTrack?.title ?? "No Track")
                                .font(.system(size: 22, weight: .bold))
                                .foregroundColor(.white)

                            Text(audioEngine.currentTrack?.artist ?? "")
                                .font(.system(size: 15))
                                .foregroundColor(.gray)
                        }
                        Spacer()

                        Text("FLAC 24-BIT")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(Color(hex: "#00e5ff"))
                            .padding(.horizontal, 8)
                            .padding(.vertical, 4)
                            .background(Color(hex: "#00e5ff").opacity(0.12))
                            .cornerRadius(6)
                    }

                    // Scrubber
                    VStack(spacing: 6) {
                        Slider(
                            value: Binding(
                                get: { audioEngine.currentTime },
                                set: { audioEngine.seek(to: $0) }
                            ),
                            in: 0...max(1.0, audioEngine.duration)
                        )
                        .accentColor(Color(hex: "#00e5ff"))

                        HStack {
                            Text(formatTime(audioEngine.currentTime))
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.gray)
                            Spacer()
                            Text(formatTime(audioEngine.duration))
                                .font(.system(size: 11, design: .monospaced))
                                .foregroundColor(.gray)
                        }
                    }
                    .padding(.top, 10)
                }
                .padding(.horizontal, 28)

                // Controls
                HStack(spacing: 48) {
                    Button(action: { showSleepTimer = true }) {
                        Image(systemName: "moon.fill")
                            .font(.system(size: 20))
                            .foregroundColor(.gray)
                    }

                    Button(action: {
                        if audioEngine.isPlaying {
                            audioEngine.pause()
                        } else {
                            audioEngine.resume()
                        }
                    }) {
                        Image(systemName: audioEngine.isPlaying ? "pause.circle.fill" : "play.circle.fill")
                            .font(.system(size: 64))
                            .foregroundColor(Color(hex: "#00e5ff"))
                    }

                    Button(action: { showLyrics = true }) {
                        Image(systemName: "quote.bubble.fill")
                            .font(.system(size: 20))
                            .foregroundColor(.gray)
                    }
                }
                .padding(.bottom, 36)
            }
        }
        .sheet(isPresented: $showLyrics) {
            if let lyrics = audioEngine.currentTrack?.lyrics {
                LyricsView(lines: lyrics)
            } else {
                Text("No Synced Lyrics Available")
                    .foregroundColor(.gray)
            }
        }
        .sheet(isPresented: $showEqualizer) {
            EqualizerView()
        }
        .sheet(isPresented: $showSleepTimer) {
            SleepTimerSheet()
        }
    }

    private func formatTime(_ sec: Double) -> String {
        let m = Int(sec) / 60
        let s = Int(sec) % 60
        return String(format: "%d:%02d", m, s)
    }
}
