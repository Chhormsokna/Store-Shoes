import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAdmin } from "./AdminContext";

const STORAGE_KEY = "kickstack.wishlist.v1";
const WishlistContext = createContext(null);

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function WishlistProvider({ children }) {
  const { products } = useAdmin();
  const [ids, setIds] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      /* ignore */
    }
  }, [ids]);

  const toggleWishlist = useCallback((productOrId) => {
    const id =
      typeof productOrId === "object" ? productOrId.id : productOrId;
    setIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const addAll = useCallback((list) => {
    setIds((prev) => [...new Set([...prev, ...list.map((p) => p.id)])]);
  }, []);

  const isInWishlist = useCallback((productOrId) => {
    const id = typeof productOrId === "object" ? productOrId.id : productOrId;
    return ids.includes(id);
  }, [ids]);

  const clearWishlist = useCallback(() => setIds([]), []);

  const items = useMemo(
    () => products.filter((p) => ids.includes(p.id)),
    [products, ids]
  );

  const count = ids.length;

  return (
    <WishlistContext.Provider
      value={{
        ids,
        items,
        count,
        toggleWishlist,
        addAll,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used inside <WishlistProvider>");
  return ctx;
}

export default WishlistContext;
