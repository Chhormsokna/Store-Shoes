import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products as initialProducts } from "../data/products";

const PRODUCTS_KEY = "kickstack.admin.products.v1";
const ORDERS_KEY = "kickstack.admin.orders.v1";

const MOCK_INITIAL_ORDERS = [
  {
    id: "ORD-9821",
    customerName: "Sokna Chhorm",
    email: "chhormsokna46@gmail.com",
    date: "2026-09-11",
    total: 313.00,
    itemsCount: 2,
    status: "Processing",
    paymentMethod: "Credit Card",
    shippingAddress: "Street 271, Phnom Penh, Cambodia",
    items: [
      { name: "Air Zoom Pegasus Trail", brand: "Nike", price: 148, quantity: 1, size: 9 },
      { name: "Air Max Pulse", brand: "Nike", price: 165, quantity: 1, size: 10 },
    ],
  },
  {
    id: "ORD-9820",
    customerName: "Alex Morgan",
    email: "demo@kickstack.com",
    date: "2026-09-10",
    total: 190.00,
    itemsCount: 1,
    status: "Shipped",
    paymentMethod: "PayPal",
    shippingAddress: "742 Evergreen Terrace, Springfield, US",
    items: [
      { name: "Ultraboost Light", brand: "Adidas", price: 190, quantity: 1, size: 10 },
    ],
  },
  {
    id: "ORD-9819",
    customerName: "David Beckham",
    email: "david@example.com",
    date: "2026-09-08",
    total: 420.00,
    itemsCount: 3,
    status: "Delivered",
    paymentMethod: "Credit Card",
    shippingAddress: "London, UK",
    items: [
      { name: "990v6 Made in USA", brand: "New Balance", price: 200, quantity: 2, size: 11 },
    ],
  },
  {
    id: "ORD-9818",
    customerName: "Sarah Connor",
    email: "sarah@cyberdyne.io",
    date: "2026-09-05",
    total: 148.00,
    itemsCount: 1,
    status: "Delivered",
    paymentMethod: "Credit Card",
    shippingAddress: "Los Angeles, CA",
    items: [
      { name: "Air Zoom Pegasus Trail", brand: "Nike", price: 148, quantity: 1, size: 8 },
    ],
  },
  {
    id: "ORD-9817",
    customerName: "John Doe",
    email: "john.doe@gmail.com",
    date: "2026-09-01",
    total: 165.00,
    itemsCount: 1,
    status: "Pending",
    paymentMethod: "Cash on Delivery",
    shippingAddress: "New York, NY",
    items: [
      { name: "Air Max Pulse", brand: "Nike", price: 165, quantity: 1, size: 9 },
    ],
  },
];

const loadProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    if (!raw) return initialProducts;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : initialProducts;
  } catch {
    return initialProducts;
  }
};

const loadOrders = () => {
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (!raw) return MOCK_INITIAL_ORDERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : MOCK_INITIAL_ORDERS;
  } catch {
    return MOCK_INITIAL_ORDERS;
  }
};

const AdminContext = createContext(null);

export function AdminProvider({ children }) {
  const [productsList, setProductsList] = useState(loadProducts);
  const [ordersList, setOrdersList] = useState(loadOrders);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productsList));
    } catch {
      /* ignore quota */
    }
  }, [productsList]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(ordersList));
    } catch {
      /* ignore quota */
    }
  }, [ordersList]);

  const addProduct = useCallback((productData) => {
    const newProduct = {
      id: Date.now(),
      slug: (productData.name || "new-shoe").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      brand: productData.brand || "Nike",
      name: productData.name || "New Sneaker",
      category: productData.category || "Lifestyle",
      gender: productData.gender || "Unisex",
      price: Number(productData.price) || 120,
      compareAt: productData.compareAt ? Number(productData.compareAt) : null,
      rating: 5.0,
      reviews: 0,
      color: productData.color || "Black / White",
      colorHex: productData.colorHex || "#000000",
      colors: [{ name: productData.color || "Black", hex: productData.colorHex || "#000000" }],
      sizes: [7, 8, 9, 10, 11],
      stock: Number(productData.stock) || 10,
      tags: ["new"],
      badge: "New arrival",
      images: [
        productData.imageUrl ||
          "https://images.pexels.com/photos/10963373/pexels-photo-10963373.jpeg?auto=compress&cs=tinysrgb&w=900",
      ],
      description: productData.description || "High performance quality footwear.",
      details: ["Premium materials", "Durable Rubber Sole", "Breathable Mesh"],
    };

    setProductsList((prev) => [newProduct, ...prev]);
    return newProduct;
  }, []);

  const updateProduct = useCallback((id, updatedFields) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  }, []);

  const deleteProduct = useCallback((id) => {
    setProductsList((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrdersList((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  }, []);

  const deleteOrder = useCallback((orderId) => {
    setOrdersList((prev) => prev.filter((o) => o.id !== orderId));
  }, []);

  const value = useMemo(
    () => ({
      products: productsList,
      orders: ordersList,
      addProduct,
      updateProduct,
      deleteProduct,
      updateOrderStatus,
      deleteOrder,
    }),
    [productsList, ordersList, addProduct, updateProduct, deleteProduct, updateOrderStatus, deleteOrder]
  );

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within <AdminProvider>");
  return ctx;
}

export default AdminContext;

