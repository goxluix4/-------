import type { Metadata } from "next";
import OrderClient from "./order/OrderClient";

export const metadata: Metadata = {
  title: "沁涼飲 QIN LIANG YIN｜線上點餐",
  description: "沁涼飲線上點餐，選好甜度冰塊加料，送出後到店取餐。真材實料・清爽每一刻。",
};

// 獨立飲料站首頁：打開網址就是點餐畫面
export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FBF7EE]">
      <OrderClient />
    </div>
  );
}
