import React from "react";

const Divider = () => {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-xs sm:text-sm">
        <span className="px-2 sm:px-4 bg-white dark:bg-black text-gray-500">
          Or continue with
        </span>
      </div>
    </div>
  );
};

export default Divider;
