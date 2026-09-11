import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Lock, Repeat, Shield, Truck } from "../components/Icons";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";

const STEPS = ["Information", "Shipping", "Payment"];

const PROMOS = {
  KICKSTACK10: { type: "percent", value: 10, label: "10% off your order" },
  SOLECLUB: { type: "percent", value: 15, label: "15% members discount" },
  FREESHIP: { type: "shipping", value: 0, label: "Free shipping unlocked" },
};

const SHIPPING_METHODS = [
  { id: "standard", label: "Standard", eta: "3–5 business days", price: 9 },
  { id: "express", label: "Express", eta: "48 hours, tracked", price: 19 },
  { id: "pickup", label: "Store pickup", eta: "Ready in 2 hours", price: 0 },
];

const emptyForm = {
  email: "",
  firstName: "",
  lastName: "",
  address: "",
  city: "",
  zip: "",
  country: "United States",
  phone: "",
  card: "",
  expiry: "",
  cvc: "",
  nameOnCard: "",
};

export default function Checkout() {
  const { items, subtotal, savings, clearCart, itemCount } = useCart();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [method, setMethod] = useState("express");
  const [promoInput, setPromoInput] = useState("");
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState("");
  const [order, setOrder] = useState(null);

  const set = (field) => (e) => {
    let value = e.target.value;
    if (field === "card") value = value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    if (field === "expiry") {
      const digits = value.replace(/\D/g, "").slice(0, 4);
      value = digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
    }
    if (field === "cvc") value = value.replace(/\D/g, "").slice(0, 4);
    if (field === "zip") value = value.replace(/[^\w\s-]/g, "").slice(0, 10);
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const methodPrice = useMemo(() => {
    const chosen = SHIPPING_METHODS.find((m) => m.id === method);
    if (promo?.type === "shipping") return 0;
    return subtotal >= 150 && chosen.id !== "pickup" ? 0 : chosen.price;
  }, [method, subtotal, promo]);

  const discount = promo?.type === "percent" ? (subtotal * promo.value) / 100 : 0;
  const tax = Math.round((subtotal - discount) * 8.25) / 100;
  const total = Math.max(0, subtotal - discount + methodPrice + tax);

  const validate = (fields) => {
    const next = {};
    fields.forEach((f) => {
      if (!form[f] || String(form[f]).trim().length < 2) next[f] = "Required";
    });
    if (fields.includes("email") && form.email && !/^\S+@\S+\.\S+$/.test(form.email))
      next.email = "Enter a valid email";
    if (fields.includes("zip") && form.zip && form.zip.length < 4) next.zip = "Too short";
    if (fields.includes("card") && form.card.replace(/\s/g, "").length < 16)
      next.card = "16 digits needed";
    if (fields.includes("expiry") && !/^\d{2}\/\d{2}$/.test(form.expiry))
      next.expiry = "MM/YY";
    if (fields.includes("cvc") && form.cvc.length < 3) next.cvc = "3 digits";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const nextStep = () => {
    if (step === 0 && !validate(["email", "firstName", "lastName", "address", "city", "zip"]))
      return;
    if (step === 1) return setStep(2);
    setStep((s) => Math.min(2, s + 1));
  };

  const placeOrder = () => {
    if (!validate(["nameOnCard", "card", "expiry", "cvc"])) return;
    const id = `KS-${Math.floor(100000 + Math.random() * 899999)}`;
    setOrder({
      id,
      email: form.email,
      total,
      items: itemCount,
      eta: SHIPPING_METHODS.find((m) => m.id === method).eta,
      address: `${form.address}, ${form.city} ${form.zip}`,
    });
    clearCart();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const applyPromo = (e) => {
    e.preventDefault();
    const code = promoInput.trim().toUpperCase();
    if (PROMOS[code]) {
      setPromo({ code, ...PROMOS[code] });
      setPromoError("");
      setPromoInput("");
    } else {
      setPromoError("That code isn't valid. Try KICKSTACK10.");
    }
  };

  const field = (name, label, placeholder, type = "text", span = "") => (
    <div className={span}>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/55">
        {label}
      </label>
      <input
        type={type}
        value={form[name]}
        onChange={set(name)}
        placeholder={placeholder}
        className={`h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition placeholder:text-ink/30 focus:border-ink ${
          errors[name] ? "border-flare" : "border-ink/12"
        }`}
      />
      {errors[name] && <p className="mt-1 text-[11px] font-semibold text-flare">{errors[name]}</p>}
    </div>
  );

  /* ---------- confirmation ---------- */
  if (order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="border border-ink/8 bg-white p-8 text-center card-shadow sm:p-12">
          <span className="mx-auto flex h-16 w-16 animate-pop items-center justify-center rounded-full bg-volt text-ink">
            <Check className="h-8 w-8" />
          </span>
          <p className="eyebrow mt-6 text-flare">Order confirmed</p>
          <h1 className="display-title mt-3 text-4xl sm:text-5xl">
            Thanks, you&apos;re in
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/60">
            Order <strong className="text-ink">{order.id}</strong> is confirmed. A
            receipt is on its way to {order.email} — we&apos;ll email tracking the
            moment your box leaves the warehouse.
          </p>

          <dl className="mx-auto mt-8 grid max-w-lg gap-3 text-left sm:grid-cols-2">
            {[
              ["Items", `${order.items} pair${order.items > 1 ? "s" : ""}`],
              ["Total paid", formatPrice(order.total)],
              ["Delivery", order.eta],
              ["Shipping to", order.address],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-paper p-4">
                <dt className="text-[10px] font-bold uppercase tracking-widest text-ink/45">
                  {label}
                </dt>
                <dd className="mt-1 text-sm font-semibold">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-flare"
            >
              Keep shopping <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center rounded-full border border-ink/15 px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition hover:border-ink"
            >
              Back home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------- empty bag ---------- */
  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
        <span className="text-5xl">🛍️</span>
        <h1 className="display-title mt-6 text-4xl">Your bag is empty</h1>
        <p className="mt-3 text-sm text-ink/60">
          Add a pair before checking out — everything ships free over $150.
        </p>
        <Link
          to="/shop"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-flare"
        >
          Browse sneakers <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow text-flare">Secure checkout</p>
          <h1 className="display-title mt-2 text-4xl sm:text-5xl">Checkout</h1>
        </div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-ink/60 transition hover:text-flare"
        >
          ← Continue shopping
        </Link>
      </div>

      {/* stepper */}
      <ol className="mt-8 flex items-center gap-2 sm:gap-4">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2 sm:gap-3">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${
                i < step
                  ? "bg-volt text-ink"
                  : i === step
                  ? "bg-ink text-white"
                  : "bg-paper-dim text-ink/40"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </button>
            <span
              className={`hidden text-xs font-bold uppercase tracking-wider sm:block ${
                i === step ? "text-ink" : "text-ink/40"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px flex-1 bg-ink/12" />}
          </li>
        ))}
      </ol>

      <div className="mt-9 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-12">
        {/* form column */}
        <div className="rounded-3xl border border-ink/8 bg-white p-6 card-shadow sm:p-8">
          {step === 0 && (
            <div className="animate-pop">
              <h2 className="display-title text-2xl">Contact & address</h2>
              <p className="mt-1 text-xs text-ink/50">
                This is a demo — use any details, nothing is stored or charged.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {field("email", "Email", "you@email.com", "email", "sm:col-span-2")}
                {field("firstName", "First name", "Alex")}
                {field("lastName", "Last name", "Rivera")}
                {field("address", "Address", "128 Court Street", "text", "sm:col-span-2")}
                {field("city", "City", "Brooklyn")}
                {field("zip", "ZIP / Postcode", "11201")}
                {field("country", "Country", "United States", "text", "sm:col-span-2")}
              </div>
              <button
                onClick={nextStep}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-flare"
              >
                Continue to shipping <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="animate-pop">
              <h2 className="display-title text-2xl">Delivery method</h2>
              <div className="mt-6 space-y-3">
                {SHIPPING_METHODS.map((m) => {
                  const free = subtotal >= 150 && m.id !== "pickup";
                  return (
                    <label
                      key={m.id}
                      className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition ${
                        method === m.id
                          ? "border-ink bg-paper"
                          : "border-ink/12 hover:border-ink/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="shipping"
                        checked={method === m.id}
                        onChange={() => setMethod(m.id)}
                        className="sr-only"
                      />
                      <span
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          method === m.id ? "bg-ink text-white" : "bg-paper-dim text-ink/50"
                        }`}
                      >
                        {m.id === "pickup" ? <Shield className="h-5 w-5" /> : <Truck className="h-5 w-5" />}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-bold">{m.label}</span>
                        <span className="block text-xs text-ink/55">{m.eta}</span>
                      </span>
                      <span className="text-sm font-bold">
                        {free || m.price === 0 ? "Free" : formatPrice(m.price)}
                      </span>
                    </label>
                  );
                })}
              </div>

              <div className="mt-6 flex items-start gap-3 rounded-2xl bg-paper p-4 text-xs text-ink/60">
                <Repeat className="mt-0.5 h-4 w-4 shrink-0 text-flare" />
                <p>
                  Returns are free on every method. Print the label from your
                  confirmation email within 30 days.
                </p>
              </div>

              <div className="mt-7 flex gap-3">
                <button
                  onClick={() => setStep(0)}
                  className="rounded-full border border-ink/15 px-6 py-4 text-sm font-bold uppercase tracking-wide transition hover:border-ink"
                >
                  Back
                </button>
                <button
                  onClick={nextStep}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-flare"
                >
                  Continue to payment <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-pop">
              <div className="flex items-center justify-between">
                <h2 className="display-title text-2xl">Payment</h2>
                <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                  <Lock className="h-3.5 w-3.5" /> 256-bit encrypted
                </span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {field("nameOnCard", "Name on card", "Alex Rivera", "text", "sm:col-span-2")}
                {field("card", "Card number", "4242 4242 4242 4242", "text", "sm:col-span-2")}
                {field("expiry", "Expiry", "12/28")}
                {field("cvc", "CVC", "123")}
              </div>

              <div className="mt-6 rounded-2xl border border-ink/8 bg-paper p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-ink/45">
                  Shipping to
                </p>
                <p className="mt-1.5 text-sm">
                  {form.firstName} {form.lastName} · {form.address}, {form.city} {form.zip}
                </p>
                <button
                  onClick={() => setStep(0)}
                  className="mt-2 text-xs font-semibold text-flare underline underline-offset-2"
                >
                  Edit details
                </button>
              </div>

              <button
                onClick={placeOrder}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-flare py-4 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-ink"
              >
                <Lock className="h-4 w-4" /> Pay {formatPrice(total)}
              </button>
              <p className="mt-3 text-center text-[11px] text-ink/45">
                Demo store · no card is charged and no data leaves your browser.
              </p>
            </div>
          )}
        </div>

        {/* summary column */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-3xl border border-ink/8 bg-white p-6 card-shadow">
            <h2 className="display-title text-xl">Order summary</h2>

            <ul className="mt-5 space-y-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="eyebrow text-ink/45">{item.brand}</p>
                    <p className="truncate text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-ink/55">
                      US {item.size ?? "OS"} · qty {item.qty}
                    </p>
                  </div>
                  <p className="text-sm font-bold">{formatPrice(item.price * item.qty)}</p>
                </li>
              ))}
            </ul>

            <form onSubmit={applyPromo} className="mt-6 flex gap-2">
              <input
                value={promoInput}
                onChange={(e) => {
                  setPromoInput(e.target.value);
                  setPromoError("");
                }}
                placeholder="Promo code"
                className="h-11 w-full rounded-xl border border-ink/12 bg-paper px-4 text-sm uppercase outline-none focus:border-ink"
              />
              <button
                type="submit"
                className="h-11 shrink-0 rounded-xl bg-ink px-4 text-xs font-bold uppercase tracking-wide text-white transition hover:bg-flare"
              >
                Apply
              </button>
            </form>
            {promoError && <p className="mt-2 text-[11px] font-semibold text-flare">{promoError}</p>}
            {promo && (
              <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                <Check className="h-3.5 w-3.5" /> {promo.code} — {promo.label}
              </p>
            )}

            <dl className="mt-6 space-y-2.5 border-t border-ink/10 pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(subtotal)}</dd>
              </div>
              {savings > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink/60">Product savings</dt>
                  <dd className="font-semibold text-emerald-600">-{formatPrice(savings)}</dd>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-ink/60">Promo {promo.code}</dt>
                  <dd className="font-semibold text-emerald-600">-{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-ink/60">Shipping</dt>
                <dd className="font-semibold">
                  {methodPrice === 0 ? "Free" : formatPrice(methodPrice)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60">Estimated tax</dt>
                <dd className="font-semibold">{formatPrice(tax)}</dd>
              </div>
              <div className="flex items-end justify-between border-t border-ink/10 pt-4">
                <dt className="display-title text-lg">Total</dt>
                <dd className="display-title text-2xl text-flare">{formatPrice(total)}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              { icon: Truck, label: "48h ship" },
              { icon: Repeat, label: "Free returns" },
              { icon: Shield, label: "Authentic" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="rounded-2xl border border-ink/8 bg-white p-3">
                <Icon className="mx-auto h-5 w-5 text-flare" />
                <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-ink/60">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
