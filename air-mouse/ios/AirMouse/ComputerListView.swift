import SwiftUI

/// 首頁：自動列出同一個 Wi-Fi 裡的電腦，點一下就連線
struct ComputerListView: View {
    @StateObject private var browser = ComputerBrowser()
    @State private var selected: Computer?
    @AppStorage("lastPc") private var lastPc = ""

    var body: some View {
        NavigationStack {
            List {
                Section {
                    if browser.computers.isEmpty {
                        HStack(spacing: 12) {
                            ProgressView()
                            Text("尋找電腦中…").foregroundStyle(.secondary)
                        }
                        .padding(.vertical, 8)
                    }
                    ForEach(browser.computers) { pc in
                        Button {
                            lastPc = pc.id
                            selected = pc
                        } label: {
                            HStack(spacing: 14) {
                                Image(systemName: "desktopcomputer")
                                    .font(.title2)
                                    .foregroundStyle(.blue)
                                VStack(alignment: .leading, spacing: 2) {
                                    Text(pc.name).font(.headline).foregroundStyle(.primary)
                                    if let ip = pc.ips.first {
                                        Text(ip).font(.caption).foregroundStyle(.secondary)
                                    }
                                }
                                Spacer()
                                if pc.id == lastPc {
                                    Text("上次使用")
                                        .font(.caption2)
                                        .padding(.horizontal, 8).padding(.vertical, 3)
                                        .background(Capsule().fill(Color.blue))
                                        .foregroundStyle(.white)
                                }
                                Image(systemName: "chevron.right").foregroundStyle(.tertiary)
                            }
                            .padding(.vertical, 6)
                        }
                    }
                } header: {
                    Text("同一個 Wi-Fi 裡的電腦")
                } footer: {
                    if let problem = browser.problem {
                        Text(problem).foregroundStyle(.red)
                    } else {
                        Text("沒看到電腦？確認電腦有執行空中滑鼠、和手機連同一個 Wi-Fi，並在 Windows 防火牆允許 Python。")
                    }
                }

                Section("使用方式") {
                    Label("手機螢幕朝上拿著，左右轉、上下翹移動游標", systemImage: "iphone.gen3")
                    Label("點左半邊 = 左鍵，右半邊 = 右鍵", systemImage: "hand.tap")
                    Label("長按左半邊 = 拖曳", systemImage: "hand.point.up.left")
                    Label("兩指滑動 = 捲動", systemImage: "hand.draw")
                }
                .font(.subheadline)
            }
            .navigationTitle("空中滑鼠")
            .toolbar {
                NavigationLink {
                    SettingsView()
                } label: {
                    Image(systemName: "gearshape")
                }
            }
        }
        .onAppear { browser.start() }
        .fullScreenCover(item: $selected) { pc in
            ControlView(computer: pc)
        }
    }
}
