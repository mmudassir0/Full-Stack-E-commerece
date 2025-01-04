import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { NextAuthConfig, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { db } from "./db";
import { SignInSchema } from "@/prisma/schemas";
import { generateAccessToken, generateRefreshToken } from "@/utils/jwt";
import { NextResponse } from "next/server";

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
        try {
          const validatedFields = SignInSchema.parse({
            ...credentials,
            rememberMe: credentials.rememberMe === "true",
          });
          console.log(
            credentials,
            "credentials",
            "validatedFields",
            validatedFields
          );

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

          const tokenPayload = {
            userId: user.id,
            email: user.email,
            role: user.role,
          };

          const accessToken = generateAccessToken(tokenPayload);
          const refreshToken = generateRefreshToken(tokenPayload);

          await db.userToken.create({
            data: {
              accessToken,
              refreshToken,
              expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              user: {
                connect: {
                  id: user.id,
                },
              },
            },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.profile ? `${user.profile.name} ` : null,
            role: user.role,
            isVerified: user.isVerified,
            status: user.status,
            rememberMe,
            accessToken,
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
    async signIn({ user, account }) {
      if (account) {
        // Log the tokens to verify they're being received
        console.log("Access Token:", account.access_token);
        console.log("Refresh Token:", account.refresh_token);
        console.log(user, "user");
      }
      // Prevent unverified email login for credentials provider
      // if (account?.provider === "credentials" && !user.isVerified) {
      //   throw new Error("Please verify your email first");
      // }
      // if (account?.provider && account.provider !== "credentials") {
      //   try {
      //     // First, check if the account exists
      //     const existingAccount = await db.account.findUnique({
      //       where: {
      //         provider_providerAccountId: {
      //           provider: account.provider,
      //           providerAccountId: account.providerAccountId,
      //         },
      //       },
      //     });

      //     if (existingAccount) {
      //       // If account exists, update the lastLogin
      //       await db.account.update({
      //         where: {
      //           provider_providerAccountId: {
      //             provider: account.provider,
      //             providerAccountId: account.providerAccountId,
      //           },
      //         },
      //         data: {
      //           access_token: account.access_token,
      //           expires_at: account.expires_at,
      //           metadata: {
      //             lastLogin: new Date(),
      //           },
      //         },
      //       });
      //     }

      //     // Update user information
      //     await db.user.update({
      //       where: { id: user.id },
      //       data: {
      //         emailVerified: new Date(),
      //         lastLoginAt: new Date(),
      //       },
      //     });
      //   } catch (error) {
      //     console.error("Error updating OAuth account:", error);
      //     // Don't throw error here - allow sign in to continue
      //   }
      // }
      return true;
    },
    async jwt({ token, user, account, session }) {
      console.log(
        token,
        "token",
        user,
        "user",
        account,
        "account",
        session,
        "session"
      );

      if (account && user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          isVerified: user.isVerified,
          status: user.status,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
        };
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      try {
        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const tokens = await response.json();

        if (!response.ok) throw new Error("Failed to refresh token");

        return {
          ...token,
          accessToken: tokens.accessToken,
          accessTokenExpires: Date.now() + 15 * 60 * 1000,
          refreshToken: tokens.refreshToken ?? token.refreshToken,
        };
      } catch (error) {
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
        // if (user) {
        //   token.id = user.id;
        //   token.role = user.role;
        //   token.isVerified = user.isVerified;
        //   token.status = user.status;
        //   token.rememberMe = account?.rememberMe;
        // }
        // if (token.rememberMe) {
        //   token.exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
        // } else {
        //   token.exp = Math.floor(Date.now() / 1000) + 24 * 60 * 60; // 1 day
        // }
      }
    },
    async session({ token, session }): Promise<ExtendedSession> {
      console.log(token, "token", session, "session");

      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.status = token.status as string;
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user, account }) {
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
  // events: {
  //   // async createUser({ user }) {
  //   //   try {
  //   //     // Create a profile for the user
  //   //     await db.profile.create({
  //   //       data: {
  //   //         userId: user.id,
  //   //         name: user.name || "Unknown",
  //   //         profileImageUrl: user.image || null,
  //   //       },
  //   //     });
  //   //   } catch (error) {
  //   //     console.error("Error creating user profile:", error);
  //   //   }
  //   // },

  //   async linkAccount({ user }) {
  //     await db.user.update({
  //       where: { id: user.id },
  //       data: {
  //         emailVerified: new Date(),
  //         // isVerified: true,
  //       },
  //     });
  //   },
  // },
  session: {
    strategy: "jwt",
    maxAge: 30,
    updateAge: 15,
  },
  jwt: {
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/signin",
    // error: "/auth/error",
    // verifyRequest: "/auth/verify",
    // newUser: "/auth/new-user",
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);

// async function refreshAccessToken(token) {
//   try {
//     const refreshedTokens = await fetch("https://oauth2.provider.com/token", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         grant_type: "refresh_token",
//         refresh_token: token.refreshToken,
//         client_id: process.env.CLIENT_ID,
//         client_secret: process.env.CLIENT_SECRET,
//       }),
//     }).then((res) => res.json());

//     if (!refreshedTokens.access_token) {
//       throw refreshedTokens;
//     }

//     return {
//       ...token,
//       accessToken: refreshedTokens.access_token,
//       expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
//       refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
//     };
//   } catch (error) {
//     console.error("Failed to refresh access token", error);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }
