import CryptoKit
import Foundation
import Network
import QuartzCore
import Security

/// 和一台電腦的 WebSocket 連線（TLS，用憑證指紋驗證，不需要信任自簽憑證）
final class PCConnection: ObservableObject {
    enum Status: Equatable {
        case connecting
        case connected
        case failed(String)
    }

    @Published private(set) var status: Status = .connecting
    @Published private(set) var latency: Int?

    private let computer: Computer
    private let queue = DispatchQueue(label: "airmouse.connection")
    private var conn: NWConnection?
    private var stopped = true
    private var attempt = 0
    private var pingTimer: Timer?
    private var retryWork: DispatchWorkItem?

    init(computer: Computer) {
        self.computer = computer
    }

    // MARK: - 連線管理

    func start() {
        stopped = false
        connect()
        pingTimer?.invalidate()
        pingTimer = Timer.scheduledTimer(withTimeInterval: 2, repeats: true) { [weak self] _ in
            self?.send(["t": "ping", "ts": CACurrentMediaTime() * 1000])
        }
    }

    func stop() {
        stopped = true
        retryWork?.cancel()
        pingTimer?.invalidate()
        pingTimer = nil
        conn?.cancel()
        conn = nil
    }

    /// 依序嘗試：Bonjour 服務本身 → TXT 記錄裡的各個 IP
    private func endpoints() -> [NWEndpoint] {
        var list: [NWEndpoint] = [computer.endpoint]
        if let port = computer.port {
            for ip in computer.ips {
                if let url = URL(string: "wss://\(ip):\(port)/ws") {
                    list.append(.url(url))
                }
            }
        }
        return list
    }

    private func connect() {
        guard !stopped else { return }
        conn?.cancel()
        let candidates = endpoints()
        let endpoint = candidates[attempt % candidates.count]
        DispatchQueue.main.async { self.status = .connecting }

        let tls = NWProtocolTLS.Options()
        let expected = computer.fingerprint?.lowercased()
        sec_protocol_options_set_verify_block(tls.securityProtocolOptions, { _, trust, complete in
            let secTrust = sec_trust_copy_ref(trust).takeRetainedValue()
            guard let chain = SecTrustCopyCertificateChain(secTrust) as? [SecCertificate],
                  let leaf = chain.first else {
                complete(false)
                return
            }
            let der = SecCertificateCopyData(leaf) as Data
            let fp = SHA256.hash(data: der).map { String(format: "%02x", $0) }.joined()
            complete(expected == nil || expected == fp)
        }, queue)

        let params = NWParameters(tls: tls)
        let ws = NWProtocolWebSocket.Options()
        ws.autoReplyPing = true
        params.defaultProtocolStack.applicationProtocols.insert(ws, at: 0)

        let c = NWConnection(to: endpoint, using: params)
        c.stateUpdateHandler = { [weak self, weak c] state in
            guard let self, let c, c === self.conn else { return }
            switch state {
            case .ready:
                self.attempt = 0
                DispatchQueue.main.async { self.status = .connected }
            case let .failed(error), let .waiting(error):
                self.scheduleRetry("連不上 \(self.computer.name)（\(error.localizedDescription)）")
            case .cancelled:
                break
            default:
                break
            }
        }
        conn = c
        c.start(queue: queue)
        receive(on: c)
    }

    private func scheduleRetry(_ message: String) {
        DispatchQueue.main.async {
            guard !self.stopped else { return }
            self.status = .failed(message)
            self.attempt += 1
            self.retryWork?.cancel()
            let work = DispatchWorkItem { [weak self] in self?.connect() }
            self.retryWork = work
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.5, execute: work)
        }
    }

    private func receive(on c: NWConnection) {
        c.receiveMessage { [weak self, weak c] data, _, _, error in
            guard let self, let c else { return }
            if let data,
               let obj = try? JSONSerialization.jsonObject(with: data) as? [String: Any],
               obj["t"] as? String == "pong",
               let ts = obj["ts"] as? Double {
                let ms = Int(CACurrentMediaTime() * 1000 - ts)
                DispatchQueue.main.async { self.latency = ms }
            }
            if error == nil, c === self.conn {
                self.receive(on: c)
            }
        }
    }

    // MARK: - 傳送指令（格式和網頁版相同）

    func send(_ message: [String: Any]) {
        guard let c = conn, c.state == .ready,
              let data = try? JSONSerialization.data(withJSONObject: message) else { return }
        let meta = NWProtocolWebSocket.Metadata(opcode: .text)
        let context = NWConnection.ContentContext(identifier: "msg", metadata: [meta])
        c.send(content: data, contentContext: context, isComplete: true, completion: .idempotent)
    }

    func move(_ dx: Double, _ dy: Double) {
        send(["t": "m", "x": (dx * 100).rounded() / 100, "y": (dy * 100).rounded() / 100])
    }

    func click(_ button: String) { send(["t": "c", "b": button]) }

    func button(_ button: String, _ action: String) { send(["t": "b", "b": button, "a": action]) }

    func scroll(dx: Double, dy: Double) {
        send(["t": "s", "x": (dx * 1000).rounded() / 1000, "y": (dy * 1000).rounded() / 1000])
    }
}
