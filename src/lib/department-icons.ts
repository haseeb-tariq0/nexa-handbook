import {
  Palette,
  Handshake,
  Globe,
  Megaphone,
  Settings,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

// Map department slug → Lucide icon. Falls back to Briefcase.
// Add a slug here when new departments are seeded.
const ICONS: Record<string, LucideIcon> = {
  creative: Palette,
  "account-mgmt": Handshake,
  web: Globe,
  "social-content": Megaphone,
  operations: Settings,
};

export function departmentIcon(slug: string): LucideIcon {
  return ICONS[slug] ?? Briefcase;
}
