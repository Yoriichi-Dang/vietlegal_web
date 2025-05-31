"use client";

import type React from "react";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

import {
  IconUser,
  IconSettings,
  IconPalette,
  IconBell,
  IconShield,
  IconLogout,
  IconCamera,
  IconX,
  IconCheck,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signOut, useSession } from "next-auth/react";
import useAxiosAuth from "@/hooks/useAxiosAuth";
import { profileApiUrl } from "@/utils/config";
import { uploadAvatar } from "@/utils/upload";

interface UserAvatarMenuProps {
  className?: string;
}

export default function UserAvatarMenu({ className }: UserAvatarMenuProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const { data: session } = useSession();

  const menuItems = [
    {
      id: "profile",
      label: "Profile Settings",
      icon: <IconUser className="h-4 w-4" />,
      description: "Manage your profile information",
    },
    {
      id: "account",
      label: "Account Settings",
      icon: <IconSettings className="h-4 w-4" />,
      description: "Privacy and security settings",
    },
    {
      id: "appearance",
      label: "Appearance",
      icon: <IconPalette className="h-4 w-4" />,
      description: "Customize your experience",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <IconBell className="h-4 w-4" />,
      description: "Manage notification preferences",
    },
    {
      id: "privacy",
      label: "Privacy & Security",
      icon: <IconShield className="h-4 w-4" />,
      description: "Control your privacy settings",
    },
    {
      id: "logout",
      label: "Sign Out",
      icon: <IconLogout className="h-4 w-4" />,
      description: "Sign out of your account",
      danger: true,
    },
  ];

  const handleMenuItemClick = (itemId: string) => {
    setIsDropdownOpen(false);
    if (itemId === "logout") {
      // Handle logout
      signOut({ callbackUrl: "/" });
    } else {
      setActiveDialog(itemId);
    }
  };

  return (
    <>
      {/* Avatar Button */}
      <div className={cn("relative", className)}>
        <motion.button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden border-2 border-transparent hover:border-blue-400 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Image
            src={session?.user?.image || "/avatar.jpg"}
            alt="User avatar"
            className="w-full h-full object-cover"
            width={40}
            height={40}
          />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isDropdownOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Dropdown */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-12 z-50 w-80 bg-neutral-800/95 backdrop-blur-xl rounded-2xl border border-neutral-700/50 shadow-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 border-b border-neutral-700/50 bg-gradient-to-r from-neutral-800/50 to-neutral-700/50">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden">
                      <Image
                        src={session?.user?.image || "/placeholder.svg"}
                        alt="User avatar"
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        {session?.user.name}
                      </h3>
                      <p className="text-neutral-400 text-sm">
                        {session?.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  {menuItems.map((item) => (
                    <motion.button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.id)}
                      whileHover={{ x: 4 }}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group",
                        item.danger
                          ? "hover:bg-red-500/10 text-red-400 hover:text-red-300"
                          : "hover:bg-neutral-700/50 text-neutral-300 hover:text-white"
                      )}
                    >
                      <div
                        className={cn(
                          "p-2 rounded-lg transition-colors",
                          item.danger
                            ? "bg-red-500/20 group-hover:bg-red-500/30"
                            : "bg-neutral-700 group-hover:bg-neutral-600"
                        )}
                      >
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-neutral-500">
                          {item.description}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Profile Dialog */}
      <AnimatePresence>
        {activeDialog === "profile" && (
          <ProfileDialog onClose={() => setActiveDialog(null)} />
        )}
      </AnimatePresence>

      {/* Account Dialog */}
      <AnimatePresence>
        {activeDialog === "account" && (
          <AccountDialog onClose={() => setActiveDialog(null)} />
        )}
      </AnimatePresence>

      {/* Appearance Dialog */}
      <AnimatePresence>
        {activeDialog === "appearance" && (
          <AppearanceDialog onClose={() => setActiveDialog(null)} />
        )}
      </AnimatePresence>

      {/* Notifications Dialog */}
      <AnimatePresence>
        {activeDialog === "notifications" && (
          <NotificationsDialog onClose={() => setActiveDialog(null)} />
        )}
      </AnimatePresence>

      {/* Privacy Dialog */}
      <AnimatePresence>
        {activeDialog === "privacy" && (
          <PrivacyDialog onClose={() => setActiveDialog(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

// Profile form schema
const profileFormSchema = z.object({
  name: z.string().min(2, {
    message: "Tên phải có ít nhất 2 ký tự",
  }),
  avatarUrl: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Enhanced Profile Dialog Component
function ProfileDialog({ onClose }: { onClose: () => void }) {
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

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    // Create preview URL
    const localImageUrl = URL.createObjectURL(file);
    setAvatar(localImageUrl);
    setIsUploading(true);

    try {
      const cloudinaryUrl = await uploadAvatar(file);
      if (cloudinaryUrl) {
        URL.revokeObjectURL(localImageUrl);
        setAvatar(cloudinaryUrl);
        toast.success("Upload ảnh đại diện thành công!");
      } else {
        toast.error("Không thể upload ảnh đại diện");
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi upload ảnh đại diện");
      setAvatar(session?.user?.image || null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-neutral-800 rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-700 bg-zinc-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Profile Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <IconX className="h-5 w-5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative group">
              <div
                className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full overflow-hidden cursor-pointer border-4 border-neutral-700 hover:border-blue-500 transition-all duration-200"
                onClick={handleAvatarClick}
              >
                {avatar ? (
                  <Image
                    src={avatar || "/placeholder.svg"}
                    alt="User avatar"
                    className="w-full h-full object-cover"
                    width={96}
                    height={96}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <IconUser className="h-10 w-10 text-white" />
                  </div>
                )}
              </div>

              {/* Upload overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 rounded-full transition-opacity cursor-pointer"
                onClick={handleAvatarClick}
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <IconCamera className="h-6 w-6 text-white" />
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
                accept="image/*"
                disabled={isUploading || isSubmitting}
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-neutral-300 font-medium">
                Click để thay đổi ảnh đại diện
              </p>
              <p className="text-xs text-neutral-500">PNG, JPG tối đa 5MB</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-neutral-300 flex items-center gap-2">
                <IconUser className="h-4 w-4" />
                Họ tên
              </label>
              <input
                {...form.register("name")}
                className="w-full bg-neutral-700 text-white rounded-lg px-3 py-2.5 border border-neutral-600 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="Nhập họ tên của bạn"
                disabled={isSubmitting}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-400">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-neutral-600 disabled:to-neutral-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <IconCheck className="h-4 w-4" />
                  Cập nhật thông tin
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Account Dialog Component
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

// Enhanced Account Dialog Component
function AccountDialog({ onClose }: { onClose: () => void }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const { axiosAuth, isReady } = useAxiosAuth();

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: PasswordFormValues) => {
    const payload = {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    };
    setIsPending(true);

    try {
      // Simulate API call - replace with actual API call
      // await axiosAuth.patch(profileApiUrl.changePassword, payload)
      if (isReady) {
        axiosAuth.patch(profileApiUrl.changePassword, payload).then(() => {
          toast.success("Thay đổi mật khẩu thành công!");
          form.reset();
          setIsPending(false);
        });
      }
    } catch (error: any) {
      console.log(error);
      toast.error("Có lỗi xảy ra khi thay đổi mật khẩu");
    } finally {
      setIsPending(false);
    }
  };

  //   const handleEnable2FA = async () => {
  //     try {
  //       // Simulate API call
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //       setTwoFactorEnabled(!twoFactorEnabled);
  //       toast.success(twoFactorEnabled ? "Đã tắt 2FA" : "Đã bật 2FA thành công!");
  //     } catch (error) {
  //       toast.error("Có lỗi xảy ra");
  //     }
  //   };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-lg bg-neutral-800 rounded-2xl border border-neutral-700 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-700 bg-gradient-to-r from-neutral-800/50 to-neutral-700/50">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Account Settings
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
              disabled={isPending}
            >
              <IconX className="h-5 w-5 text-neutral-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Password Change Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <IconShield className="h-5 w-5 text-blue-400" />
              <h3 className="text-lg font-medium text-white">Đổi mật khẩu</h3>
            </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Current Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    {...form.register("currentPassword")}
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full bg-neutral-700 text-white rounded-lg px-3 py-2.5 pr-10 border border-neutral-600 focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                    disabled={isPending}
                  >
                    {showCurrentPassword ? (
                      <IconEyeOff className="h-4 w-4" />
                    ) : (
                      <IconEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.currentPassword && (
                  <p className="text-sm text-red-400">
                    {form.formState.errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    {...form.register("newPassword")}
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu mới"
                    className="w-full bg-neutral-700 text-white rounded-lg px-3 py-2.5 pr-10 border border-neutral-600 focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                    disabled={isPending}
                  >
                    {showNewPassword ? (
                      <IconEyeOff className="h-4 w-4" />
                    ) : (
                      <IconEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.newPassword && (
                  <p className="text-sm text-red-400">
                    {form.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-300">
                  Xác nhận mật khẩu
                </label>
                <div className="relative">
                  <input
                    {...form.register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Xác nhận mật khẩu mới"
                    className="w-full bg-neutral-700 text-white rounded-lg px-3 py-2.5 pr-10 border border-neutral-600 focus:border-blue-500 focus:outline-none transition-colors"
                    disabled={isPending}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-white transition-colors"
                    disabled={isPending}
                  >
                    {showConfirmPassword ? (
                      <IconEyeOff className="h-4 w-4" />
                    ) : (
                      <IconEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-sm text-red-400">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-neutral-700/30 rounded-lg p-3">
                <p className="text-xs text-neutral-400 mb-2">
                  Mật khẩu phải có:
                </p>
                <ul className="text-xs text-neutral-400 space-y-1">
                  <li>• Ít nhất 8 ký tự</li>
                  <li>• Ít nhất 1 chữ hoa</li>
                  <li>• Ít nhất 1 chữ số</li>
                  <li>• Ít nhất 1 ký tự đặc biệt</li>
                </ul>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-neutral-600 disabled:to-neutral-600 text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
              >
                {isPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <IconCheck className="h-4 w-4" />
                    Cập nhật mật khẩu
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-700"></div>

          {/* Two-Factor Authentication */}
          {/* <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <IconShield className="h-5 w-5 text-green-400" />
              <h3 className="text-lg font-medium text-white">
                Xác thực hai yếu tố
              </h3>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-700/30 rounded-lg">
              <div>
                <div className="font-medium text-white">2FA Authentication</div>
                <div className="text-sm text-neutral-400">
                  {twoFactorEnabled
                    ? "Đã bật bảo mật 2FA"
                    : "Thêm lớp bảo mật cho tài khoản"}
                </div>
              </div>
              <button
                onClick={handleEnable2FA}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors font-medium",
                  twoFactorEnabled
                    ? "bg-red-600 hover:bg-red-500 text-white"
                    : "bg-green-600 hover:bg-green-500 text-white"
                )}
              >
                {twoFactorEnabled ? "Tắt 2FA" : "Bật 2FA"}
              </button>
            </div>
          </div> */}

          {/* Session Management */}
          {/* <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <IconSettings className="h-5 w-5 text-orange-400" />
              <h3 className="text-lg font-medium text-white">Quản lý phiên</h3>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-neutral-700/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">
                      Đăng xuất tất cả thiết bị
                    </div>
                    <div className="text-sm text-neutral-400">
                      Đăng xuất khỏi tất cả thiết bị khác
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors text-white font-medium">
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </motion.div>
    </div>
  );
}

// Appearance Dialog Component
function AppearanceDialog({ onClose }: { onClose: () => void }) {
  const [theme, setTheme] = useState("dark");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-neutral-800 rounded-2xl border border-neutral-700 shadow-2xl"
      >
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Appearance</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <IconX className="h-5 w-5 text-neutral-400" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-white mb-3">Theme</h3>
            <div className="grid grid-cols-2 gap-3">
              {["light", "dark"].map((themeOption) => (
                <button
                  key={themeOption}
                  onClick={() => setTheme(themeOption)}
                  className={cn(
                    "p-4 rounded-lg border-2 transition-all",
                    theme === themeOption
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-neutral-600 hover:border-neutral-500"
                  )}
                >
                  <div className="text-white font-medium capitalize">
                    {themeOption}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// Notifications Dialog Component
function NotificationsDialog({ onClose }: { onClose: () => void }) {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-neutral-800 rounded-2xl border border-neutral-700 shadow-2xl"
      >
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Notifications</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <IconX className="h-5 w-5 text-neutral-400" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-neutral-700/50 rounded-lg"
            >
              <div>
                <div className="font-medium text-white capitalize">
                  {key} Notifications
                </div>
                <div className="text-sm text-neutral-400">
                  Receive notifications via {key}
                </div>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({ ...prev, [key]: !value }))
                }
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  value ? "bg-blue-600" : "bg-neutral-600"
                )}
              >
                <div
                  className={cn(
                    "w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform",
                    value ? "translate-x-6" : "translate-x-0.5"
                  )}
                />
              </button>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Privacy Dialog Component
function PrivacyDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-md bg-neutral-800 rounded-2xl border border-neutral-700 shadow-2xl"
      >
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">
              Privacy & Security
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <IconX className="h-5 w-5 text-neutral-400" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
