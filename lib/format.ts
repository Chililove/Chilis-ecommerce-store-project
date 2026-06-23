// Formats a number as a Danish kroner price, e.g. 299 -> "299,00 kr.".
export function formatDkk(amount: number): string {
  return new Intl.NumberFormat("da-DK", {
    style: "currency",
    currency: "DKK",
  }).format(amount);
}
