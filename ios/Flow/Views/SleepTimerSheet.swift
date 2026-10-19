import SwiftUI

public struct SleepTimerSheet: View {
    @ObservedObject var audioEngine = FlowAudioEngine.shared
    @Environment(\.presentationMode) var presentationMode

    let presets: [(Int, String)] = [
        (15, "15 Minutes"),
        (30, "30 Minutes"),
        (45, "45 Minutes"),
        (60, "1 Hour")
    ]

    public init() {}

    public var body: some View {
        VStack(spacing: 20) {
            Text("Sleep Timer")
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(.white)
                .padding(.top, 24)

            Text("Music fades out smoothly over the final 30 seconds.")
                .font(.system(size: 13))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)

            if let remaining = audioEngine.sleepTimerRemainingSec {
                Text("\(remaining / 60):\(String(format: "%02d", remaining % 60)) remaining")
                    .font(.system(size: 28, weight: .bold, design: .monospaced))
                    .foregroundColor(Color(hex: "#00e5ff"))
                    .padding(.vertical, 8)

                Button("Cancel Timer") {
                    audioEngine.cancelSleepTimer()
                }
                .foregroundColor(.red)
                .font(.system(size: 14, weight: .semibold))
            } else {
                VStack(spacing: 12) {
                    ForEach(presets, id: \.0) { minutes, label in
                        Button(action: {
                            audioEngine.startSleepTimer(minutes: minutes)
                            presentationMode.wrappedValue.dismiss()
                        }) {
                            Text(label)
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(.white)
                                .frame(maxWidth: .infinity)
                                .padding(.vertical, 14)
                                .background(Color(hex: "#111827"))
                                .cornerRadius(12)
                        }
                    }
                }
                .padding(.horizontal, 24)
            }

            Spacer()
        }
        .background(Color(hex: "#080b12").edgesIgnoringSafeArea(.all))
    }
}
