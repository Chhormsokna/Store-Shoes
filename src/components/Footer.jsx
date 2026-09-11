import { useState } from "react";
import { Link } from "react-router-dom";
import { brands } from "../data/products";
import { ArrowRight, Check, Social } from "./Icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "All sneakers", to: "/shop" },
      { label: "Running", to: "/shop?category=Running" },
      { label: "Basketball", to: "/shop?category=Basketball" },
      { label: "Lifestyle", to: "/shop?category=Lifestyle" },
      { label: "Sale", to: "/shop?deal=true" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Size guide", to: "/shop" },
      { label: "Shipping & delivery", to: "/shop" },
      { label: "Returns", to: "/shop" },
      { label: "Order tracking", to: "/shop" },
      { label: "Contact us", to: "/shop" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About KICKSTACK", to: "/" },
      { label: "Careers", to: "/" },
      { label: "Sustainability", to: "/" },
      { label: "Press", to: "/" },
      { label: "Affiliates", to: "/" },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const subscribe = (e) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setDone(true);
    setEmail("");
    setTimeout(() => setDone(false), 3500);
  };

  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_2fr]">
          {/* newsletter */}
          <div>
            <h2 className="display-title text-3xl">
              Never miss
              <br />
              a <span className="text-flare">drop</span>
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
              Friday release alerts, restock pings and member-only pricing.
              One email a week, zero spam.
            </p>
            <form onSubmit={subscribe} className="mt-6 flex max-w-md gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="h-12 w-full rounded-full border border-white/15 bg-white/5 px-5 text-sm outline-none transition placeholder:text-white/35 focus:border-volt"
              />
              <button
                type="submit"
                className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-flare px-5 text-xs font-bold uppercase tracking-wide transition hover:bg-volt hover:text-ink"
              >
                {done ? <Check className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                <span className="hidden sm:block">{done ? "Joined" : "Join"}</span>
              </button>
            </form>

            <div className="mt-7 flex gap-2.5">
              {Object.entries(Social).map(([name, Icon]) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-flare hover:bg-flare hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px]" />
                </a>
              ))}
            </div>
          </div>

          {/* links */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="eyebrow text-white/40">{col.title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link
                        to={l.to}
                        className="text-sm text-white/70 transition hover:text-volt"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h3 className="eyebrow text-white/40">Brands</h3>
              <ul className="mt-4 space-y-2.5">
                {brands.map((b) => (
                  <li key={b.name}>
                    <Link
                      to={`/shop?brand=${encodeURIComponent(b.name)}`}
                      className="text-sm text-white/70 transition hover:text-volt"
                    >
                      {b.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} KICKSTACK. Frontend demo — no real orders are processed.
          </p>
          <div className="flex items-center gap-2">
            {["VISA", "MC", "AMEX", "PAYPAL", "APPLE PAY"].map((p) => (
              <span
                key={p}
                className="rounded-md border border-white/12 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white/50"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
