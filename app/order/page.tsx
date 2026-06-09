import type { Metadata } from "next";
import OrderClient from "./OrderClient";

export const metadata: Metadata = {
  title: "線上點餐｜沁涼飲 QIN LIANG YIN",
  description: "沁涼飲線上點餐，選好甜度冰塊加料，送出後到店取餐。真材實料・清爽每一刻。",
};

// 沁涼飲線上點餐頁（之後用 LINE LIFF 把這個網址包進 LINE 圖文選單）
export default function OrderPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EE]">
      <OrderClient />
    </div>
  );
}
