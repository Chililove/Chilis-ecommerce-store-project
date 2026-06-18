// =============================================================================
//  PRODUCTS LISTING PAGE  —  lives at "/products"
// =============================================================================
//
//  It gets its data through the repository, never touching the database
//  directly. That's clean boundary.
// =============================================================================

import Link from "next/link";
import { productRepository } from "@/lib/repositories/productRepository";
import { formatDkk } from "@/lib/format";

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
            // Each card links to that product's detail page at /products/<id>
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="rounded-xl border border-gray-200 p-5 transition hover:shadow-md"
            >
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                {product.description}
              </p>
              {/* product.price is a Decimal, so it is converted to a number
                  with Number() before formatting it as kroner. */}
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
