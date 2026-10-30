"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    const reviews = JSON.parse(localStorage.getItem("cacto_reviews") || "[]");
    reviews.push({ name, comment, date: new Date().toLocaleDateString() });
    localStorage.setItem("cacto_reviews", JSON.stringify(reviews));

    setName("");
    setComment("");
  };

  return (
    <main className="min-h-screen flex flex-col justify-between bg-cover bg-center" style={{ backgroundImage: `url('')` }}>
      <Navbar />

      <div className="container mx-auto px-4 py-16 flex-grow flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-md p-8 md:p-10 rounded-3xl shadow-xl max-w-lg w-full border border-white/20 space-y-6">
          <h1 className="text-3xl font-extrabold text-[#4B382A] text-center">تواصل معنا 🌵</h1>
          <p className="text-gray-600 text-center text-sm">يسعدنا تواصلك معنا أو متابعتنا عبر منصاتنا الاجتماعية.</p>

          {/* روابط السوشيال ميديا */}
          <div className="flex justify-center gap-4 py-2">
            <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition shadow">
              واتساب (WhatsApp)
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-pink-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-pink-700 transition shadow">
              إنستجرام (Instagram)
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow">
              فيسبوك (Facebook)
            </a>
          </div>

          <hr className="border-gray-200" />

          {/* نموذج إرسال التقييم أو الرسالة */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم الكريم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="أدخل اسمك..."
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#8C6D53] bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رسالتك أو تقييمك</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="اكتب رسالتك هنا..."
                rows="3"
                className="w-full border border-gray-200 p-3 rounded-xl focus:outline-none focus:border-[#8C6D53] bg-white"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[#4B382A] text-[#F7F4EF] py-3 rounded-xl font-medium hover:bg-[#38291F] transition shadow-md"
            >
              إرسال الرسالة
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </main>
  );
}