"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

export default function ContactPage() {
  const [lang, setLang] = useState('en');
  const [reviews, setReviews] = useState([
    { id: 1, name: "Sarah Ahmed", comment: "The earrings are gorgeous and even better than pictures, packaging is so neat! 🤍", rating: "⭐⭐⭐⭐⭐" },
    { id: 2, name: "Mariam Mahmoud", comment: "The mug is stunning and arrived right on time. Always exceptional!", rating: "⭐⭐⭐⭐⭐" }
  ]);

  const [newName, setNewName] = useState("");
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const currentLang = localStorage.getItem("cacto_lang") || 'en';
    setLang(currentLang);
  }, []);

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!newName || !newComment) return;

    const newRev = {
      id: Date.now(),
      name: newName,
      comment: newComment,
      rating: "⭐⭐⭐⭐⭐"
    };

    setReviews([newRev, ...reviews]);
    setNewName("");
    setNewComment("");
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    alert(lang === 'en' ? "Message sent successfully! We will get back to you soon 💌" : "تم إرسال رسالتك بنجاح! سنقوم بالرد عليكِ قريباً جداً 💌");
  };

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-5xl mx-auto px-6 pt-12 pb-20">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#4B382A] mb-3">
              {lang === 'en' ? "Contact Us 💌" : "تواصل معنا 💌"}
            </h1>
            <p className="text-[#7C6A58] text-base">
              {lang === 'en' ? "We are always here to answer your questions and hear your lovely feedback." : "نحن هنا دائماً للإجابة على استفساراتك وسماع آرائكم الجميلة."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* نموذج التواصل والسوشيال ميديا */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-xs flex flex-col gap-6">
              <h2 className="text-xl font-bold text-[#4B382A] border-b border-[#E8E2D5] pb-3">
                {lang === 'en' ? "💬 Send a Message" : "💬 ابعتلي رسالة أو استفسار"}
              </h2>
              
              <form onSubmit={handleSendMessage} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#7C6A58] mb-1">
                    {lang === 'en' ? "Your Name" : "الاسم الكريم"}
                  </label>
                  <input required type="text" placeholder={lang === 'en' ? "Enter your name..." : "اكتبي اسمك هنا..."} className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#7C6A58] mb-1">
                    {lang === 'en' ? "Message or Inquiry" : "الرسالة أو الاستفسار"}
                  </label>
                  <textarea required rows="4" placeholder={lang === 'en' ? "What would you like to ask about?..." : "حابب تسأل عن إيه؟..."} className="w-full px-4 py-2.5 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-sm text-[#4B382A] focus:outline-none"></textarea>
                </div>
                <button type="submit" className="bg-[#4B382A] text-[#F7F4EF] py-3 rounded-xl text-sm font-medium hover:bg-[#38291F] transition cursor-pointer">
                  {lang === 'en' ? "Send Message" : "إرسال الرسالة"}
                </button>
              </form>

              {/* قسم التواصل المباشر والسوشيال ميديا */}
              <div className="pt-4 border-t border-[#E8E2D5] flex flex-col gap-3">
                <p className="text-xs text-[#7C6A58] mb-1">
                  {lang === 'en' ? "Or connect with us directly via:" : "أو تواصلي معنا مباشرة عبر:"}
                </p>
                
                {/* زر الواتساب */}
                <a 
                  href="https://wa.me/201000000000" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full bg-[#556B2F] text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#465926] transition shadow-xs text-center flex items-center justify-center gap-2"
                >
                  <span>💬</span> {lang === 'en' ? "WhatsApp Chat" : "محادثة الواتساب الفورية"}
                </a>

                {/* أزرار الفيسبوك وإنستجرام */}
                <div className="grid grid-cols-2 gap-3">
                  <a 
                    href="https://facebook.com/your-page-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-[#1877F2] text-white py-2.5 rounded-xl text-xs font-medium hover:bg-[#145DBF] transition shadow-xs text-center flex items-center justify-center gap-2"
                  >
                    <span>🌐</span> {lang === 'en' ? "Facebook" : "فيسبوك"}
                  </a>

                  <a 
                    href="https://instagram.com/your-profile-link" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F56040] text-white py-2.5 rounded-xl text-xs font-medium opacity-90 hover:opacity-100 transition shadow-xs text-center flex items-center justify-center gap-2"
                  >
                    <span>📸</span> {lang === 'en' ? "Instagram" : "إنستجرام"}
                  </a>
                </div>
              </div>
            </div>

            {/* قسم الريفيوهات */}
            <div className="bg-white p-8 rounded-3xl border border-[#E8E2D5] shadow-xs flex flex-col gap-6">
              <h2 className="text-xl font-bold text-[#4B382A] border-b border-[#E8E2D5] pb-3">
                {lang === 'en' ? "⭐ Customer Reviews" : "⭐ آراء عملائنا الأتقياء"}
              </h2>

              <div className="flex flex-col gap-4 max-h-[220px] overflow-y-auto pr-1">
                {reviews.map((rev) => (
                  <div key={rev.id} className="bg-[#F7F4EF] p-4 rounded-2xl border border-[#E8E2D5]">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm text-[#4B382A]">{rev.name}</span>
                      <span className="text-xs">{rev.rating}</span>
                    </div>
                    <p className="text-xs text-[#7C6A58] leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#E8E2D5] pt-4 mt-2">
                <h3 className="text-sm font-bold text-[#4B382A] mb-3">
                  {lang === 'en' ? "Add your review or feedback ✨" : "أضفي رأيك أو تقييمك للمتجر ✨"}
                </h3>
                <form onSubmit={handleAddReview} className="flex flex-col gap-3">
                  <input 
                    required 
                    type="text" 
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder={lang === 'en' ? "Your name..." : "اسمك..."} 
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-xs text-[#4B382A] focus:outline-none"
                  />
                  <textarea 
                    required 
                    rows="2" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={lang === 'en' ? "Share your experience with our products..." : "اكتبي تجربتك مع منتجاتنا..."} 
                    className="w-full px-3 py-2 rounded-xl border border-[#E8E2D5] bg-[#F7F4EF] text-xs text-[#4B382A] focus:outline-none"
                  ></textarea>
                  <button type="submit" className="bg-[#8C6D53] text-white py-2 rounded-xl text-xs font-medium hover:bg-[#785B43] transition cursor-pointer">
                    {lang === 'en' ? "Post Review" : "نشر التقييم"}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}