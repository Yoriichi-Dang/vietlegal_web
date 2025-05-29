"use client";
import {
  EllipsisVertical,
  LogOut,
  Settings,
  Trash2,
  Upload,
} from "lucide-react";
import React, { useState, useRef } from "react";
import Image from "next/image";
import useOutsideClick from "@/hooks/useOutsideClick"; // Using your existing hook
import Dropdown from "./dropdown-header";
import { signOut, useSession } from "next-auth/react";
import SettingDialog from "../settings/setting-dialog";
const HeaderAvatar = () => {
  const { data: session } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Use your existing useOutsideClick hook
  useOutsideClick(
    dropdownRef,
    () => {
      if (isDropdownOpen) setIsDropdownOpen(false);
    },
    isDropdownOpen
  );
  const profileDropdownItems = [
    {
      icon: <Upload size={18} />,
      label: "Share",
      onClick: () => console.log("Share clicked"),
      hasDivider: true,
    },
    {
      icon: <Settings size={18} />,
      label: "Settings",
      onClick: () => setIsDialogOpen(true),
      hasDivider: true,
    },
    {
      icon: <LogOut size={18} />,
      label: "Log out",
      onClick: () => signOut({ callbackUrl: "/" }),
    },
  ];
  const settingDropdownItems = [
    {
      icon: <Trash2 size={18} />,
      label: "Delete ",
      onClick: () => console.log("Delete  clicked"),
    },
  ];
  return (
    <div className="absolute top-1 right-6 flex items-center gap-2">
      <Dropdown
        items={settingDropdownItems}
        className="cursor-pointer  "
        triggerClassName="text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 p-2 rounded-md"
        width="w-32"
        align="right"
      >
        <EllipsisVertical />
      </Dropdown>
      <SettingDialog
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      <Dropdown
        triggerClassName="text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700/50 p-2 rounded-md"
        items={profileDropdownItems}
        width="w-40"
        align="right"
      >
        <Image
          className="rounded-full"
          src={session?.user?.image || "/avatar.jpg"}
          alt="avatar"
          width={40}
          height={40}
        />
      </Dropdown>
    </div>
  );
};

export default HeaderAvatar;
