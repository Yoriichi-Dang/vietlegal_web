"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { profileApiUrl } from "@/utils/config";
import useAxiosAuth from "@/hooks/useAxiosAuth";

// Định nghĩa schema cho form
const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, {
      message: "Vui lòng nhập mật khẩu hiện tại",
    }),
    newPassword: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .regex(/\d/, { message: "Mật khẩu phải chứa ít nhất một chữ số" })
      .regex(/[A-Z]/, {
        message: "Mật khẩu phải chứa ít nhất một chữ hoa",
      })
      .regex(/[^A-Za-z0-9]/, {
        message: "Mật khẩu phải chứa ít nhất một ký tự đặc biệt",
      }),
    confirmPassword: z.string().min(1, {
      message: "Vui lòng xác nhận mật khẩu",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu không khớp",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const PasswordForm = () => {
  const { axiosAuth, isReady } = useAxiosAuth();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (data: PasswordFormValues) => {
    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    setIsPending(true);
    if (isReady) {
      axiosAuth.patch(profileApiUrl.changePassword, payload).then(() => {
        toast.success("Thay đổi mật khẩu thành công!");
        form.reset();
        setIsPending(false);
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-3 gap-4 items-center">
          <label
            htmlFor="currentPassword"
            className="text-sm font-medium col-span-1"
          >
            Mật khẩu hiện tại
          </label>
          <div className="relative col-span-2">
            <Input
              id="currentPassword"
              placeholder="Nhập mật khẩu hiện tại"
              type={showCurrentPassword ? "text" : "password"}
              {...form.register("currentPassword")}
              className="pr-10 w-full bg-zinc-100 dark:bg-zinc-800"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {form.formState.errors.currentPassword && (
            <p className="text-sm text-red-500 col-start-2 col-span-2">
              {form.formState.errors.currentPassword.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 items-center">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium col-span-1"
          >
            Mật khẩu mới
          </label>
          <div className="relative col-span-2">
            <Input
              id="newPassword"
              placeholder="Nhập mật khẩu mới"
              type={showNewPassword ? "text" : "password"}
              {...form.register("newPassword")}
              className="pr-10 w-full bg-zinc-100 dark:bg-zinc-800"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {form.formState.errors.newPassword && (
            <p className="text-sm text-red-500 col-start-2 col-span-2">
              {form.formState.errors.newPassword.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 items-center">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium col-span-1"
          >
            Xác nhận mật khẩu
          </label>
          <div className="relative col-span-2">
            <Input
              id="confirmPassword"
              placeholder="Xác nhận mật khẩu mới"
              type={showConfirmPassword ? "text" : "password"}
              {...form.register("confirmPassword")}
              className="pr-10 w-full bg-zinc-100 dark:bg-zinc-800"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>
          {form.formState.errors.confirmPassword && (
            <p className="text-sm text-red-500 col-start-2 col-span-2">
              {form.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" className="w-1/3" disabled={isPending}>
            {isPending ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
