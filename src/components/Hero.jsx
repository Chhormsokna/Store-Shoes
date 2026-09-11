import { Link } from "react-router-dom";
import { brands, formatPrice, getTrending, heroImage } from "../data/products";
import { ArrowRight, Star } from "./Icons";

export default function Hero() {
  const trending = getTrending(3);
  const featured = trending[0];

  return (
    <section className="relative overflow-hidden bg-ink text-white">
      {/* glow blobs */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-flare/25 blur-[110px]" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-volt/15 blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:gap-6 lg:px-8 lg:pb-24 lg:pt-20">
        {/* copy */}
        <div className="animate-rise">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-semibold tracking-[0.16em] uppercase backdrop-blur">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-volt" />
            6 brands · 1 checkout
          </span>

          <h1 className="display-title mt-6 text-[clamp(2.9rem,9vw,5.6rem)]">
            Every sole
            <br />
            <span className="text-flare">worth</span> chasing
            <span className="text-volt">.</span>
          </h1>

          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/65">
            Nike, Adidas, New Balance, Jordan, Puma and Asics — curated, verified
            and shipped in 48 hours. No bots, no scalpers, no surprise fees.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 rounded-full bg-flare px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-white hover:text-ink"
            >
              Shop the drop
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/shop?deal=true"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition hover:border-volt hover:text-volt"
            >
              Up to 21% off
            </Link>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
            {[
              ["18+", "Sneakers live"],
              ["48h", "Express delivery"],
              ["4.8★", "Avg. rating"],
            ].map(([value, label]) => (
              <div key={label}>
                <dt className="display-title text-2xl text-volt">{value}</dt>
                <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-white/50">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* visual */}
        <div className="relative animate-rise [animation-delay:120ms]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 sm:aspect-[5/5]">
            <img
              src={heroImage}
              alt="Featured sneaker"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />

            {featured && (
              <Link
                to={`/product/${featured.slug}`}
                className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-md transition hover:bg-white/20"
              >
                <img
                  src={featured.images[0]}
                  alt={featured.name}
                  className="h-14 w-14 rounded-xl object-cover"
                />
                <div className="min-w-0">
                  <p className="eyebrow text-volt">{featured.brand}</p>
                  <p className="truncate text-sm font-semibold">{featured.name}</p>
                  <p className="text-xs text-white/60">
                    {formatPrice(featured.price)} ·{" "}
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 text-volt" /> {featured.rating}
                    </span>
                  </p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 shrink-0" />
              </Link>
            )}
          </div>

          <div className="absolute -right-3 top-6 hidden rotate-6 rounded-2xl bg-volt px-4 py-3 text-ink shadow-xl sm:block">
            <p className="display-title text-xl leading-none">48h</p>
            <p className="text-[10px] font-bold uppercase tracking-widest">delivery</p>
          </div>
        </div>
      </div>

      {/* brand marquee */}
      <div className="relative border-t border-white/10 py-5">
        <div className="flex w-max animate-marquee items-center gap-14 pr-14">
          {[...brands, ...brands, ...brands].map((b, i) => (
            <span
              key={i}
              className="display-title whitespace-nowrap text-2xl text-white/25 transition hover:text-white"
            >
              {b.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
