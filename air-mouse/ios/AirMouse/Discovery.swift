import Foundation
import Network

/// 一台在區網中被找到的電腦
struct Computer: Identifiable, Hashable {
    let id: String            // Bonjour 服務名稱（電腦名稱）
    let name: String
    let endpoint: NWEndpoint
    let fingerprint: String?  // 憑證 SHA-256 指紋，用來確認是同一台電腦
    let ips: [String]
    let port: Int?
}

/// 用 Bonjour 自動尋找執行空中滑鼠的電腦（_airmouse._tcp）
final class ComputerBrowser: ObservableObject {
    @Published private(set) var computers: [Computer] = []
    @Published private(set) var problem: String?

    private var browser: NWBrowser?

    func start() {
        guard browser == nil else { return }
        let params = NWParameters()
        params.includePeerToPeer = false
        let b = NWBrowser(for: .bonjourWithTXTRecord(type: "_airmouse._tcp", domain: nil), using: params)

        b.browseResultsChangedHandler = { [weak self] results, _ in
            let list: [Computer] = results.compactMap { result in
                guard case let .service(name, _, _, _) = result.endpoint else { return nil }
                var fp: String?
                var ips: [String] = []
                var port: Int?
                if case let .bonjour(txt) = result.metadata {
                    fp = txt["fp"]
                    ips = (txt["ip"] ?? "").split(separator: ",").map(String.init).filter { !$0.isEmpty }
                    port = Int(txt["port"] ?? "")
                }
                return Computer(id: name, name: name, endpoint: result.endpoint,
                                fingerprint: fp, ips: ips, port: port)
            }
            .sorted { $0.name.localizedStandardCompare($1.name) == .orderedAscending }
            DispatchQueue.main.async { self?.computers = list }
        }

        b.stateUpdateHandler = { [weak self] state in
            DispatchQueue.main.async {
                switch state {
                case .ready:
                    self?.problem = nil
                case let .waiting(error), let .failed(error):
                    // 最常見：使用者沒有允許「區域網路」權限
                    self?.problem = "無法搜尋區域網路（\(error.localizedDescription)）。請到 iPhone「設定 › 隱私權與安全性 › 區域網路」打開「空中滑鼠」。"
                    if case .failed = state { self?.restart() }
                default:
                    break
                }
            }
        }
        b.start(queue: .main)
        browser = b
    }

    func stop() {
        browser?.cancel()
        browser = nil
    }

    private func restart() {
        stop()
        DispatchQueue.main.asyncAfter(deadline: .now() + 2) { [weak self] in self?.start() }
    }
}
