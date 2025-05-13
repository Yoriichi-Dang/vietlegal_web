"use client";

import { signOut, useSession } from "next-auth/react";
import axios from "@/utils/axios";
import { authApiUrl } from "@/utils/config";
import { toast } from "sonner";

export const useRefreshToken = () => {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    try {
      if (!session?.user?.refreshToken) {
        await signOut();
        toast.error("Session expired. Please login again.");
        return null;
      }
      const res = await axios.post(authApiUrl.refreshToken, {
        refreshToken: session.user.refreshToken,
      });
      session.user.accessToken = res.data.accessToken;
      session.user.refreshToken = res.data.refreshToken;
      if (session.user.accessToken && session.user.refreshToken) {
        update({
          user: {
            accessToken: session.user.accessToken,
            refreshToken: session.user.refreshToken,
          },
        });
      }
    } catch (error: any) {
      console.error("Refresh token error:", error);
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else {
        toast.error("Authentication error. Please login again.");
      }
      await signOut();
    }
  };

  return refreshToken;
};
