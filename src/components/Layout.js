import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { money } from "../data/catalog";
import { call } from "../api/client";
import { useShop } from "../context/ShopContext";
import useProducts from "./useProducts";
import useSite from "./useSite";
import Icon, { SocialIcon } from "./Icons";

const pageLinks = [
  ["About", "/pages/about"],
  ["FAQ", "/pages/faq"],
  ["Shipping", "/pages/shipping"],
  ["Returns", "/pages/returns"],
  ["Careers", "/pages/careers"],
  ["Terms & conditions", "/pages/terms"],
  ["Privacy policy", "/pages/privacy"],
];

export default function Layout() {
  const { cart, count, subtotal, toast } = useShop();
  const { items } = useProducts();
  const site = useSite();
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState("");

  useEffect(() => {
    setMenu(false);
    setSearch(false);
    const active = document.activeElement;
    if (active && active.closest(".cart-hover")) active.blur();
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo?.(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") {
        setMenu(false);
        setSearch(false);
      }
    }
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = menu || search ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menu, search]);

  const matches = query.trim()
    ? items.filter((product) => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6)
    : [];

  async function subscribe(event) {
    event.preventDefault();
    try {
      await call("subscribe", { email });
      setSubscribed("You are on the list.");
      setEmail("");
    } catch (error) {
      setSubscribed(error.message);
    }
  }

  return (
    <div className="site">
      <header className="site-header">
        <div className="bar">
          <button className="icon-btn menu-btn" type="button" aria-label="Open menu" onClick={() => setMenu(true)}>
            <Icon name="menu" />
          </button>
          <Link to="/" className="logo">BUINI</Link>
          <nav className="nav" aria-label="Primary">
          <NavLink to="/" end>Home</NavLink>
          <div className="drop">
            <NavLink to="/shop">Shop</NavLink>
            <div className="drop-panel">
              <Link to="/shop">All pieces</Link>
              <Link to="/shop?category=Bouquets">Bouquets</Link>
              <Link to="/shop?category=Dried">Dried</Link>
              <Link to="/shop?category=Wedding">Wedding</Link>
              <Link to="/shop?category=Stems">Stems</Link>
              <Link to="/shop?category=Seasonal">Seasonal</Link>
            </div>
          </div>
          <NavLink to="/blog">Blog</NavLink>
          <div className="drop">
            <span className="nav-label">Pages</span>
            <div className="drop-panel">
              {pageLinks.map(([label, href]) => <Link key={href} to={href}>{label}</Link>)}
            </div>
          </div>
          <NavLink to="/contact">Contacts</NavLink>
          </nav>
          <div className="tools">
            <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearch(true)}>
              <Icon name="search" />
            </button>
            <div className="cart-hover">
              <Link to="/cart" className="bag" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
                <Icon name="bag" />
                {count > 0 && <span className="count">{count}</span>}
              </Link>
              <div className="cart-pop">
                {cart.length === 0 ? (
                  <p className="cart-pop-empty">Your basket is empty.</p>
                ) : (
                  <>
                    <ul className="cart-pop-lines">
                      {cart.map((line) => (
                        <li key={line.key}>
                          <img src={line.image} alt="" />
                          <div>
                            <strong>{line.name}{line.color ? `, ${line.color}` : ""}</strong>
                            <span className="cart-pop-brand">{line.brand}</span>
                            <span>{line.qty} × {money(line.unitPrice)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="cart-pop-total">
                      <span>Subtotal</span>
                      <strong>{money(subtotal)}</strong>
                    </div>
                    <div className="cart-pop-actions">
                      <Link to="/cart">View cart</Link>
                      <Link className="fill" to="/checkout">Checkout</Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {menu && (
        <div className="drawer">
          <button type="button" className="icon-btn close-drawer" aria-label="Close menu" onClick={() => setMenu(false)}>
            <Icon name="close" />
          </button>
          <Link to="/" onClick={() => setMenu(false)}>Home</Link>
          <Link to="/shop" onClick={() => setMenu(false)}>Shop</Link>
          <Link to="/blog" onClick={() => setMenu(false)}>Blog</Link>
          <Link to="/contact" onClick={() => setMenu(false)}>Contacts</Link>
          {pageLinks.map(([label, href]) => (
            <Link key={href} to={href} onClick={() => setMenu(false)}>{label}</Link>
          ))}
        </div>
      )}

      {search && (
        <div className="search-layer" role="dialog" aria-label="Search the studio">
          <button type="button" className="icon-btn search-close" aria-label="Close search" onClick={() => setSearch(false)}>
            <Icon name="close" />
          </button>
          <form onSubmit={(event) => event.preventDefault()}>
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the studio"
              aria-label="Search the studio"
            />
          </form>
          <div className="search-results">
            {matches.map((product) => (
              <Link key={product.id} to={`/product/${product.slug}`} onClick={() => setSearch(false)}>
                <img src={product.images[0]} alt="" />
                <span>
                  <small>{product.brand}</small>
                  {product.name}
                </span>
              </Link>
            ))}
            {query.trim() && matches.length === 0 && <p className="muted">Nothing in the studio matches that.</p>}
          </div>
        </div>
      )}

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="wrap footer-grid">
          <div>
            <h2>Sign up to get 10% off your first order and stay up to date on the latest studio releases, special offers and news</h2>
            <form onSubmit={subscribe} className="news-form">
              <input
                type="email"
                required
                placeholder="Your email *"
                aria-label="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button type="submit">Subscribe</button>
            </form>
            {subscribed && <p className="form-note">{subscribed}</p>}
          </div>
          <div>
            <p className="foot-label">Shop</p>
            <Link to="/shop">Shop</Link>
            <Link to="/pages/faq">FAQ</Link>
            <Link to="/pages/shipping">Shipping</Link>
            <Link to="/pages/returns">Returns</Link>
            <Link to="/pages/careers">Careers</Link>
            <Link to="/pages/terms">Terms & conditions</Link>
            <Link to="/pages/privacy">Privacy policy</Link>
          </div>
          <div>
            <p>If you have any questions regarding your order, products or our service, please contact our customer service.</p>
            {site.hours ? <p><strong>Hours</strong> {site.hours}</p> : null}
            {site.phone ? <p><strong>Phone</strong> {site.phone}</p> : null}
            {site.email ? <p><strong>Email</strong> {site.email}</p> : null}
            {site.address ? <p><strong>Address</strong> {site.address}</p> : null}
          </div>
        </div>
        <div className="wrap footer-base">
          <div className="pays" aria-label="Payment methods">
            {["Visa", "Mastercard", "Amex", "Pay"].map((name) => <span key={name}>{name}</span>)}
          </div>
          <p>© {new Date().getFullYear()} BUINI. All Rights Reserved.</p>
          <div className="socials">
            <a href="#social" aria-label="Facebook" onClick={(event) => event.preventDefault()}><SocialIcon name="facebook" /></a>
            <a href="#social" aria-label="Instagram" onClick={(event) => event.preventDefault()}><SocialIcon name="instagram" /></a>
            <a href="#social" aria-label="X" onClick={(event) => event.preventDefault()}><SocialIcon name="x" /></a>
            <a href="#social" aria-label="YouTube" onClick={(event) => event.preventDefault()}><SocialIcon name="youtube" /></a>
          </div>
        </div>
      </footer>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
