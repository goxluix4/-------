import SwiftUI

@main
struct AirMouseApp: App {
    init() {
        Prefs.registerDefaults()
    }

    var body: some Scene {
        WindowGroup {
            ComputerListView()
                .preferredColorScheme(.dark)
        }
    }
}

/// 所有設定的鍵與預設值（和網頁版相同）
enum Prefs {
    static let defaults: [String: Any] = [
        "sens": 18.0,          // 每轉 1 度移動的像素
        "accel": 40.0,         // 加速度 %
        "smooth": 45.0,        // 平滑 %
        "dead": 3.0,           // 死區 °/s
        "clickFreeze": 160.0,  // 點擊防抖 ms
        "scroll": 8.0,         // 捲動速度
        "mode": "flat",        // flat / upright
        "invX": false,
        "invY": false,
        "invScroll": false,
        "biasX": 0.0,
        "biasY": 0.0,
        "lastPc": "",
    ]

    static func registerDefaults() {
        UserDefaults.standard.register(defaults: defaults)
    }

    static func resetTuning() {
        let d = UserDefaults.standard
        for key in ["sens", "accel", "smooth", "dead", "clickFreeze", "scroll", "mode", "invX", "invY", "invScroll"] {
            d.removeObject(forKey: key)
        }
    }
}
