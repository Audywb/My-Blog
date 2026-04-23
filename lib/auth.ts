import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { AuthOptions } from "next-auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
    session: {
        strategy: "jwt",
    },

    providers: [
        Credentials({
            credentials: {
                username: {},
                password: {},
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: { username: credentials?.username },
                });

                if (!user) return null;

                const isValid = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!isValid) return null;

                return {
                    id: user.id.toString(),
                    name: user.username,
                };
            },
        }),
    ],

    pages: {
        signIn: "/signin",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };