import CoreMotion
import Foundation
import QuartzCore

/// 陀螺儀 → 游標位移（演算法和網頁版相同：校正零點、自動漂移修正、平滑、死區、加速度）
final class MotionController: ObservableObject {
    @Published var paused = false
    @Published private(set) var available = true

    /// 每次有位移要送出時呼叫（像素）
    var onMove: ((Double, Double) -> Void)?

    // 由觸控區設定：按著手指（非拖曳）時、放開後一小段時間內不移動，避免點擊時游標偏掉
    var fingerDown = false
    var dragging = false
    var freezeUntil: CFTimeInterval = 0

    private let manager = CMMotionManager()
    private var sx = 0.0, sy = 0.0       // 平滑後的角速度
    private var accX = 0.0, accY = 0.0   // 尚未送出的像素
    private var biasX = 0.0, biasY = 0.0
    private var lastT: TimeInterval = 0
    private var calibSamples: [(Double, Double)]?

    func start() {
        guard manager.isDeviceMotionAvailable else {
            available = false
            return
        }
        let d = UserDefaults.standard
        biasX = d.double(forKey: "biasX")
        biasY = d.double(forKey: "biasY")
        lastT = 0
        manager.deviceMotionUpdateInterval = 1.0 / 60.0
        manager.startDeviceMotionUpdates(to: .main) { [weak self] motion, _ in
            guard let self, let motion else { return }
            self.process(motion)
        }
    }

    func stop() {
        manager.stopDeviceMotionUpdates()
    }

    func resetMotion() {
        sx = 0; sy = 0; accX = 0; accY = 0
    }

    /// 手機平放 1.5 秒，量測零點
    func calibrate(completion: @escaping (Bool) -> Void) {
        calibSamples = []
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { [weak self] in
            guard let self else { return }
            let samples = self.calibSamples ?? []
            self.calibSamples = nil
            guard samples.count > 10 else {
                completion(false)
                return
            }
            self.biasX = samples.map { $0.0 }.reduce(0, +) / Double(samples.count)
            self.biasY = samples.map { $0.1 }.reduce(0, +) / Double(samples.count)
            UserDefaults.standard.set(self.biasX, forKey: "biasX")
            UserDefaults.standard.set(self.biasY, forKey: "biasY")
            self.resetMotion()
            completion(true)
        }
    }

    private func process(_ motion: CMDeviceMotion) {
        let d = UserDefaults.standard
        var dt = lastT == 0 ? 1.0 / 60.0 : motion.timestamp - lastT
        lastT = motion.timestamp
        if dt <= 0 || dt > 0.1 { dt = 1.0 / 60.0 }

        // CoreMotion 單位是 rad/s，換成 °/s
        let k = 180.0 / Double.pi
        let gx = motion.rotationRate.x * k
        let gy = motion.rotationRate.y * k
        let gz = motion.rotationRate.z * k

        // 依握持方式取出水平 / 垂直角速度
        var rx: Double
        var ry: Double
        if d.string(forKey: "mode") == "upright" {
            rx = -gy; ry = -gx
        } else {
            rx = -gz; ry = -gx
        }

        if calibSamples != nil {
            calibSamples?.append((rx, ry))
            return
        }

        rx -= biasX
        ry -= biasY

        // 自動漂移修正：幾乎靜止時慢慢追上零點
        if hypot(rx, ry) < 1.2 {
            biasX += rx * 0.005
            biasY += ry * 0.005
        }

        // 防抖 1：指數平滑（低通濾波），時間常數 0~120ms
        let tau = d.double(forKey: "smooth") / 100 * 0.12
        let a = tau > 0 ? 1 - exp(-dt / tau) : 1
        sx += (rx - sx) * a
        sy += (ry - sy) * a

        // 防抖 2：柔性死區
        let dead = d.double(forKey: "dead")
        var mag = hypot(sx, sy)
        var vx = 0.0, vy = 0.0
        if mag > dead {
            let f = (mag - dead) / mag
            vx = sx * f; vy = sy * f
            mag -= dead
        }

        // 加速度曲線
        let ac = d.double(forKey: "accel") / 100
        let gain = min(4, max(0.25, pow(max(mag, 0.001) / 60, ac)))
        let sens = d.double(forKey: "sens")
        var px = vx * dt * sens * gain
        var py = vy * dt * sens * gain
        if d.bool(forKey: "invX") { px = -px }
        if d.bool(forKey: "invY") { py = -py }

        let frozen = paused || (fingerDown && !dragging) || CACurrentMediaTime() < freezeUntil
        if frozen {
            accX = 0; accY = 0
            return
        }
        accX += px
        accY += py
        if abs(accX) >= 0.05 || abs(accY) >= 0.05 {
            onMove?(accX, accY)
            accX = 0; accY = 0
        }
    }
}
