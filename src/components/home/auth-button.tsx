import { useSession } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Bot } from "lucide-react";
import { useRouter } from "next/navigation";

const AuthButton = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") return null;

  if (!session) {
    return (
      <Button
        className="cursor-pointer rounded-full px-4 md:px-8 py-2 bg-foreground text-background font-semibold hover:opacity-90 transition-colors"
        variant="outline"
      >
        <Link href="/login">Đăng nhập</Link>
      </Button>
    );
  }
  return (
    <Button
      className="rounded-full cursor-pointer px-4 md:px-8 py-2 bg-foreground text-background font-semibold hover:opacity-90 transition-colors"
      variant="outline"
      onClick={() => router.push("/new")}
    >
      <Bot />
    </Button>
  );
};

export default AuthButton;
