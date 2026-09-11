import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAdmin } from "../context/AdminContext";
import { formatPrice } from "../data/products";
import logo from "../assets/images/logo.svg";
import { Bag, Chevron, Heart, Menu, Search, Shield, User, X } from "./Icons";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Shop all", to: "/shop" },
  { label: "Nike", to: "/shop?brand=Nike" },
  { label: "Adidas", to: "/shop?brand=Adidas" },
  { label: "New Balance", to: "/shop?brand=New Balance" },
  { label: "Deals", to: "/shop?deal=true" },
];

const MARQUEE = [
  "Free express shipping over $150",
  "30-day free returns",
  "Authenticity guaranteed",
  "New drops every Friday",
  "Members earn 5% back in credit",
];

export default function Navbar() {
  const { itemCount, openCart, notify } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { products } = useAdmin();
  const { count: wishCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setQuery("");
  }, [location.pathname, location.search]);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const suggestions = query.trim().length
    ? products
        .filter((p) =>
          `${p.brand} ${p.name} ${p.category}`.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/shop?q=${encodeURIComponent(query.trim())}`);
    setSearchOpen(false);
    setQuery("");
  };

  const selectSuggestion = (product) => {
    navigate(`/product/${product.slug}`);
    setSearchOpen(false);
    setQuery("");
  };

  const linkClass = ({ isActive }) =>
    `relative py-1 text-sm font-medium transition-colors hover:text-flare ${
      isActive ? "text-flare" : "text-ink/70"
    }`;

  return (
    <header className="sticky top-0 z-50">
      {/* announcement marquee */}
      <div className="overflow-hidden bg-ink py-2 text-white">
        <div className="flex w-max animate-marquee gap-10 pr-10">
          {[...MARQUEE, ...MARQUEE, ...MARQUEE, ...MARQUEE].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-[11px] tracking-[0.18em] uppercase">
              <span className="h-1 w-1 rounded-full bg-volt" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <div
        className={`border-b transition-all duration-300 ${
          scrolled
            ? "border-ink/10 bg-paper/85 backdrop-blur-xl shadow-[0_10px_30px_-24px_rgba(11,11,12,0.6)]"
            : "border-transparent bg-paper"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:h-[70px] lg:px-8">
          {/* mobile menu button */}
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="rounded-full p-2 transition hover:bg-ink/5 lg:hidden"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <Link to="/" className="group flex shrink-0 items-center gap-2.5">
            <img src={logo} alt="KICKSTACK" className="h-9 w-9 transition group-hover:rotate-6" />
            <span className="display-title text-xl leading-none tracking-tight lg:text-[22px]">
              Kick<span className="text-flare">stack</span>
            </span>
          </Link>

          <nav className="ml-6 hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((l) => (
              <NavLink key={l.label} to={l.to} className={linkClass} end={l.to === "/"}>
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <form
              onSubmit={submitSearch}
              className={`hidden items-center overflow-hidden rounded-full border border-ink/12 bg-white transition-all duration-300 md:flex ${
                searchOpen ? "w-64 px-3" : "w-10 px-0"
              }`}
            >
              <button
                type={searchOpen ? "submit" : "button"}
                onClick={() => !searchOpen && setSearchOpen(true)}
                className="p-2 text-ink/70 transition hover:text-flare"
                aria-label="Search products"
              >
                <Search className="h-[18px] w-[18px]" />
              </button>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sneakers…"
                className={`h-10 bg-transparent text-sm outline-none transition-all ${
                  searchOpen ? "w-full pl-1" : "w-0"
                }`}
              />
              {searchOpen && query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear">
                  <X className="h-4 w-4 text-ink/40" />
                </button>
              )}
            </form>

            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-full p-2 transition hover:bg-ink/5 md:hidden"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/wishlist"
              className="relative rounded-full p-2 transition hover:bg-ink/5"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" filled={wishCount > 0} />
              {wishCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] animate-pop items-center justify-center rounded-full bg-flare px-1 text-[10px] font-bold text-white">
                  {wishCount}
                </span>
              )}
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden items-center gap-1.5 rounded-full border border-volt bg-ink px-3 py-1.5 text-xs font-bold text-volt hover:bg-volt hover:text-ink transition sm:flex"
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}

            {isAuthenticated ? (
              <div className="hidden items-center gap-2 rounded-full border border-ink/10 bg-white px-2.5 py-1.5 sm:flex">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-white">
                  <User className="h-4 w-4" />
                </div>
                <div className="min-w-0 text-left">
                  <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-ink/40">
                    Hi, {user?.firstName} {isAdmin ? "(Admin)" : ""}
                  </p>
                  <button
                    type="button"
                    onClick={logout}
                    className="text-xs font-medium text-ink/70 transition hover:text-flare"
                  >
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden rounded-full p-2 transition hover:bg-ink/5 sm:block"
                aria-label="Account"
              >
                <User className="h-5 w-5" />
              </Link>
            )}

            <button
              type="button"
              onClick={openCart}
              className="group relative ml-1 flex items-center gap-2 rounded-full bg-ink px-3.5 py-2.5 text-white transition hover:bg-flare"
              aria-label="Open cart"
            >
              <Bag className="h-[18px] w-[18px]" />
              <span className="hidden text-xs font-semibold tracking-wide sm:block">Bag</span>
              <span
                className={`flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold transition-colors ${
                  itemCount ? "bg-volt text-ink" : "bg-white/20 text-white"
                }`}
              >
                {itemCount}
              </span>
            </button>
          </div>
        </div>

        {/* mobile search row */}
        {searchOpen && (
          <form
            onSubmit={submitSearch}
            className="border-t border-ink/10 bg-paper px-4 py-3 md:hidden"
          >
            <div className="flex items-center gap-2 rounded-full border border-ink/12 bg-white px-4">
              <Search className="h-4 w-4 text-ink/50" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search sneakers, brands…"
                className="h-11 w-full bg-transparent text-sm outline-none"
              />
            </div>
            {suggestions.length > 0 && (
              <div className="mt-2 divide-y divide-ink/8 overflow-hidden rounded-2xl bg-white">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => selectSuggestion(p)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-paper-dim"
                  >
                    <img src={p.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="ml-auto text-xs text-ink/50">{formatPrice(p.price)}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        )}

        {/* desktop search suggestions */}
        {searchOpen && query && suggestions.length > 0 && (
          <div className="absolute inset-x-0 top-full hidden justify-center md:flex">
            <div className="mt-2 w-full max-w-lg overflow-hidden rounded-2xl border border-ink/10 bg-white p-2 shadow-2xl">
              {suggestions.map((p) => (
                <Link
                  key={p.id}
                  to={`/product/${p.slug}`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-paper-dim"
                >
                  <img src={p.images[0]} alt="" className="h-11 w-11 rounded-lg object-cover" />
                  <span className="min-w-0">
                    <span className="eyebrow block text-ink/45">{p.brand}</span>
                    <span className="block truncate text-sm font-medium">{p.name}</span>
                  </span>
                  <span className="ml-auto text-sm font-semibold">{formatPrice(p.price)}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* mobile drawer menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden ${menuOpen ? "" : "pointer-events-none"}`}
        aria-hidden={!menuOpen}
      >
        <div
          onClick={() => setMenuOpen(false)}
          className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
            menuOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`absolute inset-y-0 left-0 w-[82%] max-w-xs bg-paper p-6 shadow-2xl transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="display-title text-lg">Menu</span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <X />
            </button>
          </div>
          <nav className="mt-8 flex flex-col">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.label}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  `flex items-center justify-between border-b border-ink/8 py-4 text-lg font-medium ${
                    isActive ? "text-flare" : ""
                  }`
                }
              >
                {l.label}
                <Chevron direction="right" />
              </NavLink>
            ))}
            <NavLink to="/wishlist" className="flex items-center justify-between border-b border-ink/8 py-4 text-lg font-medium">
              Wishlist ({wishCount})
              <Heart className="h-4 w-4" filled={wishCount > 0} />
            </NavLink>
            {isAdmin && (
              <NavLink to="/admin" className="flex items-center justify-between py-4 text-lg font-bold text-flare">
                <span className="flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Admin Dashboard
                </span>
                <Chevron direction="right" />
              </NavLink>
            )}
          </nav>
          <div className="mt-8 rounded-2xl bg-ink p-5 text-white">
            <p className="eyebrow text-volt">Members only</p>
            <p className="mt-2 text-sm text-white/70">
              Early access to Friday drops plus 5% back in credit on every order.
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
