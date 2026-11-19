import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { STUDIO } from "../data/catalog";
import { call } from "../api/client";
import { useShop } from "../context/ShopContext";
import useProducts from "./useProducts";
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
  const { count, toast } = useShop();
  const { items } = useProducts();
  const location = useLocation();
  const [menu, setMenu] = useState(false);
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState("");

  useEffect(() => {
    setMenu(false);
    setSearch(false);
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
        <div className="promo">
          <Link to="/shop">Best special offers! 10% off with code Bloom10</Link>
        </div>
        <div className="bar">
          <button className="icon-btn menu-btn" type="button" aria-label="Open menu" onClick={() => setMenu(true)}>
            <Icon name="menu" />
          </button>
          <Link to="/" className="logo">BUINI</Link>
          <div className="tools">
            <Link to="/account" aria-label="Account"><Icon name="user" /></Link>
            <button type="button" className="icon-btn" aria-label="Search" onClick={() => setSearch(true)}>
              <Icon name="search" />
            </button>
            <Link to="/wishlist" aria-label="Wishlist"><Icon name="heart" /></Link>
            <Link to="/cart" className="bag" aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}>
              <Icon name="bag" />
              {count > 0 && <span className="count">{count}</span>}
            </Link>
          </div>
        </div>
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
          <div className="drop mega-drop">
            <span className="nav-label">Mega</span>
            <div className="mega">
              <div>
                <p>The edit</p>
                <Link to="/shop?category=Bouquets">Hand-tied bouquets</Link>
                <Link to="/shop?category=Seasonal">What is in season</Link>
                <Link to="/shop?category=Stems">Single stems</Link>
              </div>
              <div>
                <p>Occasions</p>
                <Link to="/shop?category=Wedding">Weddings</Link>
                <Link to="/shop?category=Dried">Dried & kept</Link>
                <Link to="/contact">A custom order</Link>
              </div>
              <Link to="/shop?category=Seasonal" className="mega-feature">
                <img src="https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=700&q=80" alt="" />
                <span>Winter collection</span>
              </Link>
            </div>
          </div>
          <NavLink to="/contact">Contacts</NavLink>
        </nav>
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
          <Link to="/wishlist" onClick={() => setMenu(false)}>Wishlist</Link>
          <Link to="/account" onClick={() => setMenu(false)}>Account</Link>
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
            <p><strong>Hours</strong> {STUDIO.hours}</p>
            <p><strong>Phone</strong> {STUDIO.phone}</p>
            <p><strong>Email</strong> {STUDIO.email}</p>
            <p><strong>Address</strong> {STUDIO.address}</p>
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
        <div className="wrap footer-studio">
          <Link to="/flowerlog">Studio desk</Link>
        </div>
      </footer>
      {toast && <div className="toast" role="status">{toast}</div>}
    </div>
  );
}
