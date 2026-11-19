import { useEffect, useState } from "react";
import { SITE } from "../data/catalog";
import { loadSite, subscribeSite } from "../api/client";

export default function useSite() {
  const [site, setSite] = useState(SITE);

  useEffect(() => {
    let live = true;
    const pull = () => {
      loadSite().then((data) => {
        if (live) setSite(data);
      });
    };
    pull();
    const stop = subscribeSite(pull);
    return () => {
      live = false;
      stop();
    };
  }, []);

  return site;
}
