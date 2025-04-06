import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import RequirementItem from "@/helper/requirement-item";

interface PasswordRequirementsProps {
  password: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({
  password,
}) => {
  const [showRequirements, setShowRequirements] = useState(true);

  // Password validation checks
  const hasMinLength = password?.length >= 8;
  const hasNumber = /\d/.test(password || "");
  const hasUppercase = /[A-Z]/.test(password || "");
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password || "");

  // Toggle requirements display on mobile
  const toggleRequirements = () => {
    setShowRequirements(!showRequirements);
  };

  return (
    <div className="mt-2">
      <div
        className="flex items-center justify-between cursor-pointer md:cursor-default"
        onClick={toggleRequirements}
      >
        <p className="text-xs sm:text-sm text-foreground/60">
          Your password need to include:
        </p>
        <button
          type="button"
          className="md:hidden text-foreground/60"
          aria-label={
            showRequirements
              ? "Hide password requirements"
              : "Show password requirements"
          }
        >
          {showRequirements ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      <div
        className={`mt-1 space-y-1 ${
          showRequirements ? "block" : "hidden md:block"
        }`}
      >
        {/* Password requirement indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-2">
          <RequirementItem isValid={hasMinLength} text="Min 8 characters" />
          <RequirementItem isValid={hasNumber} text="One number" />
          <RequirementItem isValid={hasUppercase} text="One uppercase letter" />
          <RequirementItem
            isValid={hasSpecialChar}
            text="One special character"
          />
        </div>
      </div>
    </div>
  );
};

export default PasswordRequirements;
