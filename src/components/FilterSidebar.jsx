import { brands, categories, formatPrice } from "../data/products";
import { Star, X } from "./Icons";

export const emptyFilters = {
  brands: [],
  categories: [],
  sizes: [],
  minPrice: 0,
  maxPrice: 220,
  rating: 0,
  onSale: false,
};

function Section({ title, children }) {
  return (
    <div className="border-b border-ink/10 py-5">
      <h3 className="eyebrow mb-3.5 text-ink/45">{title}</h3>
      {children}
    </div>
  );
}

export default function FilterSidebar({
  filters,
  setFilters,
  onClear,
  brandCounts = {},
  resultCount = 0,
  showClear = true,
}) {
  const toggleValue = (field, value) => {
    const list = filters[field];
    setFilters({
      ...filters,
      [field]: list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value],
    });
  };

  const activeCount =
    filters.brands.length +
    filters.categories.length +
    filters.sizes.length +
    (filters.rating ? 1 : 0) +
    (filters.onSale ? 1 : 0) +
    (filters.maxPrice !== emptyFilters.maxPrice ? 1 : 0);

  return (
    <div className="px-1">
      <div className="flex items-center justify-between pb-1">
        <h2 className="display-title text-lg">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-flare px-2 py-0.5 align-middle text-[10px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </h2>
        {showClear && activeCount > 0 && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-semibold text-ink/50 transition hover:text-flare"
          >
            <X className="h-3.5 w-3.5" /> Clear all
          </button>
        )}
      </div>

      <Section title={`Brand · ${filters.brands.length || "all"}`}>
        <ul className="space-y-2.5">
          {brands.map((b) => (
            <li key={b.name}>
              <label className="group flex cursor-pointer items-center gap-2.5 text-sm">
                <span
                  className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all ${
                    filters.brands.includes(b.name)
                      ? "border-flare bg-flare text-white"
                      : "border-ink/25 bg-white group-hover:border-ink"
                  }`}
                >
                  {filters.brands.includes(b.name) && (
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3.5">
                      <path d="m5 13 4 4L19 7" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={filters.brands.includes(b.name)}
                  onChange={() => toggleValue("brands", b.name)}
                />
                <span className="font-medium transition group-hover:text-flare">{b.name}</span>
                <span className="ml-auto text-xs text-ink/40">{brandCounts[b.name] ?? 0}</span>
              </label>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Size (US)">
        <div className="grid grid-cols-4 gap-2">
          {[6, 7, 8, 9, 10, 11, 12, 13].map((size) => (
            <button
              key={size}
              onClick={() => toggleValue("sizes", size)}
              className={`rounded-lg border py-2 text-xs font-semibold transition-all ${
                filters.sizes.includes(size)
                  ? "border-ink bg-ink text-white"
                  : "border-ink/15 bg-white hover:border-ink hover:bg-paper-dim"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Category">
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => toggleValue("categories", c)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filters.categories.includes(c)
                  ? "border-flare bg-flare/10 text-flare"
                  : "border-ink/15 bg-white hover:border-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Price">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={60}
            max={220}
            step={5}
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-paper-dim accent-flare"
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs font-semibold">
          <span>{formatPrice(60)}</span>
          <span className="rounded-full bg-ink px-2.5 py-1 text-white">
            up to {formatPrice(filters.maxPrice)}
          </span>
        </div>
      </Section>

      <Section title="Rating">
        <div className="flex flex-wrap gap-2">
          {[4.8, 4.6, 4.4, 0].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, rating: r })}
              className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                filters.rating === r
                  ? "border-ink bg-ink text-white"
                  : "border-ink/15 bg-white hover:border-ink"
              }`}
            >
              {r === 0 ? (
                "Any"
              ) : (
                <>
                  <Star className="h-3 w-3 text-flare" /> {r}+
                </>
              )}
            </button>
          ))}
        </div>
      </Section>

      <div className="pt-5">
        <label className="flex cursor-pointer items-center justify-between gap-3">
          <span className="text-sm font-semibold">On sale only</span>
          <span
            className={`relative h-6 w-11 rounded-full transition-colors ${
              filters.onSale ? "bg-flare" : "bg-ink/15"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only"
              checked={filters.onSale}
              onChange={() => setFilters({ ...filters, onSale: !filters.onSale })}
            />
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                filters.onSale ? "translate-x-[22px]" : "translate-x-0.5"
              }`}
            />
          </span>
        </label>
      </div>

      <p className="mt-6 rounded-2xl bg-paper-dim px-4 py-3 text-xs text-ink/60">
        <strong className="font-bold">{resultCount}</strong> products match your filters.
      </p>
    </div>
  );
}
