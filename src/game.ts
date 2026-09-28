import { useCallback, useEffect, useRef, useState } from 'react';

export type OrderId = 'classic' | 'rusk' | 'adrak' | 'biscuits' | 'elaichi' | 'lassi' | 'samosa' | 'cake' | 'pakora' | 'jalebi' | 'bunmaska' | 'kachori';
export type IngredientId = 'tea' | 'milk' | 'sugar' | 'ginger' | 'cardamom' | 'yogurt' | 'flour' | 'potato' | 'batter' | 'egg';
export type UpgradeId = 'stove' | 'pot' | 'quality' | 'decor' | 'extra-stove' | 'cup-rack' | 'seating';
export type StaffId = 'helper' | 'cashier' | 'cook' | 'washer' | 'gasman';
export type LocationId = 'thela' | 'market' | 'dhaba' | 'shop';
export type Phase = 'idle' | 'heating' | 'adding' | 'brewing' | 'ready';
export type CustomerKind = 'worker' | 'student' | 'officer' | 'regular' | 'traveler';
export type ModalName = 'upgrades' | 'staff' | 'map' | 'achievements' | 'guide' | 'settings' | 'boost' | 'events';
export type BusyTask = 'brew' | 'wash' | 'gas' | 'add' | null;

export interface Order {
  name: string; shortName: string; price: number; cost: number; level: number;
  description: string; ingredients: IngredientId[]; category: 'drink' | 'food';
  prepMinutes: number;
}

export const RECIPES: Record<OrderId, Order> = {
  classic: { name: 'Classic chai', shortName: 'Classic', price: 25, cost: 0, level: 1, description: 'The familiar cup that feels like home.', ingredients: ['tea', 'milk', 'sugar'], category: 'drink', prepMinutes: 6 },
  rusk: { name: 'Rusk', shortName: 'Rusk', price: 30, cost: 0, level: 3, description: 'Crisp, buttery, dunk-perfect.', ingredients: ['flour', 'milk', 'sugar'], category: 'food', prepMinutes: 4 },
  adrak: { name: 'Adrak chai', shortName: 'Adrak', price: 40, cost: 300, level: 3, description: 'A little ginger. A whole lot of warmth.', ingredients: ['tea', 'milk', 'sugar', 'ginger'], category: 'drink', prepMinutes: 7 },
  biscuits: { name: 'Biscuits', shortName: 'Biscuits', price: 25, cost: 0, level: 2, description: 'Crunchy, sweet, chai ka saathi.', ingredients: ['flour', 'sugar'], category: 'food', prepMinutes: 3 },
  elaichi: { name: 'Elaichi chai', shortName: 'Elaichi', price: 50, cost: 550, level: 5, description: 'Fragrant cardamom for a special kind of sip.', ingredients: ['tea', 'milk', 'sugar', 'cardamom'], category: 'drink', prepMinutes: 8 },
  lassi: { name: 'Sweet lassi', shortName: 'Lassi', price: 45, cost: 700, level: 6, description: 'Cool, creamy comfort for sunny afternoons.', ingredients: ['yogurt', 'milk', 'sugar'], category: 'drink', prepMinutes: 5 },
  samosa: { name: 'Samosa', shortName: 'Samosa', price: 35, cost: 0, level: 4, description: 'Crispy, spicy, legendary.', ingredients: ['potato', 'flour'], category: 'food', prepMinutes: 8 },
  cake: { name: 'Pound cake', shortName: 'Cake', price: 45, cost: 0, level: 5, description: 'A little slice of celebration.', ingredients: ['flour', 'egg', 'sugar'], category: 'food', prepMinutes: 10 },
  pakora: { name: 'Pakora', shortName: 'Pakora', price: 45, cost: 0, level: 6, description: 'Rainy-day favourite, golden and crisp.', ingredients: ['potato', 'batter'], category: 'food', prepMinutes: 7 },
  jalebi: { name: 'Jalebi', shortName: 'Jalebi', price: 55, cost: 0, level: 9, description: 'Sweet spirals for a special chai break.', ingredients: ['batter', 'sugar'], category: 'food', prepMinutes: 7 },
  bunmaska: { name: 'Bun maska', shortName: 'Bun maska', price: 50, cost: 0, level: 11, description: 'Soft bun with a generous spread of butter.', ingredients: ['flour', 'milk'], category: 'food', prepMinutes: 4 },
  kachori: { name: 'Kachori', shortName: 'Kachori', price: 65, cost: 0, level: 14, description: 'Spiced, flaky, and perfect with tea.', ingredients: ['flour', 'potato'], category: 'food', prepMinutes: 8 },
};

export const ALL_ORDERS: OrderId[] = ['classic', 'biscuits', 'rusk', 'adrak', 'samosa', 'elaichi', 'cake', 'lassi', 'pakora', 'jalebi', 'bunmaska', 'kachori'];
export const DRINKS: OrderId[] = ['classic', 'adrak', 'elaichi', 'lassi'];
export const FOODS: OrderId[] = ['biscuits', 'rusk', 'samosa', 'cake', 'pakora', 'jalebi', 'bunmaska', 'kachori'];

// Unlocks are level-based; purchasing stock is a separate economy action.
export const SIDE_ITEMS: Record<Exclude<OrderId, 'classic' | 'adrak' | 'elaichi' | 'lassi'>, { level: number; quantity: number; buyPrice: number; sellValue: number }> = {
  biscuits: { level: RECIPES.biscuits.level, quantity: 20, buyPrice: 20, sellValue: RECIPES.biscuits.price },
  rusk: { level: RECIPES.rusk.level, quantity: 20, buyPrice: 23, sellValue: RECIPES.rusk.price },
  samosa: { level: RECIPES.samosa.level, quantity: 5, buyPrice: 25, sellValue: RECIPES.samosa.price },
  cake: { level: RECIPES.cake.level, quantity: 5, buyPrice: 30, sellValue: RECIPES.cake.price },
  pakora: { level: RECIPES.pakora.level, quantity: 10, buyPrice: 30, sellValue: RECIPES.pakora.price },
  jalebi: { level: RECIPES.jalebi.level, quantity: 8, buyPrice: 40, sellValue: RECIPES.jalebi.price },
  bunmaska: { level: RECIPES.bunmaska.level, quantity: 10, buyPrice: 35, sellValue: RECIPES.bunmaska.price },
  kachori: { level: RECIPES.kachori.level, quantity: 6, buyPrice: 45, sellValue: RECIPES.kachori.price },
};
export type SideId = keyof typeof SIDE_ITEMS;
export const SIDE_IDS = Object.keys(SIDE_ITEMS) as SideId[];
export const isSide = (id: OrderId): id is SideId => id in SIDE_ITEMS;

export const INGREDIENTS: Record<IngredientId, string> = {
  tea: 'Tea leaves', milk: 'Fresh milk', sugar: 'Sugar', ginger: 'Ginger', cardamom: 'Elaichi', yogurt: 'Yogurt',
  flour: 'Flour', potato: 'Potato', batter: 'Besan batter', egg: 'Egg',
};

// ─── PROGRESSIVE XP / LEVEL TABLE ────────────────────────────────────────────
// Each entry is the total cups needed to REACH that level (cumulative).
// Level 1 starts at 0. After Level 3 the curve steepens significantly.
// These numbers are balanced against the ~25-coin-per-cup economy.
export const LEVEL_XP_TABLE: number[] = [
  0,    // Level 1  (start)
  8,    // Level 2  (8 cups — fast tutorial ramp)
  18,   // Level 3  (10 more cups)
  32,   // Level 4  (14 more — noticeably harder)
  52,   // Level 5  (20 more)
  78,   // Level 6  (26 more)
  112,  // Level 7  (34 more)
  156,  // Level 8  (44 more)
  212,  // Level 9  (56 more)
  282,  // Level 10 (70 more)
  368,  // Level 11 (86 more)
  474,  // Level 12 (106 more)
  604,  // Level 13 (130 more)
  764,  // Level 14 (160 more)
  964,  // Level 15 (200 more)
];

/** Derive level (1-based) from total cups served. */
export function servedToLevel(served: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_XP_TABLE.length; i++) {
    if (served >= LEVEL_XP_TABLE[i]) level = i + 1;
    else break;
  }
  return level;
}

/** Cups needed to reach the NEXT level from current `served` total. */
export function cupsToNextLevel(served: number): number {
  const lv = servedToLevel(served);
  const nextThreshold = LEVEL_XP_TABLE[lv]; // index lv = lv+1 th entry
  if (nextThreshold === undefined) return 0; // maxed
  return Math.max(0, nextThreshold - served);
}

/** Progress 0–1 within current level band. */
export function levelProgress(served: number): number {
  const lv = servedToLevel(served);
  const start = LEVEL_XP_TABLE[lv - 1] ?? 0;
  const end = LEVEL_XP_TABLE[lv];
  if (end === undefined) return 1;
  return Math.min(1, (served - start) / (end - start));
}

// ─── SEATING CAPACITY TABLE ───────────────────────────────────────────────────
// seats[i] = seats available at level i+1
// Increases every 2 levels starting at level 5, never auto-grants — player must
// purchase the seating upgrade. This table is the MAXIMUM purchasable capacity.
export const MAX_SEATS_BY_LEVEL: number[] = [
  3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10
];
export function maxSeatsAtLevel(level: number): number {
  return MAX_SEATS_BY_LEVEL[Math.min(level, MAX_SEATS_BY_LEVEL.length) - 1] ?? 10;
}

// Seating upgrade: costs & required levels
export const SEATING_UPGRADES: { seats: number; requiredLevel: number; cost: number }[] = [
  { seats: 3, requiredLevel: 1,  cost: 0   }, // starter (free)
  { seats: 4, requiredLevel: 3,  cost: 75  },
  { seats: 5, requiredLevel: 5,  cost: 150 },
  { seats: 6, requiredLevel: 7,  cost: 280 },
  { seats: 7, requiredLevel: 9,  cost: 450 },
  { seats: 8, requiredLevel: 11, cost: 700 },
  { seats: 9, requiredLevel: 13, cost: 1000 },
];

// ─── UPGRADES ─────────────────────────────────────────────────────────────────
export const UPGRADES: { id: UpgradeId; name: string; description: string; benefit: string; baseCost: number; max: number; cost?: number; level?: number }[] = [
  { id: 'stove', name: 'A little more fire', description: 'A better stove for those busy mornings.', benefit: '25% faster brewing per level', baseCost: 350, max: 3, level: 2 },
  { id: 'extra-stove', name: 'Extra stove', description: 'Put on the tea. Put on the adrak. Brew multiple drinks.', benefit: 'Brew an extra drink at the same time', baseCost: 550, max: 2, level: 7 },
  { id: 'pot', name: 'The bigger the better', description: 'There is always room for one more cup. Brews slower.', benefit: '+1 cup per batch, +2 min brew time', baseCost: 450, max: 3, level: 4 },
  { id: 'quality', name: 'Only the good stuff', description: 'Fresh leaves. Rich milk. No shortcuts.', benefit: '+5 coins on every cup', baseCost: 600, max: 3, level: 5 },
  { id: 'decor', name: 'Make yourself at home', description: 'A little charm goes a long way.', benefit: '+2 coins in customer tips', baseCost: 250, max: 3, level: 3 },
];

export interface WorkerDef {
  id: StaffId; name: string; role: string; description: string; cost: number; salary: number; requires: number;
  job: 'washer' | 'gasfiller' | 'cashier' | 'brewer' | 'helper';
}

export const WORKERS: WorkerDef[] = [
  { id: 'helper', name: 'Raju', role: 'The chai boy', description: 'Adds ingredients while you serve customers.', cost: 900, salary: 10, requires: 30, job: 'helper' },
  { id: 'cashier', name: 'Vijay', role: 'The cashier', description: 'Serves ready cups and collects coins.', cost: 1600, salary: 15, requires: 60, job: 'cashier' },
  { id: 'cook', name: 'Iqbal', role: 'The master brewer', description: 'Keeps stoves going automatically.', cost: 2400, salary: 20, requires: 112, job: 'brewer' },
  { id: 'washer', name: 'Kishan', role: 'The cup washer', description: 'Washes dirty cups automatically.', cost: 1200, salary: 12, requires: 78, job: 'washer' },
  { id: 'gasman', name: 'Gaffar', role: 'The gas man', description: 'Refills gas when running low.', cost: 2000, salary: 15, requires: 156, job: 'gasfiller' },
];

export const LOCATIONS: { id: LocationId; name: string; subtitle: string; description: string; revenue: number; cost: number; image: string }[] = [
  { id: 'thela', name: 'Old City Corner', subtitle: 'Your neighborhood thela', description: 'Familiar faces, narrow lanes, and the start of something good.', revenue: 0, cost: 0, image: '/images/chai-street.jpg' },
  { id: 'market', name: 'The Market Stall', subtitle: 'In the heart of the hustle', description: 'More footfall, new flavors, and a bazaar full of possibility.', revenue: 5000, cost: 1500, image: '/images/chai-market.jpg' },
  { id: 'dhaba', name: 'Highway Dhaba', subtitle: 'A home away from home', description: 'Truckers, travelers, and long conversations over garam chai.', revenue: 15000, cost: 4000, image: '/images/chai-dhaba.jpg' },
  { id: 'shop', name: 'Chai Wala & Co.', subtitle: 'A little dream, all grown up', description: 'A proper shop, a brilliant team, and your name on every cup.', revenue: 40000, cost: 10000, image: '/images/chai-shop.jpg' },
];

export interface WorkerState {
  hired: boolean;
  unpaidDays: number;
  onStrike: boolean;
  lastPaidDay: number;
}

export interface SaveData {
  version: number;
  coins: number;
  revenue: number;
  served: number;
  happy: number;
  missed: number;
  dailyServed: number;
  day: number;
  rating: number;
  upgrades: Record<'stove' | 'pot' | 'quality' | 'decor', number> & { 'extra-stove'?: number; 'cup-rack'?: number; 'seating'?: number };
  orders: OrderId[];
  inventory: Record<SideId, number>;
  staff: Record<StaffId, WorkerState>;
  locations: LocationId[];
  activeLocation: LocationId;
  dailyClaimed: boolean;
  claimedAchievements: string[];
  tutorialDone: boolean;
  sound: boolean;
  weather: 'sunny' | 'rainy';
  boostUntil: number;
  eventUntil: number;
  skin: 'classic' | 'festival';
  festivalOwned: boolean;
  stoves: number;
  cupCapacity: number;
  gasCapacityKg: number;
  gasKg: number;
  gameMinutes: number;
  speed: 1 | 2 | 3;
  savedAt: number;
  seatCapacity: number; // NEW: purchased seating capacity
}

export interface Customer {
  id: number;
  name: string;
  title: string;
  kind: CustomerKind;
  order: OrderId[];
  served: OrderId[];
  pendingCoins: number;
  patience: number;
  maxPatience: number;
  tip: number;
  haggles: boolean;
}

export interface StoveState {
  phase: Phase;
  recipe: OrderId;
  ingredients: IngredientId[];
  progress: number;
  cups: number;
}

export const makeStove = (recipe: OrderId = 'classic'): StoveState => ({ phase: 'idle', recipe, ingredients: [], progress: 0, cups: 0 });

export const CUP_TIERS = [6, 10, 16, 24];
export const CUP_COSTS = [0, 200, 500, 1200];
export const CUP_LEVELS = [1, 5, 9, 14];
export const GAS_PRICE = 30;
export const GAS_TIERS = [1, 2, 5, 10];
export const GAS_LEVELS = [1, 10, 13, 16];
export const GAS_FILL_MINUTES = 10;
export const WASH_MINUTES_PER_CUP = 1;
export const ADD_INGREDIENT_MINUTES = 2;

export const ACHIEVEMENTS: { id: string; title: string; description: string; reward: number; target: number; progress: (s: SaveData) => number }[] = [
  { id: 'first-five', title: 'A warm welcome', description: 'Serve your first 5 customers.', reward: 100, target: 5, progress: s => s.served },
  { id: 'twenty', title: 'Talk of the mohalla', description: 'Share 20 cups of happiness.', reward: 250, target: 20, progress: s => s.served },
  { id: 'team', title: 'Better together', description: 'Hire your first team member.', reward: 200, target: 1, progress: s => Object.values(s.staff).filter(w => w.hired).length },
  { id: 'business', title: 'A brewing business', description: 'Earn 5,000 coins from your chai.', reward: 500, target: 5000, progress: s => s.revenue },
  { id: 'branches', title: 'Beyond the corner', description: 'Open a second location.', reward: 750, target: 2, progress: s => s.locations.length },
  { id: 'empire', title: 'A city full of chai', description: 'Open all four locations.', reward: 2000, target: 4, progress: s => s.locations.length },
];

const SAVE_KEY = 'chai-wala-tycoon-v6';
const emptyInventory = (): Record<SideId, number> => ({ biscuits: 0, rusk: 0, samosa: 0, cake: 0, pakora: 0, jalebi: 0, bunmaska: 0, kachori: 0 });

const freshWorker = (): WorkerState => ({ hired: false, unpaidDays: 0, onStrike: false, lastPaidDay: 0 });

const freshSave = (): SaveData => ({
  version: 6, coins: 1240, revenue: 0, served: 0, happy: 0, missed: 0, dailyServed: 0,
  day: 1, rating: 4.8, upgrades: { stove: 0, pot: 0, quality: 0, decor: 0 },
  orders: ['classic'], inventory: emptyInventory(), staff: { helper: freshWorker(), cashier: freshWorker(), cook: freshWorker(), washer: freshWorker(), gasman: freshWorker() },
  locations: ['thela'], activeLocation: 'thela', dailyClaimed: false, claimedAchievements: [],
  tutorialDone: false, sound: false, weather: 'sunny', boostUntil: 0, eventUntil: 0,
  skin: 'classic', festivalOwned: false, stoves: 1, cupCapacity: 6, gasCapacityKg: 1, gasKg: 1,
  gameMinutes: 8 * 60, speed: 1, savedAt: Date.now(),
  seatCapacity: 3, // start with 3 seats
});

function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    // Also try old key for migration
    const rawOld = !raw ? localStorage.getItem('chai-wala-tycoon-v5') : null;
    if (!raw && !rawOld) return freshSave();
    const parsed = JSON.parse((raw ?? rawOld)!) as SaveData;

    // Migrate from v5 or v3
    if (parsed.version === 3 || parsed.version === 4 || parsed.version === 5) {
      const base = freshSave();
      base.coins = Number.isFinite(parsed.coins) ? parsed.coins : base.coins;
      base.revenue = Number.isFinite(parsed.revenue) ? parsed.revenue : base.revenue;
      base.served = Number.isFinite(parsed.served) ? parsed.served : base.served;
      base.happy = Number.isFinite(parsed.happy) ? parsed.happy : base.happy;
      base.missed = Number.isFinite(parsed.missed) ? parsed.missed : base.missed;
      base.dailyServed = Number.isFinite(parsed.dailyServed) ? parsed.dailyServed : base.dailyServed;
      base.day = Number.isFinite(parsed.day) ? parsed.day : base.day;
      base.rating = Number.isFinite(parsed.rating) ? parsed.rating : base.rating;
      base.tutorialDone = Boolean(parsed.tutorialDone);
      base.sound = Boolean(parsed.sound);
      base.weather = parsed.weather === 'rainy' ? 'rainy' : 'sunny';
      base.skin = parsed.skin === 'festival' ? 'festival' : 'classic';
      base.festivalOwned = Boolean(parsed.festivalOwned);
      base.claimedAchievements = Array.isArray(parsed.claimedAchievements) ? parsed.claimedAchievements : [];
      base.locations = Array.isArray(parsed.locations) && parsed.locations.length ? parsed.locations : ['thela'];
      base.activeLocation = base.locations.includes(parsed.activeLocation) ? parsed.activeLocation : 'thela';
      base.orders = Array.isArray(parsed.orders) && parsed.orders.length ? parsed.orders.filter(id => !isSide(id)) : ['classic'];
      base.upgrades = { ...base.upgrades, ...parsed.upgrades };
      const oldStaff = parsed.staff as Record<string, unknown> | undefined;
      if (oldStaff) {
        for (const id of Object.keys(base.staff) as StaffId[]) {
          if (oldStaff[id] === true || (oldStaff[id] as WorkerState)?.hired) {
            base.staff[id] = { hired: true, unpaidDays: 0, onStrike: false, lastPaidDay: 0 };
          }
        }
      }
      base.stoves = Math.min(3, Math.max(1, 1 + (base.upgrades['extra-stove'] ?? 0)));
      base.gameMinutes = 8 * 60;
      base.speed = 1;
      // Derive a reasonable seating capacity from their progress
      base.seatCapacity = Math.min(maxSeatsAtLevel(servedToLevel(base.served)), 5);
      base.version = 6;
      return base;
    }
    if (parsed.version !== 6 || !Number.isFinite(parsed.coins) || !Array.isArray(parsed.orders)) return freshSave();
    const base = freshSave();
    const merged = {
      ...base, ...parsed, version: 6,
      orders: parsed.orders.filter(id => !isSide(id)),
      inventory: { ...emptyInventory(), ...parsed.inventory },
      upgrades: { ...base.upgrades, ...parsed.upgrades },
      staff: { ...base.staff, ...parsed.staff },
      seatCapacity: Number.isFinite(parsed.seatCapacity) ? parsed.seatCapacity : 3,
    };
    merged.stoves = Math.min(3, Math.max(1, 1 + (merged.upgrades['extra-stove'] ?? 0)));
    return merged;
  } catch { return freshSave(); }
}

const PEOPLE: Omit<Customer, 'id' | 'order' | 'served' | 'pendingCoins' | 'patience' | 'haggles'>[] = [
  { name: 'Arif bhai', title: 'The friendly regular', kind: 'worker', maxPatience: 120, tip: 5 },
  { name: 'Noor', title: 'The college student', kind: 'student', maxPatience: 145, tip: 4 },
  { name: 'Mr. Sharma', title: 'The office-goer', kind: 'officer', maxPatience: 85, tip: 10 },
  { name: 'Sana', title: 'The afternoon regular', kind: 'student', maxPatience: 125, tip: 6 },
  { name: 'Iqbal chacha', title: 'The long-haul traveler', kind: 'traveler', maxPatience: 115, tip: 7 },
  { name: 'Ravi', title: 'The neighborhood cook', kind: 'regular', maxPatience: 110, tip: 5 },
];

const generateOrder = (available: OrderId[], level: number): OrderId[] => {
  const drinks = available.filter(o => RECIPES[o].category === 'drink');
  const foods = SIDE_IDS.filter(id => level >= SIDE_ITEMS[id].level);
  const drink = drinks.length ? drinks[Math.floor(Math.random() * drinks.length)] : 'classic';
  // At higher levels, increase chance of complex multi-item orders
  const complexChance = level >= 8 ? 0.25 : level >= 6 ? 0.1 : 0;
  if (foods.length >= 2 && Math.random() < complexChance) {
    const f1 = foods[Math.floor(Math.random() * foods.length)];
    let f2 = foods[Math.floor(Math.random() * foods.length)];
    while (f2 === f1) f2 = foods[Math.floor(Math.random() * foods.length)];
    return [drink, f1, f2];
  }
  // Food side-item probability increases with level
  const sideChance = level >= 6 ? 0.6 : level >= 4 ? 0.45 : level >= 2 ? 0.25 : 0;
  if (foods.length && Math.random() < sideChance) {
    const food = foods[Math.floor(Math.random() * foods.length)];
    return [drink, food];
  }
  return [drink];
};

const initialCustomers = (): Customer[] => [
  { id: 1, name: 'Arif bhai', title: 'The friendly regular', kind: 'worker', order: ['classic'], served: [], pendingCoins: 0, patience: 110, maxPatience: 120, tip: 5, haggles: false },
  { id: 2, name: 'Noor', title: 'The college student', kind: 'student', order: ['classic'], served: [], pendingCoins: 0, patience: 125, maxPatience: 145, tip: 4, haggles: false },
  { id: 3, name: 'Mr. Sharma', title: 'The office-goer', kind: 'officer', order: ['classic'], served: [], pendingCoins: 0, patience: 90, maxPatience: 120, tip: 10, haggles: false },
];

export const formatCoins = (n: number) => Math.round(n).toLocaleString('en-IN');

export function getHour(minutes: number): number { return Math.floor(minutes / 60) % 24; }
export function getMinute(minutes: number): number { return Math.floor(minutes % 60); }
export function isNight(minutes: number): boolean { const h = getHour(minutes); return h >= 20 || h < 6; }
export function isRushHour(minutes: number): boolean {
  const h = getHour(minutes);
  return (h >= 6 && h < 10) || (h >= 13 && h < 15) || (h >= 17 && h < 20);
}

export function calculatePenalty(order: OrderId[], served: OrderId[], level: number): number {
  if (served.length >= order.length) return 0;
  const scaleFactor = 1 + Math.floor(level / 5) * 0.15;
  if (served.length === 0) return Math.round(8 * scaleFactor);
  return Math.round(4 * scaleFactor);
}

// ─── CUSTOMER CAPACITY SCALING ────────────────────────────────────────────────
// Normal (non-rush): cap starts at seatCapacity, rush allows +2 more
export function getMaxCustomers(seatCapacity: number, isRush: boolean): number {
  return isRush ? seatCapacity + 2 : seatCapacity;
}

// Arrival interval in seconds: longer early, shorter later, respect rush hours
export function getArrivalInterval(level: number, isRush: boolean, hasEvent: boolean): number {
  if (hasEvent) return 4;
  // Base: starts at 22s, reduces every 2 levels, floor at 8s
  const base = Math.max(8, 22 - Math.floor(level / 2) * 2);
  return isRush ? Math.max(5, Math.round(base * 0.45)) : base;
}

export function useGame(uiPaused: boolean) {
  const [save, setSave] = useState<SaveData>(loadSave);
  const inventoryRef = useRef(save.inventory);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [stoves, setStoves] = useState<StoveState[]>(() => Array.from({ length: Math.max(1, save.stoves) }, () => makeStove()));
  const [activeStove, setActiveStove] = useState(0);
  const [cleanCups, setCleanCups] = useState(save.cupCapacity);
  const [dirtyCups, setDirtyCups] = useState(0);
  const [wash, setWash] = useState<{ active: boolean; progress: number; queued: number }>({ active: false, progress: 0, queued: 0 });
  const [gasFilling, setGasFilling] = useState<{ active: boolean; progress: number; targetKg: number }>({ active: false, progress: 0, targetKg: 0 });
  const [clock, setClock] = useState(0);
  const [manuallyPaused, setManuallyPaused] = useState(false);
  const [appBackgrounded, setAppBackgrounded] = useState(false); // NEW: background pause
  const [busyTask, setBusyTask] = useState<BusyTask>(null);
  const [toast, setToast] = useState<{ id: number; message: string; tone: 'success' | 'info'; action?: { label: string; onClick: () => void } } | null>(null);
  const [reward, setReward] = useState<{ id: number; amount: number } | null>(null);
  const [ingredientDrop, setIngredientDrop] = useState<{ id: number; ingredient: IngredientId } | null>(null);
  const [voiceQuote, setVoiceQuote] = useState<{ id: number; kind: 'good' | 'bad' | 'neutral' | 'slow'; text: string; side: 'left' | 'right' } | null>(null);
  const [upgradePulse, setUpgradePulse] = useState(0);
  const [bargain, setBargain] = useState<Customer | null>(null);
  const bargainItem = useRef<OrderId | null>(null);
  const [celebration, setCelebration] = useState<string | null>(null);
  const [showSalary, setShowSalary] = useState(false);
  const [levelUp, setLevelUp] = useState<{ level: number; id: number } | null>(null);
  const current = useRef(save);
  const queue = useRef(customers);
  const stovesRef = useRef(stoves);
  const currentStove = useRef(activeStove);
  const cleanCupsRef = useRef(cleanCups);
  const dirtyCupsRef = useRef(dirtyCups);
  const washRef = useRef(wash);
  const gasFillingRef = useRef(gasFilling);
  const busyTaskRef = useRef(busyTask);
  const serial = useRef(4);
  const audio = useRef<AudioContext | null>(null);
  const prevLevel = useRef(servedToLevel(save.served));
  current.current = save;
  inventoryRef.current = save.inventory;
  queue.current = customers;
  stovesRef.current = stoves;
  currentStove.current = activeStove;
  cleanCupsRef.current = cleanCups;
  dirtyCupsRef.current = dirtyCups;
  washRef.current = wash;
  gasFillingRef.current = gasFilling;
  busyTaskRef.current = busyTask;

  const level = servedToLevel(save.served);
  // Game is paused if: manually paused, UI overlay open (except shop), app backgrounded, bargain or celebration active
  const paused = manuallyPaused || uiPaused || appBackgrounded || Boolean(bargain) || Boolean(celebration);
  const boostActive = save.boostUntil > Date.now();
  const eventActive = save.eventUntil > Date.now();
  const location = LOCATIONS.find(l => l.id === save.activeLocation) ?? LOCATIONS[0];
  const hour = getHour(save.gameMinutes);
  const minute = getMinute(save.gameMinutes);
  const night = isNight(save.gameMinutes);
  const rushHour = isRushHour(save.gameMinutes);
  void wash.active;
  void gasFilling.active;

  const notify = useCallback((message: string, tone: 'success' | 'info' = 'success', action?: { label: string; onClick: () => void }) => {
    setToast({ id: Date.now(), message, tone, action });
  }, []);

  const playSound = useCallback((kind: 'coin' | 'brew' | 'add' | 'upgrade' | 'boil' | 'pour' | 'praise' | 'disappointed' | 'chatter' | 'walk' | 'birds' | 'celebrate') => {
    if (!current.current.sound) return;
    try {
      if (!audio.current) audio.current = new AudioContext();
      const ctx = audio.current;
      void ctx.resume();
      const master = ctx.createGain();
      master.gain.value = kind === 'birds' ? 0.3 : kind === 'celebrate' ? 0.5 : 0.6;
      master.connect(ctx.destination);
      const tone = (frequency: number, start: number, duration: number, volume: number, type: OscillatorType = 'sine') => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, start);
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(volume, start + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(start);
        oscillator.stop(start + duration + 0.05);
      };
      const noise = (start: number, duration: number, volume: number, filterType: BiquadFilterType, frequency: number, q = 1) => {
        const frameCount = Math.ceil(ctx.sampleRate * duration);
        const buffer = ctx.createBuffer(1, frameCount, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < frameCount; i++) data[i] = Math.random() * 2 - 1;
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = filterType;
        filter.frequency.value = frequency;
        filter.Q.value = q;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(volume, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        source.start(start);
        source.stop(start + duration);
      };
      const now = ctx.currentTime;
      if (kind === 'coin') [1046, 1568, 2093].forEach((frequency, index) => tone(frequency, now + index * 0.075, 0.22, 0.09, 'sine'));
      if (kind === 'brew') { tone(220, now, 0.42, 0.035, 'triangle'); noise(now + 0.08, 0.5, 0.035, 'highpass', 1800); }
      if (kind === 'add') tone(720, now, 0.12, 0.07, 'triangle');
      if (kind === 'upgrade') [523, 659, 784, 1046].forEach((frequency, index) => tone(frequency, now + index * 0.09, 0.3, 0.055, 'triangle'));
      if (kind === 'boil') { noise(now, 1.4, 0.035, 'bandpass', 850, 0.8); noise(now + 0.12, 1.2, 0.025, 'bandpass', 1450, 0.9); }
      if (kind === 'pour') { noise(now, 0.55, 0.045, 'bandpass', 950, 0.7); noise(now + 0.16, 0.4, 0.03, 'bandpass', 1500, 0.8); }
      if (kind === 'praise') { tone(392, now, 0.18, 0.055, 'triangle'); tone(494, now + 0.11, 0.2, 0.06, 'triangle'); tone(587, now + 0.22, 0.3, 0.07, 'triangle'); }
      if (kind === 'disappointed') { tone(330, now, 0.22, 0.055, 'sawtooth'); tone(277, now + 0.16, 0.34, 0.05, 'sawtooth'); }
      if (kind === 'chatter') { noise(now, 0.18, 0.018, 'bandpass', 1300, 0.9); noise(now + 0.22, 0.2, 0.018, 'bandpass', 950, 0.9); }
      if (kind === 'walk') noise(now, 0.12, 0.025, 'lowpass', 360, 0.6);
      if (kind === 'birds') { tone(2000, now, 0.08, 0.02, 'sine'); tone(2400, now + 0.1, 0.06, 0.015, 'sine'); tone(1800, now + 0.2, 0.1, 0.018, 'sine'); }
      if (kind === 'celebrate') { [523, 659, 784, 1046, 1318].forEach((f, i) => tone(f, now + i * 0.1, 0.35, 0.06, 'triangle')); noise(now + 0.5, 0.3, 0.03, 'highpass', 3000); }
    } catch { /* Audio optional */ }
  }, []);

  const sayVoiceQuote = useCallback((kind: 'good' | 'bad' | 'neutral' | 'slow') => {
    const positiveLines = ['The tea is fantastic!', 'Wah! Best chai in town.', 'Such good chai, bhai!', 'Mmm, garam and perfect!'];
    const neutralLines = ['Thanks for the chai.', 'Good tea, ekdum garam.', 'Nice cup! Keep it coming.'];
    const badLines = ['Arre, this tea is bad...', 'Too weak, bhai. Sorry.', 'This chai was a bit bad.', 'Not quite right...'];
    const slowLines = ['Your service is very slow.', 'Bhai, kitna wait karu?', 'Please serve faster!', 'The chai is getting cold!'];
    if (kind === 'good') playSound('praise');
    if (kind === 'bad') playSound('disappointed');
    if (kind === 'slow') playSound('disappointed');
    if (kind === 'neutral') playSound('chatter');
    const pool = kind === 'good' ? positiveLines : kind === 'bad' ? badLines : kind === 'slow' ? slowLines : neutralLines;
    setVoiceQuote({ id: Date.now(), kind, text: pool[Math.floor(Math.random() * pool.length)], side: Math.random() > 0.5 ? 'left' : 'right' });
  }, [playSound]);

  useEffect(() => {
    const unlockAudio = () => {
      try {
        if (!audio.current) {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
          audio.current = new AudioCtx();
        }
        if (audio.current && audio.current.state === 'suspended') {
          void audio.current.resume();
        }
      } catch { /* AudioContext optional */ }
    };
    window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    window.addEventListener('click', unlockAudio, { once: true });
    return () => {
      window.removeEventListener('touchstart', unlockAudio);
      window.removeEventListener('click', unlockAudio);
    };
  }, []);

  // ─── MOBILE BACKGROUND PAUSE (Capacitor appStateChange) ───────────────────
  // When the app is backgrounded, all timers stop because `paused` becomes true.
  // When resumed, timers restart from where they were — no elapsed time penalty.
  useEffect(() => {
    let removeListener: (() => void) | null = null;
    try {
      // Dynamically import Capacitor App plugin to avoid breaking web-only builds
      const { App: CapApp } = require('@capacitor/app') as { App: { addListener: (event: string, handler: (state: { isActive: boolean }) => void) => Promise<{ remove: () => void }> } };
      const promise = CapApp.addListener('appStateChange', (state: { isActive: boolean }) => {
        setAppBackgrounded(!state.isActive);
      });
      promise.then(handle => {
        removeListener = () => handle.remove();
      }).catch(() => {});
    } catch {
      // Not running inside Capacitor (web browser) — no-op, game runs normally
    }
    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  // ─── PAGE VISIBILITY API fallback (handles tab switching in browsers) ───────
  useEffect(() => {
    const handler = () => {
      setAppBackgrounded(document.hidden);
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ ...save, savedAt: Date.now() })); } catch { /* The game remains playable without local storage. */ }
  }, [save]);

  useEffect(() => {
    if (!toast) return;
    const timeout = window.setTimeout(() => setToast(null), actionTimeout(toast));
    return () => window.clearTimeout(timeout);
  }, [toast]);

  function actionTimeout(t: typeof toast) { return t?.action ? 8000 : 4000; }

  useEffect(() => {
    if (!reward) return;
    const timeout = window.setTimeout(() => setReward(null), 1700);
    return () => window.clearTimeout(timeout);
  }, [reward]);

  useEffect(() => {
    if (!ingredientDrop) return;
    const timeout = window.setTimeout(() => setIngredientDrop(null), 850);
    return () => window.clearTimeout(timeout);
  }, [ingredientDrop]);

  useEffect(() => {
    if (!voiceQuote) return;
    const timeout = window.setTimeout(() => setVoiceQuote(null), 2200);
    return () => window.clearTimeout(timeout);
  }, [voiceQuote]);

  useEffect(() => {
    if (!levelUp) return;
    const timeout = window.setTimeout(() => setLevelUp(null), 3000);
    return () => window.clearTimeout(timeout);
  }, [levelUp]);

  // Level up detection
  useEffect(() => {
    if (level > prevLevel.current) {
      setLevelUp({ level, id: Date.now() });
      playSound('celebrate');
      const newSides = SIDE_IDS.filter(id => SIDE_ITEMS[id].level > prevLevel.current && SIDE_ITEMS[id].level <= level);
      setCelebration(newSides.length ? `New Item Unlocked! ${newSides.map(id => RECIPES[id].name).join(', ')} is now in the Shop.` : `Level ${level}!`);
    }
    prevLevel.current = level;
  }, [level, playSound]);

  // Day/night cycle: game time advances based on speed
  useEffect(() => {
    if (paused) return;
    let last = performance.now();
    const iv = window.setInterval(() => {
      const now = performance.now();
      const dt = (now - last) / 1000;
      last = now;
      const speedMult = current.current.speed;
      const gameMinAdvance = dt * speedMult;
      setSave(s => {
        const newMinutes = s.gameMinutes + gameMinAdvance;
        const newDay = s.day + Math.floor(newMinutes / 1440);
        const dayChanged = newDay > s.day;
        if (dayChanged) {
          let newStaff = { ...s.staff };
          let totalSalaries = 0;
          for (const id of Object.keys(newStaff) as StaffId[]) {
            const w = newStaff[id];
            if (!w.hired) continue;
            totalSalaries += WORKERS.find(x => x.id === id)!.salary * w.unpaidDays;
            newStaff[id] = { ...w, unpaidDays: w.unpaidDays + 1 };
            if (newStaff[id].unpaidDays >= 3) {
              newStaff[id] = { ...newStaff[id], onStrike: true };
            }
          }
          const newCoins = Math.max(0, s.coins - totalSalaries);
          return { ...s, gameMinutes: newMinutes % 1440, day: newDay, dailyServed: 0, dailyClaimed: false, weather: newDay % 3 === 0 ? 'rainy' : 'sunny', coins: newCoins, staff: newStaff };
        }
        return { ...s, gameMinutes: newMinutes };
      });
    }, 100);
    return () => window.clearInterval(iv);
  }, [paused]);

  // Wash timer: game-minute based
  useEffect(() => {
    if (!wash.active) return;
    let lastGameMin = current.current.gameMinutes;
    const iv = window.setInterval(() => {
      if (current.current.speed === undefined) return; // safety
      const curGameMin = current.current.gameMinutes;
      const elapsed = curGameMin - lastGameMin;
      if (elapsed > 0) lastGameMin = curGameMin;
      setWash(w => {
        if (!w.active) return w;
        const totalGameMin = w.queued * WASH_MINUTES_PER_CUP;
        const p = Math.min(1, w.progress + elapsed / totalGameMin);
        if (p >= 1) {
          const q = w.queued;
          setDirtyCups(d => Math.max(0, d - q));
          setCleanCups(c => Math.min(current.current.cupCapacity, c + q));
          return { active: false, progress: 0, queued: 0 };
        }
        return { ...w, progress: p };
      });
    }, 200);
    return () => window.clearInterval(iv);
  }, [wash.active]);

  // Clear wash busyTask when washing completes
  useEffect(() => {
    if (!wash.active && busyTaskRef.current === 'wash') setBusyTask(null);
  }, [wash.active]);

  // Gas fill timer: 10 game-minutes
  useEffect(() => {
    if (!gasFilling.active) return;
    let lastGameMin = current.current.gameMinutes;
    const iv = window.setInterval(() => {
      const curGameMin = current.current.gameMinutes;
      const elapsed = curGameMin - lastGameMin;
      if (elapsed > 0) lastGameMin = curGameMin;
      setGasFilling(g => {
        if (!g.active) return g;
        const p = Math.min(1, g.progress + elapsed / GAS_FILL_MINUTES);
        if (p >= 1) {
          setSave(sv => ({ ...sv, gasKg: Math.min(sv.gasCapacityKg, sv.gasKg + g.targetKg) }));
          return { active: false, progress: 0, targetKg: 0 };
        }
        return { ...g, progress: p };
      });
    }, 200);
    return () => window.clearInterval(iv);
  }, [gasFilling.active]);

  // Clear gas busyTask when gas filling completes
  useEffect(() => {
    if (!gasFilling.active && busyTaskRef.current === 'gas') setBusyTask(null);
  }, [gasFilling.active]);

  // Stove brewing: game-minute based durations
  useEffect(() => {
    if (paused) return;
    let lastGameMin = current.current.gameMinutes;
    const iv = window.setInterval(() => {
      const curGameMin = current.current.gameMinutes;
      const elapsed = curGameMin - lastGameMin;
      if (elapsed <= 0) return;
      lastGameMin = curGameMin;
      const cur = current.current;
      const boost = cur.boostUntil > Date.now() ? 2 : 1;
      let changed = false;
      let gasUsed = 0;
      const nextStoves = stovesRef.current.map((s, idx) => {
        if (s.phase !== 'heating' && s.phase !== 'brewing') return s;
        const order = RECIPES[s.recipe];
        const potLevel = cur.upgrades.pot;
        const baseBrewMin = order.category === 'drink' ? (6 + potLevel * 2) : (4 + potLevel);
        const dur = (s.phase === 'heating' ? 1.5 : baseBrewMin) / boost;
        const progress = Math.min(100, s.progress + (elapsed / dur) * 100);
        if (progress < 100) { changed = true; return { ...s, progress }; }
        changed = true;
        if (s.phase === 'heating') {
          if (busyTaskRef.current === 'brew' && idx === currentStove.current) setBusyTask('add');
          return { ...s, phase: 'adding' as Phase, progress: 0 };
        }
        gasUsed += order.category === 'drink' ? 0.1 : 0.05;
        return { ...s, phase: 'ready' as Phase, progress: 0, cups: 2 + potLevel };
      });
      if (gasUsed > 0) setSave(sv => ({ ...sv, gasKg: Math.max(0, sv.gasKg - gasUsed) }));
      if (changed) setStoves(nextStoves);
    }, 200);
    return () => window.clearInterval(iv);
  }, [paused]);

  // Customer arrival with rush hours — uses level-scaled caps and intervals
  useEffect(() => {
    if (paused) return;
    let arrival = 0;
    let walkTimer = 0;
    let birdTimer = 0;
    const iv = window.setInterval(() => {
      const cur = current.current;
      const speedMult = cur.speed;
      walkTimer += speedMult;
      if (walkTimer >= 5) { walkTimer = 0; playSound('walk'); }
      if (!isNight(cur.gameMinutes) && cur.sound) {
        birdTimer += speedMult;
        if (birdTimer >= 30 + Math.random() * 30) { birdTimer = 0; playSound('birds'); }
      }
      setClock(c => c + speedMult);
      if (!cur.tutorialDone) return;
      const oldQueue = queue.current;
      const patienceDecay = speedMult * (cur.weather === 'rainy' ? 0.85 : 1);
      const next = oldQueue.map(c => {
        const newPatience = c.patience - patienceDecay;
        if (newPatience < c.maxPatience * 0.3 && c.patience >= c.maxPatience * 0.3) sayVoiceQuote('slow');
        return { ...c, patience: newPatience };
      });
      const expired = next.filter(c => c.patience <= 0);
      let remaining = next.filter(c => c.patience > 0);
      if (expired.length) {
        const lv = servedToLevel(cur.served);
        const penalty = expired.reduce((sum, c) => sum + calculatePenalty(c.order, c.served, lv), 0);
        setSave(s => ({ ...s, coins: Math.max(0, s.coins - penalty), missed: s.missed + expired.length, rating: Math.max(1, s.rating - expired.length * 0.06) }));
        const partial = expired.filter(c => c.served.length > 0).length;
        if (partial > 0) notify(`${expired[0].name} left with an incomplete order. -${penalty} coins`, 'info');
        else notify(`${expired[0].name} left. -${penalty} coins`, 'info');
      }
      arrival += speedMult;
      const lv = servedToLevel(cur.served);
      const isRush = isRushHour(cur.gameMinutes);
      const hasEvent = cur.eventUntil > Date.now();
      const maxCustomers = getMaxCustomers(cur.seatCapacity, isRush);
      const arrivalInterval = getArrivalInterval(lv, isRush, hasEvent);
      if (arrival >= arrivalInterval && remaining.length < maxCustomers) {
        arrival = 0;
        const person = PEOPLE[Math.floor(Math.random() * PEOPLE.length)];
        const available = cur.orders;
        const order = generateOrder(available, lv);
        const id = serial.current++;
        remaining = [...remaining, { ...person, id, order, served: [], pendingCoins: 0, patience: person.maxPatience, haggles: id % 7 === 0 }];
      }
      queue.current = remaining;
      setCustomers(remaining);
    }, 1000);
    return () => window.clearInterval(iv);
  }, [paused, notify, playSound, sayVoiceQuote]);

  const selectStove = useCallback((index: number) => {
    if (index < 0 || index >= stovesRef.current.length) return false;
    currentStove.current = index;
    setActiveStove(index);
    const s = stovesRef.current[index];
    if (s.phase === 'adding') setBusyTask('add');
    else if (s.phase === 'heating') setBusyTask('brew');
    else setBusyTask(null);
    return true;
  }, []);

  const selectRecipe = useCallback((id: OrderId) => {
    if (isSide(id)) return false;
    if (!current.current.orders.includes(id)) return false;
    const idx = currentStove.current;
    if (stovesRef.current[idx].phase !== 'idle') { notify('Finish this batch before switching.', 'info'); return true; }
    setStoves(prev => prev.map((x, i) => i === idx ? { ...x, recipe: id } : x));
    return true;
  }, [notify]);

  const startBrew = useCallback(() => {
    const idx = currentStove.current;
    const s = stovesRef.current[idx];
    if (s.phase !== 'idle' || isSide(s.recipe)) return;
    if (busyTaskRef.current && busyTaskRef.current !== 'brew') { notify(`You're busy with ${busyTaskRef.current}. Wait!`, 'info'); return; }
    const order = RECIPES[s.recipe];
    const gasNeed = order.category === 'drink' ? 0.1 : 0.05;
    if (current.current.gasKg < gasNeed && !gasFilling.active) {
      notify('Gas is empty! Buy gas to continue.', 'info', { label: 'Buy Gas', onClick: () => buyGas(1) });
      return;
    }
    if (gasFilling.active) { notify('Gas is filling. Wait a moment!', 'info'); return; }
    const firstPhase: Phase = order.category === 'food' ? 'adding' : 'heating';
    setStoves(prev => prev.map((x, i) => i === idx ? { ...x, phase: firstPhase, ingredients: [], progress: 0, cups: 0 } : x));
    setBusyTask(firstPhase === 'adding' ? 'add' : 'brew');
    playSound('brew');
  }, [notify, playSound]);

  const addIngredient = useCallback((id: IngredientId) => {
    const idx = currentStove.current;
    const s = stovesRef.current[idx];
    if (s.phase !== 'adding') {
      if (s.phase === 'idle') notify('First things first: tap Brew to start.', 'info');
      else if (s.phase === 'heating') notify('Water is still heating. Ingredients will unlock soon.', 'info');
      return;
    }
    if (busyTaskRef.current && busyTaskRef.current !== 'add') { notify(`You're busy with ${busyTaskRef.current}. Wait!`, 'info'); return; }
    const order = RECIPES[s.recipe];
    if (s.ingredients.includes(id) || !order.ingredients.includes(id)) return;
    const next = [...s.ingredients, id];
    setStoves(prev => prev.map((x, i) => i === idx ? { ...x, ingredients: next } : x));
    setIngredientDrop({ id: Date.now(), ingredient: id });
    playSound('add');
    sayVoiceQuote('neutral');
    if (order.ingredients.every(i => next.includes(i))) {
      setStoves(prev => prev.map((x, i) => i === idx ? { ...x, phase: 'brewing', progress: 0 } : x));
      playSound('boil');
    }
  }, [notify, playSound, sayVoiceQuote]);

  const discardBatch = useCallback(() => {
    const idx = currentStove.current;
    setStoves(prev => prev.map((x, i) => i === idx ? { ...x, phase: 'idle', cups: 0, ingredients: [], progress: 0 } : x));
    setBusyTask(null);
    notify('A fresh pot, a fresh start.', 'info');
  }, [notify]);

  const serveCustomer = useCallback((customerId?: number, itemId?: OrderId, priceMultiplier = 1) => {
    const customer = queue.current[0];
    if (!customer) { notify('No one is waiting right now.', 'info'); return; }
    if (customerId != null && customer.id !== customerId) { notify(`Finish ${customer.name}'s order first. The queue moves in order.`, 'info'); return; }
    const outstanding = customer.order.filter(id => !customer.served.includes(id));
    const item = itemId ?? stovesRef.current[currentStove.current]?.recipe;
    if (!item || !outstanding.includes(item)) {
      notify(`Waiting for ${outstanding.map(id => RECIPES[id].name).join(' + ')}...`, 'info');
      return;
    }
    const lv = servedToLevel(current.current.served);
    const side = isSide(item);
    const idx = side ? -1 : stovesRef.current.findIndex(s => s.recipe === item && s.phase === 'ready' && s.cups > 0);
    if (side) {
      if (lv < SIDE_ITEMS[item].level) { notify(`${RECIPES[item].name} unlocks at level ${SIDE_ITEMS[item].level}.`, 'info'); return; }
      if ((inventoryRef.current[item] ?? 0) <= 0) { notify(`${RECIPES[item].name} out of stock! Restock in the Shop.`, 'info'); return; }
    } else {
      if (idx < 0) { notify(`${RECIPES[item].name} isn't ready yet.`, 'info'); return; }
      if (cleanCupsRef.current <= 0) { notify('Out of clean cups! Wash them at the sink.', 'info'); return; }
    }
    if (!side && outstanding.length === 1 && customer.haggles && priceMultiplier === 1) { setBargain(customer); bargainItem.current = item; return; }

    const sv = current.current;
    const happy = customer.patience / customer.maxPatience > 0.3;
    const eventBonus = sv.eventUntil > Date.now() ? 1.5 : 1;
    const locationBonus = 1 + LOCATIONS.findIndex(l => l.id === sv.activeLocation) * 0.2;
    const rainBonus = sv.weather === 'rainy' && item !== 'lassi' ? 1.25 : sv.weather === 'sunny' && item === 'lassi' ? 1.2 : 1;
    const itemValue = side ? SIDE_ITEMS[item].sellValue : Math.round((RECIPES[item].price + sv.upgrades.quality * 5) * rainBonus * eventBonus * locationBonus);
    const newServed = [...customer.served, item];
    const completed = customer.order.every(id => newServed.includes(id));
    const earned = completed ? Math.round((customer.pendingCoins + itemValue + (happy ? customer.tip + sv.upgrades.decor * 2 : 0)) * priceMultiplier) : 0;
    queue.current = completed ? queue.current.slice(1) : [{ ...customer, served: newServed, pendingCoins: customer.pendingCoins + itemValue }, ...queue.current.slice(1)];
    setCustomers(queue.current);
    if (side) {
      inventoryRef.current = { ...inventoryRef.current, [item]: inventoryRef.current[item] - 1 };
      setSave(previous => ({ ...previous, inventory: { ...previous.inventory, [item]: Math.max(0, previous.inventory[item] - 1) } }));
    } else {
      const stove = stovesRef.current[idx];
      const remainingCups = stove.cups - 1;
      stovesRef.current = stovesRef.current.map((s, i) => i === idx ? { ...s, cups: remainingCups, phase: remainingCups <= 0 ? 'idle' : 'ready', ingredients: remainingCups <= 0 ? [] : s.ingredients } : s);
      setStoves(stovesRef.current);
      setCleanCups(c => c - 1);
      setDirtyCups(d => d + 1);
      if (busyTaskRef.current === 'brew' || busyTaskRef.current === 'add') setBusyTask(null);
    }
    if (completed) {
      setSave(previous => ({ ...previous, coins: previous.coins + earned, revenue: previous.revenue + earned, served: previous.served + 1, dailyServed: previous.dailyServed + 1, happy: previous.happy + (happy ? 1 : 0), rating: Math.min(5, previous.rating + (happy ? 0.008 : -0.01)), tutorialDone: true }));
      setReward({ id: Date.now(), amount: earned });
      playSound('coin');
      sayVoiceQuote(happy ? 'good' : 'bad');
      if (!sv.tutorialDone) notify('Wah, what a complete order! Your chai journey has begun.');
    } else {
      notify(`Waiting for ${customer.order.filter(id => !newServed.includes(id)).map(id => RECIPES[id].name).join(' + ')}...`, 'info');
    }
  }, [notify, playSound, sayVoiceQuote]);

  const startWash = useCallback(() => {
    if (washRef.current.active || dirtyCupsRef.current <= 0) return;
    if (busyTaskRef.current && busyTaskRef.current !== 'wash') { notify(`You're busy with ${busyTaskRef.current}. Wait!`, 'info'); return; }
    setWash(w => ({ ...w, active: true, progress: 0, queued: dirtyCupsRef.current }));
    setBusyTask('wash');
  }, [notify]);

  useEffect(() => {
    const washer = save.staff.washer;
    if (!washer.hired || washer.onStrike || paused || dirtyCups <= 0 || wash.active) return;
    if (busyTaskRef.current === 'wash') return;
    startWash();
  }, [paused, dirtyCups, wash.active, save.staff.washer, startWash]);

  const washCups = useCallback(() => { startWash(); }, [startWash]);

  const buyGas = useCallback((kg: number) => {
    const tierIdx = GAS_TIERS.indexOf(kg);
    if (tierIdx < 0) return;
    const lv = servedToLevel(current.current.served);
    if (lv < GAS_LEVELS[tierIdx]) { notify(`Reach level ${GAS_LEVELS[tierIdx]} for ${kg} kg gas tanks.`, 'info'); return; }
    const cost = GAS_PRICE * kg;
    if (current.current.coins < cost) { notify(`Gas costs ${cost} coins. Save up!`, 'info'); return; }
    if (gasFilling.active) { notify('Gas is already filling!', 'info'); return; }
    setSave(s => ({ ...s, coins: s.coins - cost, gasCapacityKg: Math.max(s.gasCapacityKg, kg) }));
    setGasFilling({ active: true, progress: 0, targetKg: kg });
    setBusyTask('gas');
    notify('Gas is filling...', 'info');
  }, [notify]);

  useEffect(() => {
    if (!gasFilling.active) return;
    if (gasFilling.progress >= 1) {
      setBusyTask(null);
    }
  }, [gasFilling.active, gasFilling.progress]);

  const buyCupUpgrade = useCallback(() => {
    const idx = CUP_TIERS.indexOf(save.cupCapacity);
    const next = CUP_TIERS[idx + 1];
    if (!next) return;
    const lv = servedToLevel(current.current.served);
    if (lv < CUP_LEVELS[idx + 1]) { notify(`Reach level ${CUP_LEVELS[idx + 1]} for more cups.`, 'info'); return; }
    const cost = CUP_COSTS[idx + 1];
    if (current.current.coins < cost) { notify(`More cups cost ${cost} coins.`, 'info'); return; }
    setSave(s => ({ ...s, coins: s.coins - cost, cupCapacity: next }));
    setCleanCups(c => c + (next - save.cupCapacity));
    notify(`You now have ${next} cups. Shabaash!`);
  }, [notify, save.cupCapacity]);

  const buyUpgrade = useCallback((id: UpgradeId) => {
    if (id === 'seating') {
      // Handled separately
      return;
    }
    const item = UPGRADES.find(u => u.id === id)!;
    const currentLevel = current.current.upgrades[id] ?? 0;
    if (currentLevel >= item.max) return;
    const reqLevel = id === 'extra-stove' ? (currentLevel === 0 ? 7 : 11) : (item.level ?? 2);
    const lv = servedToLevel(current.current.served);
    if (lv < reqLevel) { notify(`Reach level ${reqLevel} for this upgrade.`, 'info'); return; }
    const cost = id === 'extra-stove' ? (currentLevel === 0 ? 550 : 1200) : (item.cost ?? item.baseCost * (currentLevel + 1));
    if (current.current.coins < cost) { notify('A few more cups and this upgrade is yours.', 'info'); return; }
    const nextLevel = currentLevel + 1;
    const nextStoves = id === 'extra-stove' ? Math.min(3, 1 + nextLevel) : current.current.stoves;
    setSave(s => ({ ...s, coins: s.coins - cost, upgrades: { ...s.upgrades, [id]: nextLevel }, stoves: nextStoves }));
    if (id === 'extra-stove') setStoves(prev => [...prev, makeStove()]);
    setUpgradePulse(p => p + 1);
    playSound('upgrade');
    const celebrationName = id === 'extra-stove' ? (currentLevel === 0 ? 'Second Stove' : 'Third Stove') : `${item.name}, level ${nextLevel}`;
    setCelebration(celebrationName);
    notify(`${celebrationName} unlocked! Looking good!`);
  }, [notify, playSound]);

  // ─── BUY SEATING UPGRADE ──────────────────────────────────────────────────
  const buySeating = useCallback(() => {
    const sv = current.current;
    const lv = servedToLevel(sv.served);
    const next = SEATING_UPGRADES.find(s => s.seats > sv.seatCapacity);
    if (!next) { notify('Your thela is at maximum seating!', 'info'); return; }
    if (lv < next.requiredLevel) { notify(`Reach level ${next.requiredLevel} to add more seats.`, 'info'); return; }
    if (sv.coins < next.cost) { notify(`${next.seats} seats costs ${next.cost} coins.`, 'info'); return; }
    setSave(s => ({ ...s, coins: s.coins - next.cost, seatCapacity: next.seats }));
    playSound('upgrade');
    notify(`${next.seats} seats now! More chai for more people.`);
    setCelebration(`${next.seats} Seats Unlocked!`);
  }, [notify, playSound]);

  const unlockRecipe = useCallback((id: OrderId) => {
    if (isSide(id)) return;
    if (current.current.orders.includes(id)) return;
    const order = RECIPES[id];
    const lv = servedToLevel(current.current.served);
    if (lv < order.level) { notify(`Reach level ${order.level} to unlock ${order.name}.`, 'info'); return; }
    if (current.current.coins < order.cost) { notify(`${order.name} costs ${order.cost} coins.`, 'info'); return; }
    setSave(s => ({ ...s, coins: s.coins - order.cost, orders: [...s.orders, id] }));
    setCelebration(`${order.name} unlocked!`);
    playSound('celebrate');
    notify(`${order.name} is on the menu!`);
  }, [notify, playSound]);

  const buySideStock = useCallback((id: SideId) => {
    const item = SIDE_ITEMS[id];
    const lv = servedToLevel(current.current.served);
    if (lv < item.level) { notify(`${RECIPES[id].name} unlocks at level ${item.level}.`, 'info'); return; }
    if (current.current.coins < item.buyPrice) { notify(`Not enough coins for ${RECIPES[id].name} stock. Need ${item.buyPrice}.`, 'info'); return; }
    inventoryRef.current = { ...inventoryRef.current, [id]: inventoryRef.current[id] + item.quantity };
    setSave(s => ({ ...s, coins: s.coins - item.buyPrice, inventory: { ...s.inventory, [id]: s.inventory[id] + item.quantity } }));
    playSound('upgrade');
    notify(`Restocked ${item.quantity} ${RECIPES[id].name}.`);
  }, [notify, playSound]);

  const hireStaff = useCallback((id: StaffId) => {
    const person = WORKERS.find(p => p.id === id)!;
    if (current.current.staff[id].hired) return;
    if (current.current.served < person.requires) { notify(`Serve ${person.requires} customers to meet ${person.name}.`, 'info'); return; }
    if (current.current.coins < person.cost) { notify(`Save ${formatCoins(person.cost)} coins to welcome ${person.name}.`, 'info'); return; }
    setSave(s => ({ ...s, coins: s.coins - person.cost, staff: { ...s.staff, [id]: { ...freshWorker(), hired: true } } }));
    setCelebration(`${person.name} joined the team!`);
    playSound('celebrate');
    notify(`${person.name} is part of the family.`);
  }, [notify, playSound]);

  const paySalary = useCallback((id: StaffId) => {
    const worker = WORKERS.find(p => p.id === id)!;
    const state = current.current.staff[id];
    if (!state.hired || state.unpaidDays <= 0) return;
    const totalDue = worker.salary * state.unpaidDays;
    if (current.current.coins < totalDue) { notify(`Salary for ${worker.name} costs ${totalDue} coins.`, 'info'); return; }
    setSave(s => ({
      ...s, coins: s.coins - totalDue,
      staff: { ...s.staff, [id]: { ...s.staff[id], unpaidDays: 0, onStrike: false, lastPaidDay: s.day } },
    }));
    notify(`${worker.name} paid ${totalDue} coins. Shukriya!`);
  }, [notify]);

  const payAllSalaries = useCallback(() => {
    let totalDue = 0;
    for (const id of Object.keys(current.current.staff) as StaffId[]) {
      const w = current.current.staff[id];
      if (w.hired && w.unpaidDays > 0) totalDue += WORKERS.find(p => p.id === id)!.salary * w.unpaidDays;
    }
    if (totalDue === 0) { notify('No outstanding salaries.', 'info'); return; }
    if (current.current.coins < totalDue) { notify(`Total salaries due: ${totalDue} coins. Save up!`, 'info'); return; }
    setSave(s => {
      const newStaff = { ...s.staff };
      for (const id of Object.keys(newStaff) as StaffId[]) {
        if (newStaff[id].hired && newStaff[id].unpaidDays > 0) {
          newStaff[id] = { ...newStaff[id], unpaidDays: 0, onStrike: false, lastPaidDay: s.day };
        }
      }
      return { ...s, coins: s.coins - totalDue, staff: newStaff };
    });
    notify(`All salaries paid: ${totalDue} coins.`);
  }, [notify]);

  const clearSalariesFree = useCallback(() => {
    setSave(s => {
      const newStaff = { ...s.staff };
      for (const id of Object.keys(newStaff) as StaffId[]) {
        if (newStaff[id].hired && newStaff[id].unpaidDays > 0) {
          newStaff[id] = { ...newStaff[id], unpaidDays: 0, onStrike: false, lastPaidDay: s.day };
        }
      }
      return { ...s, staff: newStaff };
    });
    playSound('celebrate');
    notify('Worker salaries cleared by video ad! Your team is happy.', 'success');
  }, [notify, playSound]);

  const addCoins = useCallback((amount: number, reason = 'Video ad reward') => {
    setSave(s => ({ ...s, coins: s.coins + amount }));
    setReward({ id: Date.now(), amount });
    playSound('coin');
    notify(`+${amount} coins earned! ${reason}`, 'success');
  }, [notify, playSound]);

  const setSpeed = useCallback((speed: 1 | 2 | 3) => {
    setSave(s => ({ ...s, speed }));
  }, []);

  const openLocation = useCallback((id: LocationId) => {
    const place = LOCATIONS.find(l => l.id === id)!;
    if (current.current.locations.includes(id)) { setSave(s => ({ ...s, activeLocation: id })); return true; }
    if (current.current.revenue < place.revenue) { notify(`Earn ${formatCoins(place.revenue)} lifetime coins.`, 'info'); return false; }
    if (current.current.coins < place.cost) { notify(`Opening this spot takes ${formatCoins(place.cost)} coins.`, 'info'); return false; }
    setSave(s => ({ ...s, coins: s.coins - place.cost, locations: [...s.locations, id], activeLocation: id }));
    setCelebration(place.name);
    playSound('celebrate');
    return true;
  }, [notify, playSound]);

  const claimDaily = useCallback(() => {
    if (save.dailyServed < 20 || save.dailyClaimed) return;
    setSave(s => ({ ...s, coins: s.coins + 200, dailyClaimed: true }));
    setReward({ id: Date.now(), amount: 200 });
    playSound('coin');
    notify('Twenty cups, twenty little moments of joy. +200 coins!');
  }, [save.dailyServed, save.dailyClaimed, notify, playSound]);

  const claimAchievement = useCallback((id: string) => {
    const achievement = ACHIEVEMENTS.find(a => a.id === id);
    if (!achievement || save.claimedAchievements.includes(id) || achievement.progress(save) < achievement.target) return;
    setSave(s => ({ ...s, coins: s.coins + achievement.reward, claimedAchievements: [...s.claimedAchievements, id] }));
    setCelebration(`${achievement.title}!`);
    playSound('celebrate');
    notify(`${achievement.title}! +${achievement.reward} coins.`);
  }, [save.claimedAchievements, notify, playSound]);

  const setWeather = useCallback((weather: 'sunny' | 'rainy') => {
    setSave(s => ({ ...s, weather }));
    notify(weather === 'rainy' ? 'Monsoon magic! Hot chai now earns 25% more.' : 'Hello, sunshine.', 'info');
  }, [notify]);

  const activateBoost = useCallback(() => {
    setSave(s => ({ ...s, boostUntil: Date.now() + 120000 }));
    notify('A little second wind: double brewing speed for 2 minutes!');
  }, [notify]);

  const startEvent = useCallback(() => {
    if (current.current.eventUntil > Date.now()) return;
    setSave(s => ({ ...s, eventUntil: Date.now() + 60000 }));
    notify('The match is on! More customers and 50% bonus for 60 seconds.');
  }, [notify]);

  const changeSkin = useCallback(() => {
    if (!save.festivalOwned && save.coins < 600) { notify('Save 600 coins for a little festive sparkle.', 'info'); return; }
    setSave(s => ({ ...s, coins: s.coins - (s.festivalOwned ? 0 : 600), festivalOwned: true, skin: s.skin === 'festival' ? 'classic' : 'festival' }));
    setUpgradePulse(p => p + 1);
    notify(save.skin === 'festival' ? 'Back to that classic charm.' : 'Your thela is dressed for a celebration!');
  }, [save.festivalOwned, save.coins, save.skin, notify]);

  const resetGame = useCallback(() => {
    const fresh = freshSave();
    setSave(fresh);
    const initial = initialCustomers();
    setCustomers(initial);
    queue.current = initial;
    setStoves(Array.from({ length: fresh.stoves }, () => makeStove()));
    currentStove.current = 0;
    setActiveStove(0);
    setCleanCups(fresh.cupCapacity);
    setDirtyCups(0);
    setWash({ active: false, progress: 0, queued: 0 });
    setGasFilling({ active: false, progress: 0, targetKg: 0 });
    setClock(0);
    setShowSalary(false);
    setLevelUp(null);
    setManuallyPaused(false);
    setAppBackgrounded(false);
    notify('A fresh start. Your little chai dream is waiting.');
  }, [notify]);

  // Staff automation
  useEffect(() => {
    if (paused) return;
    const timers: number[] = [];
    const idx = currentStove.current;
    const s = stovesRef.current[idx];
    const st = save.staff;
    const head = customers[0];
    const cashierItem = head?.order.find(id => !head.served.includes(id) && (
      isSide(id) ? inventoryRef.current[id] > 0 : cleanCupsRef.current > 0 && stovesRef.current.some(pot => pot.recipe === id && pot.phase === 'ready' && pot.cups > 0)
    ));
    if (s.phase === 'adding' && st.helper.hired && !st.helper.onStrike) {
      const next = RECIPES[s.recipe].ingredients.find(i => !s.ingredients.includes(i));
      if (next) timers.push(window.setTimeout(() => addIngredient(next), 500));
    }
    if (st.cashier.hired && !st.cashier.onStrike && head && cashierItem) {
      timers.push(window.setTimeout(() => serveCustomer(head.id, cashierItem), 700));
    }
    if (s.phase === 'idle' && st.cook.hired && !st.cook.onStrike && head) {
      const nextRecipe = head.order.find(i => !head.served.includes(i) && !isSide(i) && save.orders.includes(i));
      if (nextRecipe && !stovesRef.current.some(pot => pot.recipe === nextRecipe && pot.phase !== 'idle')) {
        if (s.recipe !== nextRecipe) setStoves(prev => prev.map((x, i) => i === idx ? { ...x, recipe: nextRecipe } : x));
        timers.push(window.setTimeout(startBrew, 650));
      }
    }
    if (st.gasman.hired && !st.gasman.onStrike && save.gasKg < 0.2 && save.coins >= GAS_PRICE && !gasFilling.active) {
      timers.push(window.setTimeout(() => {
        setSave(sv => ({ ...sv, coins: sv.coins - GAS_PRICE, gasKg: Math.min(sv.gasCapacityKg, sv.gasKg + 1) }));
      }, 2000));
    }
    return () => timers.forEach(timer => window.clearTimeout(timer));
  }, [paused, save.staff, save.orders, save.inventory, save.gasKg, save.coins, customers, addIngredient, startBrew, serveCustomer, gasFilling.active]);

  // Clear busy task when stove is ready (brew or add both need clearing)
  useEffect(() => {
    const s = stovesRef.current[currentStove.current];
    if (s.phase === 'ready' && (busyTaskRef.current === 'brew' || busyTaskRef.current === 'add')) {
      setBusyTask(null);
    }
  }, [stoves, activeStove]);

  const gasInfo = {
    kg: save.gasKg,
    capacityKg: save.gasCapacityKg,
    tiers: GAS_TIERS.map((kg, i) => ({ kg, cost: GAS_PRICE * kg, level: GAS_LEVELS[i], locked: level < GAS_LEVELS[i] })),
  };
  const cupInfo = {
    capacity: save.cupCapacity,
    tiers: CUP_TIERS.map((c, i) => ({ capacity: c, cost: CUP_COSTS[i], level: CUP_LEVELS[i], current: save.cupCapacity === c, locked: level < CUP_LEVELS[i] })),
  };

  const totalSalariesDue = Object.entries(save.staff).reduce((sum, [id, w]) => {
    if (!w.hired || w.unpaidDays <= 0) return sum;
    return sum + WORKERS.find(p => p.id === id as StaffId)!.salary * w.unpaidDays;
  }, 0);

  const anySalariesDue = totalSalariesDue > 0;

  // Seating info: next purchasable upgrade
  const nextSeating = SEATING_UPGRADES.find(s => s.seats > save.seatCapacity);
  const seatingInfo = {
    current: save.seatCapacity,
    next: nextSeating,
    maxAtCurrentLevel: maxSeatsAtLevel(level),
    canBuyNext: nextSeating ? level >= nextSeating.requiredLevel && save.coins >= nextSeating.cost : false,
  };

  return {
    save, customers, stoves, activeStove, cleanCups, dirtyCups, wash, gasFilling, gasInfo, cupInfo,
    clock, level, manuallyPaused, paused, appBackgrounded, hour, minute, night, rushHour,
    toast, reward, ingredientDrop, voiceQuote, upgradePulse, bargain, celebration, boostActive, eventActive, location,
    showSalary, totalSalariesDue, anySalariesDue, levelUp, busyTask,
    seatingInfo,
    notify, startBrew, discardBatch, addIngredient, serveCustomer, selectRecipe, selectStove, buyUpgrade, unlockRecipe, buySideStock,
    hireStaff, paySalary, payAllSalaries, clearSalariesFree, addCoins, setSpeed, openLocation, claimDaily, claimAchievement, setWeather, activateBoost, startEvent,
    changeSkin, resetGame, washCups, buyGas, buyCupUpgrade, buySeating,
    toggleSalary: () => setShowSalary(s => !s),
    dismissToast: () => setToast(null),
    togglePause: () => setManuallyPaused(p => !p),
    toggleSound: () => setSave(s => ({ ...s, sound: !s.sound })),
    settleBargain: (success: boolean) => { if (bargain && bargainItem.current) serveCustomer(bargain.id, bargainItem.current, success ? 1.2 : 0.85); bargainItem.current = null; setBargain(null); notify(success ? 'A fair deal and a happy customer!' : 'A little discount, a little goodwill.', success ? 'success' : 'info'); },
    closeCelebration: () => setCelebration(null),
  };
}

export type Game = ReturnType<typeof useGame>;
