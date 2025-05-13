// utils/upload.ts
import { toast } from "sonner";

/**
 * Upload hình ảnh lên Cloudinary qua API Route
 * @param file File hình ảnh cần upload
 * @returns Promise với URL của hình ảnh hoặc null nếu thất bại
 */
export const uploadAvatar = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload-avatar", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Upload thất bại");
    }
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Upload error:", error);
    toast.error(
      error instanceof Error ? error.message : "Có lỗi xảy ra khi upload ảnh"
    );
    return null;
  }
};
