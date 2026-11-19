import { Link } from "react-router-dom";
import { money } from "../data/catalog";
import { useShop } from "../context/ShopContext";

export default function ProductCard({ product }) {
  const { addToCart, toggleWish, wishlist } = useShop();
  const wished = wishlist.includes(product.id);
  const soldOut = product.stock <= 0;

  return (
    <article className="pcard">
      <Link to={`/product/${product.slug}`} className="pcard-media">
        {product.badge && <span className={`badge ${product.badge === "SALE" ? "sale" : ""}`}>{product.badge}</span>}
        <img src={product.images[0]} alt={product.name} />
        <span className="pcard-hover">
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              addToCart(product, { qty: 1 });
            }}
            disabled={soldOut}
          >
            {soldOut ? "Sold out" : "Add to cart"}
          </button>
          <button
            type="button"
            className={wished ? "on" : ""}
            aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              toggleWish(product.id);
            }}
          >
            {wished ? "Saved" : "Save"}
          </button>
        </span>
      </Link>
      <div className="pcard-meta">
        <p className="pcard-brand">{product.brand}</p>
        <Link to={`/product/${product.slug}`}>{product.name}</Link>
        <p className="pcard-price">
          {product.compareAt ? <s>{money(product.compareAt)}</s> : null}
          <span className={product.compareAt ? "sale" : ""}>{money(product.price)}</span>
        </p>
        <div className="swatches">
          {product.colors.map((color) => (
            <i key={color.name} style={{ background: color.hex }} title={color.name} />
          ))}
        </div>
      </div>
    </article>
  );
}
