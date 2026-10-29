"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const currentLang = localStorage.getItem("cacto_lang") || 'en';
    setLang(currentLang);
  }, []);

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-4xl mx-auto px-6 pt-16 pb-20">
          {/* عنوان الصفحة */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#4B382A] mb-4">
              {lang === 'en' ? "About Cacto Club 🌵" : "عن Cacto Club 🌵"}
            </h1>
            <p className="text-[#7C6A58] text-base md:text-lg max-w-xl mx-auto">
              {lang === 'en' 
                ? "A story of passion starting from the smallest details to match your unique taste." 
                : "قصة شغف بتبدأ من التفاصيل الصغيرة عشان تليق بذوقك الفريد."}
            </p>
          </div>

          {/* محتوى القصة */}
          <div className="bg-white p-8 md:p-12 rounded-3xl border border-[#E8E2D5] shadow-xs flex flex-col gap-6 text-[#4B382A] leading-relaxed">
            <h2 className="text-2xl font-bold text-[#4B382A] border-b border-[#E8E2D5] pb-3">
              {lang === 'en' ? "Who We Are? ✨" : "مين إحنا؟ ✨"}
            </h2>
            <p className="text-sm md:text-base text-[#7C6A58]">
              <strong className="text-[#4B382A]">Cacto Club</strong> 
              {lang === 'en' 
                ? " is a local brand born out of our love for everything beautiful, calm, and unique. We care about offering a handpicked selection of trendy girls' accessories and artistic mugs that bring warmth to your day." 
                : " هو براند محلي نشأ من حبنا لكل ما هو جميل، هادي، ومميز. بنهتم بتقديم تشكيلة مختارة بعناية من إكسسوارات البنات العصرية والمجات المصنوعة بلمسات فنية تضفي دفء على يومك."}
            </p>

            <h2 className="text-2xl font-bold text-[#4B382A] border-b border-[#E8E2D5] pb-3 pt-4">
              {lang === 'en' ? "Our Mission 🤍" : "رسالتنا 🤍"}
            </h2>
            <p className="text-sm md:text-base text-[#7C6A58]">
              {lang === 'en'
                ? "We believe that every piece you wear or use reflects a part of your personality. That's why we ensure every product in Cacto Club is handpicked with high quality to suit your daily look."
                : "مؤمنين إن كل قطعة تلبسيها أو تستخدميها بتعكس جزء من شخصيتك. عشان كده بنحرص إن كل منتج في كاختو كلوب يكون اختياره نابع من ذوق رفيع وجودة تناسب إطلالتك اليومية."}
            </p>

            <div className="bg-[#F7F4EF] p-6 rounded-2xl border border-[#E8E2D5] text-center mt-4">
              <p className="font-bold text-[#4B382A] text-base mb-1">
                {lang === 'en' ? "Thanks for being part of our small family 🌵" : "شكراً لكونك جزء من عائلتنا الصغيرة 🌵"}
              </p>
              <p className="text-xs text-[#7C6A58]">
                {lang === 'en' ? "Always looking forward to adding special magic to every piece." : "دائماً في انتظار إضافتك لسحر خاص لكل قطعة."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}