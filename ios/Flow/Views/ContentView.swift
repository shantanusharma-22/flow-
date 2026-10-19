import SwiftUI

public struct ContentView: View {
    @ObservedObject var audioEngine = FlowAudioEngine.shared
    @State private var showFullPlayer = false
    @State private var searchText = ""
    @State private var localTracks: [Track] = []
    @State private var trendingTracks: [Track] = []
    @State private var searchResults: [Track] = []
    @State private var isSearching = false

    let sampleCatalog: [Track] = [
        Track(
            id: "trk-1",
            title: "Midnight City Pulse",
            artist: "Kavinsky & The Midnight",
            album: "Synthwave Odyssey",
            durationSec: 234,
            thumbnailUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=500&auto=format&fit=crop&q=80",
            streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            audioFormat: "flac",
            bitrateKbps: 1411
        ),
        Track(
            id: "trk-2",
            title: "Echoes of Shibuya",
            artist: "Tokyo Lo-Fi Collective",
            album: "Rainy Shinjuku Beats",
            durationSec: 176,
            thumbnailUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&auto=format&fit=crop&q=80",
            streamUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            audioFormat: "flac",
            bitrateKbps: 1411
        )
    ]

    public init() {}

    public var body: some View {
        ZStack(alignment: .bottom) {
            TabView {
                // Home Tab
                NavigationView {
                    ScrollView {
                        VStack(alignment: .leading, spacing: 20) {
                            Text("Trending on Flow")
                                .font(.system(size: 20, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal)

                            let displayedTracks = trendingTracks.isEmpty ? sampleCatalog : trendingTracks
                            ForEach(displayedTracks) { track in
                                HStack(spacing: 14) {
                                    AsyncImage(url: URL(string: track.thumbnailUrl)) { phase in
                                        if let img = phase.image {
                                            img.resizable().aspectRatio(contentMode: .fill)
                                        } else {
                                            Rectangle().fill(Color(hex: "#111827"))
                                        }
                                    }
                                    .frame(width: 52, height: 52)
                                    .cornerRadius(10)

                                    VStack(alignment: .leading, spacing: 4) {
                                        Text(track.title)
                                            .font(.system(size: 15, weight: .semibold))
                                            .foregroundColor(.white)
                                        Text(track.artist)
                                            .font(.system(size: 13))
                                            .foregroundColor(.gray)
                                    }

                                    Spacer()

                                    Text(track.audioFormat.uppercased())
                                        .font(.system(size: 9, weight: .bold))
                                        .foregroundColor(Color(hex: "#00e5ff"))
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 3)
                                        .background(Color(hex: "#00e5ff").opacity(0.12))
                                        .cornerRadius(4)
                                }
                                .padding(.horizontal)
                                .contentShape(Rectangle())
                                .onTapGesture {
                                    audioEngine.play(track: track)
                                }
                            }
                        }
                        .padding(.top, 16)
                        .padding(.bottom, 90)
                    }
                    .background(Color(hex: "#080b12").edgesIgnoringSafeArea(.all))
                    .navigationTitle("Flow")
                }
                .tabItem {
                    Label("Home", systemImage: "house.fill")
                }

                // Search Tab
                NavigationView {
                    VStack {
                        // Spotify Link Banner
                        if searchText.contains("spotify.com") || searchText.starts(with: "spotify:") {
                            HStack {
                                Image(systemName: "antenna.radiowaves.left.and.right")
                                    .foregroundColor(Color(hex: "#1ed760"))
                                Text("Spotify URI link detected: auto-resolving to Hi-Res stream")
                                    .font(.system(size: 12, weight: .medium))
                                    .foregroundColor(Color(hex: "#1ed760"))
                            }
                            .padding(10)
                            .background(Color(hex: "#1ed760").opacity(0.12))
                            .cornerRadius(10)
                            .padding(.horizontal)
                        }

                        let searchList = !searchResults.isEmpty ? searchResults : sampleCatalog.filter {
                            searchText.isEmpty || $0.title.localizedCaseInsensitiveContains(searchText) || $0.artist.localizedCaseInsensitiveContains(searchText)
                        }

                        List(searchList) { track in
                            HStack {
                                VStack(alignment: .leading) {
                                    Text(track.title).foregroundColor(.white)
                                    Text(track.artist).font(.subheadline).foregroundColor(.gray)
                                }
                                Spacer()
                                Button(action: { audioEngine.play(track: track) }) {
                                    Image(systemName: "play.circle.fill")
                                        .foregroundColor(Color(hex: "#00e5ff"))
                                        .font(.system(size: 24))
                                }
                            }
                            .listRowBackground(Color(hex: "#0d131f"))
                        }
                        .searchable(text: $searchText, prompt: "Search YouTube Music songs...")
                        .onChange(of: searchText) { newQuery in
                            guard !newQuery.trimmingCharacters(in: .whitespaces).isEmpty else {
                                searchResults = []
                                return
                            }
                            Task {
                                do {
                                    let results = try await FlowApiService.shared.searchTracks(query: newQuery)
                                    await MainActor.run {
                                        self.searchResults = results
                                    }
                                } catch {
                                    // Keep local filter fallback
                                }
                            }
                        }
                        .scrollContentBackground(.hidden)
                    }
                    .background(Color(hex: "#080b12").edgesIgnoringSafeArea(.all))
                    .navigationTitle("Search")
                }
                .tabItem {
                    Label("Search", systemImage: "magnifyingglass")
                }
            }
            .accentColor(Color(hex: "#00e5ff"))

            // Mini-Player Dock
            if let track = audioEngine.currentTrack {
                HStack(spacing: 12) {
                    AsyncImage(url: URL(string: track.thumbnailUrl)) { phase in
                        if let img = phase.image {
                            img.resizable().aspectRatio(contentMode: .fill)
                        } else {
                            Rectangle().fill(Color(hex: "#111827"))
                        }
                    }
                    .frame(width: 44, height: 44)
                    .cornerRadius(8)

                    VStack(alignment: .leading, spacing: 2) {
                        Text(track.title)
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.white)
                            .lineLimit(1)
                        Text(track.artist)
                            .font(.system(size: 11))
                            .foregroundColor(.gray)
                            .lineLimit(1)
                    }

                    Spacer()

                    Button(action: {
                        if audioEngine.isPlaying {
                            audioEngine.pause()
                        } else {
                            audioEngine.resume()
                        }
                    }) {
                        Image(systemName: audioEngine.isPlaying ? "pause.fill" : "play.fill")
                            .font(.system(size: 18))
                            .foregroundColor(.white)
                    }
                    .padding(.trailing, 8)
                }
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(Color(hex: "#111827"))
                .cornerRadius(14)
                .shadow(color: Color.black.opacity(0.4), radius: 10, y: 4)
                .padding(.horizontal, 12)
                .padding(.bottom, 56)
                .onTapGesture {
                    showFullPlayer = true
                }
            }
        }
        .task {
            do {
                let feed = try await FlowApiService.shared.fetchExploreFeed()
                if !feed.isEmpty {
                    await MainActor.run {
                        self.trendingTracks = feed
                    }
                }
            } catch {
                // Keep sample fallback
            }
        }
        .sheet(isPresented: $showFullPlayer) {
            NowPlayingView()
        }
    }
}
