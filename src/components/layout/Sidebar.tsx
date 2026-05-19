"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Building2,
  ListChecks,
  Compass,
  Folder,
  KeyRound,
  Users,
  Megaphone,
  Zap,
  User,
  Settings as SettingsIcon,
  ShieldCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: LucideIcon };
type NavGroup = { label?: string; items: NavItem[] };

const NAV: NavGroup[] = [
  {
    label: "Main",
    items: [
      { href: "/", label: "Dashboard", icon: Home },
      { href: "/departments", label: "Departments", icon: Building2 },
    ],
  },
  {
    label: "Resources",
    items: [
      { href: "/sops", label: "SOPs", icon: ListChecks },
      { href: "/onboarding", label: "Onboarding", icon: Compass },
      { href: "/documents", label: "Documents", icon: Folder },
      { href: "/platform-logins", label: "Platform Logins", icon: KeyRound },
    ],
  },
  {
    label: "People & Comms",
    items: [
      { href: "/team", label: "Team Directory", icon: Users },
      { href: "/internal-comms", label: "Internal Comms", icon: Megaphone },
    ],
  },
  {
    label: "Tools",
    items: [{ href: "/nexa-tools", label: "NEXA Tools", icon: Zap }],
  },
  {
    label: "Account",
    items: [
      { href: "/profile", label: "My Profile", icon: User },
      { href: "/settings", label: "Settings", icon: SettingsIcon },
    ],
  },
];

function initialsFrom(name: string, fallback = "?") {
  if (!name.trim()) return fallback;
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function Sidebar({
  isAdmin = false,
  userName = "",
  userRole = "Member",
  userEmail = "",
}: {
  isAdmin?: boolean;
  userName?: string;
  userRole?: string;
  userEmail?: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("sidebar:open", onOpen);
    return () => window.removeEventListener("sidebar:open", onOpen);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const displayName = userName.trim() || userEmail.split("@")[0] || "Member";
  const initials = initialsFrom(displayName);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/40 backdrop-blur-sm transition-opacity md:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setOpen(false)}
        aria-hidden
      />

      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 flex flex-col bg-side-bg text-side-text transition-transform md:translate-x-0",
          open ? "translate-x-0 shadow-2xl" : "-translate-x-full md:shadow-none",
        )}
        style={{ width: "var(--spacing-sidebar)" }}
        aria-label="Primary navigation"
      >
        {/* Brand header */}
        <div className="px-5 pt-6 pb-5 flex items-start justify-between">
          <Link href="/" className="block" aria-label="NEXA — Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/brand/nexa-logo-white.png"
              alt="NEXA"
              className="block h-6 w-auto"
            />
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="md:hidden h-8 w-8 inline-flex items-center justify-center rounded text-side-text hover:text-white hover:bg-white/5 transition"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-4">
          {NAV.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <div className="px-3 pt-4 pb-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-white/35">
                  {group.label}
                </div>
              )}
              {group.items.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors",
                      active
                        ? "bg-side-active-bg text-white"
                        : "text-side-text hover:text-side-text-hover hover:bg-white/5",
                    )}
                  >
                    {active && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r bg-nexa-purple" />
                    )}
                    <Icon className="h-4 w-4 stroke-[1.75]" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          {isAdmin && (
            <div>
              <div className="px-3 pt-4 pb-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-white/35">
                Admin
              </div>
              <Link
                href="/admin"
                className={cn(
                  "relative flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors",
                  pathname.startsWith("/admin")
                    ? "bg-side-active-bg text-white"
                    : "text-side-text hover:text-side-text-hover hover:bg-white/5",
                )}
              >
                {pathname.startsWith("/admin") && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r bg-nexa-purple" />
                )}
                <ShieldCheck className="h-4 w-4 stroke-[1.75]" />
                <span>Admin</span>
              </Link>
            </div>
          )}
        </nav>

        {/* User card */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 px-3 py-3 mx-2 mb-3 mt-1 rounded-md hover:bg-white/5 transition"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-nexa-purple text-white text-[11px] font-semibold shrink-0">
            {initials}
          </span>
          <div className="min-w-0">
            <div className="text-[12.5px] text-white font-medium truncate">
              {displayName}
            </div>
            <div className="text-[10.5px] text-white/45 truncate">
              {userRole}
            </div>
          </div>
        </Link>
      </aside>
    </>
  );
}
