// =============================================================================
//  CHECKOUT SERVICE  — turning a cart into a Stripe payment
// =============================================================================
//  This is the SERVICE LAYER.
//  all the real logic lives here. It:
//   1. Looks up the REAL products from the database (never trusts the prices
//      the browser sent — a user could tamper with them).
//   2. Builds Stripe line items from that verified data.
//   3. Creates a Stripe Checkout Session and returns its URL.
// =============================================================================

import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { productRepository } from "@/lib/repositories/productRepository";

// One line of the cart as the browser sends it: just an id and a quantity.
export type CartLine = { id: string; quantity: number };

export async function createCheckoutSession(cart: CartLine[], origin: string) {
  // 1. Look up the real products by their ids.
  const products = await productRepository.findManyByIds(cart.map((l) => l.id));

  // 2. Build Stripe line items from the VERIFIED database data.
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
          // Stripe wants the amount in the SMALLEST unit (øre) as an integer —
          // the same "integer money" idea from earlier. 149.50 kr → 14950 øre.
          unit_amount: Math.round(Number(product.price) * 100),
        },
      };
    }
  );

  // 3. Create the hosted Checkout Session.
  //    - success_url / cancel_url are where Stripe sends the customer back.
  //    - metadata carries a compact copy of the cart 
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
