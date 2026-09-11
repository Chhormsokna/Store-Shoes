import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import { ArrowRight, Bag, Check, Minus, Plus, Trash, X } from "./Icons";

const FREE_SHIPPING_AT = 150;

export default function Cart() {
  const {
    items,
    isOpen,
    closeCart,
    updateQty,
    removeFromCart,
    clearCart,
    subtotal,
    savings,
    itemCount,
  } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && closeCart();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  const remaining = Math.max(0, FREE_SHIPPING_AT - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_AT) * 100);

  const go = (path) => {
    closeCart();
    navigate(path);
  };

  return (
    <div className={`fixed inset-0 z-[60] ${isOpen ? "" : "pointer-events-none"}`} aria-hidden={!isOpen}>
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping bag"
      >
        {/* header */}
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <Bag className="h-5 w-5" />
            <h2 className="display-title text-lg">Your bag</h2>
            <span className="rounded-full bg-ink px-2 py-0.5 text-[11px] font-bold text-white">
              {itemCount}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="rounded-full p-2 transition hover:bg-ink/5"
            aria-label="Close cart"
          >
            <X />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-paper-dim">
              <Bag className="h-8 w-8 text-ink/40" />
            </div>
            <h3 className="display-title mt-5 text-xl">Bag&apos;s empty</h3>
            <p className="mt-2 text-sm text-ink/60">
              Nothing here yet. Go find your next pair — free returns on everything.
            </p>
            <button
              onClick={() => go("/shop")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-flare"
            >
              Start shopping <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            {/* free shipping meter */}
            <div className="border-b border-ink/10 bg-white px-5 py-3.5">
              <p className="text-xs font-medium text-ink/70">
                {remaining > 0 ? (
                  <>
                    You&apos;re <strong className="text-flare">{formatPrice(remaining)}</strong> away
                    from free express shipping
                  </>
                ) : (
                  <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-600">
                    <Check className="h-4 w-4" /> Free express shipping unlocked
                  </span>
                )}
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-paper-dim">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-flare to-volt transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => (
                  <li key={item.key} className="flex gap-3.5 animate-pop">
                    <Link
                      to={`/product/${item.slug}`}
                      onClick={closeCart}
                      className="h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-white"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover transition duration-500 hover:scale-105"
                      />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="eyebrow text-ink/45">{item.brand}</p>
                          <Link
                            to={`/product/${item.slug}`}
                            onClick={closeCart}
                            className="block truncate text-sm font-semibold hover:text-flare"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-0.5 text-xs text-ink/55">
                            US {item.size ?? "OS"} · {item.color}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="rounded-full p-1.5 text-ink/40 transition hover:bg-flare/10 hover:text-flare"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-ink/12 bg-white">
                          <button
                            onClick={() => updateQty(item.key, item.qty - 1)}
                            className="p-1.5 text-ink/60 transition hover:text-flare disabled:opacity-30"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold">{item.qty}</span>
                          <button
                            onClick={() => updateQty(item.key, item.qty + 1)}
                            className="p-1.5 text-ink/60 transition hover:text-flare disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">{formatPrice(item.price * item.qty)}</p>
                          {item.compareAt && (
                            <p className="text-xs text-ink/40 line-through">
                              {formatPrice(item.compareAt * item.qty)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <button
                onClick={clearCart}
                className="mt-5 text-xs font-semibold text-ink/45 underline decoration-dotted underline-offset-4 transition hover:text-flare"
              >
                Clear bag
              </button>
            </div>

            {/* footer */}
            <div className="border-t border-ink/10 bg-white px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink/60">Subtotal</span>
                <span className="text-base font-bold">{formatPrice(subtotal)}</span>
              </div>
              {savings > 0 && (
                <div className="mt-1 flex items-center justify-between text-sm">
                  <span className="text-ink/60">You save</span>
                  <span className="font-semibold text-emerald-600">-{formatPrice(savings)}</span>
                </div>
              )}
              <p className="mt-1 text-xs text-ink/45">
                Taxes and shipping calculated at checkout.
              </p>
              <button
                onClick={() => go("/checkout")}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-flare"
              >
                Checkout <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={closeCart}
                className="mt-2 w-full rounded-full py-2 text-xs font-semibold text-ink/55 transition hover:text-ink"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
