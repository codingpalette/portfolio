import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ROUTE_ACCESS: Record<string, string> = {
  "/admin": "admin",
  "/dashboard": "user",
  "/profile": "user",
};

const AUTH_ROUTES = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 로그인 상태에서 auth 페이지 접근 -> 홈으로
  if (user && AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // 보호 경로 확인
  const matchedRoute = Object.keys(ROUTE_ACCESS).find((route) =>
    pathname.startsWith(route),
  );

  if (matchedRoute) {
    // 비인증 -> 로그인 페이지로
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    // 권한 확인을 위해 프로필 조회
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const requiredRole = ROUTE_ACCESS[matchedRoute];
    const roleHierarchy: Record<string, number> = {
      guest: 0,
      user: 1,
      admin: 2,
    };

    const userLevel = roleHierarchy[profile?.role ?? "user"] ?? 1;
    const requiredLevel = roleHierarchy[requiredRole] ?? 0;

    // 권한 부족 -> 홈으로
    if (userLevel < requiredLevel) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
