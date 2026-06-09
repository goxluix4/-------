"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  SHOP,
  CATEGORIES,
  DRINKS,
  SUGAR_OPTIONS,
  ICE_OPTIONS,
  TOPPING_OPTIONS,
  DEFAULT_SUGAR,
  DEFAULT_ICE,
  type Drink,
  type CategoryId,
} from "@/lib/drinks";
import type { OrderItem, Order } from "@/lib/orders";

// 客製選擇暫存
interface Customizing {
  drink: Drink;
  sugar: string;
  ice: string;
  toppings: string[]; // topping ids
  qty: number;
}

export default function OrderClient() {
  const [category, setCategory] = useState<CategoryId>(CATEGORIES[0].id);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [editing, setEditing] = useState<Customizing | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [note, setNote] = useState("");

  const [view, setView] = useState<"menu" | "checkout" | "done">("menu");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<Order | null>(null);

  const filtered = useMemo(
    () => DRINKS.filter((d) => d.category === category),
    [category]
  );

  const cartCount = cart.reduce((n, it) => n + it.qty, 0);
  const cartTotal = cart.reduce((n, it) => n + it.subtotal, 0);

  function openCustomize(drink: Drink) {
    setEditing({ drink, sugar: DEFAULT_SUGAR, ice: DEFAULT_ICE, toppings: [], qty: 1 });
  }

  function unitPriceOf(c: Customizing): number {
    const toppingExtra = c.toppings.reduce((sum, tid) => {
      const t = TOPPING_OPTIONS.find((x) => x.id === tid);
      return sum + (t?.price ?? 0);
    }, 0);
    return c.drink.price + toppingExtra;
  }

  function addToCart() {
    if (!editing) return;
    const unit = unitPriceOf(editing);
    const item: OrderItem = {
      drinkId: editing.drink.id,
      name: editing.drink.name,
      sugar: editing.sugar,
      ice: editing.ice,
      toppings: editing.toppings.map((tid) => {
        const t = TOPPING_OPTIONS.find((x) => x.id === tid)!;
        return { id: t.id, label: t.label, price: t.price };
      }),
      qty: editing.qty,
      unitPrice: unit,
      subtotal: unit * editing.qty,
    };
    setCart((prev) => [...prev, item]);
    setEditing(null);
  }

  function removeItem(idx: number) {
    setCart((prev) => prev.filter((_, i) => i !== idx));
  }

  function changeQty(idx: number, delta: number) {
    setCart((prev) =>
      prev
        .map((it, i) =>
          i === idx
            ? { ...it, qty: it.qty + delta, subtotal: it.unitPrice * (it.qty + delta) }
            : it
        )
        .filter((it) => it.qty > 0)
    );
  }

  async function submitOrder() {
    setErrorMsg("");
    if (cart.length === 0) return setErrorMsg("購物車是空的，請先選擇飲料");
    if (!customerName.trim()) return setErrorMsg("請填寫取餐姓名");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          customerName: customerName.trim(),
          phone: phone.trim() || undefined,
          pickupTime: pickupTime.trim() || undefined,
          note: note.trim() || undefined,
          // lineUserId: 之後串 LIFF 時帶入
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "送出失敗");
      setResult(data.order as Order);
      setView("done");
      setCart([]);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "送出時發生錯誤，請重試");
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setResult(null);
    setCustomerName("");
    setPhone("");
    setPickupTime("");
    setNote("");
    setView("menu");
  }

  // ════════════ 完成畫面 ════════════
  if (view === "done" && result) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🧊</div>
        <h2 className="text-2xl font-bold text-[#1F3A4D] mb-2">訂單已送出！</h2>
        <p className="text-[#6E8A99] mb-6">沁涼飲已收到您的訂單，請依預計時間前往取餐。</p>

        <div className="bg-white rounded-2xl shadow-sm border border-[#BCE6F5] p-6 text-left">
          <div className="flex justify-between items-center pb-3 border-b border-[#E8F6FC]">
            <span className="text-[#6E8A99] text-sm">訂單編號</span>
            <span className="text-3xl font-bold text-[#1AA0DC] tracking-wider">{result.id}</span>
          </div>
          <div className="py-3 space-y-2 text-sm">
            {result.items.map((it, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-[#1F3A4D]">{it.name} × {it.qty}</span>
                <span className="text-[#6E8A99]">${it.subtotal}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-3 border-t border-[#E8F6FC] font-bold">
            <span className="text-[#1F3A4D]">總計</span>
            <span className="text-[#1AA0DC]">${result.total}</span>
          </div>
          {result.pickupTime && (
            <p className="text-sm text-[#6E8A99] mt-3">預計取餐：{result.pickupTime}</p>
          )}
        </div>

        <button
          onClick={resetAll}
          className="mt-8 px-8 py-3 bg-[#1AA0DC] text-white rounded-full font-medium hover:bg-[#0B79B4] transition-colors"
        >
          再點一杯
        </button>
      </div>
    );
  }

  // ════════════ 結帳畫面 ════════════
  if (view === "checkout") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8">
        <button onClick={() => setView("menu")} className="text-[#6E8A99] text-sm mb-4 hover:text-[#1AA0DC]">
          ← 回菜單
        </button>
        <h2 className="text-xl font-bold text-[#1F3A4D] mb-4">確認訂單</h2>

        <div className="bg-white rounded-2xl border border-[#BCE6F5] p-5 mb-6 space-y-3">
          {cart.map((it, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div>
                <p className="text-[#1F3A4D] font-medium">
                  {it.name} <span className="text-[#6E8A99]">× {it.qty}</span>
                </p>
                <p className="text-xs text-[#6E8A99]">
                  {it.sugar}・{it.ice}
                  {it.toppings.length > 0 && "・" + it.toppings.map((t) => t.label).join("、")}
                </p>
              </div>
              <span className="text-[#1F3A4D]">${it.subtotal}</span>
            </div>
          ))}
          <div className="flex justify-between pt-3 border-t border-[#E8F6FC] font-bold">
            <span>總計</span>
            <span className="text-[#1AA0DC]">${cartTotal}</span>
          </div>
        </div>

        <div className="space-y-4">
          <Field label="取餐姓名" required>
            <input className="cl-input" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="例：王小明" />
          </Field>
          <Field label="聯絡電話">
            <input className="cl-input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="選填" inputMode="tel" />
          </Field>
          <Field label="預計取餐時間">
            <input className="cl-input" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} placeholder="例：12:30 / 盡快" />
          </Field>
          <Field label="備註">
            <textarea className="cl-input min-h-[80px]" value={note} onChange={(e) => setNote(e.target.value)} placeholder="其他需求（選填）" />
          </Field>
        </div>

        {errorMsg && <p className="text-red-500 text-sm mt-4">{errorMsg}</p>}

        <button
          onClick={submitOrder}
          disabled={submitting}
          className="w-full mt-6 py-4 bg-[#1AA0DC] text-white rounded-full font-bold text-lg hover:bg-[#0B79B4] transition-colors disabled:opacity-50"
        >
          {submitting ? "送出中…" : `送出訂單 ($${cartTotal})`}
        </button>

        {/* 本地樣式：輸入框 */}
        <style jsx global>{`
          .cl-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #BCE6F5;
            border-radius: 0.5rem;
            background: #fff;
            color: #1F3A4D;
            font-size: 0.95rem;
            outline: none;
            transition: all 0.2s;
          }
          .cl-input:focus {
            border-color: #1AA0DC;
            box-shadow: 0 0 0 2px rgba(26, 160, 220, 0.25);
          }
        `}</style>
      </div>
    );
  }

  // ════════════ 菜單畫面 ════════════
  return (
    <div className="pb-28">
      {/* 店頭 */}
      <div className="relative bg-gradient-to-b from-[#1AA0DC] to-[#0B79B4] text-white px-4 py-7 text-center overflow-hidden">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white shadow-lg overflow-hidden mb-2">
            <Image src={SHOP.logo} alt={SHOP.name} width={80} height={80} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">{SHOP.name}</h1>
          <p className="text-white/90 text-sm mt-1">{SHOP.slogan}</p>
          <p className="text-white/70 text-xs mt-2">{SHOP.notice}</p>
        </div>
        {/* 水波裝飾 */}
        <div className="absolute -bottom-1 left-0 right-0 h-6 bg-[#FBF7EE]" style={{ borderTopLeftRadius: "50% 100%", borderTopRightRadius: "50% 100%" }} />
      </div>

      {/* 分類 tabs */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-[#E8F6FC] overflow-x-auto">
        <div className="flex gap-1 px-3 py-2 min-w-max">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCategory(c.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                category === c.id ? "bg-[#1AA0DC] text-white font-medium" : "text-[#6E8A99] hover:bg-[#E8F6FC]"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* 菜單清單 */}
      <div className="max-w-2xl mx-auto px-3 py-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((d) => (
          <button
            key={d.id}
            onClick={() => openCustomize(d)}
            className="flex items-center gap-3 bg-white rounded-xl border border-[#E8F6FC] p-3 text-left hover:border-[#1AA0DC] hover:shadow-sm transition-all"
          >
            <div className="text-3xl shrink-0 w-11 h-11 flex items-center justify-center rounded-full bg-[#E8F6FC]">{d.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-[#1F3A4D]">
                {d.name}
                {d.note && <span className="text-[10px] text-[#6FB23F] ml-1">（{d.note}）</span>}
              </p>
              <p className="text-[#1AA0DC] font-bold text-sm mt-0.5">${d.price}</p>
            </div>
            <span className="text-[#1AA0DC] text-xl shrink-0">＋</span>
          </button>
        ))}
      </div>

      {/* 底部購物車列 */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-20 bg-white border-t border-[#BCE6F5] p-3 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
          <div className="max-w-2xl mx-auto flex items-center gap-3">
            <button onClick={() => setCartOpen(true)} className="relative text-2xl px-2" aria-label="查看購物車">
              🛒
              <span className="absolute -top-1 -right-1 bg-[#6FB23F] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </button>
            <div className="flex-1">
              <p className="text-xs text-[#6E8A99]">{cartCount} 杯</p>
              <p className="font-bold text-[#1F3A4D]">${cartTotal}</p>
            </div>
            <button onClick={() => setView("checkout")} className="px-6 py-3 bg-[#1AA0DC] text-white rounded-full font-bold hover:bg-[#0B79B4] transition-colors">
              去結帳
            </button>
          </div>
        </div>
      )}

      {/* 購物車明細彈窗 */}
      {cartOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 flex items-end sm:items-center justify-center" onClick={() => setCartOpen(false)}>
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[80vh] overflow-y-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#1F3A4D]">購物車</h3>
              <button onClick={() => setCartOpen(false)} className="text-[#6E8A99] text-xl">✕</button>
            </div>
            {cart.length === 0 ? (
              <p className="text-[#6E8A99] text-center py-8">購物車是空的</p>
            ) : (
              <div className="space-y-3">
                {cart.map((it, i) => (
                  <div key={i} className="flex gap-3 items-start border-b border-[#E8F6FC] pb-3">
                    <div className="flex-1">
                      <p className="font-medium text-[#1F3A4D]">{it.name}</p>
                      <p className="text-xs text-[#6E8A99]">
                        {it.sugar}・{it.ice}
                        {it.toppings.length > 0 && "・" + it.toppings.map((t) => t.label).join("、")}
                      </p>
                      <p className="text-[#1AA0DC] font-bold text-sm mt-1">${it.subtotal}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => changeQty(i, -1)} className="w-7 h-7 rounded-full border border-[#BCE6F5]">－</button>
                      <span className="w-5 text-center">{it.qty}</span>
                      <button onClick={() => changeQty(i, 1)} className="w-7 h-7 rounded-full border border-[#BCE6F5]">＋</button>
                    </div>
                    <button onClick={() => removeItem(i)} className="text-red-400 text-sm">刪除</button>
                  </div>
                ))}
                <button
                  onClick={() => { setCartOpen(false); setView("checkout"); }}
                  className="w-full mt-2 py-3 bg-[#1AA0DC] text-white rounded-full font-bold"
                >
                  去結帳 (${cartTotal})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 客製化彈窗 */}
      {editing && (
        <div className="fixed inset-0 z-40 bg-black/40 flex items-end sm:items-center justify-center" onClick={() => setEditing(null)}>
          <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[88vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-[#E8F6FC] flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-[#1F3A4D]">{editing.drink.emoji} {editing.drink.name}</h3>
                <p className="text-xs text-[#1AA0DC] font-medium">${editing.drink.price}</p>
              </div>
              <button onClick={() => setEditing(null)} className="text-[#6E8A99] text-xl">✕</button>
            </div>

            <div className="p-5 space-y-5">
              <OptionGroup label="甜度">
                {SUGAR_OPTIONS.map((s) => (
                  <Chip key={s} active={editing.sugar === s} onClick={() => setEditing({ ...editing, sugar: s })}>{s}</Chip>
                ))}
              </OptionGroup>

              <OptionGroup label="冰塊">
                {ICE_OPTIONS.map((s) => (
                  <Chip key={s} active={editing.ice === s} onClick={() => setEditing({ ...editing, ice: s })}>{s}</Chip>
                ))}
              </OptionGroup>

              <OptionGroup label="加料（可複選）">
                {TOPPING_OPTIONS.map((t) => {
                  const on = editing.toppings.includes(t.id);
                  return (
                    <Chip
                      key={t.id}
                      active={on}
                      onClick={() =>
                        setEditing({
                          ...editing,
                          toppings: on ? editing.toppings.filter((x) => x !== t.id) : [...editing.toppings, t.id],
                        })
                      }
                    >
                      {t.label} +${t.price}
                    </Chip>
                  );
                })}
              </OptionGroup>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#1F3A4D]">數量</span>
                <div className="flex items-center gap-3">
                  <button onClick={() => setEditing({ ...editing, qty: Math.max(1, editing.qty - 1) })} className="w-9 h-9 rounded-full border border-[#BCE6F5] text-lg">－</button>
                  <span className="w-6 text-center font-medium">{editing.qty}</span>
                  <button onClick={() => setEditing({ ...editing, qty: editing.qty + 1 })} className="w-9 h-9 rounded-full border border-[#BCE6F5] text-lg">＋</button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t border-[#E8F6FC]">
              <button onClick={addToCart} className="w-full py-3 bg-[#1AA0DC] text-white rounded-full font-bold hover:bg-[#0B79B4] transition-colors">
                加入購物車　${unitPriceOf(editing) * editing.qty}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── 小元件 ──
function OptionGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-sm font-medium text-[#1F3A4D] mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 rounded-full text-sm border transition-colors ${
        active ? "bg-[#1AA0DC] text-white border-[#1AA0DC]" : "bg-white text-[#1F3A4D] border-[#BCE6F5] hover:border-[#1AA0DC]"
      }`}
    >
      {children}
    </button>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#1F3A4D] mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
