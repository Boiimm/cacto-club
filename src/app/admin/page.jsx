"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("accessories");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  useEffect(() => {
    // جلب المنتجات والريفيوهات من LocalStorage
    const defaultProducts = [
      { id: 1, name: "Trendy Designer Earrings", price: 150, category: "accessories", image: "/placeholder.jpg", description: "حلقان مميزة بتصميم عصري أنيق." },
      { id: 2, name: "Handmade Clay Mug 1", price: 220, category: "mugs", image: "/placeholder.jpg", description: "مج فخار مصنوع يدويًا بحب." },
      { id: 3, name: "Handmade Clay Mug 2", price: 240, category: "mugs", image: "/placeholder.jpg", description: "مج فخار كلاسيكي مميز." },
      { id: 4, name: "Handmade Clay Mug 3", price: 260, category: "mugs", image: "/placeholder.jpg", description: "مج فخار بتصميم فني راقي." }
    ];

    const savedProducts = JSON.parse(localStorage.getItem("cacto_products") || JSON.stringify(defaultProducts));
    setProducts(savedProducts);

    const savedReviews = JSON.parse(localStorage.getItem("cacto_reviews") || "[]");
    setReviews(savedReviews);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    // بيانات الأمان الخاصة بالآدمن
    if (username === "admin" && password === "cacto2026") {
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("اسم المستخدم أو كلمة المرور غير صحيحة!");
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProduct = {
      id: Date.now(),
      name,
      price: Number(price),
      category,
      description,
      image: image || "/placeholder.jpg"
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem("cacto_products", JSON.stringify(updated));

    setName("");
    setPrice("");
    setDescription("");
    setImage("");
  };

  const handleDeleteProduct = (id) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem("cacto_products", JSON.stringify(updated));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between" dir="rtl">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-4">
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 max-w-md w-full space-y-4">
            <h2 className="text-2xl font-bold text-[#4B382A] text-center mb-6">تسجيل دخول الآدمن 🔒</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#8C6D53]"
              required
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#8C6D53]"
              required
            />
            <button type="submit" className="w-full bg-[#4B382A] text-white py-3 rounded-xl font-medium hover:bg-[#38291F] transition">
              دخول للوحة التحكم
            </button>
          </form>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex-grow max-w-4xl space-y-10">
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-bold text-[#4B382A]">لوحة التحكم الرئيسية 🌵</h1>
          <button onClick={() => setIsAuthenticated(false)} className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm">تسجيل الخروج</button>
        </div>

        {/* إضافة منتج */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#4B382A] mb-4">إضافة منتج جديد</h2>
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input type="text" placeholder="اسم المنتج" value={name} onChange={(e) => setName(e.target.value)} className="border p-3 rounded-xl" required />
              <input type="number" placeholder="السعر (ج.م)" value={price} onChange={(e) => setPrice(e.target.value)} className="border p-3 rounded-xl" required />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border p-3 rounded-xl bg-white">
              <option value="accessories">إكسسوارات (Accessories)</option>
              <option value="mugs">مجات فخار (Clay Mugs)</option>
            </select>
            <input type="text" placeholder="رابط الصورة" value={image} onChange={(e) => setImage(e.target.value)} className="w-full border p-3 rounded-xl" />
            <textarea placeholder="الوصف" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border p-3 rounded-xl" rows="2"></textarea>
            <button type="submit" className="w-full bg-[#4B382A] text-white py-3 rounded-xl font-medium">حفظ وإضافة المنتج</button>
          </form>
        </div>

        {/* إدارة المنتجات وحذفها */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#4B382A] mb-4">المنتجات الحالية ({products.length})</h2>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {products.map(p => (
              <div key={p.id} className="flex justify-between items-center border-b pb-3">
                <div>
                  <p className="font-bold text-[#4B382A]">{p.name} <span className="text-xs text-gray-400">({p.category})</span></p>
                  <p className="text-sm text-[#8C6D53]">{p.price} ج.م</p>
                </div>
                <button onClick={() => handleDeleteProduct(p.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs">حذف</button>
              </div>
            ))}
          </div>
        </div>

        {/* حقل عرض الريفيوهات */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#4B382A] mb-4">آراء العملاء والريفيوهات ⭐</h2>
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">لا توجد ريفيوهات مسجلة حتى الآن.</p>
          ) : (
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={i} className="border-b pb-2">
                  <p className="font-bold text-gray-800">{r.name}</p>
                  <p className="text-sm text-gray-600">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}