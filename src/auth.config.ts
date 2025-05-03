import type { NextAuthConfig } from "next-auth";
import type { DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

// Định nghĩa kiểu dữ liệu phản hồi từ backend
type TokenResponse = {
  user: {
    email: string;
    name: string;
    image: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

// Module mở rộng cho Next-Auth
declare module "next-auth" {
  interface Session {
    user: {
      accessToken?: string;
      refreshToken?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
  }
}

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname.startsWith("/new");
      if (isOnChat) {
        if (isLoggedIn) return true;
        return false;
      }
      return true;
    },

    async signIn({ user, account, profile }) {
      // Chỉ xử lý khi đăng nhập với Google
      if (account?.provider === "google" && profile) {
        try {
          // Gửi thông tin Google OAuth xuống backend để xác thực và lưu
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/callback/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: profile.email,
                name: profile.name,
                image: profile.image || profile.picture,
                googleId: profile.sub,
                accessToken: account.access_token,
                idToken: account.id_token,
              }),
              cache: "no-store",
            }
          );

          console.log("Google OAuth backend response status:", response.status);

          if (response.ok) {
            const data = (await response.json()) as TokenResponse;

            // Lưu token vào user object để callback jwt có thể sử dụng
            if (data.accessToken) {
              (user as any).accessToken = data.accessToken;
              (user as any).refreshToken = data.refreshToken;
              (user as any).expiresIn = data.expiresIn;
            }

            return true;
          } else {
            console.error("Google OAuth failed:", await response.text());
            return false;
          }
        } catch (error) {
          console.error("Error during Google OAuth callback:", error);
          return false;
        }
      }

      return true;
    },
    async jwt({ token, user, account, trigger }) {
      // Khi đăng nhập lần đầu
      if (trigger === "signIn" || trigger === "signUp") {
        if (user) {
          // Lưu thông tin người dùng vào token
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.picture = user.image;

          // Lưu access token từ user object (đã được set trong signIn callback)
          if ((user as any).accessToken) {
            token.accessToken = (user as any).accessToken;
            token.refreshToken = (user as any).refreshToken;
            token.expiresIn = (user as any).expiresIn;

            console.log("Token saved from OAuth:", token.accessToken);
          }
        }

        // Xử lý trường hợp đăng nhập với Google nhưng không có custom callback
        if (account?.provider === "google" && !token.accessToken) {
          console.log("No custom token found, using default Google token");
          token.accessToken = account.access_token;
          token.refreshToken = account.refresh_token;
          token.expiresIn = account.expires_at;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        if (token.accessToken) {
          session.user.accessToken = token.accessToken as string;
        }
        if (token.refreshToken) {
          session.user.refreshToken = token.refreshToken as string;
        }
      }
      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.error("Missing credentials");
          return null;
        }

        try {
          const login_endpoint = `${process.env.BACKEND_API_URL}/auth/login`;
          console.log("Attempting login for:", credentials.email);

          const res = await fetch(login_endpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            cache: "no-store",
          });

          // Log response status
          console.log("Login response status:", res.status);
          if (res.ok) {
            const tokenResponse = (await res.json()) as TokenResponse;
            console.log("tokenResponse", tokenResponse);
            if (tokenResponse) {
              return {
                email: tokenResponse.user.email,
                name: tokenResponse.user.name,
                image: tokenResponse.user.image,
                accessToken: tokenResponse.accessToken,
                refreshToken: tokenResponse.refreshToken,
                expiresIn: tokenResponse.expiresIn,
              };
            }
          } else {
            const errorText = await res.text();
            console.error("Login failed:", errorText);
          }

          return null;
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
};
