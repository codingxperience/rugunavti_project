"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Loader2, LogOut } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PortalSignOutButtonProps = {
  compact?: boolean;
  className?: string;
  children?: ReactNode;
};

export function PortalSignOutButton({
  compact = false,
  className,
  children,
}: PortalSignOutButtonProps) {
  const [busy, setBusy] = useState(false);

  return (
    <SignOutButton redirectUrl="/api/elearning/logout">
      <Button
        type="button"
        variant="secondary"
        onClick={() => setBusy(true)}
        className={cn(
          compact
            ? "h-10 w-10 rounded-2xl border-white/12 bg-white/8 p-0 text-white hover:bg-white/12 hover:text-white"
            : "border-white/12 bg-white/8 text-white hover:bg-white/12 hover:text-white",
          className
        )}
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
        {compact ? <span className="sr-only">Sign out</span> : children ?? "Sign out"}
      </Button>
    </SignOutButton>
  );
}
