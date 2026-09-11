import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Mail, Lock, Eye, EyeOff, Google, Apple, Check, Shield } from "../components/Icons";

export default function Login() {
  const { isAuthenticated, login, error: authError, demoUser, adminUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = new URLSearchParams(location.search).get("redirect") || "/";

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  const validateField = (name, value) => {
    let err = "";
    if (name === "email") {
      if (!value.trim()) {
        err = "Email is required.";
      }
    }
    if (name === "password") {
      if (!value) {
        err = "Password is required.";
      }
    }
    setErrors((prev) => ({ ...prev, [name]: err }));
    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleFillDemo = () => {
    setForm({
      email: demoUser.email,
      password: demoUser.password,
    });
    setErrors({});
  };

  const handleLoginAdmin = () => {
    login({ email: adminUser.email, password: adminUser.password, role: "admin" });
    navigate("/admin", { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailErr = validateField("email", form.email);
    const passErr = validateField("password", form.password);

    if (emailErr || passErr) {
      return;
    }

    setSubmitting(true);
    const result = login(form);

    if (result.success) {
      navigate(from, { replace: true });
    }

    setSubmitting(false);
  };

  const handleSocialLogin = (provider) => {
    setSocialLoading(provider);
    setTimeout(() => {
      login({ email: form.email || `${provider.toLowerCase()}user@example.com`, password: "sociallogin" });
      setSocialLoading(null);
      navigate(from, { replace: true });
    }, 600);
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid overflow-hidden  border border-ink/10 bg-white shadow-[0_24px_80px_-40px_rgba(17,17,17,0.25)] lg:grid-cols-[1.1fr_0.9fr]">
        {/* Left Side Banner */}
        <div className="relative hidden min-h-[560px] overflow-hidden bg-ink p-8 text-white lg:block">
          <div className="absolute inset-0]" />
          <div className="relative z-10 flex h-full flex-col justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-volt">Member access</p>
              <h1 className="mt-4 max-w-sm display-title text-4xl leading-tight text-white">
                Fit your routine into every day.
              </h1>
            </div>

            <div className="space-y-4 text-sm text-white/80">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition duration-200 hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-volt" />
                  <p className="font-semibold text-white">Members save 5% on every order</p>
                </div>
                <p className="mt-1 text-xs text-white/70">Earn credit, unlock access to early drops and exclusive restocks.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition duration-200 hover:bg-white/10">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-volt" />
                  <p className="font-semibold text-white">Free returns & easy exchanges</p>
                </div>
                <p className="mt-1 text-xs text-white/70">Test your fit at home with easy exchanges and trusted sizing support.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="p-6 sm:p-8 lg:p-10">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink/50">Welcome back</p>
              <h2 className="mt-1 text-3xl font-black text-ink">Sign in</h2>
            </div>
            <Link to="/" className="text-sm font-semibold text-flare hover:text-flare/80 transition">
              Back to home
            </Link>
          </div>

          {/* Social Login Section */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              disabled={Boolean(socialLoading)}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-2xl border border-ink/15 bg-white text-sm font-semibold text-ink shadow-sm transition hover:bg-paper focus:outline-none focus:ring-2 focus:ring-ink/10"
            >
              <Google className="h-5 w-5" />
              <span>{socialLoading === "Google" ? "Connecting..." : "Continue with Google"}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSocialLogin("Apple")}
              disabled={Boolean(socialLoading)}
              className="flex h-11 w-full items-center justify-center gap-3 rounded-2xl bg-black text-sm font-semibold text-white shadow-sm transition hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-ink/10"
            >
              <Apple className="h-5 w-5" />
              <span>{socialLoading === "Apple" ? "Connecting..." : "Continue with Apple"}</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6 flex items-center justify-center">
            <div className="w-full border-t border-ink/10" />
            <span className="absolute bg-white px-3 text-xs font-semibold uppercase tracking-wider text-ink/40">
              or sign in with email
            </span>
          </div>

          {/* Main Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/70">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-4 h-5 w-5 text-ink/40" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`h-12 w-full rounded-2xl border bg-paper pl-11 pr-4 text-sm text-ink outline-none transition focus:ring-4 ${
                    errors.email
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-ink/10 focus:border-flare focus:ring-flare/10"
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink/70">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="pointer-events-none absolute left-4 h-5 w-5 text-ink/40" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`h-12 w-full rounded-2xl border bg-paper pl-11 pr-11 text-sm text-ink outline-none transition focus:ring-4 ${
                    errors.password
                      ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                      : "border-ink/10 focus:border-flare focus:ring-flare/10"
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 p-1 text-ink/40 hover:text-ink/80 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Options Row: Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-ink/70 hover:text-ink">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-ink/20 text-flare focus:ring-flare/20"
                />
                <span className="text-xs font-medium">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => alert("Password reset link sent to your email!")}
                className="text-xs font-semibold text-flare hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Auth Error Banner */}
            {authError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
                {authError}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex h-12 w-full items-center justify-center rounded-2xl bg-ink px-5 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-flare disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Demo & Admin Shortcuts */}
          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-ink/10 bg-paper/60 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink/50">Demo customer</p>
                <button
                  type="button"
                  onClick={handleFillDemo}
                  className="rounded-lg bg-ink/10 px-2.5 py-1 text-xs font-semibold text-ink hover:bg-ink hover:text-white transition"
                >
                  Auto-fill Demo
                </button>
              </div>
              <div className="mt-2 space-y-0.5 text-xs text-ink/70">
                <p><span className="font-medium text-ink">Email:</span> {demoUser.email}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLoginAdmin}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-volt bg-ink text-xs font-bold uppercase tracking-wider text-volt transition hover:bg-volt hover:text-ink shadow-sm"
            >
              <Shield className="h-4 w-4" />
              <span>Sign in as Shop Owner (Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
