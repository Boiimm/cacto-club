"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { translations } from "@/locales/translations";

export default function ProductsPage() {
  const [lang, setLang] = useState("ar");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const currentLang = localStorage.getItem("cacto_lang") || "ar";
    setLang(currentLang);

    // منتجات افتراضية كمثال، أو يتم جلبها من localStorage لو أضفتها من لوحة التحكم
    const defaultProducts = [
      { id: 1, name: "Trendy Designer Earrings", price: 150, image: "/placeholder.jpg", description: "حلقان مميزة بتصميم عصري أنيق يناسب كل الأوقات." },
      { id: 2, name: "Elegant Gold-Plated Necklace", price: 280, image: "/placeholder.jpg", description: "سلسلة مطليّة بالذهب بتصميم راقي وفريد." },
      { id: 3, name: "Unique Designer Bracelet", price: 200, image: "/placeholder.jpg", description: "إسوارة بتصميم فريد يضفي لمسة جمالية على إطلالتك." }
    ];

    const savedProducts = JSON.parse(localStorage.getItem("cacto_products") || JSON.stringify(defaultProducts));
    setProducts(savedProducts);
  }, []);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cacto_cart") || "[]");
    cart.push(product);
    localStorage.setItem("cacto_cart", JSON.stringify(cart));

    // إرسال حدث فوري لتحديث العداد في الـ Navbar
    window.dispatchEvent(new Event("cartUpdated"));
    alert(lang === "ar" ? "تم إضافة المنتج إلى السلة بنجاح!" : "Product added to cart successfully!");
  };

  const t = translations[lang] || translations.ar;

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-bold text-[#4B382A] mb-8 text-center">
          {lang === "ar" ? "منتجاتنا المميزة" : "Our Products"}
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
              <div>
                <Link href={`/products/${product.id}`}>
                  <div className="h-48 bg-gray-100 rounded-xl mb-4 overflow-hidden flex items-center justify-center">
                    <span className="text-gray-400">صورة المنتج</span>
                  </div>
                  <h2 className="text-xl font-bold text-[#4B382A] mb-2 hover:text-[#8C6D53] transition">{product.name}</h2>
                </Link>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              </div>

              <div className="flex items-center justify-between mt-4">
                <span className="text-lg font-bold text-[#8C6D53]">{product.price} {lang === "ar" ? "ج.م" : "EGP"}</span>
                <button
                  onClick={() => handleAddToCart(product)}
                  className="bg-[#4B382A] text-[#F7F4EF] px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#38291F] transition"
                >
                  {t.addToCart || "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}