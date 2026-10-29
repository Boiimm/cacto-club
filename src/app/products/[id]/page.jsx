"use client";
import { useState, useEffect, Suspense } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { translations } from "@/locales/translations";

function ProductDetailContent() {
  const params = useParams();
  const id = params?.id;

  const [lang, setLang] = useState("ar");
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentLang = localStorage.getItem("cacto_lang") || "ar";
    setLang(currentLang);

    if (!id) return;

    const defaultProducts = [
      { id: 1, name: "Trendy Designer Earrings", price: 150, image: "/placeholder.jpg", description: "حلقان مميزة بتصميم عصري أنيق يناسب كل الأوقات." },
      { id: 2, name: "Elegant Gold-Plated Necklace", price: 280, image: "/placeholder.jpg", description: "سلسلة مطليّة بالذهب بتصميم راقي وفريد." },
      { id: 3, name: "Unique Designer Bracelet", price: 200, image: "/placeholder.jpg", description: "إسوارة بتصميم فريد يضفي لمسة جمالية على إطلالتك." }
    ];

    try {
      const savedProducts = JSON.parse(localStorage.getItem("cacto_products") || JSON.stringify(defaultProducts));
      const found = savedProducts.find((p) => String(p.id) === String(id));
      setProduct(found || null);
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cacto_cart") || "[]");
    cart.push(product);
    localStorage.setItem("cacto_cart", JSON.stringify(cart));

    // إرسال حدث فوري لتحديث العداد في الـ Navbar
    window.dispatchEvent(new Event("cartUpdated"));
    alert(lang === "ar" ? "تم إضافة المنتج إلى السلة بنجاح!" : "Product added to cart successfully!");
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20">
        <p className="text-xl text-gray-600">{lang === "ar" ? "جاري تحميل تفاصيل المنتج..." : "Loading product details..."}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-grow flex flex-col items-center justify-center text-center px-4 py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{lang === "ar" ? "عذراً، المنتج غير موجود" : "Sorry, product not found"}</h2>
        <p className="text-gray-600 mb-6">{lang === "ar" ? "لم نتمكن من العثور على المنتج المطلوب." : "We couldn't find the requested product."}</p>
        <a href="/products" className="bg-[#4B382A] text-white px-6 py-2 rounded-xl hover:bg-[#38291F] transition">
          {lang === "ar" ? "العودة للمنتجات" : "Back to Products"}
        </a>
      </div>
    );
  }

  return (
    <main className="flex-grow container mx-auto px-4 py-12">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400">صورة المنتج</span>
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#4B382A] mb-4">{product.name}</h1>
              <p className="text-2xl font-semibold text-[#8C6D53] mb-4">{product.price} {lang === "ar" ? "ج.م" : "EGP"}</p>
              <p className="text-gray-600 leading-relaxed mb-6">{product.description || (lang === "ar" ? "لا يوجد وصف متاح." : "No description available.")}</p>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-[#4B382A] text-[#F7F4EF] py-3 px-6 rounded-xl font-medium hover:bg-[#38291F] transition text-center"
            >
              {lang === "ar" ? "إضافة إلى السلة" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  const [lang, setLang] = useState("ar");

  useEffect(() => {
    const currentLang = localStorage.getItem("cacto_lang") || "ar";
    setLang(currentLang);
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Navbar />
      <Suspense fallback={
        <div className="flex-grow flex items-center justify-center py-20">
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      }>
        <ProductDetailContent />
      </Suspense>
      <Footer />
    </div>
  );
}