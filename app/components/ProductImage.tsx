// =============================================================================
//  PRODUCT IMAGE  —  shows a product photo, with a friendly fallback
// =============================================================================
//  A small reusable presentational component. Given an image path it renders an
//  optimized Next.js <Image>; given nothing (null) it shows a chili placeholder
//  so cards never look broken. Reusing this on both the listing and detail
//  pages is "composition" — build pages out of small, focused pieces.
// =============================================================================

import Image from "next/image";

export default function ProductImage({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  // Normalize: leave full URLs and absolute paths alone; add "/" to bare names.
  const resolved =
    src && (src.startsWith("http") || src.startsWith("/")) ? src : src ? `/${src}` : null;

  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100">
      {resolved ? (
        <Image
          src={resolved}
          alt={alt}
          fill
          className="object-cover"
          // `sizes` tells the browser how big the image will display, so
          // Next.js can serve an appropriately sized file. Required with `fill`.
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        // Fallback when a product has no image yet.
        <div className="flex h-full w-full items-center justify-center text-4xl">
          🌶️
        </div>
      )}
    </div>
  );
}
