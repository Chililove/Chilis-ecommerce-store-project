import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { productRepository } from "@/lib/repositories/productRepository";

export type CartLine = { id: string; quantity: number };

export async function createCheckoutSession(cart: CartLine[], origin: string) {
  // Never trust browser prices: look products up and build line items from the
  // verified database data.
  const products = await productRepository.findManyByIds(cart.map((l) => l.id));

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = cart.map(
    (line) => {
      const product = products.find((p) => p.id === line.id);
      if (!product) {
        throw new Error(`Unknown product in cart: ${line.id}`);
      }
      return {
        quantity: line.quantity,
        price_data: {
          currency: "dkk",
          product_data: { name: product.name },
          // Stripe wants the smallest currency unit as an integer: 149.50 kr -> 14950 øre.
          unit_amount: Math.round(Number(product.price) * 100),
        },
      };
    }
  );

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: lineItems,
    success_url: `${origin}/checkout/success`,
    cancel_url: `${origin}/cart`,
    metadata: {
      cart: JSON.stringify(cart),
    },
  });

  return session.url;
}
