"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Cog,
  User,
  Speech,
  Database,
  Building2,
  AppWindow,
  Shield,
} from "lucide-react";

// Định nghĩa các mục menu trong sidebar
const MENU_ITEMS = [
  { icon: <Cog className="w-5 h-5" />, label: "General", id: "general" },
  {
    icon: <User className="w-5 h-5" />,
    label: "Personalization",
    id: "personalization",
  },
  { icon: <Speech className="w-5 h-5" />, label: "Speech", id: "speech" },
  {
    icon: <Database className="w-5 h-5" />,
    label: "Data controls",
    id: "data-controls",
  },
  {
    icon: <Building2 className="w-5 h-5" />,
    label: "Builder profile",
    id: "builder-profile",
  },
  {
    icon: <AppWindow className="w-5 h-5" />,
    label: "Connected apps",
    id: "connected-apps",
  },
  { icon: <Shield className="w-5 h-5" />, label: "Security", id: "security" },
];

// Định nghĩa interface cho settings
interface SettingsState {
  theme: string;
  showCode: boolean;
  showSuggestions: boolean;
  language: string;
}

const SettingDialog = ({
  isDialogOpen,
  setIsDialogOpen,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (isOpen: boolean) => void;
}) => {
  // State cho menu và settings
  const [activeMenuItem, setActiveMenuItem] = useState("general");
  const [settings, setSettings] = useState<SettingsState>({
    theme: "dark",
    showCode: false,
    showSuggestions: true,
    language: "auto",
  });

  // Chỉ giữ handleSelectChange vì handleToggleChange không được sử dụng
  const handleSelectChange = (setting: keyof SettingsState, value: string) => {
    setSettings({
      ...settings,
      [setting]: value,
    });
  };

  // Ứng dụng theme khi thay đổi
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;

      if (settings.theme === "dark") {
        root.classList.add("dark");
      } else if (settings.theme === "light") {
        root.classList.remove("dark");
      } else if (settings.theme === "auto") {
        const isDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        if (isDark) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    }
  }, [settings.theme]);

  // Animations
  const menuItemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
        ease: "easeOut",
      },
    }),
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1,
      },
    },
    exit: { opacity: 0 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
    exit: { opacity: 0, y: 10 },
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[425px] lg:max-w-[800px] bg-white text-black dark:bg-zinc-900 dark:text-white border-none p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-zinc-200 dark:border-zinc-800">
          <DialogTitle className="text-xl font-semibold">Settings</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-4 h-[calc(100%-56px)]">
          {/* Sidebar Menu */}
          <div className="col-span-1 border-r border-zinc-200 dark:border-zinc-800 py-2">
            {MENU_ITEMS.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={menuItemVariants}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200",
                  activeMenuItem === item.id
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                )}
                onClick={() => setActiveMenuItem(item.id)}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <div className="col-span-3 overflow-y-auto p-6">
              {activeMenuItem === "general" && (
                <motion.div
                  key="general"
                  className="space-y-8"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={contentVariants}
                >
                  {/* Theme */}
                  <motion.div
                    className="flex justify-between items-center"
                    variants={itemVariants}
                  >
                    <span>Theme</span>
                    <Select
                      value={settings.theme}
                      onValueChange={(value) =>
                        handleSelectChange("theme", value)
                      }
                    >
                      <SelectTrigger className="w-32 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-black dark:text-white">
                        <SelectValue placeholder="Theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-black dark:text-white">
                        <SelectGroup>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="auto">System</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  <motion.div
                    className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-8"
                    variants={itemVariants}
                  >
                    <span>Language</span>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        handleSelectChange("language", value)
                      }
                    >
                      <SelectTrigger className="w-32 bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-black dark:text-white">
                        <SelectValue placeholder="Language" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 text-black dark:text-white">
                        <SelectGroup>
                          <SelectItem value="english">English</SelectItem>
                          <SelectItem value="vietnamese">Vietnamese</SelectItem>
                          <SelectItem value="auto">Auto-detect</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </motion.div>

                  {/* Archived chats */}
                  <motion.div
                    className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-8"
                    variants={itemVariants}
                  >
                    <span>Archived chats</span>
                    <Button
                      variant="outline"
                      className="bg-white hover:bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white border-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
                    >
                      Manage
                    </Button>
                  </motion.div>

                  {/* Archive all chats */}
                  <motion.div
                    className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-8"
                    variants={itemVariants}
                  >
                    <span>Archive all chats</span>
                    <Button
                      variant="outline"
                      className="bg-white hover:bg-zinc-50 dark:bg-zinc-800 text-black dark:text-white border-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700"
                    >
                      Archive all
                    </Button>
                  </motion.div>

                  {/* Delete all chats */}
                  <motion.div
                    className="flex justify-between items-center border-t border-zinc-200 dark:border-zinc-800 pt-8"
                    variants={itemVariants}
                  >
                    <span>Delete all chats</span>
                    <Button variant="destructive">Delete all</Button>
                  </motion.div>
                </motion.div>
              )}

              {activeMenuItem !== "general" && (
                <motion.div
                  key={activeMenuItem}
                  className="h-full flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-500 dark:text-gray-400">
                    {
                      MENU_ITEMS.find((item) => item.id === activeMenuItem)
                        ?.label
                    }{" "}
                    settings coming soon
                  </p>
                </motion.div>
              )}
            </div>
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingDialog;
