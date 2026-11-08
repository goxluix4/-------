# 📱 空中滑鼠 iPhone App

打開 App → 自動列出同一個 Wi-Fi 裡的電腦 → 點一下就連線。
不用打網址、不會跳憑證警告（App 用憑證指紋確認是你的電腦）。

App 由 GitHub 的雲端 Mac 編譯，並自動上傳到 TestFlight，你不需要有 Mac。

## 一、加入 Apple Developer Program（付費，一年 US$99）

1. 到 https://developer.apple.com/programs/enroll/ 用你的 Apple ID 加入（個人身分即可）
2. 付款後審核通常幾小時～2 天

## 二、在 App Store Connect 建立 App（只做一次）

1. 到 https://developer.apple.com/account/resources/identifiers/list → 「+」→ App IDs → App
   - Description：`AirMouse`
   - Bundle ID 選 Explicit，填例如 `com.你的英文名.airmouse`（之後要用到，記下來）
2. 到 https://appstoreconnect.apple.com/apps → 「+」→ 新增 App
   - 平台 iOS、名稱 `空中滑鼠`（名稱被用走就加點字）、語言 繁體中文
   - 套件識別碼選上一步的 Bundle ID、SKU 隨便填（例如 `airmouse`）

## 三、建立 API 金鑰（讓雲端 Mac 可以幫你簽名上傳）

1. 到 https://appstoreconnect.apple.com/access/integrations/api → 「團隊金鑰」→「+」
   - 名稱 `GitHub`，存取權限選 **管理（Admin）**
2. 下載 `.p8` 檔（**只能下載一次**，請保存好）
3. 記下頁面上的 **Issuer ID** 和這把金鑰的 **Key ID**
4. Team ID：在 https://developer.apple.com/account 「會員資格詳細資訊」裡

## 四、把金鑰放到 GitHub Secrets

GitHub 儲存庫 → Settings → Secrets and variables → Actions → New repository secret，新增 5 個：

| 名稱 | 內容 |
|---|---|
| `APPSTORE_KEY_P8` | 用記事本打開 `.p8` 檔，整份內容貼上（含 BEGIN / END 那兩行） |
| `APPSTORE_KEY_ID` | Key ID |
| `APPSTORE_ISSUER_ID` | Issuer ID |
| `APPLE_TEAM_ID` | Team ID |
| `APP_BUNDLE_ID` | 第二步的 Bundle ID，例如 `com.xxx.airmouse` |

## 五、編譯並上傳

GitHub 儲存庫 → Actions →「iOS 空中滑鼠 App」→ 點最新一次執行 → **Re-run all jobs**
（之後每次修改 iOS 程式也會自動重新上傳）

約 10 分鐘完成，再等 5～30 分鐘 Apple 處理。

## 六、iPhone 安裝

1. App Store Connect → 你的 App → **TestFlight** → 「內部測試」→「+」建立群組，把自己（你的 Apple ID）加進去，並勾選剛上傳的版本
2. iPhone 從 App Store 安裝 **TestFlight**
3. 收到邀請 Email 或直接打開 TestFlight → 安裝「空中滑鼠」
4. 第一次打開 App 會問「要允許尋找區域網路上的裝置嗎？」→ **允許**

> TestFlight 版本 90 天後過期：到 GitHub Actions 按一次 Re-run 重新上傳即可。

## 電腦端

電腦一樣執行 `start.bat` 或 `開機自動啟動.bat`（新版已加上 iPhone App 需要的 Bonjour 廣播，請重新下載並再執行一次，讓它安裝新套件）。
