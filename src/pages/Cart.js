import { Link } from "react-router-dom";
import { money } from "../data/catalog";
import { useShop } from "../context/ShopContext";
import useTitle from "../components/useTitle";

export default function Cart() {
  useTitle("Cart");
  const { cart, updateQty, removeLine, subtotal } = useShop();

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
                    <small>{[line.brand, line.color].filter(Boolean).join(" · ")}</small>
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
            <div className="sum-row total-row"><span>Total</span><strong>{money(subtotal)}</strong></div>
            <Link className="btn checkout" to="/checkout">Checkout</Link>
          </aside>
        </div>
      )}
    </div>
  );
}
