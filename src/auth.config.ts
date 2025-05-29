import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { authApiUrl, serverApiBaseUrl } from "./utils/config";

// Định nghĩa kiểu dữ liệu phản hồi từ backend
type TokenResponse = {
  user: {
    email: string;
    name: string;
    avatarUrl: string;
  };
  accessToken: string;
  refreshToken: string;
};

export const authConfig: NextAuthConfig = {
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/auth",
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
            `${serverApiBaseUrl}${authApiUrl.googleLogin}`,
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
              (user as any).typeLogin = "google";
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
    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        // Đảm bảo cập nhật token với thông tin từ user
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;

        // Trường hợp đăng nhập với credentials
        if ((user as any).accessToken) {
          token.accessToken = (user as any).accessToken;
          token.refreshToken = (user as any).refreshToken;
          token.typeLogin = (user as any).typeLogin; // Đảm bảo lấy typeLogin từ user
        }

        // Trường hợp đăng nhập với Google
        if (account?.provider === "google") {
          // Đảm bảo gán typeLogin là "google" cho Google Auth
          token.typeLogin = "google";

          // Nếu không có accessToken từ user, sử dụng từ account
          if (!token.accessToken) {
            token.accessToken = account.access_token;
            token.refreshToken = account.refresh_token;
          }
        } else {
          token.typeLogin = "password";
        }
      }
      if (trigger === "update") {
        if (session.user.accessToken && session.user.refreshToken) {
          token.accessToken = session.user.accessToken;
          token.refreshToken = session.user.refreshToken;
        }
        if (session.user.name) {
          token.name = session.user.name;
        }
        if (session.user.image) {
          token.picture = session.user.image;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
          accessToken: token.accessToken as string,
          refreshToken: token.refreshToken as string,
          typeLogin: token.typeLogin as "google" | "password", // Đảm bảo gán typeLogin
        };
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
          return null;
        }

        try {
          const res = await fetch(`${serverApiBaseUrl}${authApiUrl.login}`, {
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
          if (res.ok) {
            const tokenResponse = (await res.json()) as TokenResponse;
            if (tokenResponse) {
              return {
                email: tokenResponse.user.email,
                name: tokenResponse.user.name,
                image: tokenResponse.user.avatarUrl,
                typeLogin: "password",
                accessToken: tokenResponse.accessToken,
                refreshToken: tokenResponse.refreshToken,
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
