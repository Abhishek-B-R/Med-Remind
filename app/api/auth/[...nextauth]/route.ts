import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    refreshToken?: string
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    refreshToken?: string
  }
}


const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/calendar",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export { handler as GET, handler as POST }
