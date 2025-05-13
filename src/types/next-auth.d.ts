import { type DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      accessToken?: string;
      refreshToken?: string;
      typeLogin: "google" | "password";
    } & DefaultSession["user"];
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    typeLogin?: "google" | "password";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresIn?: number;
    typeLogin?: "google" | "password";
  }
}
