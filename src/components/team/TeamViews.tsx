"use client";

import { useState, useMemo } from "react";
import { Tabs } from "@/components/ui/Tabs";
import { TeamCard } from "@/components/team/TeamCard";
import type { TeamMemberListItem } from "@/lib/queries/team";

type View = "card" | "department" | "org";

export function TeamViews({
  team,
  isAdmin = false,
}: {
  team: TeamMemberListItem[];
  isAdmin?: boolean;
}) {
  const [view, setView] = useState<View>("card");

  const byDept = useMemo(() => {
    const map = new Map<
      string,
      { name: string; members: TeamMemberListItem[] }
    >();
    for (const m of team) {
      const key = m.departments?.name ?? "Unassigned";
      if (!map.has(key)) map.set(key, { name: key, members: [] });
      map.get(key)!.members.push(m);
    }
    return Array.from(map.values());
  }, [team]);

  return (
    <>
      <div className="mb-5 flex items-center justify-between gap-3">
        <Tabs
          value={view}
          onChange={(v) => setView(v as View)}
          items={[
            { value: "card", label: "Card view" },
            {
              value: "org",
              label: "Org chart",
              disabled: true,
              hint: "Coming soon",
            },
            { value: "department", label: "By department" },
          ]}
        />
        <div className="text-[11.5px] text-text-3">
          {team.length} active {team.length === 1 ? "person" : "people"}
        </div>
      </div>

      {view === "card" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {team.map((m) => (
            <TeamCard key={m.id} member={m} isAdmin={isAdmin} />
          ))}
        </div>
      )}

      {view === "department" && (
        <div className="space-y-8">
          {byDept.map((g) => (
            <section key={g.name}>
              <div className="flex items-baseline justify-between mb-3">
                <h2 className="text-[13px] font-semibold text-text-1 uppercase tracking-wider">
                  {g.name}
                </h2>
                <span className="text-[11px] text-text-4">
                  {g.members.length}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {g.members.map((m) => (
                  <TeamCard key={m.id} member={m} isAdmin={isAdmin} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}
