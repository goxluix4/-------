"use client";

import { useCallback, useEffect, useState } from "react";
import { ORDER_STATUSES, type Order, type OrderStatus } from "@/lib/orders";
import { SHOP } from "@/lib/drinks";

const STATUS_STYLE: Record<OrderStatus, string> = {
  新訂單: "bg-red-100 text-red-700 border-red-200",
  製作中: "bg-amber-100 text-amber-700 border-amber-200",
  已完成: "bg-green-100 text-green-700 border-green-200",
  已取消: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<OrderStatus | "全部">("全部");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
        setLastUpdated(new Date());
      }
    } catch {
      // 原型：靜默忽略網路錯誤
    } finally {
      setLoading(false);
    }
  }, []);

  // 進場抓一次 + 每 5 秒自動更新（模擬即時收單）
  useEffect(() => {
    fetchOrders();
    const t = setInterval(fetchOrders, 5000);
    return () => clearInterval(t);
  }, [fetchOrders]);

  async function setStatus(id: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  }

  const shown = orders.filter((o) => filter === "全部" || o.status === filter);
  const counts = {
    新訂單: orders.filter((o) => o.status === "新訂單").length,
    製作中: orders.filter((o) => o.status === "製作中").length,
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 標題列 */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F3A4D]">{SHOP.name}・訂單後台</h1>
          <p className="text-sm text-[#6E8A99]">
            {lastUpdated
              ? `最後更新 ${lastUpdated.toLocaleTimeString("zh-TW")}・每 5 秒自動刷新`
              : "載入中…"}
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 text-sm border border-[#BCE6F5] rounded-full hover:border-[#1AA0DC] transition-colors text-[#1F3A4D]"
        >
          ↻ 立即刷新
        </button>
      </div>

      {/* 統計 */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Stat label="待處理（新訂單）" value={counts.新訂單} color="text-red-600" />
        <Stat label="製作中" value={counts.製作中} color="text-amber-600" />
        <Stat label="總單數" value={orders.length} color="text-[#1AA0DC]" />
      </div>

      {/* 篩選 */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        {(["全部", ...ORDER_STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition-colors ${
              filter === s
                ? "bg-[#0B79B4] text-white border-[#0B79B4]"
                : "bg-white text-[#6E8A99] border-[#BCE6F5] hover:border-[#1AA0DC]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* 訂單清單 */}
      {loading ? (
        <p className="text-center text-[#6E8A99] py-12">載入中…</p>
      ) : shown.length === 0 ? (
        <p className="text-center text-[#6E8A99] py-12">
          {filter === "全部" ? "目前還沒有訂單" : `沒有「${filter}」的訂單`}
        </p>
      ) : (
        <div className="space-y-3">
          {shown.map((o) => (
            <div key={o.id} className="bg-white rounded-xl border border-[#E8F6FC] p-4 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-[#1AA0DC] tracking-wider">{o.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_STYLE[o.status]}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-sm text-[#1F3A4D] mt-1">
                    {o.customerName}
                    {o.phone && <span className="text-[#6E8A99]">・{o.phone}</span>}
                  </p>
                  <p className="text-xs text-[#6E8A99]">
                    {new Date(o.createdAt).toLocaleString("zh-TW")}
                    {o.pickupTime && `・取餐：${o.pickupTime}`}
                  </p>
                </div>
                <span className="text-lg font-bold text-[#1F3A4D]">${o.total}</span>
              </div>

              <div className="bg-[#F4FAFD] rounded-lg p-3 space-y-1.5 mb-3">
                {o.items.map((it, i) => (
                  <div key={i} className="text-sm">
                    <span className="font-medium text-[#1F3A4D]">{it.name} × {it.qty}</span>
                    <span className="text-xs text-[#6E8A99] ml-2">
                      {it.sugar}・{it.ice}
                      {it.toppings.length > 0 && "・" + it.toppings.map((t) => t.label).join("、")}
                    </span>
                  </div>
                ))}
                {o.note && <p className="text-xs text-amber-700 pt-1">📝 備註：{o.note}</p>}
              </div>

              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatus(o.id, s)}
                    disabled={o.status === s}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                      o.status === s
                        ? "bg-[#0B79B4] text-white border-[#0B79B4] cursor-default"
                        : "bg-white text-[#6E8A99] border-[#BCE6F5] hover:border-[#1AA0DC]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E8F6FC] p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-[#6E8A99] mt-1">{label}</p>
    </div>
  );
}
