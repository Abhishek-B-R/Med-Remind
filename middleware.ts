// middleware.ts
import { withAuth } from 'next-auth/middleware'
import type { NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const publicPaths = ['/', '/terms', '/privacy', '/auth/signin']

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl
    const token = req.nextauth?.token

    const cleanPath = pathname.replace(/\/$/, '')

    if (cleanPath === '/auth/signin' && token) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (publicPaths.includes(cleanPath)) {
      return NextResponse.next()
    }

    const isApiRoute = cleanPath.startsWith('/api')
    if (!token) {
      const redirectUrl = isApiRoute ? '/api/auth/unauthorized' : '/auth/signin'
      return NextResponse.redirect(new URL(redirectUrl, req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true,
    },
  }
)

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
