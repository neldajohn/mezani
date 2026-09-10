const DRINK_KEYWORDS = [
  "kahawa",
  "chai",
  "juisi",
  "madafu",
  "cocktail",
  "divai",
  "maji",
  "soda",
];

const SNACK_KEYWORDS = [
  "keki",
  "maandazi",
  "sambusa",
  "chapati",
  "vitumbua",
  "biskuti",
];

export type MenuCategory = "Vinywaji" | "Vitafunio" | "Chakula Kikuu";

export function classifyDish(name: string): MenuCategory {
  const lower = name.toLowerCase();
  if (DRINK_KEYWORDS.some((word) => lower.includes(word))) return "Vinywaji";
  if (SNACK_KEYWORDS.some((word) => lower.includes(word))) return "Vitafunio";
  return "Chakula Kikuu";
}

// Deterministic hash so the same dish name always lands on the same price
// within its restaurant's price tier, without needing to hand-author ~60
// individual menu prices.
function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

const TIER_RANGES: Record<number, [number, number]> = {
  1: [2500, 8000],
  2: [6000, 16000],
  3: [12000, 35000],
};

export function estimatePrice(name: string, priceRange: number): number {
  const [min, max] = TIER_RANGES[priceRange] ?? TIER_RANGES[2];
  const spread = hash(name) % ((max - min) / 500 + 1);
  return min + spread * 500;
}
