"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import Divider from "@/components/auth/divider";
import AuthButton from "@/components/auth/button";
import registerSchema, { RegisterFormData } from "@/schemas/register";
import PasswordRequirements from "@/components/auth/password-requirements";
import FormInput from "@/components/auth/input";
import GoogleIcon from "@/components/icons/google-icon";
export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  // Watch password field for validation indicators
  const password = watch("password");

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Replace this with your actual registration logic
      console.log("Registration data:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect or update state after successful registration
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google registration
  const handleGoogleRegister = async () => {
    setIsLoading(true);

    try {
      // Replace with your Google auth logic
      console.log("Google registration");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect after successful registration
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Google registration failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle password visibility handlers
  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
          Join Now for Success
        </h1>
        <p className="text-sm sm:text-base text-foreground/60">
          Create an account to get started
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-5"
      >
        {/* Name field */}
        <FormInput
          id="name"
          label="Name"
          type="text"
          placeholder="Your name"
          error={errors.name}
          {...register("name")}
        />

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
        <div>
          <FormInput
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={errors.password}
            showTogglePassword
            showPassword={showPassword}
            onTogglePassword={togglePassword}
            {...register("password")}
          />

          {/* Password strength requirements */}
          <PasswordRequirements password={password} />
        </div>

        {/* Confirm Password field */}
        <FormInput
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="••••••••"
          error={errors.confirmPassword}
          showTogglePassword
          showPassword={showConfirmPassword}
          onTogglePassword={toggleConfirmPassword}
          {...register("confirmPassword")}
        />

        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              {...register("terms")}
              className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-foreground/20 rounded"
            />
          </div>
          <div className="ml-2 sm:ml-3 text-xs sm:text-sm">
            <label htmlFor="terms" className="text-foreground/60">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Terms
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-indigo-600 hover:text-indigo-800"
              >
                Privacy Policy
              </Link>
            </label>
            {errors.terms && (
              <p className="mt-1 text-xs sm:text-sm text-red-600">
                {errors.terms.message}
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <AuthButton
          type="submit"
          isLoading={isLoading}
          variant="primary"
          size="md"
        >
          {isLoading ? "Creating Account..." : "Sign Me Up!"}
        </AuthButton>
      </form>

      {/* Divider */}
      <div className="mt-5 sm:mt-6">
        <Divider />

        {/* Google Sign-up Button */}
        <div className="mt-3 sm:mt-6">
          <AuthButton
            type="button"
            onClick={handleGoogleRegister}
            isLoading={isLoading}
            variant="outline"
            size="md"
            icon={<GoogleIcon />}
          >
            Register with Google
          </AuthButton>
        </div>
      </div>

      {/* Login link */}
      <div className="mt-6 sm:mt-8 text-center">
        <p className="text-xs sm:text-sm text-foreground/60">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
