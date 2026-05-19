"use client";

import { useEffect, useRef, useState } from "react";
import { Play, X, Maximize2, ExternalLink } from "lucide-react";
import type { OnboardingVideo } from "@/lib/queries/onboarding";
import { toEmbedUrl, defaultThumbnail } from "@/lib/video-embed";

export function VideoStrip({ videos }: { videos: OnboardingVideo[] }) {
  const [active, setActive] = useState<OnboardingVideo | null>(null);

  if (videos.length === 0) return null;

  return (
    <>
      <section className="mt-8">
        <div className="text-[10.5px] uppercase tracking-[0.14em] text-text-4 font-semibold mb-3">
          Onboarding &amp; Training Videos
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((v) => (
            <VideoCard
              key={v.id}
              video={v}
              onPlay={() => setActive(v)}
            />
          ))}
        </div>
      </section>

      {active && (
        <VideoModal video={active} onClose={() => setActive(null)} />
      )}
    </>
  );
}

function VideoCard({
  video,
  onPlay,
}: {
  video: OnboardingVideo;
  onPlay: () => void;
}) {
  const thumb = video.thumbnail_url ?? defaultThumbnail(video.video_url);

  return (
    <button
      type="button"
      onClick={onPlay}
      className="group block text-left w-full bg-panel border border-border rounded-md overflow-hidden hover:border-nexa-purple hover:shadow-sm transition cursor-pointer"
    >
      <div className="relative aspect-video bg-nexa-dark-purple overflow-hidden">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=""
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-[1.03] transition-transform"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-nexa-night-purple via-nexa-dark-purple to-nexa-night-purple" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm group-hover:bg-nexa-purple group-hover:scale-110 transition">
            <Play className="h-5 w-5 ml-0.5 fill-current" />
          </span>
        </div>
        {video.duration_label && (
          <span className="absolute bottom-2 right-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-black/70 text-white tabular-nums">
            {video.duration_label}
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-[13px] font-semibold text-text-1 leading-tight group-hover:text-nexa-purple transition line-clamp-2">
          {video.title}
        </div>
        {video.description && (
          <div className="mt-1 text-[11.5px] text-text-3 line-clamp-2">
            {video.description}
          </div>
        )}
      </div>
    </button>
  );
}

function VideoModal({
  video,
  onClose,
}: {
  video: OnboardingVideo;
  onClose: () => void;
}) {
  const playerRef = useRef<HTMLDivElement>(null);
  const { embedUrl, provider } = toEmbedUrl(video.video_url);

  // Lock body scroll while the modal is open + close on Esc
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  function enterFullscreen() {
    const el = playerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else {
      el.requestFullscreen?.();
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-3 px-1">
          <div className="min-w-0">
            <h2 className="text-[15px] font-semibold text-white leading-tight truncate">
              {video.title}
            </h2>
            {video.description && (
              <p className="text-[12px] text-white/65 mt-0.5 line-clamp-1">
                {video.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={enterFullscreen}
              title="Toggle full screen"
              aria-label="Toggle full screen"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <a
              href={video.video_url}
              target="_blank"
              rel="noopener noreferrer"
              title="Open original"
              aria-label="Open original in new tab"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
            <button
              type="button"
              onClick={onClose}
              title="Close"
              aria-label="Close video"
              className="inline-flex items-center justify-center h-9 w-9 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Player */}
        <div
          ref={playerRef}
          className="relative aspect-video w-full bg-black rounded-lg overflow-hidden shadow-2xl ring-1 ring-white/10"
        >
          {embedUrl ? (
            <iframe
              src={`${embedUrl}${embedUrl.includes("?") ? "&" : "?"}autoplay=1`}
              title={video.title}
              className="absolute inset-0 h-full w-full"
              frameBorder={0}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center p-8 text-white/85">
              <ExternalLink className="h-8 w-8 text-white/60" />
              <div>
                <div className="text-[14px] font-semibold">
                  This video can&rsquo;t be embedded
                </div>
                <div className="text-[12px] text-white/65 mt-1">
                  Open it in a new tab to watch.
                </div>
              </div>
              <a
                href={video.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-white text-nexa-dark-purple text-[12.5px] font-semibold hover:bg-white/90 transition"
              >
                <ExternalLink className="h-3 w-3" />
                Open video
              </a>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="mt-3 text-[10.5px] text-white/55 text-center font-mono uppercase tracking-[0.16em]">
          {provider === "youtube" && "YouTube · "}
          {provider === "vimeo" && "Vimeo · "}
          {provider === "loom" && "Loom · "}
          Press Esc to close
        </div>
      </div>
    </div>
  );
}
