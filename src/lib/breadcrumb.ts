// Map first path segment to a human label for breadcrumbs.
const SECTION_LABELS: Record<string, string> = {
  "": "Dashboard",
  team: "Team Directory",
  departments: "Departments",
  sops: "SOPs",
  onboarding: "Onboarding",
  documents: "Documents",
  "platform-logins": "Platform Logins",
  "internal-comms": "Internal Comms",
  "nexa-tools": "NEXA Tools",
  profile: "My Profile",
  admin: "Admin",
};

export function breadcrumbFor(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return { section: "Dashboard", parent: "Home", isHome: true };
  }
  const first = segments[0];
  const label = SECTION_LABELS[first] ?? first;
  return { section: label, parent: "Home", isHome: false };
}
