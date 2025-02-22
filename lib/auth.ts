import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { SignInSchema } from "@/prisma/schemas";

declare module "next-auth" {
  interface JWT {
    access_token: string;
    expires_at: number;
    refresh_token?: string;
    error?: "RefreshTokenError";
  }
}
interface ExtendedSession extends Session {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role?: string;
    isVerified?: boolean;
    status?: string;
  };
}

const customAdapter = {
  ...PrismaAdapter(db),
  createUser: async (data: any) => {
    const user = await db.user.create({
      data: {
        email: data.email,
        emailVerified: new Date(),
        isVerified: true,
        termsAccepted: true,
        profile: {
          create: {
            name: data.name || "Unknown",
            profileImageUrl: data.image || null,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    return {
      ...user,
      name: user.profile?.name,
    };
  },
};

export const authConfig = {
  adapter: customAdapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile",
        },
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          scope: "read:user user:email",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember Me", type: "checkbox" },
      },
      async authorize(credentials) {
        console.log("authorization complete ", credentials);
        try {
          const validatedFields = SignInSchema.parse({
            ...credentials,
            rememberMe: credentials.rememberMe === "true",
          });

          if (!validatedFields) {
            throw new Error("Invalid credentials1");
          }
          const { email, password, rememberMe } = validatedFields;
          const user = await db.user.findUnique({
            where: {
              email,
              status: "ACTIVE",
              deletedAt: null,
            },
            select: {
              id: true,
              email: true,
              password: true,
              isVerified: true,
              twoFactorEnabled: true,
              status: true,
              role: true,
              failedLoginAttempts: true,
              lockedUntil: true,
              profile: {
                select: {
                  name: true,
                },
              },
            },
          });

          if (!user || !user.password) {
            throw new Error("Invalid credentials2");
          }
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new Error(
              `Account locked. Try again after ${user.lockedUntil.toLocaleString()}`
            );
          }
          const isValidPassword = await bcrypt.compare(password, user.password);

          if (!isValidPassword) {
            // Increment failed attempts
            await db.user.update({
              where: { id: user.id },
              data: {
                failedLoginAttempts: { increment: 1 },
                lockedUntil:
                  user.failedLoginAttempts >= 4
                    ? new Date(Date.now() + 15 * 60 * 1000)
                    : null,
              },
            });
            throw new Error("Invalid credentials3");
          }

          // Reset failed attempts on successful login
          await db.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: 0,
              lockedUntil: null,
              lastLoginAt: new Date(),
            },
          });
          console.log(user, "user already logged in");
          // if (user.twoFactorEnabled) {
          //   return null;
          // }
          return {
            id: user.id,
            email: user.email,
            name: user.profile ? `${user.profile.name} ` : null,
            role: user.role,
            isVerified: user.isVerified,
            status: user.status,
            rememberMe,
          };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],

  trustHost: true,
  callbacks: {
    // async signIn({ user, account }) {
    //   if (account) {
    //     // Log the tokens to verify they're being received
    //     console.log("Access Token:", account.access_token);
    //     console.log("Refresh Token:", account.refresh_token);
    //     console.log(user, "user");
    //   }
    //   // Prevent unverified email login for credentials provider
    //   // if (account?.provider === "credentials" && !user.isVerified) {
    //   //   throw new Error("Please verify your email first");
    //   // }
    //   // if (account?.provider && account.provider !== "credentials") {
    //   //   try {
    //   //     // First, check if the account exists
    //   //     const existingAccount = await db.account.findUnique({
    //   //       where: {
    //   //         provider_providerAccountId: {
    //   //           provider: account.provider,
    //   //           providerAccountId: account.providerAccountId,
    //   //         },
    //   //       },
    //   //     });

    //   //     if (existingAccount) {
    //   //       // If account exists, update the lastLogin
    //   //       await db.account.update({
    //   //         where: {
    //   //           provider_providerAccountId: {
    //   //             provider: account.provider,
    //   //             providerAccountId: account.providerAccountId,
    //   //           },
    //   //         },
    //   //         data: {
    //   //           access_token: account.access_token,
    //   //           expires_at: account.expires_at,
    //   //           metadata: {
    //   //             lastLogin: new Date(),
    //   //           },
    //   //         },
    //   //       });
    //   //     }

    //   //     // Update user information
    //   //     await db.user.update({
    //   //       where: { id: user.id },
    //   //       data: {
    //   //         emailVerified: new Date(),
    //   //         lastLoginAt: new Date(),
    //   //       },
    //   //     });
    //   //   } catch (error) {
    //   //     console.error("Error updating OAuth account:", error);
    //   //     // Don't throw error here - allow sign in to continue
    //   //   }
    //   // }
    //   return true;
    // },
    async jwt({ token, user }) {
      if (user) {
        token.rememberMe = user.rememberMe;
        token.id = user.id;
        token.role = user.role;
        token.isVerified = user.isVerified;
        token.status = user.status;
        token.requiresTwoFactor = user.twoFactorEnabled;

        // token.expires_at =
        //   Date.now() +
        //   (token.rememberMe ? 30 * 24 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000); // 30 days or 2 hours
        token.maxAge = token.rememberMe ? 5 : 10;
      }

      return token;
    },
    async session({ token, session }): Promise<ExtendedSession> {
      // console.log("auth Session:", session);
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.status = token.status as string;
        session.user.requiresTwoFactor = token.requiresTwoFactor;
        // session.expires = new Date(token.expires_at).toISOString();

        const expiryTime = token.rememberMe
          ? 5 * 1000 // 30 days
          : 10 * 1000; // 24 hours

        session.expires = new Date(Date.now() + expiryTime).toISOString();
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user }) {
      try {
        await db.user.update({
          where: { id: user.id },
          data: {
            emailVerified: new Date(),
            isVerified: true,
            lastLoginAt: new Date(),
          },
        });
      } catch (error) {
        console.error("Error in linkAccount event:", error);
      }
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    // updateAge: 5,
  },
  // jwt: {
  //   maxAge: 3 * 60,
  // },
  pages: {
    signIn: "/signin",
    signOut: "/signin",
    error: "/auth/error",
    verifyRequest: "/verify",
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
