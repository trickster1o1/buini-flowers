import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { call } from "../api/client";
import { SHIPPING, money, occasions } from "../data/catalog";
import { useShop } from "../context/ShopContext";
import useTitle from "../components/useTitle";

const empty = {
  firstName: "Mira",
  lastName: "Chen",
  email: "mira@buini.test",
  phone: "+977 980-100-0001",
  address: "12 Lazimpat Marg",
  city: "Kathmandu",
  region: "Bagmati",
  occasion: "Just because",
  note: "",
  deliveryDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
};

export default function Checkout() {
  useTitle("Checkout");
  const navigate = useNavigate();
  const { cart, subtotal, discount, coupon, shipping, clearCart } = useShop();
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const shippingCost = SHIPPING[shipping].cost;
  const total = Math.max(0, subtotal - discount) + shippingCost;

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function place(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const order = await call("order", {
        ...form,
        shipping,
        coupon: coupon?.code || "",
        discount,
        subtotal,
        shippingCost,
        total,
        items: cart.map(({ key, ...item }) => item),
      });
      sessionStorage.setItem("buini_last_order", JSON.stringify(order));
      clearCart();
      navigate(`/order/${order.id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  if (cart.length === 0) {
    return (
      <div className="wrap page empty">
        <h1>Nothing to check out</h1>
        <Link className="btn" to="/shop">Shop the collection</Link>
      </div>
    );
  }

  return (
    <div className="wrap page">
      <nav className="crumbs"><Link to="/cart">Cart</Link><span>/</span><span>Checkout</span></nav>
      <h1 className="page-title">Checkout</h1>
      <form className="checkout-layout" onSubmit={place}>
        <div className="stack">
          <p>Payment is collected on delivery, at pickup, or by transfer for wedding work. This places the order with the studio. It does not take a card.</p>
          <div className="stack two">
            <label>First name<input required value={form.firstName} onChange={(event) => setField("firstName", event.target.value)} /></label>
            <label>Last name<input required value={form.lastName} onChange={(event) => setField("lastName", event.target.value)} /></label>
          </div>
          <div className="stack two">
            <label>Email<input type="email" required value={form.email} onChange={(event) => setField("email", event.target.value)} /></label>
            <label>Phone<input required value={form.phone} onChange={(event) => setField("phone", event.target.value)} /></label>
          </div>
          <label>Address<input required value={form.address} onChange={(event) => setField("address", event.target.value)} /></label>
          <div className="stack two">
            <label>City<input required value={form.city} onChange={(event) => setField("city", event.target.value)} /></label>
            <label>Region<input required value={form.region} onChange={(event) => setField("region", event.target.value)} /></label>
          </div>
          <div className="stack two">
            <label>Occasion
              <select value={form.occasion} onChange={(event) => setField("occasion", event.target.value)}>
                {occasions.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
            <label>Delivery date<input type="date" required value={form.deliveryDate} onChange={(event) => setField("deliveryDate", event.target.value)} /></label>
          </div>
          <label>Card note<textarea rows="4" value={form.note} onChange={(event) => setField("note", event.target.value)} placeholder="A line to tuck into the wrap" /></label>
          {error && <p className="error">{error}</p>}
          <button className="place-order" type="submit" disabled={busy}>{busy ? "Placing…" : "Place order"}</button>
        </div>
        <aside className="summary">
          <h2>Your order</h2>
          {cart.map((line) => (
            <div className="sum-row" key={line.key}>
              <span>{line.name} × {line.qty}</span>
              <span>{money(line.unitPrice * line.qty)}</span>
            </div>
          ))}
          <div className="sum-row"><span>{SHIPPING[shipping].label}</span><span>{shippingCost === 0 ? "Free" : money(shippingCost)}</span></div>
          {discount > 0 && <div className="sum-row"><span>{coupon.code}</span><span>–{money(discount)}</span></div>}
          <div className="sum-row total-row"><span>Total</span><strong>{money(total)}</strong></div>
        </aside>
      </form>
    </div>
  );
}
