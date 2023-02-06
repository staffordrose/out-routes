import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import EmailProvider from 'next-auth/providers/email';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { XataAdapter } from '@next-auth/xata-adapter';
import { createUser } from '@/lib/v1/user';
import { getXataClient } from '@/xata';

const xata = getXataClient();

export const authOptions: NextAuthOptions = {
  adapter: XataAdapter(xata),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT) ?? 587,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET || '',
      // https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
      // @ts-ignore
      scope: 'read:user',
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_JWT_SECRET, // I created this
  pages: {
    signIn: '/account/sign-in',
    error: '/account/error',
    verifyRequest: '/account/verify-request',
    newUser: '/account/new/username',
  },
  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user, profile, isNewUser }) {
      const userId = token.sub || user?.id;

      if (isNewUser && userId) {
        await createUser(userId, {
          name: token.name || user?.name || profile?.name,
          image: token.picture || user?.image || undefined,
        });
      }

      return token;
    },
  },
  debug: false,
};

export default NextAuth(authOptions);
