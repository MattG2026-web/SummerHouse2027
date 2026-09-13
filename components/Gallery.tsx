"use client";

import { useEffect, useState } from "react";

export type GalleryPhoto = {
  id: string;
  url: string;
};

const PREVIEW_COUNT = 4;

export default function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % photos.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + photos.length) % photos.length);
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, photos.length]);

  if (photos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center text-stone-500">
        Photos are on their way — check back soon.
      </div>
    );
  }

  const preview = photos.slice(0, PREVIEW_COUNT);
  const remaining = photos.length - preview.length;

  function openAt(i: number) {
    setIndex(i);
    setOpen(true);
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {preview.map((p, i) => {
          const isLastTile = i === preview.length - 1 && remaining > 0;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => openAt(i)}
              className="relative block group text-left"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.url}
                alt="The Summer House"
                loading={i < 2 ? "eager" : "lazy"}
                className="w-full h-32 sm:h-40 object-cover rounded-lg group-hover:opacity-90 transition"
              />
              {isLastTile && (
                <span className="absolute inset-0 rounded-lg bg-deep/60 flex items-center justify-center text-white text-sm font-medium">
                  +{remaining} more
                </span>
              )}
            </button>
          );
        })}
      </div>

      {photos.length > PREVIEW_COUNT && (
        <button
          type="button"
          onClick={() => openAt(0)}
          className="mt-3 w-full sm:w-auto rounded-full border border-deep/20 text-deep text-sm font-medium px-4 py-2 hover:bg-deep hover:text-white transition"
        >
          View all {photos.length} photos
        </button>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setOpen(false)}
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl leading-none"
          >
            &times;
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + photos.length) % photos.length);
            }}
            aria-label="Previous photo"
            className="absolute left-2 sm:left-4 text-white/80 hover:text-white text-3xl leading-none px-2"
          >
            &#8249;
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photos[index].url}
            alt="The Summer House"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[92vw] object-contain rounded"
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % photos.length);
            }}
            aria-label="Next photo"
            className="absolute right-2 sm:right-4 text-white/80 hover:text-white text-3xl leading-none px-2"
          >
            &#8250;
          </button>

          <span className="absolute bottom-4 text-white/70 text-sm">
            {index + 1} / {photos.length}
          </span>
        </div>
      )}
    </div>
  );
}
