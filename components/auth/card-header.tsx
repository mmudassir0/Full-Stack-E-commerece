import React from "react";
import { motion } from "framer-motion";
import { CardDescription, CardTitle } from "../ui/card";

interface CardHeaderProps {
  label: string;
  Icon: React.ReactNode;
  headerDescription?: string;
}
const Header = ({ label, Icon, headerDescription }: CardHeaderProps) => {
  return (
    <div className="space-y-8 relative pb-0">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto bg-gradient-to-br from-purple-400 to-blue-500 w-20 h-20 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/20"
      >
        {Icon}
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <CardTitle className="text-4xl font-bold text-center text-white mb-2">
          {label}
        </CardTitle>
        <CardDescription className="text-center text-blue-200 text-lg">
          {headerDescription}
        </CardDescription>
      </motion.div>
    </div>
  );
};

export default Header;
