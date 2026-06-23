import Link from "next/link";
import { productRepository } from "@/lib/repositories/productRepository";
import { formatDkk } from "@/lib/format";

// Render on every request so featured products reflect current data.
export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await productRepository.findAll();
  const featured = products.slice(0, 3);

  return (
    <main className="flex-1">
      <section className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Tiny Chili Store 🌶️
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
          Carefully chosen everyday hotness, grown to last.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-block rounded-full bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800"
        >
          Shop all products
        </Link>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured</h2>
            <Link
              href="/products"
              className="text-sm text-gray-500 hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featured.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="rounded-xl border border-gray-200 p-5 transition hover:shadow-md"
              >
                <h3 className="font-semibold">{product.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                  {product.description}
                </p>
                <p className="mt-3 font-medium">
                  {formatDkk(Number(product.price))}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
