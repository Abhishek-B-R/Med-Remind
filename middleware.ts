// middleware.ts
import { withAuth } from 'next-auth/middleware'
import type { NextRequestWithAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const publicPaths = ['/', '/terms', '/privacy', '/auth/signin']

function isPublicPath(path: string) {
  const cleanPath = path === '/' ? '/' : path.replace(/\/$/, '')
  return publicPaths.includes(cleanPath)
}

export default withAuth(
  function middleware(req: NextRequestWithAuth) {
    const { pathname } = req.nextUrl
    const token = req.nextauth?.token
    const cleanPath = pathname === '/' ? '/' : pathname.replace(/\/$/, '')

    if (isPublicPath(cleanPath)) {
      return NextResponse.next()
    }

    if (cleanPath === '/auth/signin' && token) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    if (cleanPath.startsWith('/api') && !token) {
      return NextResponse.redirect(new URL('/api/auth/unauthorized', req.url))
    }

    if (!token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
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
