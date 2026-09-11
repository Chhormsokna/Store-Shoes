import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import {
  ArrowRight,
  Repeat,
  Shield,
  Sparkle,
  Star,
  Truck,
} from "../components/Icons";
import {
  brands,
  categories,
  editorialImages,
  formatPrice,
  getDeals,
  getNewArrivals,
  getTrending,
} from "../data/products";
import { useAdmin } from "../context/AdminContext";

const FEATURES = [
  { icon: Truck, title: "48h express", copy: "Free over $150, tracked door-to-door." },
  { icon: Repeat, title: "30-day returns", copy: "Wear them indoors. Send them back free." },
  { icon: Shield, title: "100% authentic", copy: "Sourced direct from brand partners." },
  { icon: Sparkle, title: "Verified pairs", copy: "Every box inspected before it ships." },
];

const REVIEWS = [
  {
    name: "Marisa T.",
    city: "Brooklyn, NY",
    text: "Ordered the 9060s on Tuesday, laced up Thursday. The box was immaculate and the price beat every reseller I checked.",
    rating: 5,
  },
  {
    name: "Dev P.",
    city: "Austin, TX",
    text: "Finally one checkout for Nike and New Balance. Filtered by my size, saw what was actually in stock, done in two minutes.",
    rating: 5,
  },
  {
    name: "Ken O.",
    city: "Chicago, IL",
    text: "Returned a half size up and the label was already in my inbox. That's the whole review, honestly.",
    rating: 4,
  },
];

function useCountdown(hours = 34) {
  const target = useMemo(() => Date.now() + hours * 3600 * 1000, [hours]);
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  return {
    h: String(Math.floor(diff / 3600000)).padStart(2, "0"),
    m: String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0"),
    s: String(Math.floor((diff % 60000) / 1000)).padStart(2, "0"),
  };
}

export default function Home() {
  const { products } = useAdmin();
  const trending = useMemo(() => getTrending(8, products), [products]);
  const newArrivals = useMemo(() => getNewArrivals(4, products), [products]);
  const deals = useMemo(() => getDeals(1, products), [products]);
  const deal = deals[0];
  const { h, m, s } = useCountdown();

  return (
    <div>
      <Hero />

      {/* feature strip */}
      <section className="border-b border-ink/8 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-7 px-4 py-9 sm:px-6 lg:grid-cols-4 lg:px-8">
          {FEATURES.map(({ icon: Icon, title, copy }) => (
            <div key={title} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper-dim text-flare">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-bold">{title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-ink/55">{copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* brand tiles */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-flare">Shop by brand</p>
            <h2 className="display-title mt-2 text-4xl sm:text-5xl">The line-up</h2>
          </div>
          <Link
            to="/shop"
            className="group inline-flex items-center gap-2 text-sm font-semibold transition hover:text-flare"
          >
            Browse all 18 sneakers
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((b) => (
            <Link
              key={b.name}
              to={`/shop?brand=${encodeURIComponent(b.name)}`}
              className="group relative overflow-hidden rounded-2xl border border-ink/8 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink/20 card-shadow"
            >
              <span
                className="absolute -right-6 -top-6 h-16 w-16 rounded-full opacity-20 transition-transform duration-500 group-hover:scale-[2.4]"
                style={{ background: b.accent }}
              />
              <p className="relative text-base font-bold leading-tight">{b.name}</p>
              <p className="relative mt-1 text-[11px] text-ink/50">{b.tagline}</p>
              <p className="relative mt-5 text-[11px] font-semibold uppercase tracking-wider text-flare">
                {b.count} styles
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* trending */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-flare">Heat check</p>
            <h2 className="display-title mt-2 text-4xl sm:text-5xl">Trending now</h2>
          </div>
          <Link
            to="/shop?sort=trending"
            className="group inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white px-5 py-2.5 text-sm font-semibold transition hover:border-ink hover:bg-ink hover:text-white"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trending.map((p, i) => (
            <ProductCard
              key={p.id}
              product={p}
              className="animate-rise"
              style={{ animationDelay: `${i * 60}ms` }}
            />
          ))}
        </div>
      </section>

      {/* deal of the week */}
      {deal && (
        <section className="bg-ink text-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
            <div className="relative">
              <div className="overflow-hidden rounded-[28px] border border-white/10">
                <img
                  src={deal.images[0]}
                  alt={deal.name}
                  className=" w-full object-cover transition duration-700 hover:scale-105"
                />
              </div>
              <div className="absolute -bottom-5 left-5 flex gap-2">
                {[["hrs", h], ["min", m], ["sec", s]].map(([label, value]) => (
                  <div
                    key={label}
                    className="w-16 rounded-xl bg-volt py-2 text-center text-ink shadow-lg"
                  >
                    <p className="display-title text-xl leading-none">{value}</p>
                    <p className="text-[9px] font-bold uppercase tracking-widest">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="eyebrow text-volt">Deal of the week</p>
              <h2 className="display-title mt-3 text-4xl sm:text-5xl">{deal.name}</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
                {deal.description}
              </p>
              <div className="mt-6 flex items-center gap-3">
                <span className="display-title text-4xl text-flare">
                  {formatPrice(deal.price)}
                </span>
                <span className="text-lg text-white/40 line-through">
                  {formatPrice(deal.compareAt)}
                </span>
                <span className="rounded-full bg-flare px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                  Save {formatPrice(deal.compareAt - deal.price)}
                </span>
              </div>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  to={`/product/${deal.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:bg-volt"
                >
                  Shop the deal
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/shop?deal=true"
                  className="inline-flex items-center rounded-full border border-white/25 px-6 py-3.5 text-sm font-bold uppercase tracking-wide transition hover:border-volt hover:text-volt"
                >
                  All markdowns
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="eyebrow text-flare">Find your lane</p>
        <h2 className="display-title mt-2 text-4xl sm:text-5xl">Shop by category</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c, i) => {
            const list = products.filter((p) => p.category === c);
            return (
              <Link
                key={c}
                to={`/shop?category=${encodeURIComponent(c)}`}
                className={`group relative overflow-hidden rounded-3xl border border-ink/8 ${
                  i === 0 ? "sm:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <img
                  src={list[0].images[0]}
                  alt={c}
                  className={`w-full object-cover transition duration-700 group-hover:scale-105 ${
                    i === 0 ? "" : " "
                  }`}
                />
                <div className="absolute inset-0  from-ink/85 via-ink/20 to-transparent" />
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between text-white">
                  <div>
                    <p className="display-title text-2xl">{c}</p>
                    <p className="text-xs text-white/60">{list.length} styles</p>
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur transition group-hover:bg-flare">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* new arrivals */}
      <section className="border-y border-ink/8 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-flare">Just landed</p>
              <h2 className="display-title mt-2 text-4xl sm:text-5xl">New arrivals</h2>
            </div>
            <Link
              to="/shop?sort=newest"
              className="group inline-flex items-center gap-2 text-sm font-semibold transition hover:text-flare"
            >
              See everything new
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* reviews */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="eyebrow text-flare">Receipts</p>
            <h2 className="display-title mt-2 text-4xl sm:text-5xl">
              12,400 pairs shipped,
              <br />
              4.8 average
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/60">
              We only stock what we can ship fast and return for free. Here's what
              the last few customers said, unedited.
            </p>
            <div className="mt-7 flex items-center gap-3 rounded-2xl border border-ink/8 bg-white p-4 card-shadow">
              <div className="flex -space-x-3">
                {["#ff4b26", "#d9ff3b", "#0b0b0c", "#2b7fd4"].map((c) => (
                  <span
                    key={c}
                    className="h-9 w-9 rounded-full border-2 border-white"
                    style={{ background: c }}
                  />
                ))}
              </div>
              <p className="text-xs text-ink/60">
                <strong className="text-ink">+2,180</strong> verified buyers this
                month
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {REVIEWS.map((r) => (
              <figure
                key={r.name}
                className="flex h-full flex-col rounded-2xl border border-ink/8 bg-white p-5 card-shadow"
              >
                <div className="flex gap-0.5 text-flare">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5" />
                  ))}
                </div>
                <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-ink/75">
                  “{r.text}”
                </blockquote>
                <figcaption className="mt-4 border-t border-ink/8 pt-3 text-xs">
                  <span className="font-bold">{r.name}</span>
                  <span className="text-ink/45"> · {r.city}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* editorial cta */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden ">
          <img
            src={editorialImages.street}
            alt="Street style sneakers"
            className="h-[420px] w-full object-cover"
          />
          <div className="absolute inset-0  from-ink via-ink/70 to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-center px-7 text-white sm:px-12">
            <p className="eyebrow text-volt">The kickstack promise</p>
            <h2 className="display-title mt-3 max-w-lg text-4xl sm:text-5xl">
              Retail prices. Resale knowledge.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/65">
              Every listing tells you the true market value, how many pairs we hold
              and how fast they're moving. No games, no fake scarcity.
            </p>
            <Link
              to="/shop"
              className="group mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-ink transition hover:bg-volt"
            >
              Enter the shop
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
