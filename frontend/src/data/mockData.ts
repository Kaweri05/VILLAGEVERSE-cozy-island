export type ShopItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  rarity: string;
  description: string;
  emoji: string;
  favorite?: boolean;
};

export type InventoryItem = {
  id: number;
  name: string;
  category: string;
  emoji: string;
  quantity: number;
  value: number;
  rarity: string;
  reserved?: boolean;
  favorite?: boolean;
};

export const featureCards = [
  {
    title: "AI Companions",
    description: "Warm, personalized suggestions help you discover the next cozy upgrade for your island life.",
    icon: "✦",
  },
  {
    title: "Live Seasons",
    description: "Experience a constantly shifting island with fresh items, events, and weather that feels alive.",
    icon: "☀",
  },
  {
    title: "Smart Inventory",
    description: "Reserve, favorite, and stack cherished pieces with a polished, playful management flow.",
    icon: "🧺",
  },
  {
    title: "Premium Collectibles",
    description: "Browse rare décor, fashion, and seasonal finds in a marketplace that feels handcrafted and aspirational.",
    icon: "🌿",
  },
];

export const shopItems: ShopItem[] = [
  { id: 1, name: "Sunbeam Lantern", category: "Furniture", price: 680, stock: 8, rarity: "Rare", description: "A glowing lantern that warms every evening path.", emoji: "🏮" },
  { id: 2, name: "Pineapple Bloom", category: "Flowers", price: 220, stock: 24, rarity: "Common", description: "Bright tropical petals that sway with the breeze.", emoji: "🌺" },
  { id: 3, name: "Mossy Bench", category: "Furniture", price: 340, stock: 13, rarity: "Uncommon", description: "A soft, weathered seat for seaside conversations.", emoji: "🪑" },
  { id: 4, name: "Whisper Coat", category: "Clothing", price: 410, stock: 6, rarity: "Rare", description: "A cloud-soft layer for moonlit strolls.", emoji: "🧥" },
  { id: 5, name: "Golden Beetle", category: "Bugs", price: 950, stock: 3, rarity: "Epic", description: "Rare collector treasure with luminous shine.", emoji: "🐞" },
  { id: 6, name: "Moonfish", category: "Fish", price: 540, stock: 5, rarity: "Rare", description: "An elegant catch for late-night fishing trips.", emoji: "🐟" },
  { id: 7, name: "Cedar Sapling", category: "Trees", price: 180, stock: 21, rarity: "Common", description: "A young tree for a cozy canopy of shade.", emoji: "🌲" },
  { id: 8, name: "Tidal Wallpaper", category: "Wallpaper", price: 260, stock: 12, rarity: "Uncommon", description: "Gentle wave patterns for a calm interior retreat.", emoji: "🖼️" },
  { id: 9, name: "Citrus Tart", category: "Food", price: 140, stock: 19, rarity: "Common", description: "A sweet treat with island citrus notes.", emoji: "🍰" },
  { id: 10, name: "Dawn Orchid", category: "Seasonal Items", price: 360, stock: 10, rarity: "Rare", description: "Petals that bloom during the first light of day.", emoji: "🌼" },
];

export const inventoryItems: InventoryItem[] = [
  { id: 1, name: "Seashell Lantern", category: "Furniture", emoji: "🏮", quantity: 2, value: 560, rarity: "Rare", favorite: true },
  { id: 2, name: "Mango Seed", category: "Fruits", emoji: "🥭", quantity: 8, value: 120, rarity: "Common" },
  { id: 3, name: "Cloud Knit", category: "Clothing", emoji: "🧶", quantity: 1, value: 420, rarity: "Rare", reserved: true },
  { id: 4, name: "Golden Fern", category: "Flowers", emoji: "🌿", quantity: 4, value: 230, rarity: "Uncommon", favorite: true },
  { id: 5, name: "Ocean Map", category: "Tools", emoji: "🗺️", quantity: 1, value: 310, rarity: "Epic" },
];

export const villagers = [
  { name: "Mina", role: "Garden Host", quote: "The breeze always brings a fresh idea.", emoji: "🐰" },
  { name: "Sol", role: "Night Market Guide", quote: "Every evening shines with chance.", emoji: "🦊" },
  { name: "Luma", role: "Crafting Muse", quote: "A cozy home starts with one thoughtful detail.", emoji: "🦉" },
];

export const dailyRewards = [
  { label: "Daily Login", value: "120 coins" },
  { label: "Fishing Aid", value: "x2 luck" },
  { label: "Garden Boost", value: "1 rare seed" },
];

export const categories = ["All", "Furniture", "Clothing", "Fish", "Bugs", "Fossils", "Flowers", "Fruits", "Trees", "Wallpaper", "Flooring", "Seasonal Items", "Food", "Tools"];
