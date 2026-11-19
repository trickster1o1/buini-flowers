import { useSearchParams } from "react-router-dom";
import { categories } from "../data/catalog";
import ProductCard from "../components/ProductCard";
import useProducts from "../components/useProducts";
import useTitle from "../components/useTitle";

const PAGE_SIZE = 12;

function CatIcon({ id }) {
  const common = { viewBox: "0 0 64 64", fill: "none", stroke: "currentColor", strokeWidth: "1.4" };
  if (id === "Bouquets") {
    return <svg {...common}><circle cx="32" cy="24" r="8" /><circle cx="22" cy="30" r="7" /><circle cx="42" cy="30" r="7" /><path d="M32 38v16" /></svg>;
  }
  if (id === "Dried") {
    return <svg {...common}><path d="M18 50c6-14 8-22 14-34 6 12 8 20 14 34" /><path d="M32 20v32" /><path d="M24 28c4 2 8 2 16 0" /></svg>;
  }
  if (id === "Wedding") {
    return <svg {...common}><path d="M20 40c0-10 24-10 24 0" /><circle cx="24" cy="26" r="4" /><circle cx="40" cy="26" r="4" /><path d="M24 30c4 4 12 4 16 0" /></svg>;
  }
  if (id === "Stems") {
    return <svg {...common}><circle cx="32" cy="18" r="6" /><path d="M32 24v28" /><path d="M32 36c8 2 10 8 12 12" /></svg>;
  }
  if (id === "Seasonal") {
    return <svg {...common}><circle cx="32" cy="32" r="6" /><path d="M32 12v6M32 46v6M12 32h6M46 32h6M18 18l4 4M42 42l4 4M18 46l4-4M42 22l4-4" /></svg>;
  }
  return <svg {...common}><rect x="14" y="14" width="14" height="14" /><rect x="36" y="14" width="14" height="14" /><rect x="14" y="36" width="14" height="14" /><rect x="36" y="36" width="14" height="14" /></svg>;
}

export default function Shop() {
  useTitle("Shop");
  const { items, loading, error } = useProducts();
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "All";
  const sort = params.get("sort") || "featured";
  const query = (params.get("q") || "").trim().toLowerCase();
  const page = Math.max(1, Number(params.get("page")) || 1);

  function setParam(key, value) {
    const next = new URLSearchParams(params);
    if (!value || value === "All" || value === "featured") next.delete(key);
    else next.set(key, value);
    if (key !== "page") next.delete("page");
    setParams(next);
  }

  let list = items.filter((product) => (category === "All" ? true : product.category === category));
  if (query) {
    list = list.filter((product) => `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(query));
  }
  list = [...list].sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    if (sort === "name") return a.name.localeCompare(b.name);
    return Number(b.featured) - Number(a.featured) || Number(b.trending) - Number(a.trending);
  });

  const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, pages);
  const slice = list.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);
  const from = list.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1;
  const to = Math.min(safePage * PAGE_SIZE, list.length);

  return (
    <div className="wrap page">
      <div className="shop-head">
        <h1>Shop</h1>
        <div className="cat-icons">
          {categories.map((item) => (
            <button key={item.id} type="button" className={category === item.id ? "on" : ""} onClick={() => setParam("category", item.id)}>
              <CatIcon id={item.id} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <select className="sort" aria-label="Sort" value={sort} onChange={(event) => setParam("sort", event.target.value)}>
          <option value="featured">Featured</option>
          <option value="price-asc">Price, low to high</option>
          <option value="price-desc">Price, high to low</option>
          <option value="name">Name</option>
        </select>
      </div>
      {error && <p className="error">{error}</p>}
      <div className="grid-4">
        {loading && items.length === 0
          ? Array.from({ length: 8 }, (_, index) => <div key={index} className="skeleton" />)
          : slice.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
      {!loading && list.length === 0 && <p className="empty">Nothing in this edit yet.</p>}
      <p className="showing">Showing {from}–{to} of {list.length}</p>
      {pages > 1 && (
        <div className="pager">
          {Array.from({ length: pages }, (_, index) => (
            <button key={index + 1} type="button" className={safePage === index + 1 ? "on" : ""} onClick={() => setParam("page", String(index + 1))}>
              {index + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
