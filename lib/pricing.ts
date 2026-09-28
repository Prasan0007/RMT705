/** Sell-back offer: a card's base catalog value scaled up by its grade. */
export function sellBackOffer(cardValue: number, grade: number): number {
  return Math.round(cardValue * (0.55 + grade / 40));
}
