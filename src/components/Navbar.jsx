"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { translations } from "@/locales/translations";

export default function Navbar() {
  const [lang, setLang] = useState("ar");
  const [cartCount, setCartCount] = useState(0);

  // دالة لحساب عدد المنتجات في السلة
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cacto_cart") || "[]");
    setCartCount(cart.length);
  };

  useEffect(() => {
    // جلب اللغة والحرص على تحديث عدد السلة عند التحميل
    const currentLang = localStorage.getItem("cacto_lang") || "ar";
    setLang(currentLang);
    updateCartCount();

    // الاستماع لحدث تحديث السلة لتغيير الرقم فوراً
    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleLanguageToggle = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    setLang(newLang);
    localStorage.setItem("cacto_lang", newLang);
    window.location.reload(); // تحديث الصفحة لتطبيق اللغة الجديدة في باقي المكونات
  };

  const t = translations[lang] || translations.ar;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* اللوجو */}
        <Link href="/" className="text-2xl font-extrabold text-[#4B382A]">
          Cacto Club <span className="text-[#8C6D53]">🌵</span>
        </Link>

        {/* الروابط */}
        <div className="hidden md:flex items-center gap-6 font-medium text-gray-700">
          <Link href="/" className="hover:text-[#8C6D53] transition">{t.home || "Home"}</Link>
          <Link href="/products" className="hover:text-[#8C6D53] transition">{t.products || "Products"}</Link>
          <Link href="/contact" className="hover:text-[#8C6D53] transition">{t.contact || "Contact"}</Link>
          <Link href="/admin" className="hover:text-[#8C6D53] transition">Admin</Link>
        </div>

        {/* الأزرار (السلة وزر تغيير اللغة) */}
        <div className="flex items-center gap-3">
          {/* زر السلة مع عداد المنتجات الفوري */}
          <Link href="/cart" className="relative bg-[#F7F4EF] px-4 py-2 rounded-xl text-[#4B382A] font-medium hover:bg-gray-200 transition flex items-center gap-2">
            <span>🛒</span>
            <span className="hidden sm:inline">{t.cart || "Cart"}</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {cartCount}
              </span>
            )}
          </Link>

          {/* زر تغيير اللغة */}
          <button
            onClick={handleLanguageToggle}
            className="bg-[#4B382A] text-[#F7F4EF] px-3 py-2 rounded-xl text-sm font-medium hover:bg-[#38291F] transition"
          >
            {lang === "ar" ? "English" : "العربية"}
          </button>
        </div>
      </div>
    </header>
  );
}