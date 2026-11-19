import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import rose from "../rose.jpg";
import { call, isRemote } from "../api/client";
import { ADMIN_EMAIL, ADMIN_PASSWORD, formatDate, money } from "../data/catalog";
import useTitle from "../components/useTitle";

const STATUSES = ["New", "Processing", "Ready", "Out for delivery", "Delivered", "Cancelled"];
const VIEWS = [
  ["", "Dashboard"],
  ["orders", "Orders"],
  ["customers", "Customers"],
  ["inventory", "Inventory"],
  ["inquiries", "Inquiries"],
  ["subscribers", "Subscribers"],
];

function token() {
  return sessionStorage.getItem("buini_admin_token") || "";
}

function DeskLoader() {
  return (
    <div className="desk-loader" role="status" aria-label="Loading the studio desk">
      <img src={rose} alt="" />
    </div>
  );
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
      <div className="admin-tools">
        <h1 className="page-title" style={{ margin: 0 }}>Studio desk</h1>
        <button className="ghost" type="button" onClick={logout}>Sign out</button>
      </div>
      <div className="admin">
        <nav className="admin-nav">
          {VIEWS.map(([id, label]) => (
            <NavLink key={label} to={id ? `/flowerlog/${id}` : "/flowerlog"} end={!id} className={current === (id || "dashboard") ? "on" : ""}>
              {label}
            </NavLink>
          ))}
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

  async function updateStock(id, stock) {
    await call("stock", { token: token(), id, stock });
    refresh();
  }

  async function resetDemo() {
    await call("reset", { token: token() });
    refresh();
  }

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
            <ul>{(selected.items || []).map((item) => <li key={`${item.productId}${item.size}${item.color}`}>{item.qty} × {item.name} · {item.size} · {item.color}</li>)}</ul>
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
      <div className="table-wrap">
        <table>
          <thead><tr><th>Piece</th><th>Category</th><th>Price</th><th>Stock</th></tr></thead>
          <tbody>
            {rows.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{money(product.price)}</td>
                <td>
                  <input
                    aria-label={`${product.name} stock`}
                    type="number"
                    min="0"
                    defaultValue={product.stock}
                    style={{ width: 80 }}
                    onBlur={(event) => {
                      if (Number(event.target.value) !== Number(product.stock)) updateStock(product.id, event.target.value);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pager page={data.page} pages={data.pages} total={data.total} onPage={goTo} />
      </div>
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
