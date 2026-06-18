// =============================================================================
//  PRODUCT DETAIL PAGE  —  lives at "/products/<id>"
// =============================================================================
//  The folder name "[id]" makes this a DYNAMIC route:
//  one file that serves every product. The actual id from the URL arrives in
//  `params`.
//
//  `params` is a Promise, so we `await` it.
//
//  If no product matches the id, we call notFound(), which shows Next.js's
//  built-in 404 page —  handling "this thing doesn't exist".
// =============================================================================

import { notFound } from "next/navigation";
import Link from "next/link";
import { productRepository } from "@/lib/repositories/productRepository";
import { formatDkk } from "@/lib/format";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await productRepository.findById(id);

  // No product with this id? Show the 404 page.
  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/products" className="text-sm text-gray-500 hover:underline">
        ← Back to products
      </Link>

      <h1 className="mt-4 text-3xl font-bold">{product.name}</h1>
      <p className="mt-3 text-gray-600">{product.description}</p>

      <p className="mt-6 text-2xl font-semibold">
        {formatDkk(Number(product.price))}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
      </p>
    </main>
  );
}
