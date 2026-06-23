import Link from "next/link";
import { productRepository } from "@/lib/repositories/productRepository";
import { formatDkk } from "@/lib/format";
import ProductImage from "@/app/components/ProductImage";

// Render on every request so stock/listing data is always current.
export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await productRepository.findAll();

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-3xl font-bold">Products</h1>

      {products.length === 0 ? (
        <p className="text-gray-500">
          No products yet. Run <code>npm run db:seed</code> to add some.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="rounded-xl border border-gray-200 p-5 transition hover:shadow-md"
            >
              <ProductImage src={product.imageUrl} alt={product.name} />
              <h2 className="mt-3 text-lg font-semibold">{product.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {product.description}
              </p>
              <p className="mt-3 font-medium">
                {formatDkk(Number(product.price))}
              </p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
