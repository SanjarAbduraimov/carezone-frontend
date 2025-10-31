import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import { connectDB } from "@/app/lib/db/mongoose";
import { User } from "@/app/lib/models";
import bcrypt from "bcryptjs";

const providers = [
  // Optional: Google (only if env present)
  ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET })]
    : []),
  // Basic credentials for admin/editor
  Credentials({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'text' },
      password: { label: 'Password', type: 'password' }
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null;
      
      try {
        await connectDB();
        const user = await User.findOne({ email: credentials.email }).select('+password').lean();
        
        if (!user || !user.email) return null;
        
        // Check password hash
        const hash = user.password ?? '';
        if (!hash) return null;
        
        const valid = await bcrypt.compare(credentials.password, hash).catch(() => false);
        
        if (!valid) return null;
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      } catch (error) {
        console.error('Auth error:', error);
        return null;
      }
    }
  })
];

const handler = NextAuth({
  session: { strategy: 'jwt' },
  providers,
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: unknown }) {
      if (user) {
        const u = user as { id?: string; role?: string };
        (token as Record<string, unknown>).role = u.role;
        (token as Record<string, unknown>).uid = u.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        const t = token as Record<string, unknown> & { uid?: unknown; role?: unknown };
        const su = session.user as Record<string, unknown>;
        su.id = typeof t.uid === 'string' ? t.uid : '';
        su.role = typeof t.role === 'string' ? t.role : '';
      }
      return session;
    }
  }
});

export { handler as GET, handler as POST };
