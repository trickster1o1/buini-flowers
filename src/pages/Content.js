import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import emailjs from "@emailjs/browser";
import rose from "../rose.jpg";
import { call } from "../api/client";
import { DEMO_CUSTOMER, formatDate, money, posts } from "../data/catalog";
import useSite from "../components/useSite";
import { useShop } from "../context/ShopContext";
import useProducts from "../components/useProducts";
import useTitle from "../components/useTitle";
import ProductCard from "../components/ProductCard";

export function Blog() {
  useTitle("Blog");
  return (
    <div className="wrap page">
      <h1 className="page-title">Our news</h1>
      <div className="grid-3">
        {posts.map((post) => (
          <Link key={post.id} to={`/blog/${post.slug}`} className="news-card">
            <img src={post.image} alt="" />
            <time>{formatDate(post.date)}</time>
            <h3>{post.title}</h3>
            <p className="muted">{post.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((item) => item.slug === slug);
  useTitle(post ? post.title : "Note");
  if (!post) return <div className="wrap page empty"><h1>That note is not in the studio.</h1></div>;
  return (
    <article className="wrap page article">
      <nav className="crumbs"><Link to="/blog">Blog</Link><span>/</span><span>{post.category}</span></nav>
      <p className="quiet">{formatDate(post.date)} · {post.category}</p>
      <h1>{post.title}</h1>
      <img className="hero-img" src={post.image} alt="" />
      {post.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
    </article>
  );
}

const MAIL_SERVICE = "service_t52cepr";
const MAIL_TEMPLATE = "template_tt7sqi7";
const MAIL_PUBLIC_KEY = "oDYDzwYQrLY_-YViZ";

export function Contact() {
  useTitle("Contacts");
  const site = useSite();
  const [form, setForm] = useState({ name: "", email: "", topic: "General", message: "" });
  const [note, setNote] = useState("");
  const [failed, setFailed] = useState(false);
  const [sending, setSending] = useState(false);

  async function send(event) {
    event.preventDefault();
    setSending(true);
    setNote("");
    setFailed(false);
    try {
      await emailjs.send(
        MAIL_SERVICE,
        MAIL_TEMPLATE,
        {
          name: form.name,
          email: form.email,
          message: `Topic: ${form.topic}\n\n${form.message}\n\nFrom: ${form.email}`,
          reply_to: form.email,
        },
        { publicKey: MAIL_PUBLIC_KEY }
      );
      try {
        await call("inquiry", form);
      } catch (error) {
        /* the email already went out; the desk copy is optional */
      }
      setNote("The studio has your note.");
      setForm({ name: "", email: "", topic: "General", message: "" });
    } catch (error) {
      setFailed(true);
      setNote(error?.text || error?.message || "The note could not be sent.");
    } finally {
      setSending(false);
    }
  }

  function setField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="wrap page">
      <h1 className="page-title">Contacts</h1>
      <div className="checkout-layout">
        <form className="stack" onSubmit={send}>
          <label>Name<input required value={form.name} onChange={(event) => setField("name", event.target.value)} /></label>
          <label>Email<input type="email" required value={form.email} onChange={(event) => setField("email", event.target.value)} /></label>
          <label>Topic
            <select value={form.topic} onChange={(event) => setField("topic", event.target.value)}>
              {["General", "Wedding", "Delivery", "Wholesale"].map((topic) => <option key={topic}>{topic}</option>)}
            </select>
          </label>
          <label>Message<textarea required rows="6" value={form.message} onChange={(event) => setField("message", event.target.value)} /></label>
          <button className="btn" type="submit" disabled={sending}>{sending ? "Sending…" : "Send"}</button>
          {note && <p className={failed ? "error" : undefined}>{note}</p>}
        </form>
        <aside className="studio-card">
          <h2>The studio</h2>
          <dl>
            {[
              ["Hours", site.hours],
              ["Phone", site.phone],
              ["Email", site.email],
              ["Address", site.address],
            ].filter(([, value]) => value).map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}

export function StaticPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [error, setError] = useState("");
  useTitle(page?.title || "Page");

  useEffect(() => {
    let live = true;
    call("page", { slug })
      .then((data) => { if (live) setPage(data); })
      .catch((err) => { if (live) setError(err.message); });
    return () => { live = false; };
  }, [slug]);

  if (error) return <div className="wrap page empty"><h1>{error}</h1></div>;
  if (!page) return <div className="wrap page"><div className="skeleton" /></div>;

  return (
    <div className="wrap page">
      <p className="quiet" style={{ textAlign: "center" }}>{page.kicker}</p>
      <h1 className="page-title">{page.title}</h1>
      {slug === "about" ? (
        <div className="about-grid">
          <img src={rose} alt="A single red studio rose" />
          <div className="prose">{page.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      ) : page.faq ? (
        <div className="faq narrow">
          {page.faq.map((item) => (
            <details key={item.q}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      ) : (
        <div className="prose">{page.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
      )}
    </div>
  );
}

export function Wishlist() {
  useTitle("Wishlist");
  const { wishlist, toggleWish } = useShop();
  const { items } = useProducts();
  const saved = items.filter((product) => wishlist.includes(product.id));
  return (
    <div className="wrap page">
      <h1 className="page-title">Wishlist</h1>
      {saved.length === 0 ? (
        <div className="empty">
          <p>Nothing saved yet.</p>
          <Link className="btn" to="/shop">Shop the collection</Link>
        </div>
      ) : (
        <div>
          <div className="grid-4">{saved.map((product) => <ProductCard key={product.id} product={product} />)}</div>
          <p style={{ textAlign: "center", marginTop: 18 }}>
            <button className="text-link" type="button" onClick={() => saved.forEach((product) => toggleWish(product.id))}>Clear wishlist</button>
          </p>
        </div>
      )}
    </div>
  );
}

export function Account() {
  useTitle("Account");
  const [email, setEmail] = useState(DEMO_CUSTOMER);
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  async function lookup(event) {
    event.preventDefault();
    try {
      const data = await call("account", { email });
      setOrders(data);
      setError("");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="wrap page">
      <h1 className="page-title">Account</h1>
      <form className="stack account-card" onSubmit={lookup}>
        <p>Look up the orders placed with an email. Mira’s demo orders are ready to view.</p>
        <label>Email<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
        <button className="btn" type="submit">View orders</button>
        <button className="text-link" type="button" onClick={() => setEmail(DEMO_CUSTOMER)}>Use {DEMO_CUSTOMER}</button>
        {error && <p className="error">{error}</p>}
      </form>
      {orders && (
        <div className="table-wrap">
          {orders.length === 0 ? <p className="empty">No orders for that email yet.</p> : (
            <table>
              <thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{order.status}</td>
                    <td>{money(order.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export function OrderDone() {
  const { id } = useParams();
  useTitle("Order confirmed");
  let order = null;
  try {
    const saved = JSON.parse(sessionStorage.getItem("buini_last_order") || "null");
    if (saved && saved.id === id) order = saved;
  } catch (error) {
    order = null;
  }
  return (
    <div className="wrap page empty">
      <p className="quiet">Studio request</p>
      <h1>{id}</h1>
      <p>The bench has this order. We confirm by email, then tie it for {order ? formatDate(order.deliveryDate) : "the date you chose"}.</p>
      {order && <p>{order.firstName} {order.lastName} · {money(order.total)} · {order.items.map((item) => item.name).join(", ")}</p>}
      <p>Payment is taken on delivery or at the studio. You can follow it from your account.</p>
      <Link className="btn" to="/account">View account</Link>
    </div>
  );
}

export function NotFound() {
  useTitle("Not found");
  return (
    <div className="wrap page empty">
      <h1>This page is not in the studio</h1>
      <Link className="btn" to="/">Back home</Link>
    </div>
  );
}
