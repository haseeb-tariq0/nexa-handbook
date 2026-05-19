// Convert a video URL (YouTube / Vimeo / Loom) into an iframe-embeddable URL.
// Returns embedUrl: null when the host can't be embedded — caller should fall
// back to an "Open in new tab" link.

export type VideoProvider = "youtube" | "vimeo" | "loom" | "other";

export type EmbedInfo = {
  embedUrl: string | null;
  provider: VideoProvider;
};

export function toEmbedUrl(rawUrl: string): EmbedInfo {
  let u: URL;
  try {
    u = new URL(rawUrl);
  } catch {
    return { embedUrl: null, provider: "other" };
  }
  const host = u.hostname.replace(/^www\./, "");

  // YouTube — watch URL with ?v= or short youtu.be/ID
  if (host === "youtube.com" || host === "m.youtube.com") {
    if (u.pathname.startsWith("/embed/")) {
      return { embedUrl: rawUrl, provider: "youtube" };
    }
    const id = u.searchParams.get("v");
    if (id) {
      const params = new URLSearchParams();
      const start = u.searchParams.get("t") ?? u.searchParams.get("start");
      if (start) params.set("start", start.replace(/[^0-9]/g, "") || "0");
      const qs = params.toString();
      return {
        embedUrl: `https://www.youtube.com/embed/${id}${qs ? `?${qs}` : ""}`,
        provider: "youtube",
      };
    }
  }
  if (host === "youtu.be") {
    const id = u.pathname.replace(/^\//, "").split("/")[0];
    if (id) {
      return {
        embedUrl: `https://www.youtube.com/embed/${id}`,
        provider: "youtube",
      };
    }
  }

  // Vimeo — vimeo.com/ID (numeric)
  if (host === "vimeo.com" || host === "player.vimeo.com") {
    if (u.pathname.startsWith("/video/")) {
      return { embedUrl: rawUrl, provider: "vimeo" };
    }
    const id = u.pathname.replace(/^\//, "").split("/")[0];
    if (id && /^\d+$/.test(id)) {
      return {
        embedUrl: `https://player.vimeo.com/video/${id}`,
        provider: "vimeo",
      };
    }
  }

  // Loom — loom.com/share/ID or loom.com/embed/ID
  if (host === "loom.com") {
    const m = u.pathname.match(/\/(share|embed)\/([A-Za-z0-9-]+)/);
    if (m) {
      return {
        embedUrl: `https://www.loom.com/embed/${m[2]}`,
        provider: "loom",
      };
    }
  }

  return { embedUrl: null, provider: "other" };
}

// Best-effort thumbnail URL when none is stored. Currently only YouTube
// (uses i.ytimg.com which is publicly accessible).
export function defaultThumbnail(rawUrl: string): string | null {
  const { provider } = toEmbedUrl(rawUrl);
  if (provider !== "youtube") return null;
  try {
    const u = new URL(rawUrl);
    const host = u.hostname.replace(/^www\./, "");
    let id: string | null = null;
    if (host === "youtu.be") {
      id = u.pathname.replace(/^\//, "").split("/")[0] || null;
    } else if (u.pathname.startsWith("/embed/")) {
      id = u.pathname.replace("/embed/", "").split("/")[0] || null;
    } else {
      id = u.searchParams.get("v");
    }
    return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : null;
  } catch {
    return null;
  }
}
