import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "沁涼飲 QIN LIANG YIN｜線上點餐",
  description:
    "沁涼飲線上點餐。真材實料・清爽每一刻。選好甜度冰塊加料，送出後到店取餐。",
  openGraph: {
    title: "沁涼飲 QIN LIANG YIN｜線上點餐",
    description: "真材實料・清爽每一刻。線上點餐，到店取餐。",
    type: "website",
    locale: "zh_TW",
    siteName: "沁涼飲 QIN LIANG YIN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body className="antialiased">{children}</body>
    </html>
  );
}
