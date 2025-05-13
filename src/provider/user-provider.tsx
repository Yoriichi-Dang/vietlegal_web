// contexts/UserContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { DefaultSession } from "next-auth";
import { profileApiUrl } from "@/utils/config";
type User = DefaultSession["user"];

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  updateUserProfile: (data: {
    name: string;
    avatarUrl: string;
  }) => Promise<boolean>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      setIsLoading(true);
    } else {
      setUser(session?.user || null);
      setIsLoading(false);
    }
  }, [session, status]);

  const updateUserProfile = async (data: {
    name: string;
    avatarUrl: string;
  }) => {
    try {
      setIsLoading(true);

      // API call để cập nhật profile
      const response = await fetch(profileApiUrl.updateProfile, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Có lỗi xảy ra khi cập nhật thông tin");
      }

      // Cập nhật session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          image: data.avatarUrl,
        },
      });
      // Cập nhật local state
      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: data.name,
              image: data.avatarUrl,
            }
          : null
      );
      console.log("Session", session);
      console.log("User", user);

      toast.success("Cập nhật thông tin thành công!");
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi cập nhật thông tin"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, updateUserProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
