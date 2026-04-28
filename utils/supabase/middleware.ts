import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
// import dotenv from 'dotenv'
// dotenv.config()

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  const supabase = createServerClient(supabaseUrl!, supabaseKey!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(
        cookiesToSet: { name: string; value: string; options: CookieOptions }[],
      ) {
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
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Public routes that don't require authentication
  const publicPaths = ["/login", "/register", "/auth"];
  const isPublicRoute = publicPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!user && !isPublicRoute) {
    // Redirect unauthenticated users to login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (
    user &&
    (request.nextUrl.pathname === "/login" ||
      request.nextUrl.pathname === "/register" ||
      request.nextUrl.pathname === "/")
  ) {
    // Redirect authenticated users away from login/register
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
