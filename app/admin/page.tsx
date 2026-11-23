"use client";

import React, { useEffect, useState, useCallback } from "react";

interface Product {
  id: string;
  name: string;
  category: string;
  subType?: string;
  material: string;
  price: number;
  images: string;
  description: string;
}

interface Order {
  orderId: string;
  date: string;
  customerName: string;
  phone: string;
  address: string;
  items: string;
  total: number;
  status: string;
}

interface AdminUser {
  username: string;
  password: string;
}

const SESSION_KEY = "cacto_admin_session_v1";

const splitMediaSources = (raw: string): string[] => {
  if (!raw) return [];
  return raw
    .split(/,(?=\s*(?:https?:|data:image\/))/)
    .map((item) => item.trim())
    .filter(Boolean);
};

export default function AdminDashboardPage() {
  const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL || "";

  // Auth state
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Navigation & Data state
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "admins">("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [toast, setToast] = useState("");

  // Product Form Modal
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [pName, setPName] = useState("");
  const [pCategory, setPCategory] = useState("Mugs");
  const [pSubType, setPSubType] = useState("");
  const [pMaterial, setPMaterial] = useState("Ceramic");
  const [pPrice, setPPrice] = useState("");
  const [pImages, setPImages] = useState("");
  const [pDesc, setPDesc] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  // New Admin Form
  const [newAdminUser, setNewAdminUser] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");

  const notify = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const parseNum = (val: unknown) => {
    if (typeof val === "number") return isNaN(val) ? 0 : val;
    const num = parseFloat(String(val || "0").replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 0 : num;
  };

  const fetchAllFromSheets = useCallback(async () => {
    if (!sheetUrl) return;
    setSyncing(true);
    try {
      const res = await fetch(`${sheetUrl}?action=getAll&t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();

      const rawProducts = Array.isArray(data.products) ? data.products : [];
      setProducts(
        rawProducts.map((p: Record<string, unknown>, i: number) => ({
          id: String(p.id || p.ID || `PROD-${i + 1}`),
          name: String(p.name || p.Name || ""),
          category: String(p.category || p.Category || "Mugs"),
          subType: String(p.subType || p.subtype || ""),
          material: String(p.material || p.Material || ""),
          price: parseNum(p.price ?? p.Price),
          images: String(p.images || p.Images || p.image || p.Image || ""),
          description: String(p.description || p.Description || ""),
        }))
      );

      const rawOrders = Array.isArray(data.orders) ? data.orders : [];
      setOrders(
        rawOrders.map((o: Record<string, unknown>, i: number) => ({
          orderId: String(o.orderId || o["Order ID"] || o.id || `ORD-${i + 1}`),
          date: String(o.date || o.Date || ""),
          customerName: String(o.customerName || o["Customer Name"] || o.name || "-"),
          phone: String(o.phone || o.Phone || "-"),
          address: String(o.address || o.Address || "-"),
          items: String(o.items || o.Items || "-"),
          total: parseNum(o.total ?? o.Total),
          status: String(o.status || o.Status || "Processing"),
        }))
      );

      const rawAdmins = Array.isArray(data.admins) ? data.admins : [];
      setAdmins(
        rawAdmins.map((a: Record<string, unknown>) => ({
          username: String(a.username || a.Username || ""),
          password: String(a.password || a.Password || ""),
        }))
      );
    } catch {
      notify("Failed to sync with Google Sheets");
    } finally {
      setSyncing(false);
    }
  }, [sheetUrl]);

  useEffect(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      setCurrentUser(saved);
    }
    setAuthChecked(true);
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchAllFromSheets();
    }
  }, [currentUser, fetchAllFromSheets]);

  const postToSheet = async (payload: Record<string, unknown>) => {
    if (!sheetUrl) return;
    await fetch(sheetUrl, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(payload),
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoggingIn(true);

    try {
      const res = await fetch(`${sheetUrl}?action=getAdmins&t=${Date.now()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      const sheetAdmins: AdminUser[] = Array.isArray(data)
        ? data.map((a: Record<string, unknown>) => ({
            username: String(a.username || a.Username || "").trim(),
            password: String(a.password || a.Password || "").trim(),
          }))
        : [];

      const validFromSheet = sheetAdmins.find(
        (a) =>
          a.username.toLowerCase() === loginUser.trim().toLowerCase() &&
          a.password === loginPass.trim()
      );

      const validFallback =
        sheetAdmins.length === 0 &&
        loginUser.trim().toLowerCase() === "admin" &&
        loginPass.trim() === "cacto2026";

      if (validFromSheet || validFallback) {
        const userLabel = validFromSheet ? validFromSheet.username : "admin";
        localStorage.setItem(SESSION_KEY, userLabel);
        setCurrentUser(userLabel);
      } else {
        setLoginError("Invalid username or password.");
      }
    } catch {
      if (loginUser.trim().toLowerCase() === "admin" && loginPass.trim() === "cacto2026") {
        localStorage.setItem(SESSION_KEY, "admin");
        setCurrentUser("admin");
      } else {
        setLoginError("Could not verify credentials. Check Sheets connection.");
      }
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setLoginUser("");
    setLoginPass("");
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setPName("");
    setPCategory("Mugs");
    setPSubType("");
    setPMaterial("Ceramic");
    setPPrice("");
    setPImages("");
    setPDesc("");
    setShowProductForm(true);
  };

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPCategory(prod.category);
    setPSubType(prod.subType || "");
    setPMaterial(prod.material);
    setPPrice(String(prod.price));
    setPImages(prod.images);
    setPDesc(prod.description);
    setShowProductForm(true);
  };

  const compressImageToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxSide = 700;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxSide) {
            height = Math.round((height * maxSide) / width);
            width = maxSide;
          } else if (height > maxSide) {
            width = Math.round((width * maxSide) / height);
            height = maxSide;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return reject("Canvas error");
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.72));
        };
        img.onerror = reject;
        img.src = String(event.target?.result || "");
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLocalFilesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const compressedList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await compressImageToDataUrl(files[i]);
        compressedList.push(dataUrl);
      }

      setPImages((prev) => {
        const existing = prev.trim();
        const joined = compressedList.join(", ");
        return existing ? `${existing}, ${joined}` : joined;
      });
      notify(`${compressedList.length} image(s) ready to save`);
    } catch {
      notify("Failed to process selected image(s)");
    } finally {
      setUploadingImages(false);
      e.target.value = "";
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productObj: Product = {
      id: editingProduct ? editingProduct.id : `PROD-${Date.now()}`,
      name: pName.trim(),
      category: pCategory,
      subType: pSubType.trim(),
      material: pMaterial.trim(),
      price: parseNum(pPrice),
      images: pImages.trim(),
      description: pDesc.trim(),
    };

    if (editingProduct) {
      setProducts((prev) => prev.map((p) => (p.id === productObj.id ? productObj : p)));
      await postToSheet({ action: "updateProduct", product: productObj });
      notify("Product updated in Google Sheets");
    } else {
      setProducts((prev) => [...prev, productObj]);
      await postToSheet({ action: "addProduct", product: productObj });
      notify("Product added to Google Sheets");
    }

    setShowProductForm(false);
    setTimeout(fetchAllFromSheets, 1500);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product permanently from Google Sheets?")) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
    await postToSheet({ action: "deleteProduct", id });
    notify("Product deleted from Sheets");
    setTimeout(fetchAllFromSheets, 1500);
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
    await postToSheet({ action: "updateOrderStatus", orderId, status: newStatus });
    notify(`Order ${orderId} updated to ${newStatus}`);
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    const u = newAdminUser.trim();
    const p = newAdminPass.trim();
    if (!u || !p) return;

    if (admins.some((a) => a.username.toLowerCase() === u.toLowerCase())) {
      notify("Username already exists");
      return;
    }

    setAdmins((prev) => [...prev, { username: u, password: p }]);
    setNewAdminUser("");
    setNewAdminPass("");
    await postToSheet({ action: "addAdmin", username: u, password: p });
    notify(`Admin "${u}" added to Google Sheets`);
    setTimeout(fetchAllFromSheets, 1500);
  };

  const handleDeleteAdmin = async (username: string) => {
    if (admins.length <= 1) {
      notify("Cannot delete the last remaining admin");
      return;
    }
    if (!confirm(`Remove admin "${username}"?`)) return;
    setAdmins((prev) => prev.filter((a) => a.username !== username));
    await postToSheet({ action: "deleteAdmin", username });
    notify(`Admin "${username}" removed`);
    setTimeout(fetchAllFromSheets, 1500);
  };

  const formatDate = (raw: string) => {
    if (!raw) return "-";
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!authChecked) return null;

  if (!currentUser) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f0e8] px-4 text-[#2c2520]">
        <div className="w-full max-w-md rounded-2xl border border-[#e2d9cd] bg-white p-8 shadow-sm">
          <h1 className="mb-1 text-center font-serif text-2xl">Cacto Club Admin</h1>
          <p className="mb-6 text-center text-xs text-[#6b5e54]">
            Sign in with your admin username and password
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium">Username</label>
              <input
                type="text"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                placeholder="Enter username"
                className="w-full rounded-lg border border-[#d6cbc0] bg-[#faf7f2] px-3.5 py-2.5 text-sm outline-none focus:border-[#231f1d]"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium">Password</label>
              <input
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#d6cbc0] bg-[#faf7f2] px-3.5 py-2.5 text-sm outline-none focus:border-[#231f1d]"
                required
              />
            </div>

            {loginError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded-lg bg-[#231f1d] py-2.5 text-sm font-medium text-white transition hover:bg-[#3a3330] disabled:opacity-60"
            >
              {loggingIn ? "Verifying..." : "Sign In"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const previewSources = splitMediaSources(pImages);

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-4 py-10 text-[#2c2520]">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg bg-[#231f1d] px-4 py-2.5 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-2xl border border-[#e2d9cd] bg-[#faf7f2] p-6 shadow-sm md:flex-row">
        <aside className="w-full shrink-0 border-b border-[#e6ddd1] pb-4 md:w-56 md:border-b-0 md:border-r md:pb-0 md:pr-5">
          <div className="mb-5">
            <h2 className="font-serif text-lg font-medium">Cacto Club Admin</h2>
            <p className="text-xs text-[#7a6d62]">Logged in as: {currentUser}</p>
          </div>

          <nav className="space-y-1.5 text-sm">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${
                activeTab === "dashboard" ? "bg-[#eae1d3] font-medium" : "hover:bg-[#f1eae0]"
              }`}
            >
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${
                activeTab === "products" ? "bg-[#eae1d3] font-medium" : "hover:bg-[#f1eae0]"
              }`}
            >
              <span>Products</span>
              <span className="rounded-full bg-[#231f1d] px-2 py-0.5 text-xs text-white">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${
                activeTab === "orders" ? "bg-[#eae1d3] font-medium" : "hover:bg-[#f1eae0]"
              }`}
            >
              <span>Orders</span>
              <span className="rounded-full bg-[#231f1d] px-2 py-0.5 text-xs text-white">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("admins")}
              className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left ${
                activeTab === "admins" ? "bg-[#eae1d3] font-medium" : "hover:bg-[#f1eae0]"
              }`}
            >
              <span>Admins</span>
              <span className="rounded-full bg-[#231f1d] px-2 py-0.5 text-xs text-white">
                {admins.length}
              </span>
            </button>
          </nav>

          <div className="mt-6 space-y-2 border-t border-[#e6ddd1] pt-4">
            <button
              onClick={fetchAllFromSheets}
              disabled={syncing}
              className="w-full rounded-lg border border-[#d6cbc0] bg-white px-3 py-2 text-xs font-medium hover:bg-[#f5f0e8]"
            >
              {syncing ? "Syncing..." : "↻ Sync with Sheets"}
            </button>
            <button
              onClick={handleLogout}
              className="w-full rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </aside>

        <section className="flex-1">
          {activeTab === "dashboard" && (
            <div>
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <h1 className="font-serif text-2xl">Dashboard Overview</h1>
                <button
                  onClick={openAddProduct}
                  className="rounded-lg bg-[#231f1d] px-4 py-2 text-xs font-medium text-white hover:bg-[#3a3330]"
                >
                  + Add New Product
                </button>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-[#e2d9cd] bg-white p-5">
                  <p className="text-xs text-[#7a6d62]">Total Sales</p>
                  <p className="mt-1 text-2xl font-semibold">{totalSales.toFixed(2)} EGP</p>
                </div>
                <div className="rounded-xl border border-[#e2d9cd] bg-white p-5">
                  <p className="text-xs text-[#7a6d62]">Total Orders</p>
                  <p className="mt-1 text-2xl font-semibold">{orders.length}</p>
                </div>
                <div className="rounded-xl border border-[#e2d9cd] bg-white p-5">
                  <p className="text-xs text-[#7a6d62]">Active Products</p>
                  <p className="mt-1 text-2xl font-semibold">{products.length}</p>
                </div>
              </div>

              <div className="rounded-xl border border-[#e2d9cd] bg-white p-5">
                <h3 className="mb-3 font-serif text-lg">Recent Orders</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#efe8de] text-[#7a6d62]">
                        <th className="py-2.5 pr-3">Order ID</th>
                        <th className="py-2.5 pr-3">Customer</th>
                        <th className="py-2.5 pr-3">Phone</th>
                        <th className="py-2.5 pr-3">Total</th>
                        <th className="py-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#f3ede4]">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.orderId}>
                          <td className="py-3 pr-3 font-medium">{o.orderId}</td>
                          <td className="py-3 pr-3">{o.customerName}</td>
                          <td className="py-3 pr-3">{o.phone}</td>
                          <td className="py-3 pr-3 font-medium">{o.total.toFixed(2)} EGP</td>
                          <td className="py-3">
                            <select
                              value={o.status}
                              onChange={(e) => handleOrderStatusChange(o.orderId, e.target.value)}
                              className="rounded-md border border-[#d6cbc0] bg-[#faf7f2] px-2 py-1 text-xs"
                            >
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <div className="mb-5 flex items-center justify-between">
                <h1 className="font-serif text-2xl">Manage Products</h1>
                <button
                  onClick={openAddProduct}
                  className="rounded-lg bg-[#231f1d] px-4 py-2 text-xs font-medium text-white"
                >
                  + Add Product
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-[#e2d9cd] bg-white p-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#efe8de] text-[#7a6d62]">
                      <th className="py-2.5 pr-3">Name</th>
                      <th className="py-2.5 pr-3">Category</th>
                      <th className="py-2.5 pr-3">Material</th>
                      <th className="py-2.5 pr-3">Price</th>
                      <th className="py-2.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3ede4]">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3 pr-3 font-medium">{p.name}</td>
                        <td className="py-3 pr-3">{p.category}</td>
                        <td className="py-3 pr-3">{p.material || "-"}</td>
                        <td className="py-3 pr-3 font-medium">{p.price.toFixed(2)} EGP</td>
                        <td className="space-x-2 py-3 text-right">
                          <button
                            onClick={() => openEditProduct(p)}
                            className="rounded border border-[#d6cbc0] px-2.5 py-1 hover:bg-[#f5f0e8]"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <h1 className="mb-5 font-serif text-2xl">All Orders</h1>
              <div className="overflow-x-auto rounded-xl border border-[#e2d9cd] bg-white p-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#efe8de] text-[#7a6d62]">
                      <th className="py-2.5 pr-3">Order ID</th>
                      <th className="py-2.5 pr-3">Customer</th>
                      <th className="py-2.5 pr-3">Phone</th>
                      <th className="py-2.5 pr-3">Date</th>
                      <th className="py-2.5 pr-3">Items</th>
                      <th className="py-2.5 pr-3">Total</th>
                      <th className="py-2.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3ede4]">
                    {orders.map((o) => (
                      <tr key={o.orderId}>
                        <td className="py-3 pr-3 font-medium">{o.orderId}</td>
                        <td className="py-3 pr-3">{o.customerName}</td>
                        <td className="py-3 pr-3">{o.phone}</td>
                        <td className="py-3 pr-3">{formatDate(o.date)}</td>
                        <td className="py-3 pr-3">{o.items}</td>
                        <td className="py-3 pr-3 font-medium">{o.total.toFixed(2)} EGP</td>
                        <td className="py-3">
                          <select
                            value={o.status}
                            onChange={(e) => handleOrderStatusChange(o.orderId, e.target.value)}
                            className="rounded-md border border-[#d6cbc0] bg-[#faf7f2] px-2 py-1 text-xs"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "admins" && (
            <div>
              <h1 className="mb-2 font-serif text-2xl">Admin Accounts</h1>
              <p className="mb-5 text-xs text-[#6b5e54]">
                Add or remove admin users synced directly with the &ldquo;Admins&rdquo; tab in Google Sheets.
              </p>

              <form
                onSubmit={handleAddAdmin}
                className="mb-6 flex flex-col gap-3 rounded-xl border border-[#e2d9cd] bg-white p-4 sm:flex-row"
              >
                <input
                  type="text"
                  value={newAdminUser}
                  onChange={(e) => setNewAdminUser(e.target.value)}
                  placeholder="New Username"
                  className="flex-1 rounded-lg border border-[#d6cbc0] bg-[#faf7f2] px-3 py-2 text-xs outline-none"
                  required
                />
                <input
                  type="text"
                  value={newAdminPass}
                  onChange={(e) => setNewAdminPass(e.target.value)}
                  placeholder="New Password"
                  className="flex-1 rounded-lg border border-[#d6cbc0] bg-[#faf7f2] px-3 py-2 text-xs outline-none"
                  required
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#231f1d] px-4 py-2 text-xs font-medium text-white"
                >
                  + Add Admin
                </button>
              </form>

              <div className="overflow-x-auto rounded-xl border border-[#e2d9cd] bg-white p-4">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#efe8de] text-[#7a6d62]">
                      <th className="py-2.5 pr-3">Username</th>
                      <th className="py-2.5 pr-3">Password</th>
                      <th className="py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3ede4]">
                    {admins.map((a) => (
                      <tr key={a.username}>
                        <td className="py-3 pr-3 font-medium">{a.username}</td>
                        <td className="py-3 pr-3 font-mono text-[#6b5e54]">{a.password}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => handleDeleteAdmin(a.username)}
                            className="rounded border border-red-200 bg-red-50 px-2.5 py-1 text-red-700 hover:bg-red-100"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {showProductForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 font-serif text-xl">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="mb-1 block font-medium">Product Name</label>
                <input
                  type="text"
                  value={pName}
                  onChange={(e) => setPName(e.target.value)}
                  className="w-full rounded-lg border border-[#d6cbc0] px-3 py-2"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block font-medium">Category</label>
                  <select
                    value={pCategory}
                    onChange={(e) => setPCategory(e.target.value)}
                    className="w-full rounded-lg border border-[#d6cbc0] px-3 py-2"
                  >
                    <option value="Mugs">Mugs</option>
                    <option value="Jewellery">Jewellery</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block font-medium">Material</label>
                  <input
                    type="text"
                    value={pMaterial}
                    onChange={(e) => setPMaterial(e.target.value)}
                    placeholder="Ceramic / Gold-plated"
                    className="w-full rounded-lg border border-[#d6cbc0] px-3 py-2"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block font-medium">Price (EGP)</label>
                <input
                  type="number"
                  step="0.01"
                  value={pPrice}
                  onChange={(e) => setPPrice(e.target.value)}
                  className="w-full rounded-lg border border-[#d6cbc0] px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block font-medium">
                  Upload from Computer or Paste Image URLs
                </label>

                <label className="mb-2 flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#b8aa9c] bg-[#faf7f2] px-3 py-2.5 text-xs font-medium text-[#2c2520] transition hover:bg-[#f1eae0]">
                  <span>
                    {uploadingImages ? "Processing images..." : "📁 Choose Images from Computer"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleLocalFilesUpload}
                    disabled={uploadingImages}
                    className="hidden"
                  />
                </label>

                <textarea
                  rows={2}
                  value={pImages}
                  onChange={(e) => setPImages(e.target.value)}
                  placeholder="Selected computer images appear here automatically, or paste URLs separated by commas..."
                  className="w-full rounded-lg border border-[#d6cbc0] px-3 py-2"
                  required
                />

                {previewSources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {previewSources.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative h-14 w-14 overflow-hidden rounded-md border border-[#d6cbc0]"
                      >
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="mb-1 block font-medium">Description</label>
                <textarea
                  rows={2}
                  value={pDesc}
                  onChange={(e) => setPDesc(e.target.value)}
                  className="w-full rounded-lg border border-[#d6cbc0] px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProductForm(false)}
                  className="rounded-lg border border-[#d6cbc0] px-4 py-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#231f1d] px-4 py-2 font-medium text-white"
                >
                  Save to Sheets
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}