import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrderStatus, ORDER_STATUSES, type OrderStatus } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── GET /api/orders/[id] ── 查單一訂單 (客戶查詢進度可用)
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const order = getOrder(params.id);
  if (!order) {
    return NextResponse.json({ success: false, message: "找不到訂單" }, { status: 404 });
  }
  return NextResponse.json({ success: true, order });
}

// ── PATCH /api/orders/[id] ── 後台更新訂單狀態
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = (await req.json()) as { status: OrderStatus };

    if (!ORDER_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: "狀態不正確" },
        { status: 400 }
      );
    }

    const order = updateOrderStatus(params.id, status);
    if (!order) {
      return NextResponse.json({ success: false, message: "找不到訂單" }, { status: 404 });
    }

    // ── 之後可在這裡推播狀態更新給客戶 (例如「製作中」「已完成可取餐」) ──

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("[orders] PATCH error:", err);
    return NextResponse.json(
      { success: false, message: "更新狀態時發生錯誤" },
      { status: 500 }
    );
  }
}
