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

const HeaderAvatar = () => {
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
      onClick: () => console.log("Settings clicked"),
      hasDivider: true,
    },
    {
      icon: <LogOut size={18} />,
      label: "Log out",
      onClick: () => console.log("Log out clicked"),
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
      <Dropdown items={profileDropdownItems} width="w-40" align="right">
        <Image
          className="rounded-full"
          src="https://scontent.fdad1-3.fna.fbcdn.net/v/t39.30808-6/321458393_689078906262854_8283041181478027070_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeH4XpGlr5asUaBieRnWiOH4rYuxCQAUBJOti7EJABQEkxqsH7ignctBNlMoTdAc6KBBdhQHfEdDxIN1dMkxHI3t&_nc_ohc=6xJ9gg97UnIQ7kNvwHFFBRs&_nc_oc=AdlSE2BxZikb5zOjlWht5BeIGqfJk559jjNB-vSt060t00iURZJhX2g6yDjnrbKHtE8&_nc_zt=23&_nc_ht=scontent.fdad1-3.fna&_nc_gid=4adN1XIznM_Yw6mp7NkcUA&oh=00_AfGeWw3nOcPhmNTO5TLSrmr9R3Ht4zwK5v1Zi8goB5GtZA&oe=680EC081"
          alt="avatar"
          width={40}
          height={40}
        />
      </Dropdown>
    </div>
  );
};

export default HeaderAvatar;
