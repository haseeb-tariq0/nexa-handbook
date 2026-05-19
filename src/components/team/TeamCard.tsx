import Link from "next/link";
import { Mail, MessageSquare, Phone, Pencil } from "lucide-react";
import type { TeamMemberListItem } from "@/lib/queries/team";

// Stable colour per member (used as avatar background). Hash from id so it
// stays the same across renders. Palette taken from the wireframe.
const PALETTE = [
  "#6B1FCC", // nexa purple
  "#1565C0", // blue
  "#2E7D32", // green
  "#E65100", // orange
  "#00838F", // teal
  "#F57F17", // amber
  "#C2185B", // pink
  "#5066D0", // indigo
];

function colorFor(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function TeamCard({
  member,
  isAdmin = false,
}: {
  member: TeamMemberListItem;
  isAdmin?: boolean;
}) {
  const dept = member.departments?.name;
  const color = colorFor(member.id);

  return (
    <div className="group relative bg-panel border border-border rounded-md p-5 text-center transition hover:border-border-3 hover:-translate-y-0.5 hover:shadow-sm">
      {isAdmin && (
        <Link
          href={`/admin/team/${member.id}`}
          className="absolute top-2.5 right-2.5 z-10 inline-flex items-center justify-center h-6 w-6 rounded text-text-4 hover:text-nexa-purple hover:bg-nexa-purple-tint transition opacity-0 group-hover:opacity-100"
          aria-label="Edit"
          title="Edit"
        >
          <Pencil className="h-3 w-3" />
        </Link>
      )}
      <Link href={`/team/${member.id}`} className="block">
        {member.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={member.avatar_url}
            alt={member.full_name}
            className="mx-auto mb-2.5 h-[52px] w-[52px] rounded-full object-cover"
          />
        ) : (
          <div
            className="mx-auto mb-2.5 h-[52px] w-[52px] rounded-full inline-flex items-center justify-center text-white text-[16px] font-bold tracking-tight"
            style={{ background: color }}
          >
            {initials(member.full_name)}
          </div>
        )}
        <div className="text-[13.5px] font-semibold text-text-1 truncate">
          {member.full_name}
        </div>
        <div className="text-[11px] text-text-3 mt-0.5 truncate">
          {member.role_title}
        </div>
        {dept && (
          <div className="text-[10px] text-text-4 mt-1 uppercase tracking-wider">
            {dept}
          </div>
        )}
      </Link>

      <div className="flex items-center justify-center gap-1.5 mt-3">
        <ContactChip
          href={`mailto:${member.email}`}
          icon={<Mail className="h-2.5 w-2.5" />}
          label="Email"
          variant="purple"
        />
        {member.slack_handle && (
          <ContactChip
            href={`slack://user?team=&id=${member.slack_handle}`}
            icon={<MessageSquare className="h-2.5 w-2.5" />}
            label="Slack"
            variant="neutral"
          />
        )}
        {member.whatsapp && (
          <ContactChip
            href={`https://wa.me/${member.whatsapp.replace(/\D/g, "")}`}
            icon={<Phone className="h-2.5 w-2.5" />}
            label="WhatsApp"
            variant="neutral"
          />
        )}
      </div>
    </div>
  );
}

function ContactChip({
  href,
  icon,
  label,
  variant,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  variant: "purple" | "neutral";
}) {
  const styles =
    variant === "purple"
      ? "bg-nexa-purple-tint text-nexa-purple hover:bg-nexa-purple hover:text-white"
      : "bg-panel-2 text-text-3 border border-border hover:text-text-1 hover:border-border-3";
  return (
    <a
      href={href}
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition ${styles}`}
    >
      {icon}
      {label}
    </a>
  );
}
