"use client";
import LoginForm from "@/components/auth/lold-ogin-form";
import { LoginFormData } from "@/schemas/login";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });
      if (result?.error) {
        toast.error("Email hoặc mật khẩu không chính xác");
      }
      router.push("/new");
      router.refresh();
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="text-center mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
          Welcome Back
        </h1>
        <p className="text-sm sm:text-base text-foreground/60">
          Sign in to access your account
        </p>
      </div>
      <LoginForm
        onSubmit={onSubmit}
        isLoading={isLoading}
        handleGoogleLogin={async () => {
          setIsLoading(true);
          await signIn("google", { callbackUrl: "/new" });
          setIsLoading(false);
        }}
      />
    </div>
  );
}
