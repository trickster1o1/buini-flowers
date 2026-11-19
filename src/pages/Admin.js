import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { call, invalidateProducts, invalidateSite, isRemote, loadSite } from "../api/client";
import { ADMIN_EMAIL, ADMIN_PASSWORD, categories, formatDate, money } from "../data/catalog";
import useTitle from "../components/useTitle";
import FlowerLoader from "../components/FlowerLoader";

const STATUSES = ["New", "Processing", "Ready", "Out for delivery", "Delivered", "Cancelled"];
const VIEWS = [
  ["", "Dashboard"],
  ["orders", "Orders"],
  ["customers", "Customers"],
  ["inventory", "Inventory"],
  ["inquiries", "Inquiries"],
  ["subscribers", "Subscribers"],
  ["site", "Site"],
];

function token() {
  return sessionStorage.getItem("buini_admin_token") || "";
}

function DeskLoader() {
  return <FlowerLoader compact label="Loading the studio desk" />;
}

const PAGE_SIZE = 8;

function Pager({ page, pages, total, onPage }) {
  if (total === 0) return <p className="showing">No records yet</p>;
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const windowStart = Math.max(1, Math.min(page - 2, pages - 4));
  const numbers = [];
  for (let n = windowStart; n <= Math.min(pages, windowStart + 4); n += 1) numbers.push(n);
  return (
    <div>
      <p className="showing">Showing {from}–{to} of {total}</p>
      {pages > 1 && (
        <div className="pager">
          <button type="button" onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Previous page">‹</button>
          {numbers.map((n) => (
            <button key={n} type="button" className={n === page ? "on" : ""} onClick={() => onPage(n)}>{n}</button>
          ))}
          <button type="button" onClick={() => onPage(page + 1)} disabled={page === pages} aria-label="Next page">›</button>
        </div>
      )}
    </div>
  );
}

export default function Admin() {
  useTitle("Studio desk");
  const [session, setSession] = useState(token);
  const location = useLocation();
  const bits = location.pathname.split("/").filter(Boolean);
  const deskAt = bits.lastIndexOf("flowerlog");
  const view = deskAt >= 0 ? bits[deskAt + 1] : "";
  const current = VIEWS.some(([id]) => id && id === view) ? view : "dashboard";
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login(event) {
    event.preventDefault();
    try {
      const result = await call("login", { email, password });
      sessionStorage.setItem("buini_admin_token", result.token);
      setSession(result.token);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  function logout() {
    sessionStorage.removeItem("buini_admin_token");
    setSession("");
  }

  if (!session) {
    return (
      <div className="wrap page">
        <h1 className="page-title">Studio desk</h1>
        <form className="stack admin-login" onSubmit={login}>
          <p>Orders, customers, stock, and messages live here.</p>
          <label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          <button type="submit">Enter</button>
          {error && <p className="error">{error}</p>}
          <p className="quiet">Demo desk · {ADMIN_EMAIL} · {ADMIN_PASSWORD}</p>
        </form>
      </div>
    );
  }

  return (
    <div className="wrap page">
      <div className="admin">
        <nav className="admin-nav">
          <div className="admin-links">
            {VIEWS.map(([id, label]) => (
              <NavLink key={label} to={id ? `/flowerlog/${id}` : "/flowerlog"} end={!id} className={current === (id || "dashboard") ? "on" : ""}>
                {label}
              </NavLink>
            ))}
          </div>
          <button className="ghost" type="button" onClick={logout}>Sign out</button>
        </nav>
        <Desk key={current} view={current} />
      </div>
    </div>
  );
}

function Desk({ view }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [revision, setRevision] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (view === "site") return undefined;
    let live = true;
    setData(null);
    setError("");
    const payload = { token: token(), page, pageSize: PAGE_SIZE };
    const request = view === "orders" ? call("orders", payload)
      : view === "customers" ? call("customers", payload)
      : view === "inventory" ? call("inventory", payload)
      : view === "inquiries" ? call("inquiries", payload)
      : view === "subscribers" ? call("subscribers", payload)
      : call("dashboard", { token: token() });
    request
      .then((result) => { if (live) setData(result); })
      .catch((err) => { if (live) setError(err.message); });
    return () => { live = false; };
  }, [view, page, revision]);

  function refresh() {
    setRevision((value) => value + 1);
  }

  function goTo(next) {
    setSelected(null);
    setPage(next);
  }

  async function updateOrder(id, status) {
    await call("orderUpdate", { token: token(), id, status });
    setSelected((order) => (order && order.id === id ? { ...order, status } : order));
    refresh();
  }

  async function updateInquiry(id, status) {
    await call("inquiryUpdate", { token: token(), id, status });
    refresh();
  }

  function showNewPiece() {
    invalidateProducts();
    const last = Math.max(1, Math.ceil(((data?.total || 0) + 1) / PAGE_SIZE));
    if (page === last) refresh();
    else setPage(last);
  }

  function showSavedPiece() {
    invalidateProducts();
    refresh();
  }

  async function resetDemo() {
    await call("reset", { token: token() });
    refresh();
  }

  if (view === "site") return <SiteDesk />;

  const listView = view !== "dashboard";
  if (error) return <p className="error">{error}</p>;
  if (!data || (listView && !Array.isArray(data.items))) return <DeskLoader />;
  const rows = listView ? data.items : [];

  if (view === "dashboard") {
    return (
      <div>
        <div className="stats">
          <div className="stat"><span>Revenue</span><b>{money(data.revenue)}</b></div>
          <div className="stat"><span>Orders</span><b>{data.orders}</b></div>
          <div className="stat"><span>Open</span><b>{data.openOrders}</b></div>
          <div className="stat"><span>New notes</span><b>{data.inquiries}</b></div>
        </div>
        <p className="quiet">{data.customers} customers · {data.subscribers} subscribers</p>
        {!isRemote() && <p>These records are the review demo, kept in this browser. Deploy the Apps Script and set REACT_APP_API_URL to keep them in a Google Sheet.</p>}
        {data.sheetUrl && <p><a href={data.sheetUrl} target="_blank" rel="noreferrer">Open the Google Sheet</a></p>}
        <h2 className="sec-title" style={{ textAlign: "left" }}>Needs tying</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Total</th></tr></thead>
            <tbody>
              {data.recent.map((order) => (
                <tr key={order.id}><td>{order.id}</td><td>{order.firstName} {order.lastName}</td><td>{order.status}</td><td>{money(order.total)}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="sec-title" style={{ textAlign: "left" }}>Low stock</h2>
        <ul>{data.lowStock.map((product) => <li key={product.id}>{product.name} · {product.stock} left</li>)}</ul>
        {!isRemote() && <button className="ghost" type="button" onClick={resetDemo}>Reset demo records</button>}
      </div>
    );
  }

  if (view === "orders") {
    return (
      <div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Order</th><th>When</th><th>Customer</th><th>Occasion</th><th>Total</th><th>Status</th></tr></thead>
            <tbody>
              {rows.map((order, index) => (
                <tr key={`${order.id}-${index}`} className={selected?.id === order.id && selected?.createdAt === order.createdAt ? "active" : ""} onClick={() => setSelected(order)}>
                  <td>{order.id}</td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{order.firstName} {order.lastName}</td>
                  <td>{order.occasion}</td>
                  <td>{money(order.total)}</td>
                  <td>{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pager page={data.page} pages={data.pages} total={data.total} onPage={goTo} />
        {selected && (
          <aside className="detail">
            <strong>{selected.id}</strong>
            <p>{selected.firstName} {selected.lastName} · {selected.email} · {selected.phone}</p>
            <p>{selected.address}, {selected.city} · {selected.shipping} · {formatDate(selected.deliveryDate)}</p>
            {selected.note && <p>Note: {selected.note}</p>}
            <ul>{(selected.items || []).map((item) => <li key={`${item.productId}${item.color}`}>{item.qty} × {item.name}{item.color ? ` · ${item.color}` : ""}</li>)}</ul>
            <label>Status
              <select value={selected.status} onChange={(event) => updateOrder(selected.id, event.target.value)}>
                {STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </aside>
        )}
      </div>
    );
  }

  if (view === "customers") {
    return (
      <div className="table-wrap">
        <table>
          <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Spent</th></tr></thead>
          <tbody>
            {rows.map((customer) => (
              <tr key={customer.email}>
                <td>{customer.firstName} {customer.lastName}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.orders}</td>
                <td>{money(customer.spent)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager page={data.page} pages={data.pages} total={data.total} onPage={goTo} />
      </div>
    );
  }

  if (view === "inventory") {
    return (
      <InventoryDesk
        rows={rows}
        page={data.page}
        pages={data.pages}
        total={data.total}
        onPage={goTo}
        onAdded={showNewPiece}
        onSaved={showSavedPiece}
      />
    );
  }

  if (view === "inquiries") {
    return (
      <div className="table-wrap">
        <table>
          <thead><tr><th>From</th><th>Topic</th><th>Message</th><th>Status</th></tr></thead>
          <tbody>
            {rows.map((item) => (
              <tr key={item.id}>
                <td>{item.name}<br />{item.email}</td>
                <td>{item.topic}</td>
                <td>{item.message}</td>
                <td>
                  <select value={item.status} onChange={(event) => updateInquiry(item.id, event.target.value)}>
                    <option>New</option>
                    <option>Replied</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager page={data.page} pages={data.pages} total={data.total} onPage={goTo} />
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead><tr><th>Email</th><th>Joined</th></tr></thead>
        <tbody>
          {rows.map((item) => (
            <tr key={item.email}><td>{item.email}</td><td>{formatDate(item.createdAt)}</td></tr>
          ))}
        </tbody>
      </table>
      <Pager page={data.page} pages={data.pages} total={data.total} onPage={goTo} />
    </div>
  );
}

const DEFAULT_COLOR_LINES = "Blush:#e7b7b0\nIvory:#f3efe6\nSage:#9aab84\nKraft:#c4a574";

const EMPTY_PIECE = {
  name: "",
  brand: "ATELIER",
  category: "Bouquets",
  price: "",
  compareAt: "",
  stock: "1",
  description: "",
  additional: "",
  image: "",
  details: "",
  colors: DEFAULT_COLOR_LINES,
  featured: false,
  trending: false,
  madeToOrder: false,
};

function formFromProduct(product) {
  return {
    id: product.id,
    name: product.name || "",
    brand: product.brand || "",
    category: product.category || "Bouquets",
    price: product.price ?? "",
    compareAt: product.compareAt || "",
    stock: product.stock ?? 0,
    badge: product.badge === "SOLD OUT" ? "" : product.badge || "",
    description: product.description || "",
    additional: product.additional || "",
    image: (product.images || []).join("\n"),
    details: (product.details || []).join("\n"),
    colors: (product.colors || []).map((color) => `${color.name}:${color.hex}`).join("\n"),
    featured: Boolean(product.featured),
    trending: Boolean(product.trending),
    madeToOrder: Boolean(product.madeToOrder),
  };
}

function InventoryDesk({ rows, page, pages, total, onPage, onAdded, onSaved }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_PIECE);
  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_PIECE);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [editError, setEditError] = useState("");
  const pieceCategories = categories.filter((item) => item.id !== "All");

  useEffect(() => {
    if (!editing) return undefined;
    function onKey(event) {
      if (event.key === "Escape") setEditing(null);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [editing]);

  function setField(field) {
    return (event) => {
      const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
      setForm((current) => ({ ...current, [field]: value }));
    };
  }

  function setEditField(field) {
    return (event) => {
      const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
      setEditForm((current) => ({ ...current, [field]: value }));
    };
  }

  function openEdit(product) {
    setOpen(false);
    setEditError("");
    setEditForm(formFromProduct(product));
    setEditing(product);
  }

  async function submit(event) {
    event.preventDefault();
    const name = form.name.trim();
    const price = Math.round(Number(form.price));
    if (!name) {
      setFormError("Name the piece.");
      return;
    }
    if (!price || price < 1) {
      setFormError("Enter a price.");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      await call("productCreate", {
        token: token(),
        ...form,
        name,
        price,
        stock: form.stock,
        compareAt: form.compareAt,
      });
      setForm(EMPTY_PIECE);
      setOpen(false);
      onAdded();
    } catch (err) {
      const message = err.message === "Unknown request."
        ? "The studio API needs the latest Apps Script deployed before it can save a new piece."
        : err.message;
      setFormError(message);
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit(event) {
    event.preventDefault();
    const name = editForm.name.trim();
    const price = Math.round(Number(editForm.price));
    if (!name) {
      setEditError("Name the piece.");
      return;
    }
    if (!price || price < 1) {
      setEditError("Enter a price.");
      return;
    }
    setSaving(true);
    setEditError("");
    try {
      await call("productUpdate", { token: token(), ...editForm, name, price });
      setEditing(null);
      onSaved();
    } catch (err) {
      const message = err.message === "Unknown request."
        ? "The studio API needs the latest Apps Script deployed before it can update a piece."
        : err.message;
      setEditError(message);
    } finally {
      setSaving(false);
    }
  }

  const editCategories = pieceCategories.some((item) => item.id === editForm.category)
    ? pieceCategories
    : [{ id: editForm.category, label: editForm.category }, ...pieceCategories];

  return (
    <div>
      <div className="piece-bar">
        <p className="quiet">{total} pieces in the studio</p>
        <button className="ghost" type="button" onClick={() => { setOpen((value) => !value); setFormError(""); }}>
          {open ? "Close" : "Add a piece"}
        </button>
      </div>
      {open && (
        <form className="stack piece-form" onSubmit={submit}>
          <div className="stack two">
            <label>Name<input value={form.name} onChange={setField("name")} required /></label>
            <label>Brand<input value={form.brand} onChange={setField("brand")} /></label>
          </div>
          <div className="stack two">
            <label>Category
              <select value={form.category} onChange={setField("category")}>
                {pieceCategories.map((item) => <option key={item.id}>{item.id}</option>)}
              </select>
            </label>
            <label>Stock<input type="number" min="0" value={form.stock} onChange={setField("stock")} /></label>
          </div>
          <div className="stack two">
            <label>Price<input type="number" min="1" step="1" value={form.price} onChange={setField("price")} required /></label>
            <label>Compare at<input type="number" min="0" step="1" value={form.compareAt} onChange={setField("compareAt")} placeholder="Optional sale price" /></label>
          </div>
          <div className="checks">
            <label className="check"><input type="checkbox" checked={form.featured} onChange={setField("featured")} /> Featured</label>
            <label className="check"><input type="checkbox" checked={form.trending} onChange={setField("trending")} /> Trending</label>
            <label className="check"><input type="checkbox" checked={form.madeToOrder} onChange={setField("madeToOrder")} /> Made to order</label>
          </div>
          <label>Description<textarea rows="3" value={form.description} onChange={setField("description")} placeholder="The sentence under the price" /></label>
          <label>Additional information<textarea rows="3" value={form.additional} onChange={setField("additional")} placeholder="Care, timing, or anything else the shopper should know" /></label>
          <label>Photo link<input value={form.image} onChange={setField("image")} placeholder="https://" /></label>
          <label>Details<textarea rows="3" value={form.details} onChange={setField("details")} placeholder="One line for each detail" /></label>
          <label>Colors<textarea rows="4" value={form.colors} onChange={setField("colors")} placeholder="Name:#hex" /></label>
          <button type="submit" disabled={saving}>{saving ? "Saving" : "Save piece"}</button>
          {formError && <p className="error">{formError}</p>}
        </form>
      )}
      <div className="table-wrap">
        <table>
          <thead><tr><th>Piece</th><th>Category</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{money(product.price)}</td>
                <td>{product.stock}</td>
                <td><button className="ghost" type="button" onClick={() => openEdit(product)}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager page={page} pages={pages} total={total} onPage={onPage} />
      </div>
      {editing && (
        <div className="modal-back" onClick={() => setEditing(null)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="edit-piece-title" onClick={(event) => event.stopPropagation()}>
            <div className="modal-head">
              <h2 id="edit-piece-title">Edit {editing.name}</h2>
              <button className="ghost" type="button" onClick={() => setEditing(null)}>Close</button>
            </div>
            <form className="stack piece-form modal-form" onSubmit={saveEdit}>
              <div className="stack two">
                <label>Name<input value={editForm.name} onChange={setEditField("name")} required /></label>
                <label>Brand<input value={editForm.brand} onChange={setEditField("brand")} /></label>
              </div>
              <div className="stack two">
                <label>Category
                  <select value={editForm.category} onChange={setEditField("category")}>
                    {editCategories.map((item) => <option key={item.id}>{item.id}</option>)}
                  </select>
                </label>
                <label>Stock<input type="number" min="0" value={editForm.stock} onChange={setEditField("stock")} /></label>
              </div>
              <div className="stack two">
                <label>Price<input type="number" min="1" step="1" value={editForm.price} onChange={setEditField("price")} required /></label>
                <label>Compare at<input type="number" min="0" step="1" value={editForm.compareAt} onChange={setEditField("compareAt")} placeholder="Optional sale price" /></label>
              </div>
              <div className="stack two">
                <label>Badge<input value={editForm.badge} onChange={setEditField("badge")} placeholder="SALE, NEW" /></label>
                <div className="checks">
                  <label className="check"><input type="checkbox" checked={editForm.featured} onChange={setEditField("featured")} /> Featured</label>
                  <label className="check"><input type="checkbox" checked={editForm.trending} onChange={setEditField("trending")} /> Trending</label>
                  <label className="check"><input type="checkbox" checked={editForm.madeToOrder} onChange={setEditField("madeToOrder")} /> Made to order</label>
                </div>
              </div>
              <label>Description<textarea rows="3" value={editForm.description} onChange={setEditField("description")} placeholder="The sentence under the price" /></label>
              <label>Additional information<textarea rows="3" value={editForm.additional} onChange={setEditField("additional")} placeholder="Care, timing, or anything else the shopper should know" /></label>
              <label>Photos<textarea rows="3" value={editForm.image} onChange={setEditField("image")} placeholder="One image link per line" /></label>
              <label>Details<textarea rows="3" value={editForm.details} onChange={setEditField("details")} placeholder="One line for each detail" /></label>
              <label>Colors<textarea rows="3" value={editForm.colors} onChange={setEditField("colors")} placeholder="Name:#hex" /></label>
              <div className="modal-actions">
                <button type="submit" disabled={saving}>{saving ? "Saving" : "Save changes"}</button>
                <button className="ghost" type="button" onClick={() => setEditing(null)}>Cancel</button>
              </div>
              {editError && <p className="error">{editError}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function SiteDesk() {
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let live = true;
    loadSite().then((site) => {
      if (live) setForm(site);
    });
    return () => {
      live = false;
    };
  }, []);

  function setField(field) {
    return (event) => {
      setSaved("");
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  async function submit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSaved("");
    try {
      const next = await call("siteUpdate", { token: token(), ...form });
      invalidateSite();
      setForm(next);
      setSaved("Saved. The home banner, contact details, and social links are updated.");
    } catch (err) {
      const message = err.message === "Unknown request."
        ? "The studio API needs the latest Apps Script deployed before the banner and contact details can be saved."
        : err.message;
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  if (!form) return <DeskLoader />;

  return (
    <form className="stack piece-form" onSubmit={submit}>
      <h2 className="sec-title" style={{ textAlign: "left" }}>Home banner</h2>
      <label>Title<textarea rows="2" value={form.bannerTitle} onChange={setField("bannerTitle")} placeholder="A new line starts the second line" /></label>
      <label>Banner photo<input value={form.bannerImage} onChange={setField("bannerImage")} placeholder="https://" /></label>
      <div className="stack two">
        <label>Button label<input value={form.bannerButton} onChange={setField("bannerButton")} /></label>
        <label>Button link<input value={form.bannerLink} onChange={setField("bannerLink")} placeholder="/shop" /></label>
      </div>
      <div className="stack two">
        <label>Left photo<input value={form.bannerSideA} onChange={setField("bannerSideA")} placeholder="https://" /></label>
        <label>Right photo<input value={form.bannerSideB} onChange={setField("bannerSideB")} placeholder="https://" /></label>
      </div>
      <h2 className="sec-title" style={{ textAlign: "left" }}>Contact details</h2>
      <label>Hours<input value={form.hours} onChange={setField("hours")} /></label>
      <div className="stack two">
        <label>Phone<input value={form.phone} onChange={setField("phone")} /></label>
        <label>Email<input type="email" value={form.email} onChange={setField("email")} /></label>
      </div>
      <label>Address<input value={form.address} onChange={setField("address")} /></label>
      <h2 className="sec-title" style={{ textAlign: "left" }}>Social links</h2>
      <div className="stack two">
        <label>Facebook<input value={form.facebook || ""} onChange={setField("facebook")} placeholder="https://" /></label>
        <label>Instagram<input value={form.instagram || ""} onChange={setField("instagram")} placeholder="https://" /></label>
      </div>
      <div className="stack two">
        <label>X<input value={form.x || ""} onChange={setField("x")} placeholder="https://" /></label>
        <label>YouTube<input value={form.youtube || ""} onChange={setField("youtube")} placeholder="https://" /></label>
      </div>
      <button type="submit" disabled={saving}>{saving ? "Saving" : "Save site"}</button>
      {saved && <p className="quiet">{saved}</p>}
      {error && <p className="error">{error}</p>}
    </form>
  );
}
