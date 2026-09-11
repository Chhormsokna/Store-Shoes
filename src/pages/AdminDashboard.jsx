import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import { formatPrice } from "../data/products";
import { Lock, Plus, Trash, Check, Shield, Search, Chevron, User, Bag, Sparkle } from "../components/Icons";

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { products, orders, addProduct, updateProduct, deleteProduct, updateOrderStatus, deleteOrder } =
    useAdmin();

  const [activeTab, setActiveTab] = useState("overview"); // overview | products | orders | customers
  const [productQuery, setProductQuery] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // New product form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProd, setNewProd] = useState({
    name: "",
    brand: "Nike",
    category: "Running",
    price: "",
    stock: "15",
    description: "",
    imageUrl: "",
  });

  // Edit product modal state
  const [editingProduct, setEditingProduct] = useState(null);

  // Guard: if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/admin" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-rose-100 text-rose-600 shadow-inner">
          <Lock className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-black text-ink">Access Restricted</h1>
        <p className="mt-2 text-base text-ink/60">
          This control dashboard is reserved exclusively for the <span className="font-semibold text-ink">Shop Owner</span>.
        </p>
        <div className="mt-6 rounded-3xl border border-amber-200/80 bg-amber-50/60 p-5 text-left text-xs text-amber-900 sm:mx-auto sm:max-w-md shadow-sm">
          <p className="font-bold uppercase tracking-wider text-amber-900">Current Session Details:</p>
          <div className="mt-2 space-y-1">
            <p><span className="font-semibold">Email:</span> {user?.email}</p>
            <p><span className="font-semibold">Role:</span> {user?.role || "customer"}</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/"
            className="inline-flex h-12 items-center justify-center rounded-2xl bg-ink px-6 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-flare"
          >
            Return to Store
          </Link>
          <Link
            to="/login"
            className="inline-flex h-12 items-center justify-center rounded-2xl border border-ink/20 bg-white px-6 text-sm font-bold text-ink transition hover:bg-paper"
          >
            Sign in as Admin
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "Cancelled" ? o.total : 0), 0);
  const totalOrders = orders.length;
  const totalProductsCount = products.length;
  const totalCustomersCount = new Set(orders.map((o) => o.email)).size + 2;

  // Brand Breakdown Stats
  const brandCounts = products.reduce((acc, p) => {
    acc[p.brand] = (acc[p.brand] || 0) + 1;
    return acc;
  }, {});

  // Filtered lists
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(productQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(productQuery.toLowerCase())
  );

  const filteredOrders = orders.filter((o) => {
    const matchesQuery =
      o.id.toLowerCase().includes(orderQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(orderQuery.toLowerCase()) ||
      o.email.toLowerCase().includes(orderQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || o.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) return;
    addProduct(newProd);
    setShowAddModal(false);
    setNewProd({
      name: "",
      brand: "Nike",
      category: "Running",
      price: "",
      stock: "15",
      description: "",
      imageUrl: "",
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    updateProduct(editingProduct.id, {
      price: Number(editingProduct.price),
      stock: Number(editingProduct.stock),
      name: editingProduct.name,
      brand: editingProduct.brand,
    });
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Header Card */}
        <div className="relative overflow-hidden rounded-[32px] bg-ink p-6 text-white shadow-2xl sm:p-8">
          <div className="absolute right-0 top-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-volt/10 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 -mb-20 h-48 w-48 rounded-full bg-flare/20 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-volt/30 bg-volt/10 px-3.5 py-1 text-xs font-bold uppercase tracking-[0.2em] text-volt backdrop-blur-sm">
                <Shield className="h-3.5 w-3.5" />
                <span>Shop Owner Control Panel</span>
              </div>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Store Dashboard
              </h1>
              <p className="mt-1 max-w-xl text-sm text-white/70">
                Manage inventory, fulfill orders, and track revenue metrics for Kickstack Store.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex h-11 items-center gap-2 rounded-2xl bg-volt px-5 text-xs font-extrabold uppercase tracking-wider text-ink shadow-lg transition duration-200 hover:bg-white hover:scale-[1.02]"
              >
                <Plus className="h-4 w-4" />
                <span>Add Product</span>
              </button>
              <Link
                to="/shop"
                className="flex h-11 items-center justify-center rounded-2xl border border-white/15 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                View Live Storefront
              </Link>
            </div>
          </div>
        </div>

        {/* Clean Modern Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-2 shadow-sm">
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "overview", label: "Overview", icon: "📊" },
              { id: "products", label: "Inventory", badge: products.length, icon: "👟" },
              { id: "orders", label: "Orders", badge: orders.length, icon: "📦" },
              { id: "customers", label: "Customers", icon: "👥" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition duration-200 ${
                  activeTab === tab.id
                    ? "bg-ink text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-ink"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      activeTab === tab.id ? "bg-volt text-ink" : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="hidden items-center gap-2 px-3 text-xs text-slate-400 sm:flex">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Store Live & Syncing</span>
          </div>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="mt-6 space-y-6">
            {/* Metric KPI Grid */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Sales Revenue</p>
                  <span className="rounded-xl bg-emerald-50 p-2 text-emerald-600 font-bold text-xs">📈 Live</span>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900 tracking-tight">
                  {formatPrice(totalRevenue)}
                </p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <span>↑ +14.2%</span>
                  <span className="font-normal text-slate-400">vs previous period</span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Customer Orders</p>
                  <span className="rounded-xl bg-blue-50 p-2 text-blue-600 font-bold text-xs">📦 Orders</span>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900 tracking-tight">{totalOrders}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-blue-600">
                  <span>8 Pending fulfillment</span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Shoes in Store</p>
                  <span className="rounded-xl bg-amber-50 p-2 text-amber-600 font-bold text-xs">👟 Stock</span>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900 tracking-tight">{totalProductsCount}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-500">
                  <span>In-stock catalog items</span>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Store Customers</p>
                  <span className="rounded-xl bg-purple-50 p-2 text-purple-600 font-bold text-xs">👥 Members</span>
                </div>
                <p className="mt-3 text-3xl font-black text-slate-900 tracking-tight">{totalCustomersCount}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-bold text-purple-600">
                  <span>Verified member accounts</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Recent Orders & Brand Breakdown */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Recent Orders Card */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h2 className="text-base font-extrabold text-slate-900">Recent Customer Activity</h2>
                    <p className="text-xs text-slate-400">Latest orders placed by customers</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-ink hover:bg-ink hover:text-white transition"
                  >
                    View All →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-b border-slate-100 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="pb-3 px-3">Order</th>
                        <th className="pb-3 px-3">Customer</th>
                        <th className="pb-3 px-3">Date</th>
                        <th className="pb-3 px-3">Amount</th>
                        <th className="pb-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/70 transition">
                          <td className="py-3 px-3 font-mono font-bold text-slate-900">{o.id}</td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-slate-800">{o.customerName}</p>
                            <p className="text-[11px] text-slate-400">{o.email}</p>
                          </td>
                          <td className="py-3 px-3 text-slate-500">{o.date}</td>
                          <td className="py-3 px-3 font-extrabold text-slate-900">{formatPrice(o.total)}</td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-extrabold ${
                                o.status === "Delivered"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : o.status === "Shipped"
                                  ? "bg-blue-50 text-blue-700"
                                  : o.status === "Processing"
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  o.status === "Delivered"
                                    ? "bg-emerald-500"
                                    : o.status === "Shipped"
                                    ? "bg-blue-500"
                                    : o.status === "Processing"
                                    ? "bg-amber-500"
                                    : "bg-slate-400"
                                }`}
                              />
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Brand Inventory Breakdown */}
              <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
                <h2 className="text-base font-extrabold text-slate-900">Brand Inventory Ratio</h2>
                <p className="text-xs text-slate-400 mb-5">Product distribution across brands</p>

                <div className="space-y-4">
                  {Object.entries(brandCounts).map(([brand, count]) => {
                    const percentage = Math.round((count / products.length) * 100) || 0;
                    return (
                      <div key={brand}>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
                          <span>{brand}</span>
                          <span>{count} items ({percentage}%)</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-ink transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 rounded-2xl bg-slate-50 p-4 border border-slate-200/60 text-xs text-slate-600">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    <Sparkle className="h-4 w-4 text-flare" />
                    <span>Quick Tip</span>
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                    Keep your inventory balanced across popular brands to maximize daily order conversions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS INVENTORY */}
        {activeTab === "products" && (
          <div className="mt-6 space-y-5">
            {/* Search & Actions Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  value={productQuery}
                  onChange={(e) => setProductQuery(e.target.value)}
                  placeholder="Filter by shoe name, brand, or category..."
                  className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white pl-10 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-ink focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-ink px-5 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-flare transition"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3.5 px-4">Shoe Product</th>
                      <th className="py-3.5 px-4">Brand</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Price</th>
                      <th className="py-3.5 px-4">Stock Level</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="h-11 w-11 rounded-xl object-cover border border-slate-200/60 shadow-xs"
                            />
                            <div>
                              <p className="font-bold text-slate-900">{p.name}</p>
                              <p className="text-[11px] text-slate-400">{p.color || "Standard"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-700">{p.brand}</td>
                        <td className="py-3 px-4 text-slate-500 font-medium">{p.category}</td>
                        <td className="py-3 px-4 font-black text-slate-900">{formatPrice(p.price)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                                p.stock > 10
                                  ? "bg-emerald-50 text-emerald-700"
                                  : p.stock > 0
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {p.stock > 0 ? `${p.stock} units` : "Sold Out"}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-ink hover:text-white transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                              }}
                              className="rounded-lg bg-rose-50 p-1.5 text-rose-600 hover:bg-rose-600 hover:text-white transition"
                              aria-label="Delete"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="mt-6 space-y-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  value={orderQuery}
                  onChange={(e) => setOrderQuery(e.target.value)}
                  placeholder="Filter by Order ID, customer, email..."
                  className="h-11 w-full rounded-2xl border border-slate-200/80 bg-white pl-10 pr-4 text-xs font-medium text-slate-800 outline-none focus:border-ink focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 rounded-2xl border border-slate-200/80 bg-white px-4 text-xs font-bold text-slate-800 outline-none focus:border-ink"
                >
                  <option value="All">All Orders</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Customer</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Ordered Items</th>
                      <th className="py-3.5 px-4">Total</th>
                      <th className="py-3.5 px-4">Fulfillment Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredOrders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{o.id}</td>
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-900">{o.customerName}</p>
                          <p className="text-[11px] text-slate-400">{o.email}</p>
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium">{o.date}</td>
                        <td className="py-3.5 px-4">
                          {o.items.map((item, i) => (
                            <span key={i} className="block text-[11px] text-slate-600">
                              {item.quantity}x {item.name}
                            </span>
                          ))}
                        </td>
                        <td className="py-3.5 px-4 font-black text-slate-900">{formatPrice(o.total)}</td>
                        <td className="py-3.5 px-4">
                          <select
                            value={o.status}
                            onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                            className={`rounded-xl border px-2.5 py-1 text-[11px] font-extrabold outline-none cursor-pointer ${
                              o.status === "Delivered"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : o.status === "Shipped"
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : o.status === "Processing"
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : "border-slate-200 bg-slate-50 text-slate-700"
                            }`}
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              if (confirm(`Remove record ${o.id}?`)) deleteOrder(o.id);
                            }}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                            aria-label="Remove order"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CUSTOMERS */}
        {activeTab === "customers" && (
          <div className="mt-6">
            <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-800">
                  <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="py-3.5 px-4">Customer Name</th>
                      <th className="py-3.5 px-4">Email</th>
                      <th className="py-3.5 px-4">Orders Placed</th>
                      <th className="py-3.5 px-4">Account Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { name: "Sokna Chhorm", email: "chhormsokna46@gmail.com", orders: 2, role: "Customer" },
                      { name: "Alex Morgan", email: "demo@kickstack.com", orders: 1, role: "Customer" },
                      { name: "Shop Owner Admin", email: "admin@kickstack.com", orders: 0, role: "Shop Owner" },
                      { name: "David Beckham", email: "david@example.com", orders: 1, role: "Customer" },
                      { name: "Sarah Connor", email: "sarah@cyberdyne.io", orders: 1, role: "Customer" },
                    ].map((c, i) => (
                      <tr key={i} className="hover:bg-slate-50/70 transition">
                        <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                        <td className="py-3.5 px-4 text-slate-500 font-medium">{c.email}</td>
                        <td className="py-3.5 px-4 font-bold text-slate-700">{c.orders} orders</td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                              c.role === "Shop Owner"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {c.role}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL: ADD PRODUCT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-900">Add New Shoe to Store</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Shoe Title</label>
                <input
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. Air Max Dn"
                  className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-medium outline-none focus:border-ink focus:bg-white transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Brand</label>
                  <select
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none focus:border-ink focus:bg-white"
                  >
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                    <option value="New Balance">New Balance</option>
                    <option value="Puma">Puma</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 text-xs font-bold outline-none focus:border-ink focus:bg-white"
                  >
                    <option value="Running">Running</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Basketball">Basketball</option>
                    <option value="Outdoor">Outdoor</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Price ($)</label>
                  <input
                    required
                    type="number"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    placeholder="150"
                    className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-ink focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Stock Units</label>
                  <input
                    required
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    placeholder="20"
                    className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold outline-none focus:border-ink focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Image URL</label>
                <input
                  value={newProd.imageUrl}
                  onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                  placeholder="https://..."
                  className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-medium outline-none focus:border-ink focus:bg-white"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-11 rounded-2xl border border-slate-200 px-5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-2xl bg-ink px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-flare transition"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-[32px] border border-slate-200/80 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-slate-900">Edit Product</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Shoe Name</label>
                <input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-900 outline-none focus:border-ink"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Price ($)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-900 outline-none focus:border-ink"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="mt-1 h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-xs font-bold text-slate-900 outline-none focus:border-ink"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="h-11 rounded-2xl border border-slate-200 px-5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-2xl bg-ink px-6 text-xs font-bold uppercase tracking-wider text-white hover:bg-flare transition"
                >
                  Update Shoe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
