"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRefreshToken } from "./useRefreshToken";
import { axiosAuth } from "@/utils/axios";

const useAxiosAuth = () => {
  const { data: session, status } = useSession();
  const refreshToken = useRefreshToken();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Cập nhật trạng thái isReady dựa trên status session
    setIsReady(status === "authenticated" && !!session?.user?.accessToken);
  }, [status, session]);

  useEffect(() => {
    if (status === "loading") return;

    const requestIntercept = axiosAuth.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"] && session?.user?.accessToken) {
          config.headers[
            "Authorization"
          ] = `Bearer ${session?.user?.accessToken}`;
        }
        return config;
      },
      () => Promise.reject(new Error("Authentication required"))
    );

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true;
          await refreshToken();

          prevRequest.headers[
            "Authorization"
          ] = `Bearer ${session?.user.accessToken}`;
          return axiosAuth(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, [
    refreshToken,
    session,
    session?.user?.accessToken,
    session?.user?.refreshToken,
    status,
  ]);

  // Trả về object có axiosAuth và isReady flag
  return {
    axiosAuth,
    isReady,
  };
};

export default useAxiosAuth;
