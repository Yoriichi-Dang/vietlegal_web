// components/ui/form-input.tsx
import React from "react";
import { FieldError } from "react-hook-form";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: FieldError;
  showTogglePassword?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  showRightElement?: React.ReactNode;
  showBottomElement?: React.ReactNode;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  error,
  showTogglePassword = false,
  showPassword = false,
  onTogglePassword,
  showRightElement,
  showBottomElement,
  className,
  ...props
}) => {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-medium text-foreground mb-1"
      >
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          className={`w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg border ${
            error ? "border-red-500" : "border-foreground/20"
          } focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm sm:text-base bg-background text-foreground ${
            className || ""
          }`}
          {...props}
        />

        {showTogglePassword && onTogglePassword && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/60"
          >
            {showPassword ? (
              <EyeOffIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            ) : (
              <EyeIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            )}
          </button>
        )}

        {/* Custom right element if provided */}
        {!showTogglePassword && showRightElement && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {showRightElement}
          </div>
        )}
      </div>

      {/* Bottom element (like forgot password link) */}
      {showBottomElement && (
        <div className="w-full flex justify-end mt-2 sm:mt-4">
          {showBottomElement}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1 text-xs sm:text-sm text-red-600">{error.message}</p>
      )}
    </div>
  );
};

export default FormInput;
