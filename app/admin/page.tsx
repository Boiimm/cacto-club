"use client";
import { useStore, formatEGP } from "@/lib/store";
import { useState } from "react";

export default function AdminDashboardPage() {
  const { orders, products, addNewProduct, updateOrderStatus, deleteProduct, refreshStoreData } = useStore();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"dashboard" | "products">("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);

  const [newProd, setNewProd] = useState({
    name: "",
    price: "200",
    category: "Jewellery" as "Mugs" | "Jewellery",
    subType: "Rings" as "Rings" | "Necklaces" | "Earrings",
    material: "Gold-plated" as "Gold-plated" | "Ceramic",
    images: [] as string[],
    linkInput: "",
    description: "",
  });

  const totalSalesEGP = orders.reduce((sum, o) => sum + o.total, 0);

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          setNewProd((prev) => ({
            ...prev,
            images: [...prev.images, compressedBase64],
          }));
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddLink = () => {
    const trimmed = newProd.linkInput.trim();
    if (!trimmed) return;
    setNewProd((prev) => ({
      ...prev,
      images: [...prev.images, trimmed],
      linkInput: "",
    }));
  };

  const handleRemovePreviewImage = (idx: number) => {
    setNewProd((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== idx),
    }));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalImages = newProd.linkInput.trim()
      ? [...newProd.images, newProd.linkInput.trim()]
      : newProd.images;

    await addNewProduct({
      id: "prod-" + Date.now(),
      name: newProd.name,
      price: Number(newProd.price) || 0,
      category: newProd.category,
      subType: newProd.subType,
      material: newProd.material,
      image: finalImages[0] || "",
      images: finalImages,
      description: newProd.description,
    });
    setShowAddModal(false);
    setNewProd({
      name: "",
      price: "200",
      category: "Jewellery",
      subType: "Rings",
      material: "Gold-plated",
      images: [],
      linkInput: "",
      description: "",
    });
  };

  if (!isAuthenticated) {
    return (
      <main className="max-w-md mx-auto px-4 py-20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === "cacto2026") setIsAuthenticated(true);
            else alert("كلمة المرور غير صحيحة");
          }}
          className="bg-[#FAF8F5] p-8 rounded-xl border border-[#E2DDD5] space-y-4 text-center shadow-sm"
        >
          <h1 className="text-2xl font-serif-title">Cacto Club Admin</h1>
          <p className="text-xs text-[#6E6A63]">أدخل كلمة المرور للدخول إلى لوحة التحكم</p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 text-xs border border-[#E2DDD5] rounded bg-white text-center"
          />
          <button type="submit" className="w-full bg-[#1E2522] text-white py-2.5 rounded text-xs font-medium">
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="bg-[#FAF8F5] rounded-xl border border-[#E2DDD5] p-6 grid grid-cols-1 md:grid-cols-5 gap-8">
        <aside className="space-y-2 text-xs border-r border-[#E2DDD5] pr-4">
          <div className="font-semibold text-sm mb-4">Cacto Club Admin</div>
          <button
            type="button"
            onClick={() => setActiveTab("dashboard")}
            className={`w-full text-left px-3 py-2 rounded ${
              activeTab === "dashboard" ? "bg-[#EAE5DC] font-medium" : "text-[#6E6A63]"
            }`}
          >
            ⌂ Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`w-full text-left px-3 py-2 rounded ${
              activeTab === "products" ? "bg-[#EAE5DC] font-medium" : "text-[#6E6A63]"
            }`}
          >
            ◆ Products ({products.length})
          </button>
          <div className="px-3 py-2 text-[#6E6A63] flex justify-between items-center">
            <span>🛒 Orders</span>
            <span className="bg-[#1E2522] text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {orders.length}
            </span>
          </div>
          <button
            type="button"
            onClick={() => refreshStoreData()}
            className="w-full text-left px-3 py-2 rounded text-[#1E2522] border border-[#D5CFC4] bg-white mt-2"
          >
            ↻ Refresh from Sheets
          </button>
        </aside>

        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif-title">Dashboard Overview</h1>
            <button
              type="button"
              onClick={() => setShowAddModal(!showAddModal)}
              className="bg-[#1E2522] text-white text-xs px-4 py-2 rounded hover:bg-black"
            >
              + Add New Product
            </button>
          </div>

          {showAddModal && (
            <form
              onSubmit={handleAddProduct}
              className="bg-white p-5 rounded-lg border border-[#E2DDD5] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
            >
              <input
                type="text"
                placeholder="Product Name (اسم المنتج)"
                required
                value={newProd.name}
                onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                className="p-2.5 border rounded"
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price (EGP)"
                required
                value={newProd.price}
                onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                className="p-2.5 border rounded"
              />
              <select
                value={newProd.category}
                onChange={(e) =>
                  setNewProd({
                    ...newProd,
                    category: e.target.value as "Mugs" | "Jewellery",
                    material: e.target.value === "Mugs" ? "Ceramic" : "Gold-plated",
                  })
                }
                className="p-2.5 border rounded"
              >
                <option value="Jewellery">Jewellery</option>
                <option value="Mugs">Mugs</option>
              </select>
              <select
                value={newProd.material}
                onChange={(e) =>
                  setNewProd({ ...newProd, material: e.target.value as "Gold-plated" | "Ceramic" })
                }
                className="p-2.5 border rounded"
              >
                <option value="Gold-plated">Gold-plated</option>
                <option value="Ceramic">Ceramic</option>
              </select>

              <div className="sm:col-span-2 space-y-2">
                <label className="block font-medium text-[#6E6A63]">
                  صور المنتج (يمكنك اختيار أكثر من صورة من جهازك أو إضافة عدة روابط Google Drive):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleMultipleImageUpload}
                    className="p-2 border rounded bg-[#FAF8F5] flex-1"
                  />
                  <div className="flex gap-1.5 flex-1">
                    <input
                      type="url"
                      placeholder="الصق رابط صورة هنا واضغط + Add"
                      value={newProd.linkInput}
                      onChange={(e) => setNewProd({ ...newProd, linkInput: e.target.value })}
                      className="p-2 border rounded flex-1"
                    />
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="px-3 py-2 bg-[#EAE5DC] text-[#1E2522] rounded font-medium hover:bg-[#D5CFC4]"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {newProd.images.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {newProd.images.map((imgSrc, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded border overflow-hidden group">
                        <img src={imgSrc} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => handleRemovePreviewImage(idx)}
                          className="absolute top-0 right-0 bg-black/70 text-white text-[10px] px-1.5 py-0.5"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <textarea
                placeholder="Product Description (وصف المنتج)"
                value={newProd.description}
                onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                className="sm:col-span-2 p-2.5 border rounded"
                rows={2}
              />

              <button type="submit" className="sm:col-span-2 bg-[#1E2522] text-white py-2.5 rounded font-medium">
                Save Product to Store & Google Sheets
              </button>
            </form>
          )}

          {activeTab === "products" ? (
            <div className="bg-white rounded-lg border border-[#E2DDD5] p-4">
              <h2 className="text-sm font-semibold mb-3">All Store Products</h2>
              {products.length === 0 ? (
                <p className="text-xs text-[#6E6A63] py-4">لا توجد منتجات في Google Sheets حالياً.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {products.map((p) => (
                    <div key={p.id} className="border border-[#E2DDD5] rounded-lg p-2.5 space-y-2 text-xs">
                      {p.image && (
                        <img src={p.image} alt={p.name} className="w-full aspect-square object-cover rounded" />
                      )}
                      <h4 className="font-medium truncate">{p.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-[#6E6A63]">{formatEGP(p.price)}</span>
                        <button
                          type="button"
                          onClick={() => deleteProduct(p.id)}
                          className="text-red-600 hover:underline text-[11px]"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-[#E2DDD5] bg-white">
                  <p className="text-[11px] text-[#6E6A63]">Total Sales (From Orders)</p>
                  <p className="text-xl font-semibold mt-1">{formatEGP(totalSalesEGP)}</p>
                </div>
                <div className="p-4 rounded-lg border border-[#E2DDD5] bg-white">
                  <p className="text-[11px] text-[#6E6A63]">Total Orders</p>
                  <p className="text-xl font-semibold mt-1">{orders.length}</p>
                </div>
                <div className="p-4 rounded-lg border border-[#E2DDD5] bg-white">
                  <p className="text-[11px] text-[#6E6A63]">Active Products</p>
                  <p className="text-xl font-semibold mt-1">{products.length}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#E2DDD5] p-4 overflow-x-auto">
                <h2 className="text-sm font-semibold mb-3">Orders (From Google Sheets)</h2>
                {orders.length === 0 ? (
                  <p className="text-xs text-[#6E6A63] py-4">لا توجد طلبات مسجلة في Google Sheets حتى الآن.</p>
                ) : (
                  <table className="w-full text-left text-xs">
                    <thead className="text-[#6E6A63] border-b border-[#E2DDD5]">
                      <tr>
                        <th className="pb-2">Order ID</th>
                        <th className="pb-2">Customer Name</th>
                        <th className="pb-2">Date</th>
                        <th className="pb-2">Items</th>
                        <th className="pb-2">Total</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2DDD5]">
                      {orders.map((o) => (
                        <tr key={o.orderId}>
                          <td className="py-2.5">{o.orderId}</td>
                          <td className="py-2.5">{o.customerName}</td>
                          <td className="py-2.5 text-[#6E6A63]">{o.date}</td>
                          <td className="py-2.5">{o.itemsSummary || o.itemsCount}</td>
                          <td className="py-2.5 font-medium">{formatEGP(o.total)}</td>
                          <td className="py-2.5">
                            <button
                              type="button"
                              onClick={() =>
                                updateOrderStatus(
                                  o.orderId,
                                  o.status === "Processing" ? "Shipped" : "Processing"
                                )
                              }
                              className={`px-2.5 py-0.5 rounded-full text-[10px] cursor-pointer ${
                                o.status === "Processing"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {o.status}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}