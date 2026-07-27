import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname.startsWith('/login')
  const isPublicStatic = request.nextUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)
  const isNextInternal = request.nextUrl.pathname.startsWith('/_next')

  if (isNextInternal || isPublicStatic) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get('creonity_auth')
  const isAuthenticated = !!authCookie?.value

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect authenticated users away from the login page
  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Apply middleware to all routes except API, static assets, and favicon
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
