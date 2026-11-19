import { createContext, useContext, useEffect, useRef, useState } from "react";
import { calcDiscount, moneyRound, unitPrice } from "../data/catalog";
import { call, subscribeCatalog } from "../api/client";

const ShopContext = createContext(null);
const CART_KEY = "buini_cart_v1";

function readCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : { cart: [], wishlist: [], recent: [], coupon: null, shipping: "flat" };
  } catch (error) {
    return { cart: [], wishlist: [], recent: [], coupon: null, shipping: "flat" };
  }
}

export function ShopProvider({ children }) {
  const stored = useRef(readCart());
  const [cart, setCart] = useState(stored.current.cart || []);
  const [wishlist, setWishlist] = useState(stored.current.wishlist || []);
  const [recent, setRecent] = useState(stored.current.recent || []);
  const [coupon, setCoupon] = useState(stored.current.coupon || null);
  const [shipping, setShipping] = useState(stored.current.shipping || "flat");
  const [toast, setToast] = useState("");
  const [catalogTick, setCatalogTick] = useState(0);
  const timer = useRef(null);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify({ cart, wishlist, recent, coupon, shipping }));
  }, [cart, wishlist, recent, coupon, shipping]);

  useEffect(() => subscribeCatalog(() => setCatalogTick((value) => value + 1)), []);

  function notify(message) {
    setToast(message);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(""), 2400);
  }

  function addToCart(product, options) {
    const size = options.size || product.sizes[0];
    const color = options.color || product.colors[0].name;
    const qty = Math.max(1, Number(options.qty) || 1);
    if (product.stock <= 0) {
      notify("That piece is sold out.");
      return;
    }
    const price = unitPrice(product, size);
    const key = `${product.id}|${size}|${color}`;
    const existing = cart.find((line) => line.key === key);
    const inCart = cart.filter((line) => line.productId === product.id).reduce((sum, line) => sum + line.qty, 0);
    if (inCart + qty > product.stock) {
      notify("There are not enough stems for that quantity.");
      return;
    }
    const nextQty = (existing ? existing.qty : 0) + qty;
    const line = {
      key,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand,
      image: product.images[0],
      size,
      color,
      unitPrice: price,
      qty: nextQty,
    };
    setCart((lines) => (existing ? lines.map((item) => (item.key === key ? line : item)) : [...lines, line]));
    notify(`${product.name} is in your basket.`);
  }

  function updateQty(key, qty) {
    setCart((lines) => lines.flatMap((line) => {
      if (line.key !== key) return [line];
      if (qty <= 0) return [];
      return [{ ...line, qty }];
    }));
  }

  function removeLine(key) {
    setCart((lines) => lines.filter((line) => line.key !== key));
  }

  function toggleWish(productId) {
    setWishlist((ids) => (ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId]));
  }

  function pushRecent(slug) {
    setRecent((slugs) => [slug, ...slugs.filter((item) => item !== slug)].slice(0, 8));
  }

  async function applyCoupon(code) {
    const subtotal = cart.reduce((sum, line) => sum + line.unitPrice * line.qty, 0);
    const result = await call("coupon", { code, subtotal });
    setCoupon({ code: result.code, type: result.type, amount: result.amount, label: result.label });
    notify(`${result.code} applied.`);
    return result;
  }

  function clearCoupon() {
    setCoupon(null);
  }

  function clearCart() {
    setCart([]);
    setCoupon(null);
  }

  const subtotal = moneyRound(cart.reduce((sum, line) => sum + line.unitPrice * line.qty, 0));
  const discount = calcDiscount(coupon, subtotal);
  const count = cart.reduce((sum, line) => sum + line.qty, 0);

  const value = {
    cart,
    wishlist,
    recent,
    coupon,
    shipping,
    toast,
    catalogTick,
    subtotal,
    discount,
    count,
    addToCart,
    updateQty,
    removeLine,
    toggleWish,
    pushRecent,
    applyCoupon,
    clearCoupon,
    setShipping,
    clearCart,
    notify,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) throw new Error("useShop must be used inside ShopProvider");
  return context;
}
