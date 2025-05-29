import { motion } from "motion/react";

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex items-center space-x-3"
    >
      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-white font-bold text-xs">LW</span>
      </div>
      <span className="font-bold text-lg text-white">LegalWise</span>
    </motion.div>
  );
};

const LogoIcon = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"
    >
      <span className="text-white font-bold text-xs">LW</span>
    </motion.div>
  );
};
export { Logo, LogoIcon };
