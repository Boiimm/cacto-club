"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { translations } from "@/locales/translations";

export default function ContactPage() {
  const [lang, setLang] = useState("ar");
  const [review, setReview] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // جلب اللغة الحالية (حسب ما هو محفوظ عندك في المشروع أو localStorage)
  useEffect(() => {
    const currentLang = localStorage.getItem("cacto_lang") || "ar";
    setLang(currentLang);
  }, []);

  const t = translations[lang] || translations.ar;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!review.trim()) {
      alert(lang === "ar" ? "برجاء كتابة تقييمك أولاً!" : "Please write your review first!");
      return;
    }

    const existingReviews = JSON.parse(localStorage.getItem("cacto_reviews") || "[]");
    
    const newReview = {
      id: Date.now(),
      text: review,
      date: new Date().toLocaleDateString(lang === "ar" ? 'ar-EG' : 'en-US')
    };

    existingReviews.unshift(newReview);
    localStorage.setItem("cacto_reviews", JSON.stringify(existingReviews));

    setSubmitted(true);
    setReview("");
    
    setTimeout(() => {
      setSubmitted(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={lang === "ar" ? "rtl" : "ltr"}>
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{t.reviewTitle || "Customer Review"}</h1>
          <p className="text-gray-500 text-sm mb-6">{t.reviewSubtitle || "Share your thoughts..."}</p>
          
          {submitted && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-sm">
              {t.reviewSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-start">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.yourReview || "Your Review"}</label>
              <textarea
                rows="4"
                value={review}
                onChange={(e) => setReview(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                placeholder={t.reviewPlaceholder || "Write your review..."}
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 text-white py-3 rounded-xl font-medium hover:bg-emerald-700 transition shadow-sm"
            >
              {t.postReview || "Post Review"}
            </button>
          </form>

          <div className="mt-8 border-t pt-6">
            <p className="text-sm text-gray-500 mb-4">{t.orConnect || "Or connect with us directly via:"}</p>
            <div className="flex justify-center gap-3">
              <a 
                href="https://whatsapp.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-emerald-700 transition"
              >
                {t.whatsapp || "WhatsApp"}
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition"
              >
                {t.facebook || "Facebook"}
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="bg-pink-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-pink-700 transition"
              >
                {t.instagram || "Instagram"}
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}