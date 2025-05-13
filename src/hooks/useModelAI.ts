"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { modelApiUrl } from "@/utils/config";
import { AxiosError } from "axios";
import useAxiosAuth from "./useAxiosAuth";
import { useEffect } from "react";
import { AIModel } from "@/types/chat";

interface UseModelAIOptions {
  enabled?: boolean;
}

/**
 * Hook để lấy danh sách các model AI từ server
 * Chỉ fetch một lần duy nhất khi người dùng yêu cầu và giữ trong cache
 * @param options Các tùy chọn
 * @returns Kết quả query chứa danh sách model AI
 */
export function useModelAI(options: UseModelAIOptions = {}) {
  const { axiosAuth, isReady } = useAxiosAuth();

  return useQuery<AIModel[], AxiosError>({
    queryKey: ["ai-models"],
    queryFn: async () => {
      try {
        const response = await axiosAuth.get<AIModel[]>(modelApiUrl.getModel);
        return response.data;
      } catch (error) {
        console.error("Error fetching AI models:", error);
        throw error;
      }
    },
    staleTime: Infinity, // Không bao giờ xem là cũ
    gcTime: Infinity, // Không bao giờ dọn dẹp khỏi bộ nhớ
    retry: false, // Không retry nếu lỗi
    refetchOnWindowFocus: false, // Không refetch khi focus lại
    refetchOnMount: false, // Không refetch khi component mount lại
    refetchOnReconnect: false, // Không refetch khi kết nối lại
    // Chỉ enabled khi axiosAuth đã sẵn sàng VÀ options.enabled là true (hoặc undefined)
    enabled: isReady && (options.enabled ?? true),
  });
}

/**
 * Hook để lấy thông tin một model AI cụ thể theo ID
 * @param modelId ID của model cần lấy thông tin
 * @param options Các tùy chọn
 * @returns Kết quả query chứa thông tin model AI
 */
export function useModelAIById(
  modelId: string | undefined,
  options: UseModelAIOptions = {}
) {
  const { axiosAuth, isReady } = useAxiosAuth();

  return useQuery<AIModel, AxiosError>({
    queryKey: ["ai-model", modelId],
    queryFn: async () => {
      if (!modelId) throw new Error("Model ID is required");

      try {
        const response = await axiosAuth.get<AIModel>(
          `${modelApiUrl.getModel}/${modelId}`
        );
        return response.data;
      } catch (error) {
        console.error(`Error fetching AI model with ID ${modelId}:`, error);
        throw error;
      }
    },
    staleTime: Infinity, // Không bao giờ xem là cũ
    gcTime: Infinity, // Không bao giờ dọn dẹp khỏi bộ nhớ
    retry: false, // Không retry nếu lỗi
    refetchOnWindowFocus: false, // Không refetch khi focus lại
    refetchOnMount: false, // Không refetch khi component mount lại
    refetchOnReconnect: false, // Không refetch khi kết nối lại
    // Chỉ enabled khi có modelId VÀ axiosAuth đã sẵn sàng VÀ options.enabled là true (hoặc undefined)
    enabled: !!modelId && isReady && (options.enabled ?? true),
  });
}

/**
 * Hook để thủ công tải danh sách model AI và lưu vào cache
 * Có thể sử dụng trong initialization code
 */
export function usePreloadModelAI() {
  const queryClient = useQueryClient();
  const { axiosAuth, isReady } = useAxiosAuth();

  // Thêm function để tải khi axiosAuth đã sẵn sàng
  const preload = async () => {
    // Kiểm tra axiosAuth đã sẵn sàng chưa
    if (!isReady) {
      console.log("AxiosAuth not ready, skipping preload");
      return;
    }

    // Kiểm tra xem dữ liệu đã có trong cache chưa
    const cachedData = queryClient.getQueryData(["ai-models"]);
    if (cachedData) {
      console.log("Data already in cache, skipping preload");
      return;
    }

    try {
      console.log("Preloading AI models...");
      const response = await axiosAuth.get<AIModel[]>(modelApiUrl.getModel);
      // Lưu kết quả vào cache
      queryClient.setQueryData(["ai-models"], response.data);
      console.log("AI models preloaded successfully");
    } catch (error) {
      console.error("Error preloading AI models:", error);
    }
  };

  // useEffect để tự động preload khi isReady thay đổi thành true
  useEffect(() => {
    if (isReady) {
      preload();
    }
  }, [isReady]);

  return { preload, isReady };
}
