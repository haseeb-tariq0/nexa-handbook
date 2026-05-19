// Server-free label maps and small constants. Both server components AND
// client components can import from here without dragging next/headers into
// the client bundle. See PR comment for the diagnosis.

export const PLATFORM_CATEGORY_LABELS: Record<string, string> = {
  design: "Design",
  production: "Production",
  web: "Web",
  sales_am: "Sales & AM",
  seo: "SEO",
  content: "Content",
  performance: "Performance",
  social: "Social Media",
  everyone: "Everyone",
  ai_labs: "AI Labs",
};

export const DOC_CATEGORY_LABELS: Record<string, string> = {
  brand: "Brand",
  templates: "Templates",
  policies: "Policies",
  onboarding: "Onboarding",
  hr: "HR",
  finance: "Finance",
  operations: "Operations",
  creative: "Creative",
  ai_tech: "AI & Tech",
};

export const FILE_TYPE_LABELS: Record<string, string> = {
  pdf: "PDF",
  docx: "Word",
  pptx: "Slides",
  gdoc: "Google Doc",
  gsheet: "Google Sheet",
  link: "Link",
  video: "Video",
};

export const TEMPLATE_CATEGORY_LABELS: Record<string, string> = {
  client_facing: "Client-facing",
  internal: "Internal",
  announcement: "Announcement",
  hr: "HR",
  meeting: "Meeting",
  escalation: "Escalation",
};

export const ANNOUNCEMENT_CATEGORY_LABELS: Record<string, string> = {
  new: "New",
  reminder: "Reminder",
  access: "Access",
  ops: "Ops",
  tools: "Tools",
  team: "Team",
};
