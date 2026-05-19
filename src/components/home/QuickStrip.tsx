import Link from "next/link";
import {
  ListChecks,
  KeyRound,
  Folder,
  Users,
  Megaphone,
  Compass,
  Zap,
  Building2,
  type LucideIcon,
} from "lucide-react";

type Tile = {
  href: string;
  label: string;
  icon: LucideIcon;
};

const TILES: Tile[] = [
  { href: "/sops", label: "SoPs", icon: ListChecks },
  { href: "/platform-logins", label: "Logins", icon: KeyRound },
  { href: "/documents", label: "Documents", icon: Folder },
  { href: "/team", label: "Team", icon: Users },
  { href: "/internal-comms", label: "Comms", icon: Megaphone },
  { href: "/onboarding", label: "Onboarding", icon: Compass },
  { href: "/nexa-tools", label: "Tools", icon: Zap },
  { href: "/departments", label: "Depts", icon: Building2 },
];

export function QuickStrip() {
  return (
    <section>
      <div className="mb-3">
        <div className="text-[14px] font-semibold text-text-1">
          Quick access
        </div>
        <div className="text-[11.5px] text-text-3 mt-0.5">
          One-click jump to any section
        </div>
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {TILES.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className="group flex flex-col items-center justify-center gap-3 bg-panel-2 hover:bg-panel border border-transparent hover:border-border rounded-md py-7 transition"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-panel group-hover:bg-nexa-purple-tint text-text-2 group-hover:text-nexa-purple transition shadow-[0_1px_0_rgba(0,0,0,0.03)]">
                <Icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="text-[13px] font-medium text-text-1">
                {tile.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
