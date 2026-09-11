import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import FilterSidebar, { emptyFilters } from "../components/FilterSidebar";
import ProductCard from "../components/ProductCard";
import { Chevron, Filter, Search, X } from "../components/Icons";
import { allSizes, formatPrice, products } from "../data/products";

const SORTS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest first" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
  { value: "trending", label: "Trending" },
];

const PAGE_SIZE = 9;

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(emptyFilters);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /* --- hydrate from URL --- */
  const urlQ = searchParams.get("q") ?? "";
  const urlBrand = searchParams.get("brand");
  const urlCategory = searchParams.get("category");
  const urlDeal = searchParams.get("deal") === "true";
  const urlSort = searchParams.get("sort") ?? "featured";

  useEffect(() => {
    setQuery(urlQ);
  }, [urlQ]);

  useEffect(() => {
    setSort(urlSort);
    setFilters({
      ...emptyFilters,
      brands: urlBrand ? [urlBrand] : [],
      categories: urlCategory ? [urlCategory] : [],
      onSale: urlDeal,
    });
    setVisible(PAGE_SIZE);
  }, [urlBrand, urlCategory, urlDeal, urlSort]);

  const textMatch = (p, q) =>
    !q ||
    `${p.brand} ${p.name} ${p.category} ${p.color} ${p.description}`
      .toLowerCase()
      .includes(q.toLowerCase());

  const filtered = useMemo(() => {
    const list = products.filter((p) => {
      if (!textMatch(p, query)) return false;
      if (filters.brands.length && !filters.brands.includes(p.brand)) return false;
      if (filters.categories.length && !filters.categories.includes(p.category))
        return false;
      if (filters.sizes.length && !filters.sizes.some((s) => p.sizes.includes(s)))
        return false;
      if (p.price > filters.maxPrice) return false;
      if (filters.rating && p.rating < filters.rating) return false;
      if (filters.onSale && !(p.compareAt && p.compareAt > p.price)) return false;
      return true;
    });

    const sorted = [...list];
    switch (sort) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        sorted.sort(
          (a, b) => Number(b.tags?.includes("new")) - Number(a.tags?.includes("new"))
        );
        break;
      case "trending":
        sorted.sort(
          (a, b) =>
            Number(b.tags?.includes("trending")) - Number(a.tags?.includes("trending"))
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [filters, query, sort]);

  const brandCounts = useMemo(() => {
    const counts = {};
    products.filter((p) => textMatch(p, query)).forEach((p) => {
      counts[p.brand] = (counts[p.brand] ?? 0) + 1;
    });
    return counts;
  }, [query]);

  const activeChips = [
    ...filters.brands.map((b) => ({ label: b, clear: () => toggle("brands", b) })),
    ...filters.categories.map((c) => ({
      label: c,
      clear: () => toggle("categories", c),
    })),
    ...filters.sizes.map((s) => ({ label: `US ${s}`, clear: () => toggle("sizes", s) })),
    ...(filters.rating
      ? [{ label: `${filters.rating}★ & up`, clear: () => setFilters({ ...filters, rating: 0 }) }]
      : []),
    ...(filters.onSale
      ? [{ label: "On sale", clear: () => setFilters({ ...filters, onSale: false }) }]
      : []),
    ...(filters.maxPrice !== emptyFilters.maxPrice
      ? [
          {
            label: `Under ${formatPrice(filters.maxPrice)}`,
            clear: () => setFilters({ ...filters, maxPrice: emptyFilters.maxPrice }),
          },
        ]
      : []),
    ...(query ? [{ label: `“${query}”`, clear: () => clearUrlParam("q") }] : []),
  ];

  function toggle(field, value) {
    setFilters((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  }

  function clearUrlParam(key) {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next, { replace: true });
  }

  const clearAll = () => {
    setFilters(emptyFilters);
    setQuery("");
    if (searchParams.toString()) setSearchParams(new URLSearchParams(), { replace: true });
  };

  const sidebar = (
    <FilterSidebar
      filters={filters}
      setFilters={(f) => {
        setFilters(f);
        setVisible(PAGE_SIZE);
      }}
      onClear={clearAll}
      brandCounts={brandCounts}
      resultCount={filtered.length}
    />
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      {/* breadcrumb + heading */}
      <nav className="flex items-center gap-2 text-xs text-ink/45">
        <Link to="/" className="transition hover:text-flare">
          Home
        </Link>
        <span>/</span>
        <span className="font-semibold text-ink">Shop</span>
      </nav>

      <div className="mt-4 flex flex-col gap-6 border-b border-ink/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="display-title text-4xl sm:text-5xl">
            {filters.brands.length === 1
              ? filters.brands[0]
              : filters.onSale
              ? "On sale"
              : "All sneakers"}
          </h1>
          <p className="mt-2 text-sm text-ink/55">
            {filtered.length} {filtered.length === 1 ? "pair" : "pairs"} available · sizes
            US {allSizes[0]}–{allSizes[allSizes.length - 1]} · free returns
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* search inside shop */}
          <div className="flex h-11 items-center gap-2 rounded-full border border-ink/12 bg-white px-4">
            <Search className="h-4 w-4 text-ink/45" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setVisible(PAGE_SIZE);
                if (e.target.value) {
                  const next = new URLSearchParams(searchParams);
                  next.set("q", e.target.value);
                  setSearchParams(next, { replace: true });
                } else clearUrlParam("q");
              }}
              placeholder="Search this store"
              className="w-36 bg-transparent text-sm outline-none sm:w-48"
            />
            {query && (
              <button onClick={() => clearUrlParam("q")} aria-label="Clear search">
                <X className="h-3.5 w-3.5 text-ink/40" />
              </button>
            )}
          </div>

          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="h-11 appearance-none rounded-full border border-ink/12 bg-white pl-4 pr-10 text-sm font-medium outline-none transition hover:border-ink"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
            <Chevron className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/50" />
          </div>

          <button
            onClick={() => setDrawerOpen(true)}
            className="flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-flare lg:hidden"
          >
            <Filter className="h-4 w-4" /> Filters
            {activeChips.length > 0 && (
              <span className="rounded-full bg-volt px-1.5 text-[10px] font-bold text-ink">
                {activeChips.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* active chips */}
      {activeChips.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          {activeChips.map((chip, i) => (
            <button
              key={`${chip.label}-${i}`}
              onClick={chip.clear}
              className="group inline-flex items-center gap-1.5 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-xs font-semibold transition hover:border-flare hover:text-flare"
            >
              {chip.label}
              <X className="h-3 w-3" />
            </button>
          ))}
          <button
            onClick={clearAll}
            className="ml-1 text-xs font-semibold text-ink/45 underline decoration-dotted underline-offset-4 transition hover:text-flare"
          >
            Reset
          </button>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[16rem_1fr]">
        {/* desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-32 max-h-[calc(100vh-9rem)] overflow-y-auto pr-2 no-scrollbar">
            {sidebar}
          </div>
        </aside>

        {/* grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ink/20 bg-white/60 px-6 py-20 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper-dim text-2xl">
                👟
              </span>
              <h3 className="display-title mt-5 text-2xl">No pairs found</h3>
              <p className="mt-2 max-w-sm text-sm text-ink/55">
                Try widening your price range or removing a brand filter — we add
                stock every Friday.
              </p>
              <button
                onClick={clearAll}
                className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-flare"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.slice(0, visible).map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {visible < filtered.length && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <p className="text-xs text-ink/50">
                    Showing {Math.min(visible, filtered.length)} of {filtered.length}
                  </p>
                  <div className="h-1 w-40 overflow-hidden rounded-full bg-paper-dim">
                    <div
                      className="h-full rounded-full bg-ink transition-all duration-500"
                      style={{ width: `${(visible / filtered.length) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={() => setVisible((v) => v + PAGE_SIZE)}
                    className="rounded-full border border-ink/15 bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide transition hover:border-ink hover:bg-ink hover:text-white"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* mobile filter drawer */}
      <div className={`fixed inset-0 z-[55] lg:hidden ${drawerOpen ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setDrawerOpen(false)}
          className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity ${
            drawerOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 right-0 flex w-[90%] max-w-sm flex-col bg-paper shadow-2xl transition-transform duration-300 ${
            drawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
            <h2 className="display-title text-lg">Refine</h2>
            <button
              onClick={() => setDrawerOpen(false)}
              className="rounded-full p-2 hover:bg-ink/5"
              aria-label="Close filters"
            >
              <X />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-2">{sidebar}</div>
          <div className="border-t border-ink/10 bg-white p-4">
            <button
              onClick={() => setDrawerOpen(false)}
              className="w-full rounded-full bg-ink py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-flare"
            >
              Show {filtered.length} results
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
