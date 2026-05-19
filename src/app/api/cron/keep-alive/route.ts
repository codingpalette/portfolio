import { createClient } from "@shared/api/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Vercel Cron 요청 인증
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const supabase = await createClient();

  // 가벼운 쿼리로 Supabase 활동 기록 남기기
  const { error } = await supabase.from("profiles").select("id").limit(1);

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    at: new Date().toISOString(),
  });
}
