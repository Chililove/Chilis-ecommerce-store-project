import { notFound } from "next/navigation";
import Link from "next/link";
import { productRepository } from "@/lib/repositories/productRepository";
import { formatDkk } from "@/lib/format";
import AddToCartButton from "@/app/components/AddToCartButton";
import ProductImage from "@/app/components/ProductImage";

// Force dynamic rendering so the stock count is never served stale from cache.
export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await productRepository.findById(id);

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/products" className="text-sm text-gray-500 hover:underline">
        ← Back to products
      </Link>

      <div className="mt-4 max-w-sm">
        <ProductImage src={product.imageUrl} alt={product.name} />
      </div>

      <h1 className="mt-4 text-3xl font-bold">{product.name}</h1>
      <p className="mt-3 text-gray-600">{product.description}</p>

      <p className="mt-6 text-2xl font-semibold">
        {formatDkk(Number(product.price))}
      </p>

      <p className="mt-2 text-sm text-gray-500">
        {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
      </p>

      <div>
        <AddToCartButton
          id={product.id}
          name={product.name}
          price={Number(product.price)}
        />
      </div>
    </main>
  );
}
