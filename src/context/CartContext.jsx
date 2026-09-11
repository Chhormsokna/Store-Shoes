import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { products } from "../data/products";

const STORAGE_KEY = "kickstack.cart.v1";

const CartContext = createContext(null);

const load = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(load);
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  /* persist */
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items]);

  /* toast auto-dismiss */
  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = useCallback((message) => setToast({ id: Date.now(), message }), []);

  const addToCart = useCallback(
    (product, size, qty = 1, color) => {
      const resolved = typeof product === "object" ? product : products.find((p) => p.id === product);
      if (!resolved) return;
      const colorName = color || resolved.color || "Default";
      const key = `${resolved.id}-${size ?? "OS"}-${colorName}`;

      setItems((prev) => {
        const existing = prev.find((i) => i.key === key);
        if (existing) {
          return prev.map((i) =>
            i.key === key ? { ...i, qty: Math.min(i.qty + qty, 10) } : i
          );
        }
        return [
          ...prev,
          {
            key,
            productId: resolved.id,
            slug: resolved.slug,
            name: resolved.name,
            brand: resolved.brand,
            image: resolved.images?.[0],
            price: resolved.price,
            compareAt: resolved.compareAt ?? null,
            size: size ?? null,
            color: colorName,
            qty,
            lineTotal: resolved.price * qty,
          },
        ];
      });
      notify(`${resolved.name} · US ${size ?? "OS"} added to bag`);
    },
    [notify]
  );

  const removeFromCart = useCallback((key) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const updateQty = useCallback((key, qty) => {
    setItems((prev) =>
      prev
        .map((i) => (i.key === key ? { ...i, qty: Math.max(0, Math.min(10, qty)) } : i))
        .filter((i) => i.qty > 0)
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  );
  const savings = useMemo(
    () =>
      items.reduce(
        (sum, i) => sum + (i.compareAt ? (i.compareAt - i.price) * i.qty : 0),
        0
      ),
    [items]
  );

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQty,
    clearCart,
    itemCount,
    subtotal,
    savings,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
    toast,
    notify,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export default CartContext;
