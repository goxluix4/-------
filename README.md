# Jay Hu 工程文件工作室 — 官方網站

## 本機啟動步驟

### 前置需求
- 安裝 Node.js 18 以上版本：https://nodejs.org/zh-tw/

### 啟動指令

```bash
# 1. 進入專案資料夾
cd jay-hu-studio

# 2. 安裝套件（第一次執行需要）
npm install

# 3. 啟動開發伺服器
npm run dev
```

啟動後開啟瀏覽器前往：http://localhost:3000

### 建置正式版本

```bash
npm run build
npm run start
```

---

## 資料夾結構

```
jay-hu-studio/
├── app/
│   ├── layout.tsx           ← 全站 HTML 框架、SEO meta
│   ├── page.tsx             ← 首頁（組合各區塊）
│   ├── globals.css          ← 全域樣式
│   ├── quote/
│   │   └── page.tsx         ← 詢價表單頁 /quote
│   └── api/
│       └── submit-quote/
│           └── route.ts     ← 表單後端 API（預留串接點）
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx       ← 導覽列（含手機漢堡選單）
│   │   └── Footer.tsx       ← 頁尾
│   ├── sections/            ← 首頁各區塊
│   │   ├── HeroSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── WhyUsSection.tsx
│   │   ├── ProcessSection.tsx
│   │   ├── FaqSection.tsx
│   │   └── ContactSection.tsx
│   └── quote/
│       └── QuoteForm.tsx    ← 詢價表單元件（含驗證）
├── lib/
│   ├── constants.ts         ← 品牌資訊、服務項目、FAQ 等靜態資料
│   └── validators.ts        ← Zod 表單驗證 schema
└── public/
    └── images/
        └── qr-line.png      ← LINE QR Code
```

---

## 常見修改

### 修改聯絡資訊
編輯 `lib/constants.ts` → `STUDIO` 物件

### 新增或修改服務項目
編輯 `lib/constants.ts` → `SERVICES` 陣列

### 修改 FAQ
編輯 `lib/constants.ts` → `FAQS` 陣列

### 更換 LINE QR Code
替換 `public/images/qr-line.png`

---

## 表單後端串接（未來擴充）

目前表單為純前端，送出後呼叫 `/api/submit-quote`。
串接方式請參考 `app/api/submit-quote/route.ts` 內的說明。

推薦選項：
- **Email 通知**：Resend（免費方案每月 3,000 封）
- **試算表記錄**：Google Sheets API
- **資料庫存檔**：Supabase（免費方案可用）

---

## 部署至 Vercel

1. 將專案 push 至 GitHub
2. 至 https://vercel.com 匯入 Repository
3. 點擊 Deploy，系統自動處理 Next.js 設定
4. 可在 Vercel 設定自訂網域
