"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

// المنتجات الافتراضية الأساسية
const defaultProducts = [
  { id: "1", name: "حلقان مميزة بتصميم عصري", nameEn: "Trendy Designer Earrings", price: 180, category: "accessories", image: "/images/accessories/earrings.jpg" },
  { id: "2", name: "سلسلة أنيقة مطلية بالذهب", nameEn: "Elegant Gold-Plated Necklace", price: 250, category: "accessories", image: "/images/accessories/necklace.jpg" },
  { id: "3", name: "مجموعة خواتم بتصميم فريد", nameEn: "Unique Designer Rings Set", price: 220, category: "accessories", image: "/images/accessories/rings.jpg" },
  { id: "6", name: "كوب سيراميك يدوي الصنع (درجات الأزرق)", nameEn: "Handmade Ceramic Mug (Blue Shades)", price: 300, category: "mugs", image: "/images/mugs/blue-mug.jpg" },
  { id: "7", name: "كوب سيراميك دافئ (بني ووردي)", nameEn: "Cozy Ceramic Mug (Brown & Pink)", price: 320, category: "mugs", image: "/images/mugs/cozy-mug.jpg" },
];

export default function ProductsPage() {
  const [lang, setLang] = useState('en');
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState(defaultProducts);

  useEffect(() => {
    const currentLang = localStorage.getItem("cacto_lang") || 'en';
    setLang(currentLang);

    // جلب المنتجات المخزنة ديناميكياً من الـ localStorage لو موجودة
    const savedProducts = JSON.parse(localStorage.getItem("cacto_dynamic_products"));
    if (savedProducts && savedProducts.length > 0) {
      setProducts(savedProducts);
    } else {
      localStorage.setItem("cacto_dynamic_products", JSON.stringify(defaultProducts));
    }
  }, []);

  const addToCart = (product) => {
    const existingCart = JSON.parse(localStorage.getItem("cacto_cart")) || [];
    existingCart.push(product);
    localStorage.setItem("cacto_cart", JSON.stringify(existingCart));
  };

  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase();
    const nameMatch = product.name.toLowerCase().includes(query);
    const nameEnMatch = product.nameEn.toLowerCase().includes(query);
    return nameMatch || nameEnMatch;
  });

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto px-8 pt-12 pb-6 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#4B382A] mb-2">
            {lang === 'en' ? "Cacto Club Products 🌵" : "منتجات Cacto Club 🌵"}
          </h1>
          <p className="text-[#7C6A58] text-sm md:text-base mb-6">
            {lang === 'en' ? "Browse our handpicked collection designed for your unique taste." : "تصفحي تشكيلتنا المختارة بعناية لتناسب ذوقك الرفيع."}
          </p>

          {/* شريط البحث */}
          <div className="max-w-md mx-auto mb-8">
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'en' ? "Search for accessories or mugs..." : "ابحثي عن الإكسسوارات أو المجات..."}
              className="w-full px-5 py-3 rounded-full border border-[#D4C5B9] bg-white text-sm text-[#4B382A] focus:outline-none focus:border-[#4B382A] shadow-xs"
            />
          </div>

          
        </div>

        {/* Accessories Section */}
        <div id="accessories-section" className="max-w-7xl mx-auto px-8 pb-16 pt-8 scroll-mt-10">
          <h2 className="text-2xl font-bold text-[#4B382A] mb-6 border-b border-[#E8E2D5] pb-2">
            {lang === 'en' ? "✨ Accessories" : "✨ الإكسسوارات"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.filter((p) => p.category === "accessories").map((product) => (
              <ProductCard key={product.id} product={product} lang={lang} onAdd={addToCart} />
            ))}
          </div>
        </div>

        {/* Mugs Section */}
        <div id="mugs-section" className="max-w-7xl mx-auto px-8 pb-20 pt-8 scroll-mt-10">
          <h2 className="text-2xl font-bold text-[#4B382A] mb-6 border-b border-[#E8E2D5] pb-2">
            {lang === 'en' ? "☕ Mugs" : "☕ المجات"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.filter((p) => p.category === "mugs").map((product) => (
              <ProductCard key={product.id} product={product} lang={lang} onAdd={addToCart} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

function ProductCard({ product, lang, onAdd }) {
  return (
    <Link 
      href={`/products/${product.id}`}
      className="bg-white rounded-2xl overflow-hidden shadow-xs border border-[#E8E2D5] flex flex-col justify-between hover:shadow-md transition duration-300 block"
    >
      <div className="relative h-64 w-full bg-[#EFECE6]">
        <img src={product.image || "/images/accessories/earrings.jpg"} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-5 flex flex-col gap-3">
        <h3 className="font-bold text-[#4B382A] text-lg">{lang === 'en' ? product.nameEn : product.name}</h3>
        <div className="flex justify-between items-center">
          <span className="text-[#8C6D53] font-semibold">{product.price} EGP</span>
          <button 
            onClick={(e) => { 
              e.preventDefault(); 
              onAdd(product); 
            }}
            className="bg-[#4B382A] text-[#F7F4EF] px-4 py-2 rounded-full text-xs font-medium hover:bg-[#38291F] transition cursor-pointer"
          >
            {lang === 'en' ? "Add to Cart" : "أضف للسلة"}
          </button>
        </div>
      </div>
    </Link>
  );
}