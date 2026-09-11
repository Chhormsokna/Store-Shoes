import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice } from "../data/products";
import { ArrowRight, Bag, Heart, Star } from "./Icons";

export default function ProductCard({ product, className = "" }) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [bump, setBump] = useState(false);

  const wished = isInWishlist(product);
  const hoverImage = product.images?.[1] || product.images?.[0];
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;

  const handleWish = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    setBump(true);
    setTimeout(() => setBump(false), 420);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const mid = product.sizes[Math.floor(product.sizes.length / 2)];
    addToCart(product, mid, 1);
  };

  return (
    <article
      className={`group relative flex flex-col overflow-hidden rounded-3xl border border-ink/8 bg-white transition-all duration-300 card-shadow hover:-translate-y-1 hover:border-ink/15 ${className}`}
    >
      <Link to={`/product/${product.slug}`} className="relative block overflow-hidden">
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-paper-dim">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.06] group-hover:opacity-0"
          />
          <img
            src={hoverImage}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100"
          />
        </div>

        {/* badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.badge && (
            <span
              className={`eyebrow rounded-full px-2.5 py-1 text-[9px] ${
                product.tags?.includes("sale")
                  ? "bg-flare text-white"
                  : "bg-ink text-white"
              }`}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && !product.badge && (
            <span className="eyebrow rounded-full bg-flare px-2.5 py-1 text-[9px] text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* quick add */}
        <button
          type="button"
          onClick={handleQuickAdd}
          className="absolute inset-x-3 bottom-3 flex translate-y-4 items-center justify-center gap-2 rounded-full bg-ink/92 py-3 text-xs font-bold uppercase tracking-wider text-white opacity-0 backdrop-blur transition-all duration-300 hover:bg-flare group-hover:translate-y-0 group-hover:opacity-100"
        >
          <Bag className="h-4 w-4" /> Add to cart
        </button>
      </Link>

      {/* wishlist */}
      <button
        type="button"
        onClick={handleWish}
        aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
        className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition-all duration-300 ${
          wished
            ? "bg-flare text-white"
            : "bg-white/85 text-ink hover:bg-white hover:text-flare"
        }`}
      >
        <Heart className={`h-[18px] w-[18px] ${bump ? "animate-heart" : ""}`} filled={wished} />
      </button>

      {/* info */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-ink/45">{product.brand}</p>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-ink/60">
            <Star className="h-3 w-3 text-flare" />
            {product.rating}
          </span>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="mt-1.5 text-[15px] font-semibold leading-snug transition-colors hover:text-flare"
        >
          {product.name}
        </Link>

        <div className="mt-1 flex items-center gap-1.5">
          {product.colors.map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-3 w-3 rounded-full ring-1 ring-ink/15"
              style={{ background: c.hex }}
            />
          ))}
          <span className="ml-1 text-[11px] text-ink/40">{product.color}</span>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-ink transition-colors hover:text-flare"
        >
          View details <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <span className="text-lg font-bold tracking-tight">
              {formatPrice(product.price)}
            </span>
            {product.compareAt && (
              <span className="ml-2 text-xs text-ink/40 line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </div>
          <span className="text-[11px] font-medium text-ink/40">
            {product.stock <= 6 ? `${product.stock} left` : "In stock"}
          </span>
        </div>
      </div>
    </article>
  );
}
