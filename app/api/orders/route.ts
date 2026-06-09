import { NextRequest, NextResponse } from "next/server";
import { createOrder, listOrders, type CreateOrderInput } from "@/lib/orders";

// 原型用記憶體儲存，需在 Node runtime 執行 (非 edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── GET /api/orders ── 後台取得所有訂單
export async function GET() {
  return NextResponse.json({ success: true, orders: listOrders() });
}

// ── POST /api/orders ── 客戶送出訂單
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateOrderInput;

    // 基本驗證
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { success: false, message: "購物車是空的" },
        { status: 400 }
      );
    }
    if (!body.customerName || body.customerName.trim() === "") {
      return NextResponse.json(
        { success: false, message: "請填寫取餐姓名" },
        { status: 400 }
      );
    }

    const order = createOrder(body);

    // ── 之後串接 LINE 推播的位置 ──
    // 在這裡呼叫 LINE Messaging API：
    //   1. 推「新訂單」通知給老闆
    //   2. 推「訂單確認 (單號 / 金額 / 預計時間)」給下單客戶 (body.lineUserId)
    // 範例：
    //   await fetch("https://api.line.me/v2/bot/message/push", { ... })

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch (err) {
    console.error("[orders] POST error:", err);
    return NextResponse.json(
      { success: false, message: "送出訂單時發生錯誤，請重試" },
      { status: 500 }
    );
  }
}
