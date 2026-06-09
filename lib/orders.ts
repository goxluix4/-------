// ──────────────────────────────────────────────
// 訂單型別 + 記憶體儲存 (原型用)
//
// ⚠️ 注意：目前訂單存在記憶體裡，伺服器重啟就會清空。
//    正式上線請改接資料庫 (建議 Supabase / Vercel Postgres / Google Sheets)。
//    只要替換下方 store 的讀寫實作即可，API 介面不用動。
// ──────────────────────────────────────────────

// 單一品項 (購物車內的一杯飲料)
export interface OrderItem {
  drinkId: string;
  name: string;        // 下單當下的飲料名稱 (避免菜單改了對不上)
  sugar: string;
  ice: string;
  toppings: { id: string; label: string; price: number }[];
  qty: number;
  unitPrice: number;   // 單杯總價 (含加料)
  subtotal: number;    // unitPrice * qty
}

// 訂單狀態
export type OrderStatus = "新訂單" | "製作中" | "已完成" | "已取消";

export const ORDER_STATUSES: OrderStatus[] = ["新訂單", "製作中", "已完成", "已取消"];

// 訂單
export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  customerName: string;
  phone?: string;
  pickupTime?: string;   // 預計取餐時間 (字串，原型用)
  note?: string;
  lineUserId?: string;   // 之後串 LINE LIFF 時帶入
  status: OrderStatus;
  createdAt: string;     // ISO 字串
}

// 送出訂單時，前端傳來的 payload
export interface CreateOrderInput {
  items: OrderItem[];
  customerName: string;
  phone?: string;
  pickupTime?: string;
  note?: string;
  lineUserId?: string;
}

// ──────────────────────────────────────────────
// 記憶體儲存
// 用 globalThis 保存，避免 Next.js dev 模式 hot-reload 時被重置。
// ──────────────────────────────────────────────
type OrderStore = { orders: Order[]; seq: number };

const g = globalThis as unknown as { __orderStore?: OrderStore };

function store(): OrderStore {
  if (!g.__orderStore) {
    g.__orderStore = { orders: [], seq: 0 };
  }
  return g.__orderStore;
}

// 產生單號：A001、A002 ...
function nextOrderId(): string {
  const s = store();
  s.seq += 1;
  return "A" + String(s.seq).padStart(3, "0");
}

// 新增訂單
export function createOrder(input: CreateOrderInput): Order {
  const total = input.items.reduce((sum, it) => sum + it.subtotal, 0);
  const order: Order = {
    id: nextOrderId(),
    items: input.items,
    total,
    customerName: input.customerName,
    phone: input.phone,
    pickupTime: input.pickupTime,
    note: input.note,
    lineUserId: input.lineUserId,
    status: "新訂單",
    createdAt: new Date().toISOString(),
  };
  // 最新的排前面
  store().orders.unshift(order);
  return order;
}

// 取得所有訂單
export function listOrders(): Order[] {
  return store().orders;
}

// 取得單一訂單
export function getOrder(id: string): Order | undefined {
  return store().orders.find((o) => o.id === id);
}

// 更新訂單狀態
export function updateOrderStatus(id: string, status: OrderStatus): Order | undefined {
  const order = getOrder(id);
  if (order) order.status = status;
  return order;
}
