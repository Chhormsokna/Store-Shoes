import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { ArrowRight, Bag, Heart, Trash } from "../components/Icons";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../data/products";

export default function Wishlist() {
  const { items, count, clearWishlist } = useWishlist();
  const { addToCart, openCart } = useCart();

  const totalValue = items.reduce((sum, p) => sum + p.price, 0);

  const addAllToBag = () => {
    items.forEach((p) => {
      const mid = p.sizes[Math.floor(p.sizes.length / 2)];
      addToCart(p, mid, 1);
    });
    openCart();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <nav className="flex items-center gap-2 text-xs text-ink/45">
        <Link to="/" className="transition hover:text-flare">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink">Wishlist</span>
      </nav>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4 border-b border-ink/10 pb-6">
        <div>
          <h1 className="display-title text-4xl sm:text-5xl">
            Saved {count > 0 && <span className="text-flare">({count})</span>}
          </h1>
          <p className="mt-2 text-sm text-ink/55">
            {count > 0
              ? `${formatPrice(totalValue)} worth of heat on ice. Prices update live.`
              : "Tap the heart on any pair to park it here."}
          </p>
        </div>
        {count > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={addAllToBag}
              className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-flare"
            >
              <Bag className="h-4 w-4" /> Add all to bag
            </button>
            <button
              onClick={clearWishlist}
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-3 text-sm font-semibold transition hover:border-flare hover:text-flare"
            >
              <Trash className="h-4 w-4" /> Clear
            </button>
          </div>
        )}
      </div>

      {count === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink/20 bg-white/60 px-6 py-20 text-center">
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-paper-dim">
            <Heart className="h-9 w-9 text-ink/35" />
          </span>
          <h2 className="display-title mt-6 text-2xl">Nothing saved yet</h2>
          <p className="mt-2 max-w-sm text-sm text-ink/55">
            Your wishlist keeps sizes, colours and price drops in one place across
            every device you sign in on.
          </p>
          <Link
            to="/shop"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-flare"
          >
            Find your pair <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
