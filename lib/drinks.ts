// ──────────────────────────────────────────────
// 沁涼飲 QIN LIANG YIN — 菜單資料
//
// 品項與價格依店家菜單照片 (115 夏天版) 整理，單一杯型 (L)。
// ⚠️ 價格若有出入，直接改這個檔案的數字即可。
// ──────────────────────────────────────────────

// 店家基本資訊
export const SHOP = {
  name: "沁涼飲",
  nameEn: "QIN LIANG YIN",
  slogan: "真材實料・清爽每一刻",
  phone: "(04)887-5077",
  address: "彰化縣北斗鎮復興路251號",
  logo: "/images/drinks/logo.jpeg",
  banner: "/images/drinks/smoothie-banner.jpeg",
  notice: "現點現做・清涼順口｜尖峰時段約需等候 10–15 分鐘",
};

// ── 品牌配色 (供需要 JS 動態套色的地方使用) ──
export const THEME = {
  blue: "#1AA0DC",
  blueDark: "#0B79B4",
  blueLight: "#E8F6FC",
  blueBorder: "#BCE6F5",
  green: "#6FB23F",
  cream: "#FBF7EE",
  ink: "#1F3A4D",
  muted: "#6E8A99",
};

// ── 飲料分類 (依菜單系列) ──
export const CATEGORIES = [
  { id: "tea", label: "原味茶系列" },
  { id: "green", label: "綠茶系列" },
  { id: "smoothie", label: "冰沙系列" },
  { id: "milk", label: "鮮奶系列" },
  { id: "flavor", label: "調味系列" },
  { id: "lemon", label: "檸檬原汁系列" },
  { id: "classic", label: "古早味系列" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

// ── 飲料品項 ──
export interface Drink {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  emoji: string;
  note?: string; // 例如「不調甜度」
}

export const DRINKS: Drink[] = [
  // 原味茶系列
  { id: "black-tea-classic", name: "古早味紅茶", category: "tea", price: 25, emoji: "🫖" },
  { id: "wintermelon",       name: "冬瓜茶",     category: "tea", price: 25, emoji: "🟤", note: "不調甜度" },
  { id: "barley-tea",        name: "麥茶",       category: "tea", price: 25, emoji: "🌾" },
  { id: "barley-green",      name: "麥香綠茶",   category: "tea", price: 25, emoji: "🍃" },
  { id: "grass-tea",         name: "仙草千年茶", category: "tea", price: 25, emoji: "🌿" },
  { id: "roselle",           name: "洛神花茶",   category: "tea", price: 25, emoji: "🌺", note: "不調甜度" },
  { id: "honey-tea",         name: "蜜茶",       category: "tea", price: 30, emoji: "🍯" },
  { id: "barley-black",      name: "麥香紅茶",   category: "tea", price: 25, emoji: "🫖" },
  { id: "wm-green",          name: "冬瓜青茶",   category: "tea", price: 25, emoji: "🟤" },
  { id: "wm-black-green",    name: "冬瓜紅/綠茶", category: "tea", price: 25, emoji: "🟤" },
  { id: "wm-grass",          name: "冬瓜仙草甘茶", category: "tea", price: 25, emoji: "🌿" },
  { id: "oolong",            name: "烏龍茶",     category: "tea", price: 25, emoji: "🍵" },
  { id: "green-tea",         name: "綠茶",       category: "tea", price: 25, emoji: "🍵" },
  { id: "qing-tea",          name: "青茶",       category: "tea", price: 25, emoji: "🍃" },

  // 綠茶系列
  { id: "green-milk",     name: "綠茶鮮奶",      category: "green", price: 45, emoji: "🥛" },
  { id: "passion-green",  name: "百香綠茶",      category: "green", price: 45, emoji: "🟡" },
  { id: "honey-green",    name: "蜂蜜綠茶",      category: "green", price: 35, emoji: "🍯" },
  { id: "plum-green",     name: "梅子綠茶",      category: "green", price: 40, emoji: "🟣" },
  { id: "lemon-green",    name: "檸檬綠茶",      category: "green", price: 40, emoji: "🍋" },
  { id: "peach-green",    name: "水蜜桃綠/青茶", category: "green", price: 40, emoji: "🍑" },
  { id: "passion-yakult", name: "百香多多",      category: "green", price: 50, emoji: "🟡" },
  { id: "yakult-green",   name: "多多綠茶",      category: "green", price: 45, emoji: "🥤" },
  { id: "mango-qing",     name: "芒果青茶",      category: "green", price: 45, emoji: "🥭" },

  // 冰沙系列
  { id: "mungbean-ice",   name: "綠豆沙",         category: "smoothie", price: 40, emoji: "🟢" },
  { id: "plum-ice",       name: "烏梅冰沙",       category: "smoothie", price: 40, emoji: "🟣" },
  { id: "lemon-ice",      name: "檸檬冰沙",       category: "smoothie", price: 40, emoji: "🍋" },
  { id: "yakult-ice",     name: "多多冰沙",       category: "smoothie", price: 45, emoji: "🥤" },
  { id: "passion-pine-ice", name: "百香果鳳梨冰沙", category: "smoothie", price: 50, emoji: "🍍" },
  { id: "milk-ice",       name: "牛奶冰沙",       category: "smoothie", price: 45, emoji: "🥛" },
  { id: "mungbean-milk-ice", name: "綠豆沙牛奶",  category: "smoothie", price: 45, emoji: "🟢" },
  { id: "mango-ice",      name: "芒果冰沙",       category: "smoothie", price: 50, emoji: "🥭" },
  { id: "peach-ice",      name: "水蜜桃冰沙",     category: "smoothie", price: 45, emoji: "🍑" },
  { id: "strawberry-milk-ice", name: "草莓牛奶冰沙", category: "smoothie", price: 45, emoji: "🍓" },
  { id: "choco-milk-ice", name: "巧克力牛奶冰沙", category: "smoothie", price: 60, emoji: "🍫" },

  // 鮮奶系列
  { id: "black-milk",   name: "紅茶冰鮮奶",   category: "milk", price: 45, emoji: "🥛" },
  { id: "green-fmilk",  name: "綠茶冰鮮奶",   category: "milk", price: 45, emoji: "🥛" },
  { id: "grass-milk",   name: "仙草千年鮮奶", category: "milk", price: 45, emoji: "🌿" },
  { id: "oolong-milk",  name: "烏龍鮮奶",     category: "milk", price: 45, emoji: "🍵" },
  { id: "milk-pearl",   name: "鮮奶珍珠",     category: "milk", price: 50, emoji: "⚫" },
  { id: "milk-mungbean",name: "鮮奶綠豆",     category: "milk", price: 50, emoji: "🟢" },

  // 調味系列
  { id: "milk-tea",       name: "奶茶",       category: "flavor", price: 35, emoji: "🧋" },
  { id: "honey-milk-tea", name: "蜂蜜奶茶",   category: "flavor", price: 35, emoji: "🍯" },
  { id: "pearl-milk-tea", name: "珍珠奶茶",   category: "flavor", price: 40, emoji: "🧋" },
  { id: "taro-milk-tea",  name: "芋香奶茶",   category: "flavor", price: 40, emoji: "🟣" },
  { id: "straw-milk-tea", name: "草莓奶茶",   category: "flavor", price: 40, emoji: "🍓" },
  { id: "coconut-milk-tea", name: "椰果奶茶", category: "flavor", price: 40, emoji: "🥥" },
  { id: "grass-milk-tea", name: "仙草凍奶茶", category: "flavor", price: 40, emoji: "🌿" },
  { id: "icecream-tea",   name: "冰淇淋紅茶", category: "flavor", price: 40, emoji: "🍦" },
  { id: "ovaltine",       name: "阿華田",     category: "flavor", price: 45, emoji: "🍫" },
  { id: "qq-milk-tea",    name: "QQ圓奶茶",   category: "flavor", price: 45, emoji: "🟠" },
  { id: "mint-milk-tea",  name: "薄荷綠奶茶", category: "flavor", price: 50, emoji: "🌱" },
  { id: "pudding-milk-tea", name: "布丁奶茶", category: "flavor", price: 55, emoji: "🍮" },

  // 檸檬原汁系列
  { id: "lemon-juice",    name: "檸檬汁",     category: "lemon", price: 35, emoji: "🍋" },
  { id: "lemon-plum",     name: "檸檬梅子",   category: "lemon", price: 40, emoji: "🟣" },
  { id: "honey-lemon",    name: "蜂蜜檸檬",   category: "lemon", price: 40, emoji: "🍯" },
  { id: "lemon-yakult",   name: "檸檬多多",   category: "lemon", price: 50, emoji: "🥤" },
  { id: "lemon-seed",     name: "檸檬山粉圓", category: "lemon", price: 40, emoji: "🍋" },
  { id: "lemon-tea2",     name: "檸檬綠/紅",  category: "lemon", price: 40, emoji: "🍋" },
  { id: "wm-lemon",       name: "冬瓜檸檬",   category: "lemon", price: 45, emoji: "🟤" },
  { id: "kumquat-lemon",  name: "金桔檸檬",   category: "lemon", price: 45, emoji: "🟠" },
  { id: "fruit-tea",      name: "水果風味茶", category: "lemon", price: 45, emoji: "🍊" },

  // 古早味系列
  { id: "classic-pearl",  name: "古早味珍珠",   category: "classic", price: 30, emoji: "⚫" },
  { id: "classic-seed",   name: "古早味山粉圓", category: "classic", price: 30, emoji: "🟤" },
  { id: "classic-coconut",name: "古早味椰果",   category: "classic", price: 30, emoji: "🥥" },
  { id: "classic-grass",  name: "古早味草凍",   category: "classic", price: 30, emoji: "🌿" },
  { id: "wm-seed",        name: "冬瓜山粉圓",   category: "classic", price: 30, emoji: "🟤" },
  { id: "plum-juice",     name: "烏梅汁",       category: "classic", price: 30, emoji: "🟣" },
  { id: "mungbean-soup",  name: "古早味綠豆湯", category: "classic", price: 40, emoji: "🟢" },
  { id: "classic-pudding",name: "古早味布丁",   category: "classic", price: 40, emoji: "🍮" },
];

// ── 客製選項 ──

// 甜度
export const SUGAR_OPTIONS = [
  "全糖", "八分糖", "半糖", "微糖", "無糖",
] as const;

// 冰塊
export const ICE_OPTIONS = [
  "正常冰", "少冰", "微冰", "去冰", "完全去冰",
] as const;

// 加料 (可複選) — 一般配料 +5、QQ圓/布丁 +15
export const TOPPING_OPTIONS = [
  { id: "pearl",   label: "珍珠",   price: 5 },
  { id: "coconut", label: "椰果",   price: 5 },
  { id: "grass",   label: "仙草",   price: 5 },
  { id: "seed",    label: "山粉圓", price: 5 },
  { id: "mungbean",label: "綠豆",   price: 5 },
  { id: "qq",      label: "QQ圓",   price: 15 },
  { id: "pudding", label: "布丁",   price: 15 },
] as const;

export const DEFAULT_SUGAR = "全糖";
export const DEFAULT_ICE = "正常冰";

// 工具
export function getDrink(id: string): Drink | undefined {
  return DRINKS.find((d) => d.id === id);
}
export function getTopping(id: string) {
  return TOPPING_OPTIONS.find((t) => t.id === id);
}
