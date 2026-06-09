import { NextRequest, NextResponse } from "next/server";

const SYSTEM_URL = process.env.SYSTEM_URL ?? "http://localhost:3001";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    try {
      await fetch(`${SYSTEM_URL}/api/intake`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      });
    } catch (e) {
      console.error("[submit-quote] 呼叫後台系統失敗：", e);
    }

    return NextResponse.json({ success: true, message: "資料已收到" }, { status: 200 });
  } catch (err) {
    console.error("[submit-quote] error:", err);
    return NextResponse.json(
      { success: false, message: "處理時發生錯誤，請重試" },
      { status: 500 }
    );
  }
}
