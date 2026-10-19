import SwiftUI

public struct EqualizerView: View {
    @ObservedObject var audioEngine = FlowAudioEngine.shared
    @Environment(\.presentationMode) var presentationMode

    let presets = ["Flat", "Bass Boost", "Vocal Clarity", "Electronic", "Rock"]

    public init() {}

    public var body: some View {
        NavigationView {
            VStack(spacing: 24) {
                // Preset Chips
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 10) {
                        ForEach(presets, id: \.self) { preset in
                            Button(action: {
                                audioEngine.applyPreset(preset)
                            }) {
                                Text(preset)
                                    .font(.system(size: 13, weight: .semibold))
                                    .padding(.horizontal, 16)
                                    .padding(.vertical, 8)
                                    .background(audioEngine.activePreset == preset ? Color(hex: "#00e5ff").opacity(0.2) : Color.white.opacity(0.06))
                                    .foregroundColor(audioEngine.activePreset == preset ? Color(hex: "#00e5ff") : .white)
                                    .cornerRadius(20)
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 20)
                                            .stroke(audioEngine.activePreset == preset ? Color(hex: "#00e5ff") : Color.clear, lineWidth: 1)
                                    )
                            }
                        }
                    }
                    .padding(.horizontal, 20)
                }

                // 8-Band Vertical Sliders
                HStack(spacing: 12) {
                    ForEach(0..<8, id: \.self) { index in
                        VStack {
                            Text("\(Int(audioEngine.bandGains[index])) dB")
                                .font(.system(size: 10, weight: .bold))
                                .foregroundColor(Color(hex: "#00e5ff"))

                            Slider(
                                value: $audioEngine.bandGains[index],
                                in: -12...12,
                                step: 1
                            )
                            .rotationEffect(.degrees(-90))
                            .frame(height: 180)

                            Text(formatFreq(audioEngine.eqBands[index]))
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.gray)
                        }
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 20)
                .background(Color(hex: "#0d131f"))
                .cornerRadius(16)

                Spacer()
            }
            .padding(.top, 20)
            .navigationTitle("8-Band Equalizer")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("Done") {
                        presentationMode.wrappedValue.dismiss()
                    }
                    .foregroundColor(Color(hex: "#00e5ff"))
                }
            }
            .background(Color(hex: "#080b12").edgesIgnoringSafeArea(.all))
        }
    }

    private func formatFreq(_ freq: Double) -> String {
        if freq >= 1000 {
            return "\(Int(freq / 1000))k"
        }
        return "\(Int(freq))"
    }
}
