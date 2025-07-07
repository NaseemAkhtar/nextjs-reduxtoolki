import { NextResponse } from 'next/server'

// Only for logged-out access
const authPages = ['/login', '/signup']

// Only for logged-in access
const protectedPages = ['/create-blog', '/user']

export async function middleware(req) {
  const token =
    req.cookies.get('next-auth.session-token') ||
    req.cookies.get('__Secure-next-auth.session-token')

  const isLoggedIn = !!token

  const { pathname } = req.nextUrl


  if (isLoggedIn && authPages.some((page) => pathname.startsWith(page))) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  //guest cannot access protected pages
  if (!isLoggedIn && protectedPages.some((page) => pathname.startsWith(page))) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/login', '/signup', '/create-blog', '/user/:path*'],
}
