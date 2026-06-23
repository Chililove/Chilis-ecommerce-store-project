import Image from "next/image";

export default function ProductImage({
  src,
  alt,
}: {
  src: string | null;
  alt: string;
}) {
  // Leave full URLs and absolute paths alone; prefix bare names with "/".
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
          // Required with `fill` so Next.js can serve an appropriately sized file.
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-4xl">
          🌶️
        </div>
      )}
    </div>
  );
}
