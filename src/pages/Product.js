import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { call } from "../api/client";
import { money, productReviews } from "../data/catalog";
import { useShop } from "../context/ShopContext";
import useProducts from "../components/useProducts";
import useTitle from "../components/useTitle";
import ProductCard from "../components/ProductCard";

export default function Product() {
  const { slug } = useParams();
  const { items } = useProducts();
  const { addToCart, toggleWish, wishlist, pushRecent, recent } = useShop();
  const remember = useRef(pushRecent);
  remember.current = pushRecent;
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [image, setImage] = useState(0);
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [open, setOpen] = useState("description");

  useEffect(() => {
    let live = true;
    setError("");
    call("product", { slug })
      .then((data) => {
        if (!live) return;
        setProduct(data);
        setColor(data.colors[0]?.name || "");
        setImage(0);
        setQty(1);
        remember.current(data.slug);
      })
      .catch((err) => {
        if (live) setError(err.message);
      });
    return () => {
      live = false;
    };
  }, [slug]);

  useTitle(product ? product.name : "Piece");

  if (error) {
    return <div className="wrap page empty"><h1>{error}</h1><Link className="btn" to="/shop">Back to the shop</Link></div>;
  }
  if (!product) return <div className="wrap page"><div className="skeleton" /></div>;

  const reviews = product.reviews || productReviews(product.id);
  const related = items.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const viewed = recent.map((item) => items.find((productItem) => productItem.slug === item)).filter((item) => item && item.id !== product.id).slice(0, 4);
  const wished = wishlist.includes(product.id);
  const soldOut = product.stock <= 0;

  return (
    <div className="wrap page">
      <nav className="crumbs left">
        <Link to="/">Home</Link><span>/</span><Link to="/shop">Shop</Link><span>/</span><span>{product.name}</span>
      </nav>
      <article className="pdp">
        <div className="gallery">
          <div className="thumbs">
            {product.images.map((src, index) => (
              <button key={src} type="button" className={image === index ? "on" : ""} onClick={() => setImage(index)}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>
          <div className="stage">
            <img src={product.images[image]} alt={product.name} />
          </div>
        </div>
        <div className="pdp-info">
          <p className="eyebrow">{product.brand}</p>
          <h1>{product.name}</h1>
          <p className="pdp-price">
            {product.compareAt ? <s>{money(product.compareAt)}</s> : null}
            <span className={product.compareAt ? "sale" : ""}>{money(product.price)}</span>
          </p>
          <p className="blurb">{product.description}</p>
          <div className="option">
            <p>Color — {color}</p>
            <div className="color-row">
              {product.colors.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={color === item.name ? "on" : ""}
                  style={{ background: item.hex }}
                  aria-label={item.name}
                  onClick={() => setColor(item.name)}
                />
              ))}
            </div>
          </div>
          <p className="quiet">{soldOut ? "Sold out" : product.madeToOrder ? "Tied to order" : `${product.stock} in the studio`} · {money(product.price)}</p>
          <div className="buy">
            <div className="stepper">
              <button type="button" aria-label="Decrease quantity" onClick={() => setQty((value) => Math.max(1, value - 1))}>–</button>
              <span>{qty}</span>
              <button type="button" aria-label="Increase quantity" onClick={() => setQty((value) => value + 1)}>+</button>
            </div>
            <button className="add" type="button" disabled={soldOut} onClick={() => addToCart(product, { color, qty })}>
              {soldOut ? "Sold out" : "Add to cart"}
            </button>
          </div>
          <button className="text-link" type="button" onClick={() => toggleWish(product.id)}>
            {wished ? "Saved to wishlist" : "Add to wishlist"}
          </button>
          <p className="quiet">Order by 1pm for next-day delivery in Kathmandu. The ribbon color is the color chosen above.</p>
          <div className="accordion">
            {[
              ["description", "Description", <div key="d"><p>{product.description}</p><ul>{product.details.map((line) => <li key={line}>{line}</li>)}</ul></div>],
              ["additional", "Additional information", <p key="a">{product.additional}</p>],
              ["reviews", `Reviews (${reviews.length})`, reviews.length ? reviews.map((review) => (
                <blockquote key={review.id} className="review">
                  <span className="stars">{"★★★★★".slice(0, review.rating)}</span>
                  <strong>{review.title}</strong>
                  <p>{review.body}</p>
                  <cite>{review.author}</cite>
                </blockquote>
              )) : <p key="none">No studio notes yet.</p>],
            ].map(([id, label, body]) => (
              <div key={id}>
                <button className="acc" type="button" aria-expanded={open === id} onClick={() => setOpen(open === id ? "" : id)}>
                  {label} <span>{open === id ? "–" : "+"}</span>
                </button>
                {open === id && <div className="acc-body">{body}</div>}
              </div>
            ))}
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section className="related">
          <h2 className="sec-title">Related products</h2>
          <div className="grid-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      )}
      {viewed.length > 0 && (
        <section className="related">
          <h2 className="sec-title">Recently viewed</h2>
          <div className="grid-4">{viewed.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </section>
      )}
    </div>
  );
}
