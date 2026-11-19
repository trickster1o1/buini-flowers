import { useEffect, useState } from "react";
import { isRemote, loadProducts, readLocalProducts } from "../api/client";
import { useShop } from "../context/ShopContext";

export default function useProducts() {
  const { catalogTick } = useShop();
  const [items, setItems] = useState(() => (isRemote() ? [] : readLocalProducts()));
  const [loading, setLoading] = useState(isRemote());
  const [error, setError] = useState("");

  useEffect(() => {
    let live = true;
    if (isRemote()) setLoading(true);
    loadProducts(false)
      .then((data) => {
        if (!live) return;
        setItems(Array.isArray(data) ? data : []);
        setError(Array.isArray(data) ? "" : "The collection could not be loaded.");
      })
      .catch((err) => {
        if (live) setError(err.message || "The collection could not be loaded.");
      })
      .finally(() => {
        if (live) setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [catalogTick]);

  return { items, loading, error };
}
