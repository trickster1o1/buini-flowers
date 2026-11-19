import { useState } from "react";
import { Link } from "react-router-dom";
import { SHIPPING, money } from "../data/catalog";
import { useShop } from "../context/ShopContext";
import useTitle from "../components/useTitle";

export default function Cart() {
  useTitle("Cart");
  const { cart, updateQty, removeLine, subtotal, discount, coupon, applyCoupon, clearCoupon, shipping, setShipping } = useShop();
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const shippingCost = SHIPPING[shipping].cost;
  const total = Math.max(0, subtotal - discount) + shippingCost;

  async function submitCoupon(event) {
    event.preventDefault();
    try {
      await applyCoupon(code);
      setMessage("");
      setCode("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <div className="wrap page">
      <nav className="crumbs"><Link to="/">Home</Link><span>/</span><span>Cart</span></nav>
      <h1 className="page-title">Cart</h1>
      {cart.length === 0 ? (
        <div className="empty">
          <p>Your basket is empty. The studio is tying flowers today.</p>
          <Link className="btn" to="/shop">Shop the collection</Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div>
            <div className="line-head"><span>Product</span><span>Quantity</span><span>Subtotal</span></div>
            {cart.map((line) => (
              <div className="line" key={line.key}>
                <div className="line-product">
                  <img src={line.image} alt="" />
                  <div>
                    <Link to={`/product/${line.slug}`}>{line.name}</Link>
                    <small>{line.brand} · {line.size} · {line.color}</small>
                    <div><button className="remove" type="button" onClick={() => removeLine(line.key)}>Remove</button></div>
                  </div>
                </div>
                <div className="stepper">
                  <button type="button" aria-label="Decrease quantity" onClick={() => updateQty(line.key, line.qty - 1)}>–</button>
                  <span>{line.qty}</span>
                  <button type="button" aria-label="Increase quantity" onClick={() => updateQty(line.key, line.qty + 1)}>+</button>
                </div>
                <strong>{money(line.unitPrice * line.qty)}</strong>
              </div>
            ))}
          </div>
          <aside className="summary">
            <h2>Coupon code <button className="icon-btn" type="button" aria-label="Toggle coupon" onClick={() => setOpen((value) => !value)}>+</button></h2>
            {open && (
              <form className="coupon-box" onSubmit={submitCoupon}>
                <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="BLOOM10" aria-label="Coupon code" />
                <button type="submit">Apply</button>
              </form>
            )}
            {coupon && <p className="quiet">{coupon.code} · {coupon.label} <button className="remove" type="button" onClick={clearCoupon}>Remove</button></p>}
            {message && <p className="error">{message}</p>}
            <div className="sum-row"><span>Subtotal</span><strong>{money(subtotal)}</strong></div>
            <div className="sum-row" style={{ display: "block" }}>
              <span>Shipment</span>
              {Object.values(SHIPPING).map((option) => (
                <label className="ship-choice" key={option.id}>
                  <span><input type="radio" name="ship" checked={shipping === option.id} onChange={() => setShipping(option.id)} /> {option.label}</span>
                  <span>{option.cost === 0 ? "Free" : money(option.cost)}</span>
                </label>
              ))}
            </div>
            {discount > 0 && <div className="sum-row"><span>Discount</span><strong>–{money(discount)}</strong></div>}
            <div className="sum-row"><span>Shipping to</span><span>Kathmandu</span></div>
            <div className="sum-row total-row"><span>Total</span><strong>{money(total)}</strong></div>
            <Link className="btn checkout" to="/checkout">Checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
