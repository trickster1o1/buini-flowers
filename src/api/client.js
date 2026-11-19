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

export function readLocalProducts() {
  return withStock(catalogProducts, readCrm().stock || {});
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

function dashboardFrom(crm) {
  const active = crm.orders.filter((order) => order.status !== "Cancelled");
  const revenue = moneyRound(active.reduce((sum, order) => sum + Number(order.total || 0), 0));
  const open = crm.orders.filter((order) => !["Delivered", "Cancelled"].includes(order.status)).length;
  const inventory = withStock(catalogProducts, crm.stock || {});
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
  const stocked = () => withStock(catalogProducts, crm.stock || {});

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
        const product = catalogProducts.find((entry) => entry.id === item.productId);
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
      return crm.orders;
    case "orderUpdate": {
      const order = crm.orders.find((item) => item.id === payload.id);
      if (!order) throw new Error("Order not found.");
      order.status = payload.status;
      writeCrm(crm);
      return order;
    }
    case "customers":
      return crm.customers;
    case "inventory":
      return stocked();
    case "stock": {
      const next = Math.max(0, Number(payload.stock) || 0);
      crm.stock[payload.id] = next;
      writeCrm(crm);
      return { id: payload.id, stock: next };
    }
    case "inquiries":
      return crm.inquiries;
    case "inquiryUpdate": {
      const inquiry = crm.inquiries.find((item) => item.id === payload.id);
      if (!inquiry) throw new Error("Message not found.");
      inquiry.status = payload.status;
      writeCrm(crm);
      return inquiry;
    }
    case "subscribers":
      return crm.subscribers;
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
  return json.data;
}

let productCache = null;
let productPromise = null;

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
      emit();
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
