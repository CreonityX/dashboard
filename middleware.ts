import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PREFIXES = ['/login', '/invite', '/verify-email']

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const isPublicStatic = pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/)
  const isNextInternal = pathname.startsWith('/_next')

  if (isNextInternal || isPublicStatic) {
    return NextResponse.next()
  }

  const authCookie = request.cookies.get('creonity_auth')
  const isAuthenticated = !!authCookie?.value
  const publicPath = isPublic(pathname)

  // Redirect unauthenticated users to the login page (allow public paths)
  if (!isAuthenticated && !publicPath) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Authenticated users stay on /login only until the bootstrap decides
  // where to send them. Don't redirect here — let app/login/page.tsx do
  // the role-aware routing so the bootstrap and the page agree.

  // Forward pathname so the root layout's server-side AuthBootstrap
  // can make redirect decisions.
  const res = NextResponse.next()
  res.headers.set('x-pathname', pathname)
  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
