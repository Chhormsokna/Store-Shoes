import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import { ArrowRight, Check } from "./components/Icons";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { AdminProvider } from "./context/AdminContext";
import { CartProvider, useCart } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetail from "./pages/ProductDetail";
import Shop from "./pages/Shop";
import Wishlist from "./pages/Wishlist";

function ScrollToTop() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, search]);
  return null;
}

function Toast() {
  const { toast, openCart } = useCart();

  if (!toast) return null;

  return (
    <div className="pointer-events-none fixed bottom-6 left-1/2 z-[70] w-[min(92vw,26rem)] -translate-x-1/2">
      <div
        key={toast.id}
        className="pointer-events-auto flex animate-pop items-center gap-3 rounded-2xl border border-white/10 bg-ink/95 px-4 py-3 text-white shadow-2xl backdrop-blur"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-volt text-ink">
          <Check className="h-4 w-4" />
        </span>
        <p className="min-w-0 flex-1 truncate text-sm font-medium">{toast.message}</p>
        <button
          onClick={openCart}
          className="flex shrink-0 items-center gap-1 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wide transition hover:bg-flare"
        >
          View <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <CartProvider>
          <WishlistProvider>
            <HashRouter>
              <ScrollToTop />
              <div className="flex min-h-screen flex-col bg-paper">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/wishlist" element={<Wishlist />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </main>
                <Footer />
                <Cart />
                <Toast />
              </div>
            </HashRouter>
          </WishlistProvider>
        </CartProvider>
      </AdminProvider>
    </AuthProvider>
  );
}
