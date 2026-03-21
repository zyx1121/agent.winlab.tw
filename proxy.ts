import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function proxy(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) =>
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          ),
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isPortal =
    request.nextUrl.pathname.startsWith("/bind") ||
    request.nextUrl.pathname.startsWith("/profile")

  // Protect all portal routes
  if (!user && isPortal) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // Redirect logged-in users away from login
  if (user && request.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/bind", request.url))
  }

  return response
}

export const config = {
  matcher: ["/bind/:path*", "/profile/:path*", "/login"],
}
