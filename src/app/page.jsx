"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { translations } from "@/locales/translations";

export default function Home() {
  const [lang, setLang] = useState('en');

  // جلب اللغة المخزنة أول ما الصفحة تفتح
  useEffect(() => {
    const savedLang = localStorage.getItem("cacto_lang");
    if (savedLang) {
      setLang(savedLang);
    }
  }, []);

  // دالة لتغيير وحفظ اللغة
  const handleSetLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("cacto_lang", newLang);
  };

  const t = translations[lang] || translations.en;

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between">
      <div>
        <Navbar lang={lang} setLang={handleSetLang} />

        {/* قسم الواجهة */}
        <section className="flex flex-col items-center justify-center text-center py-24 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-[#4B382A] mb-4">
            {lang === 'en' ? "Welcome to " : "أهلاً بكِ في "}
            <span className="text-[#8C6D53]">Cacto Club</span> 🌵
          </h1>
          <p className="text-lg text-[#7C6A58] max-w-xl mb-8">
            {t.heroDesc}
          </p>
          <div className="flex gap-4">
            <Link 
              href="/products" 
              className="bg-[#4B382A] text-[#F7F4EF] px-8 py-3 rounded-full font-medium shadow-sm hover:bg-[#38291F] transition"
            >
              {t.shopNow}
            </Link>
          </div>
        </section>
      </div>

      <Footer lang={lang} />
    </main>
  );
}