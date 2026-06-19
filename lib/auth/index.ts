import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  pages: {
    signIn: '/',
  },
  callbacks: {
    async signIn({ user }) {
      const allowedEmails = process.env.ALLOWED_EMAILS?.split(',').map((e) => e.trim()) || [];

      // If no whitelist is configured, allow all authenticated users
      if (allowedEmails.length === 0 || allowedEmails[0] === '') return true;

      if (!user.email || !allowedEmails.includes(user.email)) return false;
      return true;
    },
    async session({ session }) {
      return session;
    },
  },
});
