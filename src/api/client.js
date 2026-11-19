import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  calcDiscount,
  coupons,
  moneyRound,
  pages,
  posts,
  productReviews,
  products as catalogProducts,
  seedCrm,
  SITE,
} from "../data/catalog";

const KEY = "buini_crm_v1";
const listeners = new Set();

export function isRemote() {
  return Boolean(process.env.REACT_APP_API_URL);
}

export function subscribeCatalog(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function readCrm() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch (error) {
    /* use a fresh demo if storage is blocked */
  }
  const seed = seedCrm();
  writeCrm(seed);
  return seed;
}

function writeCrm(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (error) {
    /* the demo still runs for this page view */
  }
  emit();
}

function withStock(list, stock) {
  return list.map((product) => ({
    ...product,
    stock: stock[product.id] ?? product.stock,
    badge: (stock[product.id] ?? product.stock) === 0 ? "SOLD OUT" : product.badge,
  }));
}

const PIECE_CATEGORIES = ["Bouquets", "Dried", "Wedding", "Stems", "Seasonal"];
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_COLORS = [
  { name: "Blush", hex: "#e7b7b0" },
  { name: "Ivory", hex: "#f3efe6" },
  { name: "Sage", hex: "#9aab84" },
  { name: "Kraft", hex: "#c4a574" },
];

function slugify(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "piece";
}

function allProducts(crm) {
  const extras = Array.isArray(crm.products) ? crm.products : [];
  const edits = crm.edits || {};
  const base = catalogProducts.map((product) => (edits[product.id] ? { ...product, ...edits[product.id] } : product));
  const known = new Set(base.map((product) => product.id));
  return base.concat(extras.filter((product) => !known.has(product.id)));
}

function lines(value) {
  return String(value || "").split(/\n/).map((line) => line.trim()).filter(Boolean);
}

function readPiece(payload, existing) {
  const name = String(payload.name || "").trim();
  if (!name) throw new Error("Name the piece.");
  const price = Math.round(Number(payload.price));
  if (!price || price < 1) throw new Error("Enter a price.");
  const category = PIECE_CATEGORIES.includes(payload.category) ? payload.category : existing?.category || "Bouquets";
  const stock = Math.max(0, Math.round(Number(payload.stock) || 0));
  let compareAt = payload.compareAt === "" || payload.compareAt == null ? null : Math.round(Number(payload.compareAt));
  if (compareAt != null && !(compareAt > price)) compareAt = null;
  const brand = String(payload.brand || existing?.brand || "ATELIER").trim() || "ATELIER";
  const description = payload.description == null ? (existing?.description || "") : String(payload.description).trim();
  const additional = payload.additional == null ? (existing?.additional || "") : String(payload.additional).trim();
  const detailLines = lines(payload.details);
  const details = detailLines.length ? detailLines : existing?.details || ["Hand-tied in the studio"];
  const imageLines = lines(payload.image);
  const images = imageLines.length ? imageLines : existing?.images || [DEFAULT_IMAGE];
  images.forEach((image) => {
    if (!/^https?:\/\//i.test(image) && !String(image).startsWith("/")) throw new Error("Each photo needs a full image link.");
  });
  const colorLines = lines(payload.colors);
  const colors = colorLines.length
    ? colorLines.map((line) => {
      const [colorName, hex] = line.split(":");
      return { name: String(colorName || "").trim(), hex: String(hex || "#dddddd").trim() };
    })
    : existing?.colors || DEFAULT_COLORS;
  let badge = String(payload.badge || "").trim();
  if (stock === 0) badge = "SOLD OUT";
  else if (badge === "SOLD OUT") badge = compareAt ? "SALE" : "";
  else if (!badge && compareAt) badge = "SALE";
  const flag = (value, fallback) => value === true || value === "true" || (value == null && Boolean(fallback));
  return {
    brand,
    name,
    price,
    compareAt,
    category,
    badge,
    description,
    additional,
    stock,
    featured: flag(payload.featured, existing?.featured),
    trending: flag(payload.trending, existing?.trending),
    madeToOrder: flag(payload.madeToOrder, existing?.madeToOrder),
    colors,
    images,
    details,
  };
}

function makeProduct(payload, existing) {
  const fields = readPiece(payload);
  const max = existing.reduce((n, product) => Math.max(n, Number(String(product.id).replace(/\D/g, "")) || 0), 0);
  const next = max + 1;
  const id = `p${next < 10 ? "0" : ""}${next}`;
  const base = slugify(fields.name);
  const taken = new Set(existing.map((product) => product.slug));
  let slug = base;
  let n = 2;
  while (taken.has(slug)) {
    slug = `${base}-${n}`;
    n += 1;
  }
  return { id, slug, rating: 5, ...fields };
}

export function readLocalProducts() {
  const crm = readCrm();
  return withStock(allProducts(crm), crm.stock || {});
}

function nextOrderId(orders) {
  const nums = orders.map((order) => Number(String(order.id).replace(/\D/g, ""))).filter((n) => !Number.isNaN(n));
  return `BF-${Math.max(1042, ...nums) + 1}`;
}

function upsertCustomer(crm, order) {
  const email = order.email.toLowerCase();
  const existing = crm.customers.find((customer) => customer.email === email);
  if (existing) {
    existing.firstName = order.firstName;
    existing.lastName = order.lastName;
    existing.phone = order.phone;
    existing.orders += 1;
    existing.spent = moneyRound(existing.spent + order.total);
    return;
  }
  crm.customers.unshift({
    email,
    firstName: order.firstName,
    lastName: order.lastName,
    phone: order.phone,
    orders: 1,
    spent: order.total,
    createdAt: order.createdAt,
  });
}

function pageResult(list, payload) {
  const pageSize = Math.min(50, Math.max(1, Math.floor(Number(payload.pageSize) || 8)));
  const total = list.length;
  const pages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const page = Math.min(pages, Math.max(1, Math.floor(Number(payload.page) || 1)));
  const start = (page - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    page,
    pageSize,
    pages,
    total,
  };
}

function dashboardFrom(crm) {
  const active = crm.orders.filter((order) => order.status !== "Cancelled");
  const revenue = moneyRound(active.reduce((sum, order) => sum + Number(order.total || 0), 0));
  const open = crm.orders.filter((order) => !["Delivered", "Cancelled"].includes(order.status)).length;
  const inventory = withStock(allProducts(crm), crm.stock || {});
  return {
    revenue,
    orders: crm.orders.length,
    openOrders: open,
    inquiries: crm.inquiries.filter((item) => item.status === "New").length,
    subscribers: crm.subscribers.length,
    customers: crm.customers.length,
    lowStock: inventory.filter((product) => product.stock <= 3),
    recent: crm.orders.slice(0, 5),
    mode: "demo",
  };
}

function localCall(action, payload) {
  const crm = readCrm();
  const stocked = () => withStock(allProducts(crm), crm.stock || {});

  switch (action) {
    case "products":
      return stocked();
    case "product": {
      const product = stocked().find((item) => item.slug === payload.slug || item.id === payload.id);
      if (!product) throw new Error("That piece is no longer in the studio.");
      return { ...product, reviews: productReviews(product.id) };
    }
    case "posts":
      return posts;
    case "post": {
      const post = posts.find((item) => item.slug === payload.slug);
      if (!post) throw new Error("That note could not be found.");
      return post;
    }
    case "page": {
      const page = pages[payload.slug];
      if (!page) throw new Error("That page could not be found.");
      return { slug: payload.slug, ...page };
    }
    case "coupon": {
      const coupon = coupons.find((item) => item.code === String(payload.code || "").trim().toUpperCase());
      if (!coupon) throw new Error("That code is not recognized.");
      const subtotal = Number(payload.subtotal) || 0;
      return { ...coupon, discount: calcDiscount(coupon, subtotal) };
    }
    case "subscribe": {
      const email = String(payload.email || "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email.");
      if (!crm.subscribers.some((item) => item.email === email)) {
        crm.subscribers.unshift({ email, createdAt: new Date().toISOString() });
        writeCrm(crm);
      }
      return { ok: true };
    }
    case "inquiry": {
      const name = String(payload.name || "").trim();
      const email = String(payload.email || "").trim();
      const message = String(payload.message || "").trim();
      if (!name || !email || !message) throw new Error("Name, email, and a note are required.");
      const inquiry = {
        id: `i${Date.now()}`,
        name,
        email,
        topic: payload.topic || "General",
        message,
        createdAt: new Date().toISOString(),
        status: "New",
      };
      crm.inquiries.unshift(inquiry);
      writeCrm(crm);
      return inquiry;
    }
    case "order": {
      const order = {
        ...payload,
        email: String(payload.email || "").trim().toLowerCase(),
        id: nextOrderId(crm.orders),
        createdAt: new Date().toISOString(),
        status: "New",
      };
      if (!order.items || !order.items.length) throw new Error("Your basket is empty.");
      order.items.forEach((item) => {
        const product = allProducts(crm).find((entry) => entry.id === item.productId);
        const current = crm.stock[item.productId] ?? product?.stock ?? 0;
        if (current < item.qty) throw new Error(`${item.name} does not have enough stems left.`);
        crm.stock[item.productId] = current - item.qty;
      });
      crm.orders.unshift(order);
      upsertCustomer(crm, order);
      writeCrm(crm);
      return order;
    }
    case "login": {
      const email = String(payload.email || "").trim().toLowerCase();
      if (email === ADMIN_EMAIL && payload.password === ADMIN_PASSWORD) {
        return { token: "local-demo", name: "Studio", email };
      }
      throw new Error("Those studio details do not match.");
    }
    case "dashboard":
      return dashboardFrom(crm);
    case "orders":
      return pageResult(crm.orders, payload);
    case "orderUpdate": {
      const order = crm.orders.find((item) => item.id === payload.id);
      if (!order) throw new Error("Order not found.");
      order.status = payload.status;
      writeCrm(crm);
      return order;
    }
    case "customers":
      return pageResult(crm.customers, payload);
    case "inventory":
      return pageResult(stocked(), payload);
    case "stock": {
      const next = Math.max(0, Number(payload.stock) || 0);
      crm.stock[payload.id] = next;
      writeCrm(crm);
      return { id: payload.id, stock: next };
    }
    case "productCreate": {
      const product = makeProduct(payload, allProducts(crm));
      crm.products = Array.isArray(crm.products) ? crm.products : [];
      crm.products.push(product);
      writeCrm(crm);
      return product;
    }
    case "productUpdate": {
      const current = allProducts(crm).find((item) => item.id === payload.id);
      if (!current) throw new Error("Record not found.");
      const next = { ...current, ...readPiece(payload, current), id: current.id, slug: current.slug, rating: current.rating };
      const extras = Array.isArray(crm.products) ? crm.products : [];
      const index = extras.findIndex((item) => item.id === payload.id);
      if (index >= 0) extras[index] = next;
      else {
        crm.edits = { ...(crm.edits || {}), [payload.id]: next };
      }
      crm.products = extras;
      if (crm.stock) delete crm.stock[payload.id];
      writeCrm(crm);
      return next;
    }
    case "inquiries":
      return pageResult(crm.inquiries, payload);
    case "inquiryUpdate": {
      const inquiry = crm.inquiries.find((item) => item.id === payload.id);
      if (!inquiry) throw new Error("Message not found.");
      inquiry.status = payload.status;
      writeCrm(crm);
      return inquiry;
    }
    case "subscribers":
      return pageResult(crm.subscribers, payload);
    case "site":
      return { ...SITE, ...(crm.site || {}) };
    case "siteUpdate": {
      const site = normalizeSite(payload);
      crm.site = site;
      writeCrm(crm);
      return site;
    }
    case "account": {
      const email = String(payload.email || "").trim().toLowerCase();
      return crm.orders.filter((order) => order.email === email);
    }
    case "reset": {
      writeCrm(seedCrm());
      return { ok: true };
    }
    default:
      throw new Error("Unknown request.");
  }
}

export async function call(action, payload = {}) {
  if (!isRemote() || action === "page" || action === "posts" || action === "post") {
    return localCall(action, payload);
  }

  const params = new URLSearchParams({
    action,
    payload: JSON.stringify(payload),
  });
  const response = await fetch(`${process.env.REACT_APP_API_URL}?${params.toString()}`);
  let json;
  try {
    json = await response.json();
  } catch (error) {
    throw new Error("The studio API did not return JSON. Check the Apps Script deployment.");
  }
  if (!json.ok) throw new Error(json.error || "The studio API could not complete that.");
  if (Array.isArray(json.data) && ["orders", "customers", "inventory", "inquiries", "subscribers"].includes(action)) {
    return pageResult(json.data, payload);
  }
  return json.data;
}

let productCache = null;
let productPromise = null;
let siteCache = null;
let sitePromise = null;
const siteListeners = new Set();

function imageLink(value, label) {
  const src = String(value || "").trim();
  if (!/^https?:\/\//i.test(src) && !src.startsWith("/")) throw new Error(`${label} needs a full image link.`);
  return src;
}

export function normalizeSite(payload) {
  const bannerTitle = String(payload.bannerTitle || "").trim();
  const bannerButton = String(payload.bannerButton || "").trim();
  const bannerLink = String(payload.bannerLink || "").trim();
  const hours = String(payload.hours || "").trim();
  const phone = String(payload.phone || "").trim();
  const email = String(payload.email || "").trim();
  const address = String(payload.address || "").trim();
  if (!bannerTitle) throw new Error("Add a banner title.");
  if (!bannerButton) throw new Error("Add the banner button label.");
  if (!bannerLink.startsWith("/") && !/^https?:\/\//i.test(bannerLink)) throw new Error("The banner button link should start with / or http.");
  return {
    bannerTitle,
    bannerImage: imageLink(payload.bannerImage, "The banner photo"),
    bannerButton,
    bannerLink,
    bannerSideA: imageLink(payload.bannerSideA, "The left photo"),
    bannerSideB: imageLink(payload.bannerSideB, "The right photo"),
    hours,
    phone,
    email,
    address,
  };
}

export function subscribeSite(listener) {
  siteListeners.add(listener);
  return () => siteListeners.delete(listener);
}

export function invalidateSite() {
  siteCache = null;
  sitePromise = null;
  siteListeners.forEach((listener) => listener());
}

export function loadSite() {
  if (siteCache) return Promise.resolve(siteCache);
  if (sitePromise) return sitePromise;
  sitePromise = call("site")
    .then((data) => {
      siteCache = { ...SITE, ...data };
      return siteCache;
    })
    .catch(() => {
      siteCache = { ...SITE };
      return siteCache;
    })
    .finally(() => {
      sitePromise = null;
    });
  return sitePromise;
}

export function invalidateProducts() {
  productCache = null;
  productPromise = null;
  emit();
}

export function loadProducts(force) {
  if (!isRemote()) return Promise.resolve(readLocalProducts());
  if (!force && productCache) return Promise.resolve(productCache);
  if (!force && productPromise) return productPromise;
  productPromise = call("products")
    .then((data) => {
      productCache = data;
      return data;
    })
    .finally(() => {
      productPromise = null;
    });
  return productPromise;
}

export function useRemoteFlag() {
  return isRemote();
}
