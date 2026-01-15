import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Backend pe user create/login karne ke liye
      try {
        // Name ko firstName aur lastName mein split karo
        const nameParts = user.name?.split(' ') || ['', ''];
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';

        console.log('🔄 Calling backend for Google OAuth:', {
          email: user.email,
          apiUrl: process.env.NEXT_PUBLIC_API_URL
        });

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            firstName,
            lastName,
            image: user.image,
            googleId: account?.providerAccountId,
          }),
        });

        const data = await response.json();
        console.log('✅ Backend response:', { status: response.status, hasToken: !!data.token });

        if (response.ok && data.token) {
          // Token ko user object mein store karo for later use
          (user as any).token = data.token;
          (user as any).userId = data.user?.id;
          (user as any).email = data.user?.email || user.email;
          return true;
        } else {
          console.error('❌ Backend error:', data);
          return false;
        }
      } catch (error) {
        console.error('❌ Google Sign In Error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // First time JWT callback is run, user object is available
      if (user) {
        token.userId = (user as any).userId;
        token.accessToken = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      // Session mein user data add karna
      if (token) {
        (session.user as any).id = token.userId;
        (session as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/user-signIn',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
