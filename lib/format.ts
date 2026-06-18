// =============================================================================
//  FORMATTERS  —  small helpers for displaying values nicely
// =============================================================================

// Turns a number like 299 into a Danish-formatted price like "299,00 kr."
// Intl.NumberFormat is built into JavaScript — it knows how each country
// writes currency (Denmark uses a comma for decimals and "kr." after).
export function formatDkk(amount: number): string {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
  }).format(amount);
}
