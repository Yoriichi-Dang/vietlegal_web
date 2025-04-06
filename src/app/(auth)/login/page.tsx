"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Divider from "@/components/auth/divider";
import AuthButton from "@/components/auth/button";
import GoogleIcon from "@/components/icons/google-icon";
import loginSchema, { LoginFormData } from "@/schemas/login";
import FormInput from "@/components/auth/input";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      console.log("Login data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect or update state after successful login
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // Replace with your Google auth logic
      console.log("Google login");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect after successful login
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Google login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePassword = () => setShowPassword(!showPassword);

  const forgotPasswordLink = (
    <Link
      href="/forgot-password"
      className="text-xs sm:text-sm text-indigo-600 hover:text-indigo-800"
    >
      Forgot password?
    </Link>
  );

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

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        {/* Email field */}
        <FormInput
          id="email"
          label="Email"
          type="email"
          placeholder="your.email@example.com"
          error={errors.email}
          {...register("email")}
        />

        {/* Password field */}
        <FormInput
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.password}
          showTogglePassword
          showPassword={showPassword}
          onTogglePassword={togglePassword}
          showBottomElement={forgotPasswordLink}
          {...register("password")}
        />

        {/* Submit Button */}
        <AuthButton
          type="submit"
          isLoading={isLoading}
          variant="primary"
          size="md"
        >
          Sign in
        </AuthButton>
      </form>

      {/* Divider */}
      <div className="mt-5 sm:mt-6">
        <Divider />

        {/* Google Sign-in Button */}
        <div className="mt-3 sm:mt-6">
          <AuthButton
            type="button"
            onClick={handleGoogleLogin}
            isLoading={isLoading}
            variant="outline"
            size="md"
            icon={<GoogleIcon />}
          >
            Sign in with Google
          </AuthButton>
        </div>
      </div>

      {/* Register link */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-xs sm:text-sm text-foreground/60">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
