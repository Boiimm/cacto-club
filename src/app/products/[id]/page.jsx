"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const products = [
  { id: "1", name: "حلقان مميزة بتصميم عصري", nameEn: "Trendy Designer Earrings", price: 180, category: "accessories", image: "/images/accessories/earrings.jpg", desc: "حلقان أنيقة مصممة خصيصاً لتناسب إطلالتك اليومية وتضيف لمسة رقيقة ومميزة." },
  { id: "2", name: "سلسلة أنيقة مطلية بالذهب", nameEn: "Elegant Gold-Plated Necklace", price: 250, category: "accessories", image: "/images/accessories/necklace.jpg", desc: "سلسلة راقية مطلية بالذهب بتصميم دافئ يكمل جمال مظهرك." },
  { id: "3", name: "مجموعة خواتم بتصميم فريد", nameEn: "Unique Designer Rings Set", price: 220, category: "accessories", image: "/images/accessories/rings.jpg", desc: "مجموعة خواتم عصرية بتفاصيل مميزة تمنح يديكِ بريقاً خاصاً." },
  { id: "4", name: "ميدالية حقائب متعددة الاستخدام", nameEn: "Multi-use Bag Charm", price: 150, category: "accessories", image: "/images/accessories/charm.jpg", desc: "ميدالية أنيقة لحقيبتك تحتوي على مرآة مخفية لإطلالة سريعة في أي وقت." },
  { id: "5", name: "أساور عصرية ملونة", nameEn: "Colorful Trendy Bracelets", price: 190, category: "accessories", image: "/images/accessories/bracelets.jpg", desc: "أساور ملونة تضيف بهجة وحيوية لصيفك وإطلالتك." },
  { id: "6", name: "كوب سيراميك يدوي الصنع (درجات الأزرق)", nameEn: "Handmade Ceramic Mug (Blue Shades)", price: 300, category: "mugs", image: "/images/mugs/blue-mug.jpg", desc: "مج سيراميك هاند ميد بتدرجات أزرق ساحرة تذكرك بأجواء البحر الهادئة." },
  { id: "7", name: "كوب سيراميك دافئ (بني ووردي)", nameEn: "Cozy Ceramic Mug (Brown & Pink)", price: 320, category: "mugs", image: "/images/mugs/cozy-mug.jpg", desc: "مج دافئ مصمم خصيصاً لجلسات القهوة الروقان وإضافات الكوزي للبيت." },
];

export default function ProductDetailPage() {
  const pathname = usePathname();
  // استخراج الـ id من مسار الرابط مباشرة (مثلا /products/3 هيدينا 3)
  const id = pathname ? pathname.split("/").pop() : null;

  const [lang, setLang] = useState('en');
  const product = products.find((p) => p.id === id);

  useEffect(() => {
    const currentLang = localStorage.getItem("cacto_lang") || 'en';
    setLang(currentLang);
  }, []);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between items-center py-20">
        <Navbar />
        <div className="text-center">
          <h1 className="text-2xl text-[#4B382A] mb-4">Product not found / المنتج غير موجود</h1>
          <Link href="/products" className="bg-[#4B382A] text-white px-6 py-2 rounded-full">
            Back to Products / عودة للمنتجات
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cacto_cart")) || [];
    existingCart.push(product);
    localStorage.setItem("cacto_cart", JSON.stringify(existingCart));
  };

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-5xl mx-auto px-6 pt-16 pb-20">
          <Link href="/products" className="text-sm text-[#7C6A58] hover:text-[#4B382A] mb-8 inline-block">
            {lang === 'en' ? "← Back to Products" : "← العودة للمنتجات"}
          </Link>

          <div className="bg-white rounded-3xl border border-[#E8E2D5] overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-10">
            {/* صورة المنتج */}
            <div className="relative h-80 md:h-[400px] w-full bg-[#EFECE6] rounded-2xl overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>

            {/* تفاصيل المنتج */}
            <div className="flex flex-col justify-between gap-6">
              <div className="flex flex-col gap-4">
                <span className="text-xs uppercase tracking-widest text-[#8C6D53] font-semibold">
                  {product.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-extrabold text-[#4B382A]">
                  {lang === 'en' ? product.nameEn : product.name}
                </h1>
                <p className="text-xl font-bold text-[#8C6D53]">
                  {product.price} EGP
                </p>
                <p className="text-[#7C6A58] text-sm md:text-base leading-relaxed">
                  {product.desc}
                </p>
              </div>

              <button 
                onClick={addToCart}
                className="w-full bg-[#4B382A] text-[#F7F4EF] py-3.5 rounded-full text-sm font-medium hover:bg-[#38291F] transition shadow-xs cursor-pointer text-center"
              >
                {lang === 'en' ? "Add to Cart 🛒" : "أضف للسلة 🛒"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}