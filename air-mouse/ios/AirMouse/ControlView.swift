import SwiftUI
import UIKit

/// 控制畫面：陀螺儀移動游標 + 左右半邊點擊 + 雙指捲動
struct ControlView: View {
    let computer: Computer

    @Environment(\.dismiss) private var dismiss
    @Environment(\.scenePhase) private var scenePhase
    @StateObject private var conn: PCConnection
    @StateObject private var motion = MotionController()
    @State private var showSettings = false
    @State private var calibMessage: String?
    @State private var flashLeft = false
    @State private var flashRight = false

    init(computer: Computer) {
        self.computer = computer
        _conn = StateObject(wrappedValue: PCConnection(computer: computer))
    }

    var body: some View {
        VStack(spacing: 0) {
            topBar
            ZStack {
                HStack(spacing: 0) {
                    half(title: "左鍵", hint: "點一下｜長按拖曳",
                         color: Color(red: 0.11, green: 0.16, blue: 0.23), flash: flashLeft)
                    Rectangle().fill(Color.white.opacity(0.08)).frame(width: 1)
                    half(title: "右鍵", hint: "點一下",
                         color: Color(red: 0.16, green: 0.11, blue: 0.20), flash: flashRight)
                }
                .opacity(motion.paused ? 0.45 : 1)

                TouchPad(
                    onFinger: { down in motion.fingerDown = down },
                    onDrag: { on in
                        motion.dragging = on
                        conn.button("left", on ? "down" : "up")
                        flashLeft = on
                    },
                    onClick: { side in
                        conn.click(side)
                        flash(side)
                    },
                    onScroll: { dx, dy in conn.scroll(dx: dx, dy: dy) },
                    onAllUp: {
                        let ms = UserDefaults.standard.double(forKey: "clickFreeze")
                        motion.freezeUntil = CACurrentMediaTime() + ms / 1000
                        motion.resetMotion()
                    }
                )

                VStack {
                    Spacer()
                    Text("轉動手機移動游標 · 雙指滑動捲動")
                        .font(.caption).foregroundStyle(.secondary)
                        .padding(.bottom, 8)
                }
                .allowsHitTesting(false)

                if let msg = calibMessage {
                    VStack(spacing: 12) {
                        Text("🎯 陀螺儀校正").font(.title2.bold())
                        Text("請把手機平放在桌上，保持不動").foregroundStyle(.secondary)
                        Text(msg).font(.largeTitle)
                    }
                    .padding(28)
                    .background(RoundedRectangle(cornerRadius: 18).fill(Color(white: 0.12)))
                }
            }
        }
        .background(Color(red: 0.07, green: 0.08, blue: 0.09).ignoresSafeArea())
        .statusBarHidden(false)
        .sheet(isPresented: $showSettings) {
            NavigationStack {
                SettingsView()
                    .toolbar {
                        ToolbarItem(placement: .confirmationAction) {
                            Button("完成") { showSettings = false }
                        }
                    }
            }
        }
        .onAppear {
            let connection = conn
            motion.onMove = { [weak connection] dx, dy in connection?.move(dx, dy) }
            conn.start()
            motion.start()
            UIApplication.shared.isIdleTimerDisabled = true
        }
        .onDisappear {
            motion.stop()
            conn.stop()
            UIApplication.shared.isIdleTimerDisabled = false
        }
        .onChange(of: scenePhase) { phase in
            if phase == .active {
                conn.stop(); conn.start(); motion.start()
            } else if phase == .background {
                motion.stop()
            }
        }
    }

    // MARK: - 上方工具列

    private var topBar: some View {
        HStack(spacing: 10) {
            Button {
                dismiss()
            } label: {
                Image(systemName: "chevron.left").font(.title3.weight(.semibold))
            }
            Circle().fill(statusColor).frame(width: 10, height: 10)
            VStack(alignment: .leading, spacing: 1) {
                Text(computer.name).font(.subheadline.bold()).lineLimit(1)
                Text(statusText).font(.caption2).foregroundStyle(.secondary).lineLimit(1)
            }
            Spacer()
            barButton(motion.paused ? "play.fill" : "pause.fill", highlighted: motion.paused) {
                motion.paused.toggle()
                motion.resetMotion()
            }
            barButton("scope") { calibrate() }
            barButton("gearshape") { showSettings = true }
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 10)
        .background(Color(red: 0.11, green: 0.13, blue: 0.15))
    }

    private func barButton(_ icon: String, highlighted: Bool = false, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Image(systemName: icon)
                .frame(width: 42, height: 36)
                .background(RoundedRectangle(cornerRadius: 10).fill(highlighted ? Color.orange : Color(white: 0.18)))
                .foregroundStyle(highlighted ? Color.black : Color.white)
        }
    }

    private var statusColor: Color {
        switch conn.status {
        case .connected: return .green
        case .connecting: return .orange
        case .failed: return .red
        }
    }

    private var statusText: String {
        if !motion.available { return "這支手機沒有陀螺儀" }
        switch conn.status {
        case .connecting: return "連線中…"
        case let .failed(msg): return msg
        case .connected:
            var s = "已連線"
            if let ms = conn.latency { s += " · \(ms) ms" }
            if motion.paused { s += " · 已暫停" }
            return s
        }
    }

    // MARK: - 畫面元件

    private func half(title: String, hint: String, color: Color, flash: Bool) -> some View {
        VStack(spacing: 6) {
            Text(title).font(.title2)
            Text(hint).font(.caption)
        }
        .foregroundStyle(.secondary)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(color.brightness(flash ? 0.25 : 0))
    }

    private func flash(_ side: String) {
        if side == "left" { flashLeft = true } else { flashRight = true }
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.12) {
            if side == "left" { if !motion.dragging { flashLeft = false } } else { flashRight = false }
        }
    }

    private func calibrate() {
        calibMessage = "3"
        DispatchQueue.main.asyncAfter(deadline: .now() + 0.7) { calibMessage = "2" }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.4) { calibMessage = "1" }
        DispatchQueue.main.asyncAfter(deadline: .now() + 2.1) {
            calibMessage = "量測中…"
            motion.calibrate { ok in
                calibMessage = ok ? "✅ 完成" : "⚠️ 沒收到感測器資料"
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.8) { calibMessage = nil }
            }
        }
    }
}

// MARK: - 多點觸控區（用 UIKit 取得精確的觸控資訊）

struct TouchPad: UIViewRepresentable {
    var onFinger: (Bool) -> Void
    var onDrag: (Bool) -> Void
    var onClick: (String) -> Void
    var onScroll: (Double, Double) -> Void
    var onAllUp: () -> Void

    func makeUIView(context: Context) -> PadView {
        let v = PadView()
        update(v)
        return v
    }

    func updateUIView(_ view: PadView, context: Context) {
        update(view)
    }

    private func update(_ v: PadView) {
        v.onFinger = onFinger
        v.onDrag = onDrag
        v.onClick = onClick
        v.onScroll = onScroll
        v.onAllUp = onAllUp
    }
}

final class PadView: UIView {
    var onFinger: ((Bool) -> Void)?
    var onDrag: ((Bool) -> Void)?
    var onClick: ((String) -> Void)?
    var onScroll: ((Double, Double) -> Void)?
    var onAllUp: (() -> Void)?

    private let tapMaxTime = 0.35
    private let tapMaxMove: CGFloat = 18
    private let longPress = 0.45
    private let pxPerNotch = 30.0

    private var startPoint: CGPoint?
    private var startTime: CFTimeInterval = 0
    private var startSide = "left"
    private var multi = false
    private var dragging = false
    private var scrollLast: CGPoint?
    private var longTimer: Timer?
    private let tapHaptic = UIImpactFeedbackGenerator(style: .light)
    private let dragHaptic = UIImpactFeedbackGenerator(style: .medium)

    override init(frame: CGRect) {
        super.init(frame: frame)
        isMultipleTouchEnabled = true
        backgroundColor = .clear
    }

    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    private func active(_ event: UIEvent?) -> [UITouch] {
        (event?.allTouches ?? []).filter { $0.phase != .ended && $0.phase != .cancelled }
    }

    private func center(_ touches: [UITouch]) -> CGPoint {
        let pts = touches.map { $0.location(in: self) }
        let n = CGFloat(max(pts.count, 1))
        return CGPoint(x: pts.map(\.x).reduce(0, +) / n, y: pts.map(\.y).reduce(0, +) / n)
    }

    override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
        let act = active(event)
        if act.count == 1 && !multi {
            let p = act[0].location(in: self)
            startPoint = p
            startTime = CACurrentMediaTime()
            startSide = p.x < bounds.midX ? "left" : "right"
            onFinger?(true)
            tapHaptic.prepare()
            longTimer?.invalidate()
            if startSide == "left" {
                longTimer = Timer.scheduledTimer(withTimeInterval: longPress, repeats: false) { [weak self] _ in
                    guard let self, self.startPoint != nil, !self.multi else { return }
                    self.dragging = true
                    self.onDrag?(true)
                    self.dragHaptic.impactOccurred()
                }
            }
        } else if act.count >= 2 {
            multi = true
            longTimer?.invalidate()
            scrollLast = center(act)
            onFinger?(true)
        }
    }

    override func touchesMoved(_ touches: Set<UITouch>, with event: UIEvent?) {
        let act = active(event)
        if act.count >= 2, let last = scrollLast {
            let c = center(act)
            let dx = Double(c.x - last.x)
            let dy = Double(c.y - last.y)
            scrollLast = c
            let d = UserDefaults.standard
            let speed = d.double(forKey: "scroll") / 8
            let inv = d.bool(forKey: "invScroll") ? -1.0 : 1.0
            // 手指往上滑 → 內容往上走（像手機）→ 滾輪往下
            let wy = dy / pxPerNotch * speed * inv
            let wx = -dx / pxPerNotch * speed * inv
            if abs(wx) > 0.001 || abs(wy) > 0.001 { onScroll?(wx, wy) }
        } else if act.count == 1, let s = startPoint, !dragging {
            let p = act[0].location(in: self)
            if hypot(p.x - s.x, p.y - s.y) > tapMaxMove { longTimer?.invalidate() }
        }
    }

    override func touchesEnded(_ touches: Set<UITouch>, with event: UIEvent?) {
        finish(touches, event)
    }

    override func touchesCancelled(_ touches: Set<UITouch>, with event: UIEvent?) {
        finish(touches, event)
    }

    private func finish(_ touches: Set<UITouch>, _ event: UIEvent?) {
        let remaining = active(event)
        if remaining.isEmpty {
            longTimer?.invalidate()
            if dragging {
                dragging = false
                onDrag?(false)
            } else if let s = startPoint, !multi, let t = touches.first {
                let p = t.location(in: self)
                if CACurrentMediaTime() - startTime < tapMaxTime && hypot(p.x - s.x, p.y - s.y) < tapMaxMove {
                    onClick?(startSide)
                    tapHaptic.impactOccurred()
                }
            }
            startPoint = nil
            multi = false
            scrollLast = nil
            onFinger?(false)
            onAllUp?()
        } else if multi {
            // 手指數量改變：重設捲動起點，避免跳動
            scrollLast = remaining.count >= 2 ? center(remaining) : nil
        }
    }
}
