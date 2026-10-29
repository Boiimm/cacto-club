"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminPage() {
  const [lang, setLang] = useState('en');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // بيانات تسجيل الدخول
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  // بيانات إدارة المنتجات
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [nameEn, setNameEn] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("accessories");
  const [image, setImage] = useState("");

  // بيانات إدارة الأدمنة
  const [admins, setAdmins] = useState([]);
  const [newAdminUser, setNewAdminUser] = useState("");
  const [newAdminPass, setNewAdminPass] = useState("");

  useEffect(() => {
    const currentLang = localStorage.getItem("cacto_lang") || 'en';
    setLang(currentLang);

    // التحقق من الجلسة الحالية
    const authStatus = sessionStorage.getItem("cacto_admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }

    // جلب الأدمنة أو إنشاء الافتراضي
    let savedAdmins = JSON.parse(localStorage.getItem("cacto_admins"));
    if (!savedAdmins || savedAdmins.length === 0) {
      savedAdmins = [{ username: "admin", password: "cacto123" }];
      localStorage.setItem("cacto_admins", JSON.stringify(savedAdmins));
    }
    setAdmins(savedAdmins);

    // جلب المنتجات
    const savedProducts = JSON.parse(localStorage.getItem("cacto_dynamic_products")) || [];
    setProducts(savedProducts);
  }, []);

  // تسجيل الدخول
  const handleLogin = (e) => {
    e.preventDefault();
    const foundAdmin = admins.find(
      (adm) => adm.username === usernameInput && adm.password === passwordInput
    );

    if (foundAdmin) {
      setIsAuthenticated(true);
      sessionStorage.setItem("cacto_admin_auth", "true");
    } else {
      alert(lang === 'en' ? "Invalid username or password!" : "اسم المستخدم أو كلمة المرور غير صحيحة!");
    }
  };

  // تسجيل الخروج
  const handleSignOut = () => {
    sessionStorage.removeItem("cacto_admin_auth");
    setIsAuthenticated(false);
    setUsernameInput("");
    setPasswordInput("");
  };

  // إضافة أدمن جديد
  const handleAddAdmin = (e) => {
    e.preventDefault();
    if (!newAdminUser || !newAdminPass) return;

    const exists = admins.some((adm) => adm.username === newAdminUser);
    if (exists) {
      alert(lang === 'en' ? "Username already exists!" : "اسم المستخدم موجود مسبقاً!");
      return;
    }

    const updatedAdmins = [...admins, { username: newAdminUser, password: newAdminPass }];
    setAdmins(updatedAdmins);
    localStorage.setItem("cacto_admins", JSON.stringify(updatedAdmins));

    setNewAdminUser("");
    setNewAdminPass("");
    alert(lang === 'en' ? "New admin added and saved permanently!" : "تم إضافة الأدمن الجديد وحفظه بشكل دائم! ✨");
  };

  // حذف أدمن
  const handleDeleteAdmin = (usernameToDelete) => {
    if (admins.length <= 1) {
      alert(lang === 'en' ? "You must keep at least one admin!" : "يجب أن يبقى أدمن واحد على الأقل في النظام!");
      return;
    }

    const updatedAdmins = admins.filter((adm) => adm.username !== usernameToDelete);
    setAdmins(updatedAdmins);
    localStorage.setItem("cacto_admins", JSON.stringify(updatedAdmins));
  };

  // إضافة منتج جديد
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price) return;

    const newProduct = {
      id: Date.now().toString(),
      name,
      nameEn: nameEn || name,
      price: Number(price),
      category,
      image: image || "/images/accessories/earrings.jpg",
    };

    const updatedProducts = [newProduct, ...products];
    setProducts(updatedProducts);
    localStorage.setItem("cacto_dynamic_products", JSON.stringify(updatedProducts));

    setName("");
    setNameEn("");
    setPrice("");
    setImage("");
    alert(lang === 'en' ? "Product added successfully!" : "تم إضافة المنتج بنجاح! ✨");
  };

  // حذف منتج
  const handleDeleteProduct = (id) => {
    const updatedProducts = products.filter((p) => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem("cacto_dynamic_products", JSON.stringify(updatedProducts));
  };

  // شاشة تسجيل الدخول
  if (!isAuthenticated) {
    return (
      <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between">
        <div>
          <Navbar />
          <div className="max-w-md mx-auto px-6 pt-24 pb-20">
            <div className="bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-xs text-center">
              <h1 className="text-2xl font-bold text-[#4B382A] mb-6">
                {lang === 'en' ? "Admin Login 🔒" : "تسجيل دخول الأدمن 🔒"}
              </h1>
              
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <input 
                  type="text" 
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder={lang === 'en' ? "Username..." : "اسم المستخدم..."}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A] focus:outline-none"
                  autoComplete="off"
                  required
                />
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder={lang === 'en' ? "Password..." : "كلمة المرور..."}
                  className="w-full px-4 py-3 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A] focus:outline-none"
                  autoComplete="new-password"
                  required
                />
                <button type="submit" className="w-full bg-[#4B382A] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#38291F] transition cursor-pointer">
                  {lang === 'en' ? "Login" : "دخول"}
                </button>
              </form>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // لوحة التحكم الكاملة
  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-4xl mx-auto px-6 pt-12 pb-20">
          <div className="flex justify-between items-center mb-8">
            <Link href="/products" className="text-sm text-[#7C6A58] hover:text-[#4B382A]">
              {lang === 'en' ? "← Back to Products" : "← العودة للمنتجات"}
            </Link>
            <button 
              onClick={handleSignOut}
              className="text-xs bg-red-100 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-200 transition cursor-pointer font-medium"
            >
              {lang === 'en' ? "Sign Out" : "تسجيل خروج"}
            </button>
          </div>

          <h1 className="text-3xl font-extrabold text-[#4B382A] mb-8 text-center">
            {lang === 'en' ? "Admin Dashboard ⚙️" : "لوحة التحكم الرئيسية ⚙️"}
          </h1>

          {/* قسم إدارة الأدمنة */}
          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-xs mb-10">
            <h2 className="text-xl font-bold text-[#4B382A] mb-4">
              {lang === 'en' ? "Manage Admins & Credentials 👥" : "إدارة حسابات الأدمن الدائمة 👥"}
            </h2>

            <form onSubmit={handleAddAdmin} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-[#7C6A58] mb-1">
                  {lang === 'en' ? "New Username" : "اسم المستخدم الجديد"}
                </label>
                <input type="text" value={newAdminUser} onChange={(e) => setNewAdminUser(e.target.value)} required placeholder={lang === 'en' ? "New username" : "اسم المستخدم"} className="w-full px-4 py-2 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A]" autoComplete="off" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#7C6A58] mb-1">
                  {lang === 'en' ? "New Password" : "كلمة المرور الجديدة"}
                </label>
                <input type="password" value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} required placeholder={lang === 'en' ? "New password" : "كلمة المرور"} className="w-full px-4 py-2 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A]" autoComplete="new-password" />
              </div>
              <div className="flex items-end">
                <button type="submit" className="w-full bg-[#8C6D53] text-white py-2.5 rounded-xl text-xs font-medium hover:bg-[#785B43] transition cursor-pointer">
                  {lang === 'en' ? "Add Permanent Admin ➕" : "إضافة أدمن دائم ➕"}
                </button>
              </div>
            </form>

            <div className="border-t border-[#E8E2D5] pt-4">
              <h3 className="text-xs font-bold text-[#7C6A58] mb-3">
                {lang === 'en' ? "Permanent Admins List:" : "قائمة حسابات الأدمن الدائمة:"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {admins.map((adm, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-[#F7F4EF] px-3 py-1.5 rounded-xl border border-[#E8E2D5] text-xs text-[#4B382A]">
                    <span>👤 {adm.username}</span>
                    <button 
                      onClick={() => handleDeleteAdmin(adm.username)}
                      className="text-red-500 hover:text-red-700 font-bold ml-1 cursor-pointer"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* نموذج إضافة منتج جديد */}
          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-xs mb-10">
            <h2 className="text-xl font-bold text-[#4B382A] mb-4">
              {lang === 'en' ? "Add New Product" : "إضافة منتج جديد"}
            </h2>

            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#7C6A58] mb-1">
                  {lang === 'en' ? "Product Name (Arabic)" : "اسم المنتج بالعربي"}
                </label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder={lang === 'en' ? "e.g. Trendy Earrings" : "مثال: حلقان مميزة..."} className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A]" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7C6A58] mb-1">
                  {lang === 'en' ? "Product Name (English)" : "اسم المنتج بالإنجليزية (Name En)"}
                </label>
                <input type="text" value={nameEn} onChange={(e) => setNameEn(e.target.value)} placeholder="e.g. Silver Necklace..." className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A]" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7C6A58] mb-1">
                  {lang === 'en' ? "Price (EGP)" : "السعر (EGP)"}
                </label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required placeholder="200" className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A]" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7C6A58] mb-1">
                  {lang === 'en' ? "Category" : "القسم (Category)"}
                </label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A]">
                  <option value="accessories">{lang === 'en' ? "Accessories" : "Accessories / إكسسوارات"}</option>
                  <option value="mugs">{lang === 'en' ? "Mugs" : "Mugs / مجات"}</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-[#7C6A58] mb-1">
                  {lang === 'en' ? "Image URL" : "رابط الصورة (Image URL)"}
                </label>
                <input type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="/images/accessories/earrings.jpg" className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A]" />
              </div>

              <div className="md:col-span-2 mt-2">
                <button type="submit" className="w-full bg-[#4B382A] text-[#F7F4EF] py-3 rounded-xl text-sm font-medium hover:bg-[#38291F] transition cursor-pointer">
                  {lang === 'en' ? "Add Product ➕" : "إضافة المنتج ➕"}
                </button>
              </div>
            </form>
          </div>

          {/* قائمة المنتجات الحالية */}
          <div className="bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-xs">
            <h2 className="text-xl font-bold text-[#4B382A] mb-6">
              {lang === 'en' ? "Existing Products" : "المنتجات الحالية"} ({products.length})
            </h2>

            <div className="flex flex-col gap-4">
              {products.map((prod) => (
                <div key={prod.id} className="flex items-center justify-between p-4 bg-[#F7F4EF] rounded-2xl border border-[#E8E2D5]">
                  <div className="flex items-center gap-4">
                    <img src={prod.image || "/images/accessories/earrings.jpg"} alt={prod.name} className="w-14 h-14 object-cover rounded-xl" />
                    <div>
                      <h4 className="font-bold text-[#4B382A] text-sm">{lang === 'en' ? prod.nameEn : prod.name}</h4>
                      <p className="text-xs text-[#8C6D53] font-semibold">{prod.price} EGP</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-red-600 transition cursor-pointer"
                  >
                    {lang === 'en' ? "Delete 🗑️" : "حذف 🗑️"}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </main>
  );
}