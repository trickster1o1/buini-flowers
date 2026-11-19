import rose from "../rose.jpg";

export const STUDIO = {
  name: "BUINI",
  phone: "+977 1-454-0190",
  email: "hello@buini.studio",
  address: "Thamel Marg, Kathmandu 44600",
  hours: "Monday – Saturday: 9:00–6:00",
};

export const SITE = {
  bannerTitle: "New Winter\nCollection 2026",
  bannerImage: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1400&q=80",
  bannerButton: "Shop now",
  bannerLink: "/shop",
  bannerSideA: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80",
  bannerSideB: "https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=800&q=80",
  hours: STUDIO.hours,
  phone: STUDIO.phone,
  email: STUDIO.email,
  address: STUDIO.address,
  facebook: "",
  instagram: "",
  x: "",
  youtube: "",
};

export const ADMIN_EMAIL = "studio@buini.test";
export const ADMIN_PASSWORD = "atelier";
export const DEMO_CUSTOMER = "mira@buini.test";

export const SHIPPING = {
  flat: {
    id: "flat",
    label: "Flat rate",
    detail: "Next-day delivery inside Kathmandu",
    cost: 12,
  },
  pickup: {
    id: "pickup",
    label: "Local pickup",
    detail: "Collect from the Thamel studio",
    cost: 0,
  },
};

const photo = (id, w = 1200) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const SOFT = [
  { name: "Blush", hex: "#e7b7b0" },
  { name: "Ivory", hex: "#f3efe6" },
  { name: "Sage", hex: "#9aab84" },
  { name: "Kraft", hex: "#c4a574" },
];

const BRIDAL = [
  { name: "Ivory", hex: "#f7f4ee" },
  { name: "Blush", hex: "#e7b7b0" },
  { name: "Black", hex: "#1c1c1c" },
];

const DRIED_COLORS = [
  { name: "Kraft", hex: "#c4a574" },
  { name: "Clay", hex: "#c47a5a" },
  { name: "Ivory", hex: "#f3efe6" },
];

const CARE =
  "Stems are cut the morning they leave the studio. Recut the ends, change the water daily, and keep the bunch out of direct sun.";

function piece(partial) {
  return {
    colors: SOFT,
    additional: CARE,
    featured: false,
    trending: false,
    madeToOrder: false,
    ...partial,
    badge: partial.badge || (partial.compareAt ? "SALE" : ""),
  };
}

export const products = [
  piece({
    id: "p01",
    slug: "blush-peony-cloud",
    brand: "ATELIER",
    name: "Blush Peony Cloud",
    price: 86,
    compareAt: 110,
    category: "Bouquets",
    featured: true,
    trending: true,
    stock: 8,
    rating: 5,
    description:
      "A loose cloud of blush peonies, garden roses, and sweet pea, tied with a silk ribbon.",
    details: ["Hand-tied in the studio", "Seasonal peonies when the market allows", "Care card in the wrap"],
    images: [photo("photo-1525310072745-f49212b5ac6d"), photo("photo-1496062031456-07b8f162a322")],
  }),
  piece({
    id: "p02",
    slug: "garden-rose-posy",
    brand: "ATELIER",
    name: "Garden Rose Posy",
    price: 64,
    category: "Bouquets",
    trending: true,
    stock: 6,
    rating: 5,
    description: "Short garden roses in a tight posy, finished with a soft ribbon and a handwritten tag.",
    details: ["Compact posy", "Ribbon wrap", "Best on a bedside table"],
    images: [photo("photo-1518895949257-7621c3c786d7"), photo("photo-1567696153798-9111f9cd3d0d")],
  }),
  piece({
    id: "p03",
    slug: "ivory-ranunculus",
    brand: "ATELIER",
    name: "Ivory Ranunculus Bundle",
    price: 72,
    category: "Bouquets",
    stock: 5,
    rating: 4,
    description: "Paper-thin ranunculus in ivory and cream, gathered with a few stems of olive.",
    details: ["Ivory and cream only", "Olive foliage", "Wrapped to travel"],
    images: [photo("photo-1455659817273-f96807779a8a"), photo("photo-1591886960571-74d43a9d4166")],
  }),
  piece({
    id: "p04",
    slug: "crimson-dahlia",
    brand: "ATELIER",
    name: "Crimson Dahlia Hand-tie",
    price: 78,
    compareAt: 96,
    category: "Bouquets",
    featured: true,
    trending: true,
    stock: 4,
    rating: 5,
    description: "Dinner-plate dahlias in crimson and wine, hand-tied with dark foliage.",
    details: ["Seasonal dahlias", "Rich, low palette", "A statement on a long table"],
    images: [photo("photo-1463936575829-25148e1db1b8"), photo("photo-1561181286-d3fee7d55364")],
  }),
  piece({
    id: "p05",
    slug: "meadow-jar",
    brand: "SEASON",
    name: "Meadow Wildflower Jar",
    price: 48,
    category: "Seasonal",
    featured: true,
    stock: 10,
    rating: 5,
    description: "A jam jar of whatever the meadow is offering: cosmos, scabiosa, and fine grasses.",
    details: ["Arranged in a reusable jar", "Changes with the week", "Includes the jar"],
    images: [photo("photo-1490750967868-88aa4486c946"), photo("photo-1444930694458-01bab9af4a51")],
  }),
  piece({
    id: "p06",
    slug: "sunset-tulips",
    brand: "SEASON",
    name: "Sunset Tulip Bunch",
    price: 42,
    category: "Seasonal",
    trending: true,
    stock: 12,
    rating: 5,
    description: "A generous armful of tulips in apricot, blush, and butter yellow.",
    details: ["Loose bunch", "Stems keep growing in the vase", "Kraft or blush wrap"],
    images: [photo("photo-1520763185298-1b434c919102"), photo("photo-1468327768560-75b778cbb551")],
  }),
  piece({
    id: "p07",
    slug: "champagne-orchid",
    brand: "STEM",
    name: "Champagne Orchid Spray",
    price: 96,
    category: "Stems",
    stock: 3,
    rating: 5,
    description: "A single arching spray of champagne cymbidium, cut long for a tall vase.",
    details: ["One premium spray", "Lasts for weeks", "Vase not included"],
    images: [photo("photo-1471899236350-e3016bf1e69e"), photo("photo-1455659817273-f96807779a8a")],
  }),
  piece({
    id: "p08",
    slug: "white-lily-stems",
    brand: "STEM",
    name: "White Lily Stems",
    price: 54,
    category: "Stems",
    stock: 7,
    rating: 4,
    description: "Three stems of white oriental lily, buds just opening, with the pollen left for you to pinch.",
    details: ["Three stems", "Pinch the pollen to protect linen", "Strong evening scent"],
    images: [photo("photo-1487070183336-b863922373d4"), photo("photo-1591886960571-74d43a9d4166")],
  }),
  piece({
    id: "p09",
    slug: "sage-eucalyptus",
    brand: "STEM",
    name: "Sage Eucalyptus Wrap",
    price: 38,
    category: "Stems",
    stock: 9,
    rating: 4,
    description: "Seeded eucalyptus and olive, tied for a mantel, a bath, or the neck of a gift.",
    details: ["Foliage only", "Dries beautifully", "Long stems"],
    images: [photo("photo-1501004318641-b39e6451bec6"), photo("photo-1416879595882-3373a0480b5b")],
  }),
  piece({
    id: "p10",
    slug: "pampas-cloud",
    brand: "DRIED",
    name: "Dried Pampas Cloud",
    price: 68,
    category: "Dried",
    colors: DRIED_COLORS,
    featured: true,
    trending: true,
    stock: 6,
    rating: 5,
    description: "Bleached and natural pampas with bunny tail and a clay ribbon. A piece that stays.",
    details: ["Preserved and dried", "Keep away from humidity", "No water needed"],
    additional: "Dried work is arranged to last the season. Keep it dry and out of steam.",
    images: [photo("photo-1507290439931-a861b5a38200"), photo("photo-1606041008023-472dfb5e530f")],
  }),
  piece({
    id: "p11",
    slug: "palm-wreath",
    brand: "DRIED",
    name: "Terracotta Palm Wreath",
    price: 84,
    category: "Dried",
    colors: DRIED_COLORS,
    stock: 4,
    rating: 5,
    description: "A flat wreath of sun palms, strawflower, and terracotta ribbon for a door or wall.",
    details: ["Ready to hang", "About 35 cm across", "Indoor use"],
    additional: "Dried work is arranged to last the season. Keep it dry and out of steam.",
    images: [photo("photo-1613539246066-78db6ec4ff0f"), photo("photo-1507290439931-a861b5a38200")],
  }),
  piece({
    id: "p12",
    slug: "rose-dome",
    brand: "DRIED",
    name: "Preserved Rose Dome",
    price: 120,
    compareAt: 145,
    category: "Dried",
    colors: DRIED_COLORS,
    stock: 3,
    rating: 5,
    description: "Preserved roses under a glass dome, in a color that holds for years.",
    details: ["Glass dome included", "Preserved, not fresh", "A kept gift"],
    additional: "Dust gently. The dome does not need water or light.",
    images: [photo("photo-1518895949257-7621c3c786d7"), photo("photo-1561181286-d3fee7d55364")],
  }),
  piece({
    id: "p13",
    slug: "bridal-cascade",
    brand: "BRIDAL",
    name: "Bridal Cascade",
    price: 180,
    compareAt: 220,
    category: "Wedding",
    colors: BRIDAL,
    featured: true,
    madeToOrder: true,
    stock: 5,
    rating: 5,
    description: "A cascading bridal bunch of garden rose, jasmine, and trailing jasmine vine.",
    details: ["Tied to order", "Trial bunch available", "Ivory, blush, or black ribbon"],
    additional: "Wedding pieces need five days' notice. Write the date in your order note.",
    images: [photo("photo-1519225421980-715cb0215aed"), photo("photo-1526047932273-341f2a7631f9")],
  }),
  piece({
    id: "p14",
    slug: "aisle-cluster",
    brand: "BRIDAL",
    name: "Ceremony Aisle Cluster",
    price: 96,
    category: "Wedding",
    colors: BRIDAL,
    madeToOrder: true,
    stock: 4,
    rating: 5,
    description: "A pew or aisle cluster on a short mechanic, designed to repeat down a ceremony.",
    details: ["Priced per cluster", "Mechanics included", "Palette matched to the bridal bunch"],
    additional: "Wedding pieces need five days' notice. Tell us how many clusters in the note.",
    images: [photo("photo-1519741497674-611481863552"), photo("photo-1487530811176-3780de880c2d")],
  }),
  piece({
    id: "p15",
    slug: "daisy-pail",
    brand: "SEASON",
    name: "Buttercup Daisy Pail",
    price: 36,
    category: "Seasonal",
    badge: "NEW",
    stock: 11,
    rating: 4,
    description: "Market daisies and buttercup in a small zinc pail. An easy bunch for a kitchen table.",
    details: ["Pail included", "Cheerful and short", "A good first order"],
    images: [photo("photo-1490750967868-88aa4486c946"), photo("photo-1462275646964-a0e3386b89fa")],
  }),
  piece({
    id: "p16",
    slug: "midnight-anemone",
    brand: "ATELIER",
    name: "Midnight Anemone Bouquet",
    price: 92,
    category: "Bouquets",
    badge: "NEW",
    stock: 5,
    rating: 5,
    description: "Inky anemones with a white eye, black scabiosa, and a ribbon the color of ink.",
    details: ["Dark palette", "Short, sculptural stems", "Best in a low bowl"],
    images: [photo("photo-1470509037663-253afd7f0f51"), photo("photo-1496062031456-07b8f162a322")],
  }),
  piece({
    id: "p17",
    slug: "bud-vase-trio",
    brand: "STEM",
    name: "Mini Bud Vase Trio",
    price: 44,
    category: "Stems",
    badge: "SOLD OUT",
    stock: 0,
    rating: 4,
    description: "Three mismatched glass bud vases, each holding a single perfect stem.",
    details: ["Three vases included", "Stems chosen that morning", "A set for a dinner"],
    images: [photo("photo-1471899236350-e3016bf1e69e"), photo("photo-1455659817273-f96807779a8a")],
  }),
  piece({
    id: "p18",
    slug: "kraft-sweetheart",
    brand: "ATELIER",
    name: "Kraft-Wrapped Sweetheart",
    price: 52,
    compareAt: 64,
    category: "Bouquets",
    stock: 8,
    rating: 5,
    description: "A sweetheart posy of spray rose and chamomile, wrapped in kraft and twine.",
    details: ["Small enough to carry", "Twine wrap", "A note card is tucked in"],
    images: [photo("photo-1563241527-3004b7be0ffd"), photo("photo-1487530811176-3780de880c2d")],
  }),
  piece({
    id: "p19",
    slug: "olive-rose",
    brand: "BRIDAL",
    name: "Olive & Rose Compact",
    price: 110,
    category: "Wedding",
    colors: BRIDAL,
    madeToOrder: true,
    stock: 4,
    rating: 5,
    description: "A compact bridal posy of cream rose and silver olive. Quiet, and easy to hold.",
    details: ["Round posy", "Bound handle", "Trial available in the studio"],
    additional: "Wedding pieces need five days' notice. Write the date in your order note.",
    images: [photo("photo-1526047932273-341f2a7631f9"), photo("photo-1519225421980-715cb0215aed")],
  }),
  piece({
    id: "p20",
    slug: "winter-whites",
    brand: "SEASON",
    name: "Winter White Dome",
    price: 74,
    category: "Seasonal",
    badge: "NEW",
    featured: true,
    stock: 6,
    rating: 5,
    description: "Hellebore, paperwhite, and silver brunia in a low white dome for the dark months.",
    details: ["Low and wide", "Scented paperwhite", "Winter palette"],
    images: [photo("photo-1591886960571-74d43a9d4166"), photo("photo-1572454591674-2739f30d8c40")],
  }),
  piece({
    id: "p21",
    slug: "studio-rose",
    brand: "STEM",
    name: "Studio Rose, Single Stem",
    price: 18,
    category: "Stems",
    stock: 15,
    rating: 5,
    description: "One garden rose, chosen for the head and the scent. The simplest thing we sell.",
    details: ["A single stem", "Wrapped in tissue", "Ask for a trio in the note"],
    images: [rose, photo("photo-1561181286-d3fee7d55364")],
  }),
];

export const categories = [
  { id: "All", label: "All" },
  { id: "Bouquets", label: "Bouquets" },
  { id: "Dried", label: "Dried" },
  { id: "Wedding", label: "Wedding" },
  { id: "Stems", label: "Stems" },
  { id: "Seasonal", label: "Seasonal" },
];

export const coupons = [
  { code: "BLOOM10", type: "percent", amount: 10, label: "10% off the first studio order" },
  { code: "STUDIO20", type: "percent", amount: 20, label: "20% studio courtesy" },
  { code: "WELCOME15", type: "amount", amount: 15, label: "Rs. 15 off" },
];

export const posts = [
  {
    id: "b1",
    slug: "keeping-a-hand-tied-bouquet",
    title: "How to keep a hand-tied bouquet for a week",
    date: "2026-11-12",
    category: "Studio",
    excerpt: "A few quiet habits that give cut flowers their longest life on the table.",
    image: photo("photo-1487530811176-3780de880c2d"),
    body: [
      "Unwrap the bunch as soon as it arrives. The stems have been out of water since morning, and they want a deep drink before you style them.",
      "Recut each stem on a long angle with a clean knife. Rinse the vase with hot water, then fill it halfway. Flower food helps, but clean water and a fresh cut matter more.",
      "Pull any leaf that would sit under the waterline. Leaves in the vase turn the water cloudy by the second day.",
      "Keep the bouquet off the radiator, out of a sunny window, and away from the fruit bowl. Ethylene from ripening fruit closes petals early.",
      "Each morning, top up the water and recut anything that has gone soft. A hand-tied bouquet from the studio should look considered for five to seven days.",
    ],
  },
  {
    id: "b2",
    slug: "winter-table-stems",
    title: "Choosing stems for a winter table",
    date: "2026-11-04",
    category: "Seasonal",
    excerpt: "Hellebore, paperwhite, and the branches that make a short day feel dressed.",
    image: photo("photo-1572454591674-2739f30d8c40"),
    body: [
      "Winter arrangements want less variety and more repetition. Three kinds of stem, used generously, read as calmer than a mixed handful.",
      "We start with something structural: olive, eucalyptus, or a few bare branches. Then a soft flower — hellebore, anemone, or paperwhite — and one scent.",
      "Keep the vase low if people are eating. A dome you can see over is kinder than a tall centerpiece, however beautiful.",
      "Paperwhite is the scent of this month in the studio. If anyone at the table is sensitive, ask us for the unscented winter whites instead.",
    ],
  },
  {
    id: "b3",
    slug: "dried-that-last",
    title: "Dried flowers that last the year",
    date: "2026-10-22",
    category: "Dried",
    excerpt: "What we preserve, how to dust it, and why humidity is the only real enemy.",
    image: photo("photo-1606041008023-472dfb5e530f"),
    body: [
      "The dried edit is built from pampas, palm, strawflower, and preserved rose. These are not fresh flowers left to wilt. They are prepared so the color holds.",
      "Hang a wreath on an interior door. Kitchens and bathrooms steam the grasses until they droop.",
      "Dust with a cool hairdryer on the lowest setting, or a soft brush. Do not mist dried work.",
      "A preserved dome needs nothing from you. It is the piece we suggest when a gift has to outlast the week.",
    ],
  },
];

export const reviews = [
  { id: "r1", productId: "p01", author: "Mira C.", rating: 5, title: "Soft and full", body: "It looked exactly like the photograph and lasted six days on the dining table.", createdAt: "2026-11-02" },
  { id: "r2", productId: "p01", author: "Elena V.", rating: 5, title: "The blush was true", body: "I asked for blush ribbon and the whole bunch sat in that color. Beautifully tied.", createdAt: "2026-10-28" },
  { id: "r3", productId: "p04", author: "Jonah A.", rating: 5, title: "Dark and generous", body: "The dahlias were huge. It made a small room feel dressed for dinner.", createdAt: "2026-10-18" },
  { id: "r4", productId: "p06", author: "Priya S.", rating: 5, title: "Still opening on day four", body: "The tulips arrived closed and performed all week. I will order these again.", createdAt: "2026-11-08" },
  { id: "r5", productId: "p10", author: "Nima T.", rating: 4, title: "Stays put", body: "The pampas is full without shedding everywhere. A good piece for a hallway.", createdAt: "2026-09-30" },
  { id: "r6", productId: "p13", author: "Mira C.", rating: 5, title: "Held together all evening", body: "The cascade survived hugs, photos, and a warm room. The ribbon was finished properly.", createdAt: "2026-11-16" },
  { id: "r7", productId: "p21", author: "Elena V.", rating: 5, title: "Just one perfect rose", body: "Exactly what I wanted for a birthday note. The head was enormous.", createdAt: "2026-11-11" },
  { id: "r8", productId: "p20", author: "Anika S.", rating: 5, title: "Quiet winter whites", body: "Low enough for the table and scented without taking over the room.", createdAt: "2026-11-14" },
];

export const pages = {
  about: {
    title: "About the studio",
    kicker: "BUINI",
    paragraphs: [
      "BUINI is a one-room studio for handmade flowers. Every bunch is tied to order in the morning, not pulled from a cooler of arrangements made yesterday.",
      "We work with what the market does well that week: garden roses, seasonal bulbs, foliage from the valley, and a dried edit that lasts after the fresh flowers are gone.",
      "Weddings are a small part of the week. We take a limited number so the bridal bunch, the trial, and the ceremony pieces are made by the same hands.",
      "The shop you are looking at is the studio counter. Orders placed here come to the bench as requests. We confirm by email, then tie, wrap, and deliver.",
    ],
  },
  shipping: {
    title: "Shipping",
    kicker: "Delivery",
    paragraphs: [
      "Flat-rate delivery inside Kathmandu is Rs. 12 and arrives the next day when the order is placed before 1pm. After 1pm, we move it to the following morning.",
      "Local pickup from the Thamel studio is free. We will write when the bunch is wrapped and ready at the bench.",
      "We do not ship fresh flowers by air. Dried domes and wreaths can travel; write to the studio with the address before you order one.",
      "Someone should be there to put the stems in water. If a doorman or a neighbor will receive them, say so in the order note.",
    ],
  },
  returns: {
    title: "Returns",
    kicker: "Freshness",
    paragraphs: [
      "Cut flowers are perishable, so we do not take them back for a change of mind. If a bunch arrives damaged, wilted, or unlike the piece you ordered, write within 24 hours with a photograph.",
      "We replace the bunch or refund the flowers. Delivery fees are refunded when the mistake was ours.",
      "Dried pieces can be returned unused within seven days. Glass domes must come back unbroken.",
      "Wedding work is made for a date. A date change needs four days' notice so the stems can be reordered.",
    ],
  },
  careers: {
    title: "Careers",
    kicker: "The bench",
    paragraphs: [
      "The studio is small on purpose. Most days it is one florist and a Saturday helper when wedding season asks for another pair of hands.",
      "If you have tied flowers, run a market stall, or simply have calm hands and early mornings to spare, send a note through the contact page.",
      "Tell us what you have made, which days you can stand, and whether you can lift a bucket of water. We read every note.",
    ],
  },
  terms: {
    title: "Terms & conditions",
    kicker: "Orders",
    paragraphs: [
      "An order on this site is a request to the studio. It is confirmed when we reply by email. Payment is collected on delivery, at pickup, or by bank transfer before wedding work begins.",
      "Stem substitutions happen when the market does not have a flower on the morning we tie. We stay inside the palette and the price you agreed.",
      "This demonstration stores orders so the shop and the studio desk can be reviewed. Do not enter a real card number. There is nowhere on the site that asks for one.",
    ],
  },
  privacy: {
    title: "Privacy policy",
    kicker: "Your details",
    paragraphs: [
      "We use your name, email, phone, and address to tie and deliver an order, and to reply if you write to the studio.",
      "In this demo, those records stay in this browser until you connect a Google Sheet through the Apps Script backend. They are not sold and not used for advertising.",
      "The newsletter list is only the addresses typed into the subscribe box. You can ask us to remove one by email.",
      "Studio desk access is separate from customer accounts and is meant for the florist.",
    ],
  },
  faq: {
    title: "FAQ",
    kicker: "Questions",
    faq: [
      { q: "Can I get flowers today?", a: "Orders placed before 1pm are tied for the next morning. Same-day is sometimes possible if the stems are already on the bench. Write to us before you count on it." },
      { q: "Do you deliver outside Kathmandu?", a: "Fresh work stays in the valley so it is not sitting in a van. Dried domes and wreaths can go further. Ask first." },
      { q: "Is a vase included?", a: "Only when the product says so, such as the meadow jar, the daisy pail, and the bud vase trio. Other bunches arrive wrapped, ready for a vase you already own." },
      { q: "How do wedding orders work?", a: "Choose the bridal piece, leave the date and the guest count in the note, and we will reply with a short plan. Ceremony flowers need five days." },
      { q: "What if someone is sensitive to scent?", a: "Say so in the note. We will leave out paperwhite, lily, and stock, and pinch lily pollen when lilies are requested." },
      { q: "Can I send a message with the flowers?", a: "Yes. The order note is copied onto a card and tucked into the wrap." },
    ],
  },
};

export const occasions = ["Just because", "Birthday", "Anniversary", "Wedding", "Sympathy", "Thank you", "Dinner"];

export function money(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function moneyRound(value) {
  return Math.round(Number(value || 0) * 100) / 100;
}

export function calcDiscount(coupon, subtotal) {
  if (!coupon) return 0;
  if (coupon.type === "percent") return moneyRound(subtotal * (coupon.amount / 100));
  return Math.min(subtotal, Number(coupon.amount) || 0);
}

export function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return String(iso);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function productReviews(productId) {
  return reviews.filter((review) => review.productId === productId);
}

export function seedCrm() {
  const orders = [
    {
      id: "BF-1042",
      createdAt: "2026-11-16T10:30:00.000Z",
      email: "mira@buini.test",
      firstName: "Mira",
      lastName: "Chen",
      phone: "+977 980-100-0001",
      address: "12 Lazimpat Marg",
      city: "Kathmandu",
      region: "Bagmati",
      occasion: "Anniversary",
      note: "Please leave it with the doorman and include the card.",
      deliveryDate: "2026-11-17",
      shipping: "flat",
      coupon: "BLOOM10",
      discount: 18,
      subtotal: 180,
      shippingCost: 12,
      total: 174,
      status: "Delivered",
      items: [
        { productId: "p13", slug: "bridal-cascade", name: "Bridal Cascade", brand: "BRIDAL", color: "Ivory", unitPrice: 180, qty: 1, image: products[12].images[0] },
      ],
    },
    {
      id: "BF-1038",
      createdAt: "2026-11-18T08:10:00.000Z",
      email: "elena@buini.test",
      firstName: "Elena",
      lastName: "Voss",
      phone: "+977 980-100-0002",
      address: "4 Sanepa Lane",
      city: "Kathmandu",
      region: "Bagmati",
      occasion: "Birthday",
      note: "No lilies, please.",
      deliveryDate: "2026-11-19",
      shipping: "flat",
      coupon: "",
      discount: 0,
      subtotal: 128,
      shippingCost: 12,
      total: 140,
      status: "Processing",
      items: [
        { productId: "p01", slug: "blush-peony-cloud", name: "Blush Peony Cloud", brand: "ATELIER", color: "Blush", unitPrice: 86, qty: 1, image: products[0].images[0] },
        { productId: "p06", slug: "sunset-tulips", name: "Sunset Tulip Bunch", brand: "SEASON", color: "Kraft", unitPrice: 42, qty: 1, image: products[5].images[0] },
      ],
    },
    {
      id: "BF-1033",
      createdAt: "2026-11-19T04:40:00.000Z",
      email: "jonah@buini.test",
      firstName: "Jonah",
      lastName: "Adeyemi",
      phone: "+977 980-100-0003",
      address: "Thamel Marg",
      city: "Kathmandu",
      region: "Bagmati",
      occasion: "Thank you",
      note: "I will collect this after 4pm.",
      deliveryDate: "2026-11-20",
      shipping: "pickup",
      coupon: "",
      discount: 0,
      subtotal: 68,
      shippingCost: 0,
      total: 68,
      status: "New",
      items: [
        { productId: "p10", slug: "pampas-cloud", name: "Dried Pampas Cloud", brand: "DRIED", color: "Kraft", unitPrice: 68, qty: 1, image: products[9].images[0] },
      ],
    },
  ];

  return {
    orders,
    customers: [
      { email: "mira@buini.test", firstName: "Mira", lastName: "Chen", phone: "+977 980-100-0001", orders: 1, spent: 174, createdAt: "2026-11-16T10:30:00.000Z" },
      { email: "elena@buini.test", firstName: "Elena", lastName: "Voss", phone: "+977 980-100-0002", orders: 1, spent: 140, createdAt: "2026-11-18T08:10:00.000Z" },
      { email: "jonah@buini.test", firstName: "Jonah", lastName: "Adeyemi", phone: "+977 980-100-0003", orders: 1, spent: 68, createdAt: "2026-11-19T04:40:00.000Z" },
    ],
    inquiries: [
      { id: "i1", name: "Anika Sherpa", email: "anika@example.com", topic: "Wedding", message: "We need a ceremony arch and eight aisle clusters for 14 June in Patan. Soft ivory and dried grasses.", createdAt: "2026-11-15T09:00:00.000Z", status: "New" },
      { id: "i2", name: "The Courtyard", email: "kitchen@example.com", topic: "Wholesale", message: "Can the studio deliver a Monday table arrangement for twenty covers? We can leave a vase with you.", createdAt: "2026-11-10T06:20:00.000Z", status: "Replied" },
    ],
    subscribers: [
      { email: "mira@buini.test", createdAt: "2026-10-02T00:00:00.000Z" },
      { email: "elena@buini.test", createdAt: "2026-10-18T00:00:00.000Z" },
      { email: "nima@example.com", createdAt: "2026-11-01T00:00:00.000Z" },
      { email: "priya@example.com", createdAt: "2026-11-12T00:00:00.000Z" },
    ],
    stock: {},
  };
}
