import SwiftUI

/// 設定畫面（自動儲存）
struct SettingsView: View {
    @AppStorage("sens") private var sens = 18.0
    @AppStorage("accel") private var accel = 40.0
    @AppStorage("smooth") private var smooth = 45.0
    @AppStorage("dead") private var dead = 3.0
    @AppStorage("clickFreeze") private var clickFreeze = 160.0
    @AppStorage("scroll") private var scroll = 8.0
    @AppStorage("mode") private var mode = "flat"
    @AppStorage("invX") private var invX = false
    @AppStorage("invY") private var invY = false
    @AppStorage("invScroll") private var invScroll = false

    var body: some View {
        Form {
            Section("游標") {
                slider("靈敏度", $sens, 2...60, step: 1, value: "\(Int(sens)) px/°",
                       desc: "每轉 1 度移動的像素數")
                slider("加速度", $accel, 0...100, step: 5, value: "\(Int(accel))%",
                       desc: "越高：慢轉更精準、快轉移動更遠")
            }
            Section("防抖") {
                slider("平滑", $smooth, 0...100, step: 5, value: "\(Int(smooth))%",
                       desc: "越高越穩，但反應稍慢")
                slider("死區", $dead, 0...15, step: 0.5, value: String(format: "%.1f °/s", dead),
                       desc: "低於此轉速的晃動會被忽略")
                slider("點擊防抖時間", $clickFreeze, 0...400, step: 20, value: "\(Int(clickFreeze)) ms",
                       desc: "手指按下與放開後短暫凍結游標，避免點擊時游標偏移")
            }
            Section("捲動") {
                slider("捲動速度", $scroll, 1...30, step: 1, value: "\(Int(scroll))", desc: nil)
                Toggle("反轉捲動方向", isOn: $invScroll)
            }
            Section("握持方式") {
                Picker("握持方式", selection: $mode) {
                    Text("平放（螢幕朝上，上緣指向電腦）").tag("flat")
                    Text("直立（螢幕朝向自己，背面指向電腦）").tag("upright")
                }
                .pickerStyle(.inline)
                .labelsHidden()
                Toggle("反轉左右", isOn: $invX)
                Toggle("反轉上下", isOn: $invY)
            }
            Section {
                Button("恢復預設值", role: .destructive) {
                    Prefs.resetTuning()
                    sens = 18; accel = 40; smooth = 45; dead = 3; clickFreeze = 160; scroll = 8
                    mode = "flat"; invX = false; invY = false; invScroll = false
                }
            }
        }
        .navigationTitle("設定")
    }

    private func slider(_ title: String, _ binding: Binding<Double>, _ range: ClosedRange<Double>,
                        step: Double, value: String, desc: String?) -> some View {
        VStack(alignment: .leading, spacing: 6) {
            HStack {
                Text(title)
                Spacer()
                Text(value).foregroundStyle(.blue).monospacedDigit()
            }
            Slider(value: binding, in: range, step: step)
            if let desc {
                Text(desc).font(.caption).foregroundStyle(.secondary)
            }
        }
        .padding(.vertical, 2)
    }
}
