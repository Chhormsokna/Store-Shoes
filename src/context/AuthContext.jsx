import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "kickstack.auth.v1";

const DEMO_USER = {
  id: 1,
  firstName: "Alex",
  lastName: "Morgan",
  email: "demo@kickstack.com",
  password: "kickstack123",
  role: "customer",
};

const ADMIN_USER = {
  id: 99,
  firstName: "Shop",
  lastName: "Owner",
  email: "admin@kickstack.com",
  password: "admin",
  role: "admin",
};

const AuthContext = createContext(null);

const loadUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.user) return null;
    return parsed.user;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadUser);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
    } catch {
      /* ignore quota errors */
    }
  }, [user]);

  const login = useCallback((formValues) => {
    const email = String(formValues?.email ?? "").trim().toLowerCase();
    const password = String(formValues?.password ?? "");

    if (!email || !password) {
      const message = "Please enter both your email and password.";
      setError(message);
      return { success: false, message };
    }

    const usernamePart = email.split("@")[0] || "Member";
    const formattedName = usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1);

    // Determine role: if email includes 'admin' or explicit formValues.role === 'admin'
    const role =
      formValues?.role === "admin" || email.includes("admin") || email === ADMIN_USER.email
        ? "admin"
        : "customer";

    const nextUser = {
      id: Date.now(),
      firstName: formValues?.firstName || formattedName,
      lastName: formValues?.lastName || (role === "admin" ? "(Admin)" : ""),
      email: email,
      role: role,
    };

    setUser(nextUser);
    setError("");
    return { success: true, user: nextUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError("");
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      error,
      login,
      logout,
      demoUser: DEMO_USER,
      adminUser: ADMIN_USER,
    }),
    [user, error, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

export default AuthContext;
