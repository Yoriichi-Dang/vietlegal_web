"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { AlertTriangle, AlertCircle } from "lucide-react";
import AuthButton from "@/components/auth/button";
import FormInput from "@/components/auth/input";
import forgotPasswordSchema, {
  ForgotPasswordFormData,
} from "@/schemas/forgot-password";

// Status types for the form
type FormStatus = "idle" | "loading" | "success" | "warning" | "error";

export default function ForgotPassword() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  // Initialize React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setStatus("loading");
    try {
      console.log("Forgot password request for:", data.email);

      // Simulate API call with different responses based on email
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Example logic to simulate different API responses
      // In a real application, this would be replaced with actual API calls
      if (data.email.includes("nonexistent")) {
        // Simulate case where email doesn't exist in the database
        setStatus("warning");
        setStatusMessage(
          "We couldn't find an account with that email address. Please check your spelling and try again."
        );
      } else if (data.email.includes("error")) {
        // Simulate a server error
        setStatus("error");
        setStatusMessage(
          "Something went wrong on our end. Please try again later or contact support if the issue persists."
        );
      } else {
        // Successful case
        setStatus("success");
      }
    } catch (error) {
      // Unexpected errors
      console.error("Password reset request failed:", error);
      setStatus("error");
      setStatusMessage("An unexpected error occurred. Please try again later.");
    }
  };

  // Render status alert
  const renderStatusAlert = () => {
    if (status === "success") {
      return (
        <div className="bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <h3 className="text-base font-medium text-green-800 dark:text-green-400 mb-2">
            Password Reset Link Sent
          </h3>
          <p className="text-sm text-green-700 dark:text-green-300">
            We&apos;ve sent a password reset link to your email address. Please
            check your inbox and follow the instructions.
          </p>
          <div className="mt-4 text-center">
            <Link
              href="/login"
              className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              Return to login
            </Link>
          </div>
        </div>
      );
    }

    if (status === "warning") {
      return (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6 flex">
          <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mr-3 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              {statusMessage}
            </p>
          </div>
        </div>
      );
    }

    if (status === "error") {
      return (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 flex">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mr-3 mt-0.5" />
          <div>
            <p className="text-sm text-red-700 dark:text-red-300">
              {statusMessage}
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0">
      <div className="text-center mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-foreground">
          Reset Your Password
        </h1>
        <p className="text-sm sm:text-base text-foreground/60">
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </p>
      </div>

      {status === "success" ? (
        renderStatusAlert()
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Status alerts for warning and error */}
          {renderStatusAlert()}

          {/* Email field */}
          <FormInput
            id="email"
            label="Email address"
            type="email"
            placeholder="your.email@example.com"
            error={errors.email}
            {...register("email")}
          />

          {/* Submit Button */}
          <AuthButton
            type="submit"
            isLoading={status === "loading"}
            variant="primary"
            size="md"
            fullWidth
          >
            {status === "loading" ? "Sending Reset Link..." : "Send Reset Link"}
          </AuthButton>

          {/* Back to Login */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-foreground/60">
              <Link
                href="/login"
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                Back to login
              </Link>
            </p>
          </div>
        </form>
      )}
    </div>
  );
}
