"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import type { CommunityImage } from "@/types";

function useColumnCount() {
  const [columnCount, setColumnCount] = useState(2);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 640px)");
    const update = () => setColumnCount(media.matches ? 3 : 2);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  return columnCount;
}

/** Pin the first N images to the top of each column, then fill the rest. */
function distributeImages(images: CommunityImage[], columnCount: number) {
  const columns: { image: CommunityImage; index: number }[][] = Array.from(
    { length: columnCount },
    () => [],
  );

  images.slice(0, columnCount).forEach((image, index) => {
    columns[index].push({ image, index });
  });

  images.slice(columnCount).forEach((image, offset) => {
    const index = columnCount + offset;
    columns[offset % columnCount].push({ image, index });
  });

  return columns;
}

export function CommunityImageGallery({ images }: { images: CommunityImage[] }) {
  const titleId = useId();
  const columnCount = useColumnCount();
  const columns = useMemo(
    () => distributeImages(images, columnCount),
    [images, columnCount],
  );
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const active = activeIndex === null ? null : images[activeIndex];

  const close = useCallback(() => setActiveIndex(null), []);
  const showPrev = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current - 1 + images.length) % images.length,
    );
  }, [images.length]);
  const showNext = useCallback(() => {
    setActiveIndex((current) =>
      current === null ? null : (current + 1) % images.length,
    );
  }, [images.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrev();
      if (event.key === "ArrowRight") showNext();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, close, showNext, showPrev]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {columns.map((column, columnIndex) => (
          <ul key={columnIndex} className="flex min-w-0 flex-col gap-3">
            {column.map(({ image, index }) => (
              <li key={image.id}>
                <button
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className="block w-full overflow-hidden rounded-lg border border-[var(--line)] bg-white text-left transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--tide)]"
                  aria-label={`Open photo: ${image.alt}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={1000}
                    className="h-auto w-full object-cover"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                </button>
              </li>
            ))}
          </ul>
        ))}
      </div>

      {active && activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={close}
        >
          <p id={titleId} className="sr-only">
            {active.alt}
          </p>

          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 rounded-md bg-white/15 px-3 py-2 text-sm font-bold text-white"
            aria-label="Close photo"
          >
            Close
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrev();
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-md bg-white/15 px-3 py-4 text-xl font-bold text-white sm:left-4"
            aria-label="Previous photo"
          >
            ‹
          </button>

          <figure
            className="relative max-h-[90dvh] max-w-4xl"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={active.src}
              alt={active.alt}
              width={1600}
              height={2000}
              className="max-h-[82dvh] w-auto max-w-full object-contain"
              sizes="100vw"
              priority
            />
            <figcaption className="mt-3 text-center text-sm text-white/90">
              {active.alt}
              {active.credit ? (
                <span className="mt-1 block text-[10px] text-white/55">
                  {active.credit}
                </span>
              ) : null}
              <span className="mt-1 block text-xs text-white/60">
                {activeIndex + 1} / {images.length}
              </span>
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white/15 px-3 py-4 text-xl font-bold text-white sm:right-4"
            aria-label="Next photo"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
