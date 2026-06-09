import type { Metadata } from "next";
import AdminOrdersClient from "./AdminOrdersClient";

export const metadata: Metadata = {
  title: "訂單後台｜沁涼飲",
  robots: { index: false, follow: false }, // 後台不被搜尋引擎收錄
};

// 老闆端：訂單列表後台（原型）
// ⚠️ 正式上線請加上登入驗證，避免任何人都能開啟。
export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen bg-[#FBF7EE]">
      <AdminOrdersClient />
    </div>
  );
}
