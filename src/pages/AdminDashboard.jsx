import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAdmin } from "../context/AdminContext";
import { formatPrice } from "../data/products";
import { Lock, Plus, Trash, Check, Shield, Search, Chevron, User, Bag } from "../components/Icons";

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
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-inner">
          <Lock className="h-10 w-10" />
        </div>
        <h1 className="mt-6 text-3xl font-black text-ink">Access Restricted</h1>
        <p className="mt-2 text-base text-ink/60">
          This dashboard is reserved exclusively for the <span className="font-semibold text-ink">Shop Owner / Admin</span>.
        </p>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-left text-xs text-amber-800 sm:mx-auto sm:max-w-md">
          <p className="font-semibold uppercase tracking-wider text-amber-900">Current Logged-in Account:</p>
          <p className="mt-1">
            <span className="font-semibold">Email:</span> {user?.email}
          </p>
          <p>
            <span className="font-semibold">Role:</span> {user?.role || "customer"}
          </p>
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 rounded-3xl bg-ink p-6 text-white shadow-xl sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-volt text-ink">
              <Shield className="h-4 w-4" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-volt">Shop Owner Dashboard</span>
          </div>
          <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">Store Control Center</h1>
          <p className="mt-1 text-sm text-white/70">
            Welcome back, <span className="font-semibold text-white">{user?.firstName}</span>. Manage inventory, orders, and sales performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex h-11 items-center gap-2 rounded-2xl bg-volt px-5 text-sm font-bold uppercase tracking-wider text-ink transition hover:bg-white"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
          <Link
            to="/shop"
            className="flex h-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
          >
            View Live Shop
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mt-8 flex overflow-x-auto border-b border-ink/10">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition ${
            activeTab === "overview"
              ? "border-flare text-flare"
              : "border-transparent text-ink/60 hover:text-ink"
          }`}
        >
          <span>📊 Overview</span>
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition ${
            activeTab === "products"
              ? "border-flare text-flare"
              : "border-transparent text-ink/60 hover:text-ink"
          }`}
        >
          <span>👟 Inventory Products ({products.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition ${
            activeTab === "orders"
              ? "border-flare text-flare"
              : "border-transparent text-ink/60 hover:text-ink"
          }`}
        >
          <span>📦 Customer Orders ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("customers")}
          className={`flex items-center gap-2 border-b-2 px-6 py-3.5 text-sm font-bold transition ${
            activeTab === "customers"
              ? "border-flare text-flare"
              : "border-transparent text-ink/60 hover:text-ink"
          }`}
        >
          <span>👥 Customers Directory</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="mt-8 space-y-8">
          {/* Key Metric Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/40">Total Revenue</p>
              <p className="mt-3 text-3xl font-black text-ink">{formatPrice(totalRevenue)}</p>
              <p className="mt-2 text-xs font-semibold text-emerald-600">↑ +14.2% from last month</p>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/40">Total Orders</p>
              <p className="mt-3 text-3xl font-black text-ink">{totalOrders}</p>
              <p className="mt-2 text-xs font-semibold text-emerald-600">↑ +8 new this week</p>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/40">Active Products</p>
              <p className="mt-3 text-3xl font-black text-ink">{totalProductsCount}</p>
              <p className="mt-2 text-xs text-ink/50">Across 4 major brands</p>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-ink/40">Registered Customers</p>
              <p className="mt-3 text-3xl font-black text-ink">{totalCustomersCount}</p>
              <p className="mt-2 text-xs font-semibold text-emerald-600">Active membership base</p>
            </div>
          </div>

          {/* Recent Orders Preview Table */}
          <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-extrabold text-ink">Recent Customer Orders</h2>
              <button
                onClick={() => setActiveTab("orders")}
                className="text-xs font-bold text-flare hover:underline"
              >
                View all orders →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink">
                <thead className="border-b border-ink/10 text-xs font-bold uppercase tracking-wider text-ink/50">
                  <tr>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Total</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {orders.slice(0, 4).map((o) => (
                    <tr key={o.id} className="hover:bg-paper-dim">
                      <td className="py-3.5 px-4 font-mono font-bold text-ink">{o.id}</td>
                      <td className="py-3.5 px-4 font-medium">{o.customerName}</td>
                      <td className="py-3.5 px-4 text-ink/60">{o.date}</td>
                      <td className="py-3.5 px-4 font-extrabold">{formatPrice(o.total)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold ${
                            o.status === "Delivered"
                              ? "bg-emerald-100 text-emerald-800"
                              : o.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : o.status === "Processing"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {o.status}
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

      {/* TAB 2: PRODUCTS CONTROL */}
      {activeTab === "products" && (
        <div className="mt-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-ink/40" />
              <input
                value={productQuery}
                onChange={(e) => setProductQuery(e.target.value)}
                placeholder="Search products by name, brand, category..."
                className="h-11 w-full rounded-2xl border border-ink/10 bg-white pl-10 pr-4 text-sm text-ink outline-none focus:border-flare focus:ring-4 focus:ring-flare/10"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-ink px-5 text-sm font-bold uppercase tracking-wider text-white hover:bg-flare transition"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink">
                <thead className="border-b border-ink/10 bg-paper/60 text-xs font-bold uppercase tracking-wider text-ink/50">
                  <tr>
                    <th className="py-4 px-4">Product</th>
                    <th className="py-4 px-4">Brand</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Stock</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-paper-dim">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="h-12 w-12 rounded-xl object-cover border border-ink/10"
                          />
                          <div>
                            <p className="font-bold text-ink">{p.name}</p>
                            <p className="text-xs text-ink/50">{p.color || "Default color"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold">{p.brand}</td>
                      <td className="py-3.5 px-4 text-ink/70">{p.category}</td>
                      <td className="py-3.5 px-4 font-black">{formatPrice(p.price)}</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            p.stock > 10
                              ? "bg-emerald-100 text-emerald-800"
                              : p.stock > 0
                              ? "bg-amber-100 text-amber-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {p.stock > 0 ? `${p.stock} in stock` : "Out of stock"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingProduct(p)}
                            className="rounded-lg bg-ink/5 px-3 py-1.5 text-xs font-bold text-ink hover:bg-ink hover:text-white transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                                deleteProduct(p.id);
                              }
                            }}
                            className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-600 hover:text-white transition"
                            aria-label="Delete product"
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
        <div className="mt-8 space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-ink/40" />
              <input
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value)}
                placeholder="Search orders by ID, customer name, email..."
                className="h-11 w-full rounded-2xl border border-ink/10 bg-white pl-10 pr-4 text-sm text-ink outline-none focus:border-flare focus:ring-4 focus:ring-flare/10"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-ink/50">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 rounded-2xl border border-ink/10 bg-white px-4 text-sm font-semibold text-ink outline-none focus:border-flare"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink">
                <thead className="border-b border-ink/10 bg-paper/60 text-xs font-bold uppercase tracking-wider text-ink/50">
                  <tr>
                    <th className="py-4 px-4">Order ID</th>
                    <th className="py-4 px-4">Customer Details</th>
                    <th className="py-4 px-4">Date</th>
                    <th className="py-4 px-4">Items</th>
                    <th className="py-4 px-4">Total</th>
                    <th className="py-4 px-4">Order Status</th>
                    <th className="py-4 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-paper-dim">
                      <td className="py-4 px-4 font-mono font-bold text-ink">{o.id}</td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-ink">{o.customerName}</p>
                        <p className="text-xs text-ink/50">{o.email}</p>
                      </td>
                      <td className="py-4 px-4 text-ink/60">{o.date}</td>
                      <td className="py-4 px-4 text-xs font-medium">
                        {o.items.map((item, idx) => (
                          <span key={idx} className="block">
                            {item.quantity}x {item.name} ({item.brand})
                          </span>
                        ))}
                      </td>
                      <td className="py-4 px-4 font-black">{formatPrice(o.total)}</td>
                      <td className="py-4 px-4">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold outline-none cursor-pointer ${
                            o.status === "Delivered"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                              : o.status === "Shipped"
                              ? "border-blue-300 bg-blue-50 text-blue-800"
                              : o.status === "Processing"
                              ? "border-amber-300 bg-amber-50 text-amber-800"
                              : "border-gray-300 bg-gray-50 text-gray-800"
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Remove order record ${o.id}?`)) {
                              deleteOrder(o.id);
                            }
                          }}
                          className="rounded-lg p-2 text-ink/40 hover:bg-red-50 hover:text-red-600 transition"
                          aria-label="Delete order"
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

      {/* TAB 4: CUSTOMERS DIRECTORY */}
      {activeTab === "customers" && (
        <div className="mt-8 space-y-6">
          <div className="overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-ink">
                <thead className="border-b border-ink/10 bg-paper/60 text-xs font-bold uppercase tracking-wider text-ink/50">
                  <tr>
                    <th className="py-4 px-4">Customer</th>
                    <th className="py-4 px-4">Email</th>
                    <th className="py-4 px-4">Total Orders</th>
                    <th className="py-4 px-4">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/5">
                  {[
                    { name: "Sokna Chhorm", email: "chhormsokna46@gmail.com", orders: 2, role: "Customer" },
                    { name: "Alex Morgan", email: "demo@kickstack.com", orders: 1, role: "Customer" },
                    { name: "Shop Owner Admin", email: "admin@kickstack.com", orders: 0, role: "Admin / Owner" },
                    { name: "David Beckham", email: "david@example.com", orders: 1, role: "Customer" },
                    { name: "Sarah Connor", email: "sarah@cyberdyne.io", orders: 1, role: "Customer" },
                  ].map((c, idx) => (
                    <tr key={idx} className="hover:bg-paper-dim">
                      <td className="py-3.5 px-4 font-bold text-ink">{c.name}</td>
                      <td className="py-3.5 px-4 text-ink/70">{c.email}</td>
                      <td className="py-3.5 px-4 font-semibold">{c.orders} orders</td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ${
                            c.role.includes("Admin")
                              ? "bg-purple-100 text-purple-800"
                              : "bg-gray-100 text-gray-800"
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

      {/* MODAL: ADD PRODUCT */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-black text-ink">Add New Shoe to Inventory</h3>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Shoe Name</label>
                <input
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. Air Jordan 1 Retro"
                  className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none focus:border-flare"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Brand</label>
                  <select
                    value={newProd.brand}
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-3 text-sm font-semibold outline-none focus:border-flare"
                  >
                    <option value="Nike">Nike</option>
                    <option value="Adidas">Adidas</option>
                    <option value="New Balance">New Balance</option>
                    <option value="Puma">Puma</option>
                    <option value="Asics">Asics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-3 text-sm font-semibold outline-none focus:border-flare"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Price ($)</label>
                  <input
                    required
                    type="number"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    placeholder="150"
                    className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none focus:border-flare"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Stock Quantity</label>
                  <input
                    required
                    type="number"
                    value={newProd.stock}
                    onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                    placeholder="20"
                    className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none focus:border-flare"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Image URL (Optional)</label>
                <input
                  value={newProd.imageUrl}
                  onChange={(e) => setNewProd({ ...newProd, imageUrl: e.target.value })}
                  placeholder="https://images.pexels.com/..."
                  className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm outline-none focus:border-flare"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-11 rounded-2xl border border-ink/15 px-5 text-sm font-bold text-ink hover:bg-paper transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-2xl bg-ink px-6 text-sm font-bold text-white hover:bg-flare transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-ink/10 bg-white p-6 shadow-2xl">
            <h3 className="text-xl font-black text-ink">Edit Product Details</h3>
            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Name</label>
                <input
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm font-medium outline-none focus:border-flare"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Price ($)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm font-bold outline-none focus:border-flare"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/70">Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                    className="mt-1 h-11 w-full rounded-2xl border border-ink/10 bg-paper px-4 text-sm font-bold outline-none focus:border-flare"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="h-11 rounded-2xl border border-ink/15 px-5 text-sm font-bold text-ink hover:bg-paper transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-11 rounded-2xl bg-ink px-6 text-sm font-bold text-white hover:bg-flare transition"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
