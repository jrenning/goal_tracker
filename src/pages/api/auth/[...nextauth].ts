import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import {PrismaAdapter} from "@next-auth/prisma-adapter"
import { prisma } from "~/server/db";
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    newUser: "/auth/new_user"
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ? process.env.GITHUB_ID : "",
      clientSecret: process.env.GITHUB_SECRET ? process.env.GITHUB_SECRET : "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID
        ? process.env.GOOGLE_CLIENT_ID
        : "",
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ? process.env.GOOGLE_CLIENT_SECRET  : "",
    }),
    // ...add more providers here
  ],
};
export default NextAuth(authOptions)