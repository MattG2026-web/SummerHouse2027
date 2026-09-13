export type GalleryPhoto = {
  id: string;
  url: string;
};

export default function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  if (photos.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center text-stone-500">
        Photos are on their way — check back soon.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {photos.map((p, i) => (
          <a key={p.id} href={`#photo-${p.id}`} className="block group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.url}
              alt="The Summer House"
              loading={i < 4 ? "eager" : "lazy"}
              className="w-full h-32 sm:h-40 object-cover rounded-lg group-hover:opacity-90 transition"
            />
          </a>
        ))}
      </div>

      {photos.map((p) => (
        <a
          key={`overlay-${p.id}`}
          href="#"
          id={`photo-${p.id}`}
          className="lightbox fixed inset-0 z-50 hidden items-center justify-center bg-black/90 p-4"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.url}
            alt="The Summer House"
            className="max-h-[90vh] max-w-[95vw] object-contain rounded"
          />
        </a>
      ))}
    </div>
  );
}
