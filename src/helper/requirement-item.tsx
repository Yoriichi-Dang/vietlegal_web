import { CheckCircle } from "lucide-react";

interface RequirementItemProps {
  isValid: boolean;
  text: string;
}

const RequirementItem: React.FC<RequirementItemProps> = ({ isValid, text }) => {
  return (
    <div className="flex items-center">
      <div
        className={`w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 ${
          isValid ? "text-green-500" : "text-foreground/40"
        }`}
      >
        {isValid ? (
          <CheckCircle className="h-full w-full" />
        ) : (
          <div className="w-full h-full border border-current rounded-full" />
        )}
      </div>
      <p
        className={`text-xs sm:text-sm ${
          isValid ? "text-green-600" : "text-foreground/60"
        }`}
      >
        {text}
      </p>
    </div>
  );
};

export default RequirementItem;
