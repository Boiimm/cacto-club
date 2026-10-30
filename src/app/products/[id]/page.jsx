"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const defaultProducts = [
      { id: 1, name: "Trendy Designer Earrings", price: 150, category: "accessories", image: "/placeholder.jpg", description: "حلقان مميزة بتصميم عصري أنيق." },
      { id: 2, name: "Elegant Gold Necklace", price: 280, category: "accessories", image: "/placeholder.jpg", description: "سلسلة ذهبية راقية." },
      { id: 3, name: "Handmade Clay Mug 1", price: 220, category: "mugs", image: "/placeholder.jpg", description: "مج فخار مصنوع يدويًا بحب." },
      { id: 4, name: "Handmade Clay Mug 2", price: 240, category: "mugs", image: "/placeholder.jpg", description: "مج فخار كلاسيكي مميز." },
      { id: 5, name: "Handmade Clay Mug 3", price: 260, category: "mugs", image: "/placeholder.jpg", description: "مج فخار بتصميم فني راقي." }
    ];

    const saved = JSON.parse(localStorage.getItem("cacto_products") || JSON.stringify(defaultProducts));
    setProducts(saved);
  }, []);

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cacto_cart") || "[]");
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    localStorage.setItem("cacto_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const accessories = products.filter(p => p.category === "accessories");
  const mugs = products.filter(p => p.category === "mugs");

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex-grow space-y-16">
        <h1 className="text-4xl font-extrabold text-[#4B382A] text-center">منتجاتنا المميزة 🌵</h1>

        {/* زرارين التنقل السريع */}
        <div className="flex justify-center gap-4 sticky top-20 z-40 bg-[#F7F4EF]/80 backdrop-blur py-3">
          <a href="#accessories" className="bg-[#4B382A] text-white px-6 py-2.5 rounded-full text-sm font-medium shadow hover:bg-[#38291F] transition">
            قسم الإكسسوارات
          </a>
          <a href="#mugs" className="bg-[#8C6D53] text-white px-6 py-2.5 rounded-full text-sm font-medium shadow hover:bg-[#725741] transition">
            قسم مجات الفخار
          </a>
        </div>

        {/* قسم الإكسسوارات */}
        <section id="accessories" className="scroll-mt-28">
          <h2 className="text-2xl font-bold text-[#4B382A] mb-6 border-b pb-2">الإكسسوارات (Accessories)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {accessories.map(product => (
              <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border flex flex-col justify-between">
                <div>
                  <Link href={`/products/${product.id}`}>
                    <div className="h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400">صورة المنتج</div>
                    <h3 className="text-lg font-bold text-[#4B382A]">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <span className="font-bold text-[#8C6D53]">{product.price} ج.م</span>
                  <button onClick={() => handleAddToCart(product)} className="bg-[#4B382A] text-white px-4 py-2 rounded-xl text-sm">أضف للسلة</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* قسم مجات الفخار */}
        <section id="mugs" className="scroll-mt-28">
          <h2 className="text-2xl font-bold text-[#4B382A] mb-6 border-b pb-2">مجات الفخار (Clay Mugs)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mugs.map(product => (
              <div key={product.id} className="bg-white rounded-2xl p-4 shadow-sm border flex flex-col justify-between">
                <div>
                  <Link href={`/products/${product.id}`}>
                    <div className="h-48 bg-gray-100 rounded-xl mb-4 flex items-center justify-center text-gray-400">صورة المنتج</div>
                    <h3 className="text-lg font-bold text-[#4B382A]">{product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-600 mt-2">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <span className="font-bold text-[#8C6D53]">{product.price} ج.م</span>
                  <button onClick={() => handleAddToCart(product)} className="bg-[#4B382A] text-white px-4 py-2 rounded-xl text-sm">أضف للسلة</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}