import type { CardDef } from "./types";

/**
 * Original placeholder creature roster. Art slots point at /public/cards/*
 * gradients generated at build time — swap in licensed renders later, the
 * shape of each slot (id -> image path) stays the same.
 */
export const CARD_CATALOG: CardDef[] = [
  // Common
  { id: "pebblit", name: "Pebblit", species: "Stone Pup", rarity: "common", value: 8, image: "/cards/pebblit.svg", element: "umbra", flavor: "Rolls downhill on purpose. It has never once landed upright." },
  { id: "sparkwig", name: "Sparkwig", species: "Twig Sprite", rarity: "common", value: 8, image: "/cards/sparkwig.svg", element: "volt", flavor: "Made of static and bad decisions." },
  { id: "driftmoth", name: "Driftmoth", species: "Dust Moth", rarity: "common", value: 8, image: "/cards/driftmoth.svg", element: "aether", flavor: "Follows the nearest light source, including your phone." },
  { id: "mudpaw", name: "Mudpaw", species: "Bog Cub", rarity: "common", value: 8, image: "/cards/mudpaw.svg", element: "tide", flavor: "Tracks mud through dimensions, not just houses." },
  { id: "cinderit", name: "Cinderit", species: "Ash Kit", rarity: "common", value: 8, image: "/cards/cinderit.svg", element: "ember", flavor: "Smells like a campfire that's still deciding." },
  { id: "leaflin", name: "Leaflin", species: "Sprout Whelp", rarity: "common", value: 8, image: "/cards/leaflin.svg", element: "verdant", flavor: "Photosynthesizes when nobody's watching." },
  // Uncommon
  { id: "gustling", name: "Gustling", species: "Squall Pup", rarity: "uncommon", value: 22, image: "/cards/gustling.svg", element: "aether", flavor: "Its bark is a small-craft advisory." },
  { id: "tidewhelp", name: "Tidewhelp", species: "Coast Pup", rarity: "uncommon", value: 22, image: "/cards/tidewhelp.svg", element: "tide", flavor: "Brings the whole beach home in its fur." },
  { id: "voltfin", name: "Voltfin", species: "Storm Fry", rarity: "uncommon", value: 22, image: "/cards/voltfin.svg", element: "volt", flavor: "Short-circuits streetlights out of boredom." },
  { id: "mosshorn", name: "Mosshorn", species: "Grove Ram", rarity: "uncommon", value: 22, image: "/cards/mosshorn.svg", element: "verdant", flavor: "Grows a new ring every time it's proven right." },
  { id: "embercoil", name: "Embercoil", species: "Kiln Serpent", rarity: "uncommon", value: 22, image: "/cards/embercoil.svg", element: "ember", flavor: "Curls up in forges to save on rent." },
  // Rare
  { id: "thornmaw", name: "Thornmaw", species: "Bramble Fang", rarity: "rare", value: 60, image: "/cards/thornmaw.svg", element: "verdant", flavor: "Politely asks you to leave. Once." },
  { id: "ripcurrent", name: "Ripcurrent", species: "Undertow Eel", rarity: "rare", value: 60, image: "/cards/ripcurrent.svg", element: "tide", flavor: "Not lost. Just recalculating." },
  { id: "cindermane", name: "Cindermane", species: "Ash Lion", rarity: "rare", value: 60, image: "/cards/cindermane.svg", element: "ember", flavor: "Its roar is on file with three fire departments." },
  { id: "staticfang", name: "Staticfang", species: "Coil Wolf", rarity: "rare", value: 60, image: "/cards/staticfang.svg", element: "volt", flavor: "Bites first, apologizes to the breaker box later." },
  { id: "hollowsight", name: "Hollowsight", species: "Veil Owl", rarity: "rare", value: 60, image: "/cards/hollowsight.svg", element: "umbra", flavor: "Sees the version of you that hasn't happened yet." },
  // Epic
  { id: "duskrend", name: "Duskrend", species: "Umbral Wyrm", rarity: "epic", value: 180, image: "/cards/duskrend.svg", element: "umbra", flavor: "Tears a hole in the evening and steps through." },
  { id: "tsunareign", name: "Tsunareign", species: "Deep Sovereign", rarity: "epic", value: 180, image: "/cards/tsunareign.svg", element: "tide", flavor: "The tide asks permission first, now." },
  { id: "pyroclast", name: "Pyroclast", species: "Caldera Titan", rarity: "epic", value: 180, image: "/cards/pyroclast.svg", element: "ember", flavor: "Sleeps for a century, stretches for a decade." },
  { id: "galestorm", name: "Galestorm", species: "Tempest Roc", rarity: "epic", value: 180, image: "/cards/galestorm.svg", element: "aether", flavor: "Outruns its own thunder on a bad day." },
  // Legendary
  { id: "voidmonarch", name: "Voidmonarch", species: "Null Sovereign", rarity: "legendary", value: 650, image: "/cards/voidmonarch.svg", element: "umbra", flavor: "Every silence you've ever heard was borrowed." },
  { id: "solflare", name: "Solflare Ascendant", species: "Corona Herald", rarity: "legendary", value: 650, image: "/cards/solflare.svg", element: "ember", flavor: "It doesn't rise. The horizon reaches up to meet it." },
  { id: "leviathorn", name: "Leviathorn", species: "Abyssal Colossus", rarity: "legendary", value: 650, image: "/cards/leviathorn.svg", element: "tide", flavor: "Maps still mark its wake as uncharted, on purpose." },
  // Grail
  { id: "aureliux", name: "Aureliux, First Light", species: "Genesis Wyrm", rarity: "grail", value: 4200, image: "/cards/aureliux.svg", element: "aether", flavor: "Legend says the first pack ever ripped held this card. Nobody's proven otherwise." },
  { id: "chronogryph", name: "Chronogryph", species: "Paradox Griffin", rarity: "grail", value: 4200, image: "/cards/chronogryph.svg", element: "aether", flavor: "Pulled once. Recorded twice. Explain that." },
];

export function cardById(id: string): CardDef {
  const card = CARD_CATALOG.find((c) => c.id === id);
  if (!card) throw new Error(`Unknown card id: ${id}`);
  return card;
}

export function cardsByRarity(rarity: CardDef["rarity"]): CardDef[] {
  return CARD_CATALOG.filter((c) => c.rarity === rarity);
}
