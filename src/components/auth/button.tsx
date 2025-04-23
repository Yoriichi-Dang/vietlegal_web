// components/ui/auth-button.tsx

import React from "react";
import { Loader2 } from "lucide-react";

interface AuthButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "outline";
  icon?: React.ReactNode;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
}

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  isLoading = false,
  variant = "primary",
  icon,
  fullWidth = true,
  size = "md",
  className,
  disabled,
  ...props
}) => {
  // Base styles
  const baseStyles =
    "rounded-lg font-medium transition-colors flex items-center justify-center";

  // Width styles
  const widthStyles = fullWidth ? "w-full" : "";

  // Size styles
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 sm:py-3 text-sm sm:text-base",
    lg: "px-6 py-3 sm:py-4 text-base sm:text-lg",
  }[size];

  // Variant styles
  const variantStyles = {
    primary:
      "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
  }[variant];

  // Disabled and loading styles
  const stateStyles =
    disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";

  return (
    <button
      className={`cursor-pointer ${baseStyles} ${widthStyles} ${sizeStyles} ${variantStyles} ${stateStyles} ${
        className || ""
      }`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          <span>{typeof children === "string" ? children : "Loading..."}</span>
        </>
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default AuthButton;
