import {
  Palette,
  Video,
  Globe,
  Briefcase,
  TrendingUp,
  FileText,
  BarChart3,
  MessageSquare,
  Users,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

// Map a platform category to its visual icon. Mirrors the wireframe's
// small purple-tinted icon-box on each tool card.
const ICONS: Record<string, LucideIcon> = {
  design: Palette,
  production: Video,
  web: Globe,
  sales_am: Briefcase,
  seo: TrendingUp,
  content: FileText,
  performance: BarChart3,
  social: MessageSquare,
  everyone: Users,
  ai_labs: Sparkles,
};

export function platformIcon(category: string): LucideIcon {
  return ICONS[category] ?? Palette;
}
