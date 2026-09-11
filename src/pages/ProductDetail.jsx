import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import {
  ArrowRight,
  Bag,
  Chevron,
  Heart,
  Minus,
  Plus,
  Repeat,
  Ruler,
  Shield,
  Star,
  Truck,
} from "../components/Icons";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { formatPrice, getProduct, getRelated, products } from "../data/products";

const ACCORDIONS = (product) => [
  {
    title: "Details & materials",
    body: (
      <ul className="space-y-2">
        {product.details.map((d) => (
          <li key={d} className="flex gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-flare" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    ),
  },
  {
    title: "Shipping & delivery",
    body: (
      <p>
        Express delivery in 48 hours on orders over $150 (otherwise $9 flat).
        Standard shipping lands in 3–5 business days. Every order ships in the
        original brand box with a tamper-proof authenticity seal.
      </p>
    ),
  },
  {
    title: "Returns & exchanges",
    body: (
      <p>
        30 days, no questions. Wear them around the house — if the fit is wrong
        we'll email a prepaid label and swap the size free of charge.
      </p>
    ),
  },
];

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProduct(slug);
  const { addToCart, openCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const [openAccordion, setOpenAccordion] = useState(0);

  useEffect(() => {
    setActiveImage(0);
    setSize(null);
    setColor(0);
    setQty(1);
    setError(false);
  }, [slug]);

  const soldOut = useMemo(
    () => (product ? product.sizes.filter((s) => (s * product.id) % 5 === 0) : []),
    [product]
  );

  if (!product) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-32 text-center">
        <span className="text-5xl">🧦</span>
        <h1 className="display-title mt-6 text-4xl">Pair not found</h1>
        <p className="mt-3 text-sm text-ink/60">
          That sneaker may have sold out or moved. Try the full shop instead.
        </p>
        <Link
          to="/shop"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-flare"
        >
          Back to shop <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  const wished = isInWishlist(product);
  const discount = product.compareAt
    ? Math.round(((product.compareAt - product.price) / product.compareAt) * 100)
    : 0;
  const related = getRelated(product, 4);
  const accordions = ACCORDIONS(product);

  const handleAdd = () => {
    if (!size) {
      setError(true);
      setTimeout(() => setError(false), 600);
      return;
    }
    addToCart(product, size, qty, product.colors[color]?.name);
    openCart();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:py-12 lg:pb-12">
      <nav className="flex flex-wrap items-center gap-2 text-xs text-ink/45">
        <Link to="/" className="transition hover:text-flare">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="transition hover:text-flare">
          Shop
        </Link>
        <span>/</span>
        <Link
          to={`/shop?brand=${encodeURIComponent(product.brand)}`}
          className="transition hover:text-flare"
        >
          {product.brand}
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* gallery */}
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="group relative overflow-hidden rounded-[28px] border border-ink/8 bg-white">
            <img
              key={activeImage}
              src={product.images[activeImage]}
              alt={product.name}
              className="aspect-square w-full animate-pop object-cover transition duration-700 group-hover:scale-[1.05]"
            />
            {discount > 0 && (
              <span className="eyebrow absolute left-4 top-4 rounded-full bg-flare px-3 py-1.5 text-[10px] text-white">
                save {discount}%
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product)}
              className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full backdrop-blur transition ${
                wished ? "bg-flare text-white" : "bg-white/85 hover:text-flare"
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart filled={wished} className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 flex gap-3">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActiveImage(i)}
                className={`h-20 w-20 overflow-hidden rounded-2xl border-2 transition ${
                  activeImage === i ? "border-ink" : "border-transparent opacity-65 hover:opacity-100"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
            <div className="flex h-20 flex-1 flex-col justify-center rounded-2xl bg-paper-dim px-4">
              <p className="eyebrow text-ink/45">In stock</p>
              <p className="mt-0.5 text-xs font-semibold">
                {product.stock} pairs · ships today
              </p>
            </div>
          </div>
        </div>

        {/* info */}
        <div>
          <div className="flex items-center gap-3">
            <span className="eyebrow text-flare">{product.brand}</span>
            <span className="h-px flex-1 bg-ink/10" />
            <span className="text-xs font-medium text-ink/45">{product.gender}</span>
          </div>

          <h1 className="display-title mt-3 text-4xl sm:text-5xl">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <span className="flex items-center gap-0.5 text-flare">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? "" : "text-ink/20"}`}
                />
              ))}
            </span>
            <span className="text-sm font-semibold">{product.rating}</span>
            <span className="text-sm text-ink/45">({product.reviews} reviews)</span>
          </div>

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <span className="display-title text-3xl">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <>
                <span className="text-lg text-ink/40 line-through">
                  {formatPrice(product.compareAt)}
                </span>
                <span className="rounded-full bg-flare/10 px-3 py-1 text-xs font-bold text-flare">
                  You save {formatPrice(product.compareAt - product.price)}
                </span>
              </>
            )}
          </div>

          <p className="mt-5 text-sm leading-relaxed text-ink/65">{product.description}</p>

          {/* colour */}
          <div className="mt-7">
            <p className="eyebrow text-ink/45">
              Colour · <span className="text-ink">{product.colors[color]?.name}</span>
            </p>
            <div className="mt-3 flex gap-2.5">
              {product.colors.map((c, i) => (
                <button
                  key={c.name}
                  onClick={() => setColor(i)}
                  title={c.name}
                  className={`h-9 w-9 rounded-full ring-offset-2 transition ${
                    color === i ? "ring-2 ring-ink" : "ring-1 ring-ink/20 hover:ring-ink/50"
                  }`}
                  style={{ background: c.hex }}
                />
              ))}
            </div>
          </div>

          {/* size */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <p className="eyebrow text-ink/45">
                Select size (US)
                {size && <span className="ml-2 text-ink">{size}</span>}
              </p>
              <button className="flex items-center gap-1.5 text-xs font-semibold text-ink/55 transition hover:text-flare">
                <Ruler className="h-3.5 w-3.5" /> Size guide
              </button>
            </div>
            <div
              className={`mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6 ${
                error ? "animate-shake" : ""
              }`}
            >
              {product.sizes.map((s) => {
                const out = soldOut.includes(s);
                return (
                  <button
                    key={s}
                    disabled={out}
                    onClick={() => {
                      setSize(s);
                      setError(false);
                    }}
                    className={`relative rounded-xl border py-3 text-sm font-semibold transition ${
                      size === s
                        ? "border-ink bg-ink text-white"
                        : out
                        ? "cursor-not-allowed border-ink/8 bg-paper-dim text-ink/25 line-through"
                        : "border-ink/15 bg-white hover:border-ink"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            {error && (
              <p className="mt-2.5 text-xs font-semibold text-flare">
                Pick a size first — we need to know your fit.
              </p>
            )}
          </div>

          {/* qty + add */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-ink/15 bg-white">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-3 text-ink/60 transition hover:text-flare"
                aria-label="Decrease quantity"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-8 text-center text-sm font-bold">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(10, q + 1))}
                className="p-3 text-ink/60 transition hover:text-flare"
                aria-label="Increase quantity"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <button
              onClick={handleAdd}
              className="group flex flex-1 items-center justify-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-flare"
            >
              <Bag className="h-4 w-4" />
              Add to bag · {formatPrice(product.price * qty)}
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-ink/45 sm:text-left">
            Or 4 interest-free payments of{" "}
            <strong className="text-ink">{formatPrice(Math.round(product.price / 4))}</strong>
          </p>

          {/* perks */}
          <div className="mt-7 grid gap-3 rounded-2xl border border-ink/8 bg-white p-4 sm:grid-cols-3">
            {[
              { icon: Truck, label: "48h express", sub: "free over $150" },
              { icon: Repeat, label: "Free returns", sub: "30 days" },
              { icon: Shield, label: "Authentic", sub: "brand sealed" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-2.5">
                <Icon className="h-5 w-5 shrink-0 text-flare" />
                <div>
                  <p className="text-xs font-bold">{label}</p>
                  <p className="text-[11px] text-ink/50">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* accordions */}
          <div className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
            {accordions.map((a, i) => (
              <div key={a.title}>
                <button
                  onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                  className="flex w-full items-center justify-between py-4 text-left text-sm font-bold"
                >
                  {a.title}
                  <Chevron
                    direction={openAccordion === i ? "up" : "down"}
                    className="h-4 w-4 text-ink/50"
                  />
                </button>
                {openAccordion === i && (
                  <div className="animate-pop pb-5 text-sm leading-relaxed text-ink/65">
                    {a.body}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* related */}
      <section className="mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-flare">You might also like</p>
            <h2 className="display-title mt-2 text-3xl sm:text-4xl">Pairs that match</h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-sm font-semibold transition hover:text-flare"
          >
            All {products.length} sneakers
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* sticky mobile buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-ink/10 bg-paper/95 p-3 backdrop-blur lg:hidden">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{product.name}</p>
          <p className="text-xs text-ink/55">
            {formatPrice(product.price)} · {size ? `US ${size}` : "select size"}
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="shrink-0 rounded-full bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-flare"
        >
          Add to bag
        </button>
      </div>
    </div>
  );
}
