import SwiftUI

public struct LyricsView: View {
    @ObservedObject var audioEngine = FlowAudioEngine.shared
    let lines: [LyricsLine]

    public init(lines: [LyricsLine]) {
        self.lines = lines
    }

    public var body: some View {
        ScrollViewReader { proxy in
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 28) {
                    ForEach(Array(lines.enumerated()), id: \.element.id) { index, line in
                        let isActive = isLineActive(lineIndex: index)

                        VStack(alignment: .leading, spacing: 4) {
                            Text(line.text)
                                .font(.system(size: isActive ? 26 : 20, weight: isActive ? .bold : .medium, design: .rounded))
                                .foregroundColor(isActive ? .white : Color.white.opacity(0.35))
                                .blur(radius: isActive ? 0 : 0.4)
                                .scaleEffect(isActive ? 1.05 : 1.0, anchor: .leading)
                                .animation(.spring(response: 0.35, dampingFraction: 0.7), value: isActive)

                            if let romaji = line.romanized {
                                Text(romaji)
                                    .font(.system(size: 14, weight: .semibold))
                                    .foregroundColor(isActive ? Color(hex: "#00e5ff") : Color.white.opacity(0.2))
                            }

                            if let trans = line.translation {
                                Text(trans)
                                    .font(.system(size: 13, weight: .regular))
                                    .foregroundColor(isActive ? Color(hex: "#a855f7") : Color.white.opacity(0.2))
                            }
                        }
                        .id(line.id)
                        .onTapGesture {
                            audioEngine.seek(to: Double(line.timeMs) / 1000.0)
                        }
                    }
                }
                .padding(.horizontal, 24)
                .padding(.vertical, 40)
            }
            .onChange(of: audioEngine.currentTime) { newTime in
                if let activeLine = lines.last(where: { Double($0.timeMs) / 1000.0 <= newTime }) {
                    withAnimation(.easeInOut(duration: 0.4)) {
                        proxy.scrollTo(activeLine.id, anchor: .center)
                    }
                }
            }
        }
        .background(Color(hex: "#080b12").edgesIgnoringSafeArea(.all))
    }

    private func isLineActive(lineIndex: Int) -> Bool {
        let currentMs = Int(audioEngine.currentTime * 1000)
        let lineTime = lines[lineIndex].timeMs
        let nextTime = lineIndex < lines.count - 1 ? lines[lineIndex + 1].timeMs : Int.max
        return currentMs >= lineTime && currentMs < nextTime
    }
}
