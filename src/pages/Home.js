import { Link } from "react-router-dom";
import { posts } from "../data/catalog";
import { Mark } from "../components/Icons";
import ProductCard from "../components/ProductCard";
import useProducts from "../components/useProducts";
import useTitle from "../components/useTitle";

const mosaic = [
  ["https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=800&q=80", "Bouquets", "/shop?category=Bouquets"],
  ["https://images.unsplash.com/photo-1520763185298-1b434c919102?auto=format&fit=crop&w=800&q=80", "Seasonal", "/shop?category=Seasonal"],
  ["https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80", "Stems", "/shop?category=Stems"],
  ["https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=800&q=80", "Dried", "/shop?category=Dried"],
];

const insta = [
  "photo-1525310072745-f49212b5ac6d",
  "photo-1468327768560-75b778cbb551",
  "photo-1563241527-3004b7be0ffd",
  "photo-1490750967868-88aa4486c946",
  "photo-1507290439931-a861b5a38200",
  "photo-1572454591674-2739f30d8c40",
];

export default function Home() {
  useTitle("");
  const { items, loading, error } = useProducts();
  const edit = items.filter((product) => product.trending).slice(0, 4);

  return (
    <div>
      <section className="hero">
        <div className="hero-main">
          <img src="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1400&q=80" alt="A hand-tied winter bouquet" />
        </div>
        <div className="hero-col">
          <div className="hero-copy">
            <Mark />
            <h1>New Winter<br />Collection 2026</h1>
            <Link className="btn" to="/shop">Shop now</Link>
          </div>
          <div className="hero-pair">
            <img src="https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80" alt="Garden roses wrapped in paper" />
            <img src="https://images.unsplash.com/photo-1468327768560-75b778cbb551?auto=format&fit=crop&w=800&q=80" alt="Pink tulips" />
          </div>
        </div>
      </section>

      <section className="mosaic">
        {mosaic.map(([src, label, href]) => (
          <Link key={label} to={href}>
            <img src={src} alt="" />
            <span>{label}</span>
          </Link>
        ))}
      </section>

      <div className="wrap wordstrip" aria-hidden="true">
        <span>Atelier</span><span>Hand-tied</span><span>Dried</span><span>Bridal</span><span>Seasonal</span><span>Stems</span>
      </div>

      <section className="wrap">
        <h2 className="sec-title">The edit</h2>
        {error && <p className="error">{error}</p>}
        <div className="grid-4">
          {loading && items.length === 0
            ? [0, 1, 2, 3].map((item) => <div key={item} className="skeleton" />)
            : edit.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="looks">
        <Link to="/shop?category=Wedding" className="look">
          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1400&q=80" alt="A wedding table dressed with white flowers" />
          <span className="caption">Bridal edit</span>
        </Link>
        <Link to="/shop?category=Dried" className="look">
          <img src="https://images.unsplash.com/photo-1613539246066-78db6ec4ff0f?auto=format&fit=crop&w=1400&q=80" alt="Dried palms and preserved stems" />
          <span className="caption">Dried edit</span>
        </Link>
      </section>

      <section className="wrap">
        <h2 className="sec-title">Our news</h2>
        <div className="grid-3">
          {posts.map((post) => (
            <Link key={post.id} to={`/blog/${post.slug}`} className="news-card">
              <img src={post.image} alt="" />
              <time>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
              <h3>{post.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="banners">
        <Link to="/shop?category=Bouquets" className="banner">
          <img src="https://images.unsplash.com/photo-1487530811176-3780de880c2d?auto=format&fit=crop&w=900&q=80" alt="" />
          <span>Bouquets for the table</span>
        </Link>
        <Link to="/shop?category=Seasonal" className="banner">
          <img src="https://images.unsplash.com/photo-1494972308805-463bc619d34e?auto=format&fit=crop&w=900&q=80" alt="" />
          <span>Winter whites</span>
        </Link>
        <Link to="/shop" className="banner">
          <img src="https://images.unsplash.com/photo-1533616688419-b7a585564566?auto=format&fit=crop&w=900&q=80" alt="" />
          <span>Hand-tied this week</span>
        </Link>
      </section>

      <section className="insta" aria-label="Studio photographs">
        <div className="insta-row">
          {insta.map((id) => (
            <Link key={id} to="/shop">
              <img src={`https://images.unsplash.com/${id}?auto=format&fit=crop&w=500&q=80`} alt="" />
            </Link>
          ))}
        </div>
        <div className="insta-mark">BUINI</div>
      </section>
    </div>
  );
}
