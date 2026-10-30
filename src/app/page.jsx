"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";
import { translations } from "@/locales/translations";

export default function Home() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const savedLang = localStorage.getItem("cacto_lang");
    if (savedLang) setLang(savedLang);
  }, []);

  const handleSetLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("cacto_lang", newLang);
  };

  const t = translations[lang] || translations.en;

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen flex flex-col justify-between bg-cover bg-center" style={{ backgroundImage: `url('')` }}>
      <div>
        <Navbar lang={lang} setLang={handleSetLang} />

        <section className="flex flex-col items-center justify-center text-center py-28 px-4 bg-black/30 min-h-[70vh]">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-md">
            {lang === 'en' ? "Welcome to " : "أهلاً بكِ في "}
            <span className="text-[#E6D5C3]">Cacto Club</span> 🌵
          </h1>
          <p className="text-lg text-gray-100 max-w-xl mb-8 drop-shadow">
            {t.heroDesc || "Discover our unique handmade collections."}
          </p>
          <div className="flex gap-4">
            <Link 
              href="/products" 
              className="bg-[#4B382A] text-[#F7F4EF] px-8 py-3 rounded-full font-medium shadow-lg hover:bg-[#38291F] transition"
            >
              {t.shopNow || "Shop Now"}
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}