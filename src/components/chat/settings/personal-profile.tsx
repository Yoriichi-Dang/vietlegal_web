"use client";

import React, { useState, useRef } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { User, PencilLine, Upload, Mail } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";
// Import hàm uploadAvatar từ utils
import { uploadAvatar } from "@/utils/upload";
import { profileApiUrl } from "@/utils/config";
import useAxiosAuth from "@/hooks/useAxiosAuth";

// Định nghĩa schema cho form
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự",
  }),
  avatarUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const PersonalProfile = () => {
  const { data: session, update } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { axiosAuth, isReady } = useAxiosAuth();
  const [avatar, setAvatar] = useState<string | null>(
    session?.user?.image || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: session?.user?.name || "",
      avatarUrl: session?.user?.image || "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    data.avatarUrl = avatar || "";
    if (isReady) {
      await axiosAuth
        .put(profileApiUrl.updateProfile, data)
        .then(() => {
          update({
            user: {
              name: data.name,
              image: data.avatarUrl,
            },
          });
          toast.success("Cập nhật thông tin thành công!");
        })
        .catch((error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Có lỗi xảy ra khi cập nhật thông tin"
          );
        });
      setIsSubmitting(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra kích thước file (giới hạn 2MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    // Tạo URL cho ảnh preview tạm thời
    const localImageUrl = URL.createObjectURL(file);
    setAvatar(localImageUrl);

    // Đánh dấu là đang upload
    setIsUploading(true);

    try {
      // Gọi hàm uploadAvatar từ utils
      const cloudinaryUrl = await uploadAvatar(file);
      // Nếu upload thành công, cập nhật URL avatar
      if (cloudinaryUrl) {
        // Gỡ bỏ URL tạm thời để tránh rò rỉ bộ nhớ
        URL.revokeObjectURL(localImageUrl);
        // Cập nhật avatar với URL từ Cloudinary
        setAvatar(cloudinaryUrl);
        toast.success("Upload ảnh đại diện thành công!");
      } else {
        toast.error("Không thể upload ảnh đại diện");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi upload ảnh đại diện"
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-8 p-2 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div
            className="w-24 h-24 rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center cursor-pointer border-2 border-zinc-200 dark:border-zinc-700"
            onClick={handleAvatarClick}
          >
            {avatar ? (
              <Image
                src={avatar || "/avatar.jpg"}
                alt="User avatar"
                width={112}
                height={112}
                className="object-cover w-full h-full"
              />
            ) : (
              <User size={40} className="text-zinc-400" />
            )}
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer"
            onClick={handleAvatarClick}
          >
            {isUploading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload size={24} className="text-white" />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Click để thay đổi ảnh đại diện
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        {/* Email field - read only */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <label
            htmlFor="email"
            className="text-sm font-medium col-span-1 flex items-center gap-2"
          >
            <Mail size={16} />
            Email
          </label>
          <div className="col-span-2">
            <Input
              id="email"
              value={session?.user?.email || ""}
              readOnly
              className="bg-zinc-100 dark:bg-zinc-800 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Email không thể thay đổi
            </p>
          </div>
        </div>

        {/* Name field */}
        <div className="grid grid-cols-3 gap-4 items-center">
          <label
            htmlFor="name"
            className="text-sm font-medium col-span-1 flex items-center gap-2"
          >
            <PencilLine size={16} />
            Họ tên
          </label>
          <div className="col-span-2">
            <Input
              id="name"
              placeholder="Nhập họ tên của bạn"
              {...form.register("name")}
              className="bg-zinc-100 dark:bg-zinc-800"
            />
            {form.formState.errors.name && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            className="w-1/3"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting ? "Đang xử lý..." : "Cập nhật thông tin"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PersonalProfile;
