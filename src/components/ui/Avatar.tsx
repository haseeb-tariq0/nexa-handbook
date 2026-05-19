"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

function initialsFrom(name: string | null | undefined, fallback = "?") {
  if (!name?.trim()) return fallback;
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

type AvatarProps = {
  name?: string | null;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-8 w-8 text-[11px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-16 w-16 text-[20px]",
};

export function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const [broken, setBroken] = useState(false);
  const showImage = Boolean(src) && !broken;

  return (
    <div
      className={cn(
        "relative rounded-full bg-nexa-purple text-white font-semibold inline-flex items-center justify-center select-none overflow-hidden shrink-0",
        sizes[size],
        className,
      )}
    >
      <span aria-hidden={showImage}>{initialsFrom(name)}</span>
      {showImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}
