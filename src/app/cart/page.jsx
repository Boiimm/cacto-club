"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function CartPage() {
  const [lang, setLang] = useState('en');
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const currentLang = localStorage.getItem("cacto_lang") || 'en';
    setLang(currentLang);

    const items = JSON.parse(localStorage.getItem("cacto_cart")) || [];
    setCartItems(items);
  }, []);

  const removeItem = (indexToRemove) => {
    const updatedCart = cartItems.filter((_, index) => index !== indexToRemove);
    setCartItems(updatedCart);
    localStorage.setItem("cacto_cart", JSON.stringify(updatedCart));
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

  // دالة إرسال الطلب عبر الواتساب
  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;

    // بناء نص رسالة الأوردر
    let message = lang === 'en' 
      ? "Hello Cacto Club! I would like to place an order:\n\n" 
      : "أهلاً Cacto Club! حابب أطلب الأوردر ده:\n\n";

    cartItems.forEach((item, index) => {
      const itemName = lang === 'en' ? (item.nameEn || item.name) : item.name;
      message += `${index + 1}. ${itemName} - ${item.price} EGP\n`;
    });

    message += lang === 'en' 
      ? `\nTotal: ${totalPrice} EGP\nPlease confirm my order!` 
      : `\nالإجمالي: ${totalPrice} ج.م\nبرجاء تأكيد الطلب!`;

    // رقم الواتساب الخاص بالبراند (اكتب رقمك هنا بالصيغة الدولية، مثلاً: 201234567890+)
    const phoneNumber = "201000000000"; 

    // ترميز الرسالة لرابط الـ URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // فتح رابط الواتساب في تبويب جديد
    window.open(whatsappUrl, '_blank');
  };

  return (
    <main dir={lang === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-4xl mx-auto px-6 pt-12 pb-20">
          <h1 className="text-3xl font-extrabold text-[#4B382A] mb-8 text-center">
            {lang === 'en' ? "Shopping Cart 🛒" : "سلة المشتريات 🛒"}
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E2D5] p-8">
              <p className="text-[#7C6A58] text-lg mb-6">
                {lang === 'en' ? "Your cart is currently empty." : "سلة المشتريات فارغة حالياً."}
              </p>
              <Link 
                href="/products" 
                className="bg-[#4B382A] text-[#F7F4EF] px-8 py-3 rounded-full text-sm font-medium hover:bg-[#38291F] transition shadow-xs"
              >
                {lang === 'en' ? "Shop Products Now" : "تصفحي المنتجات الآن"}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 flex flex-col gap-4">
                {cartItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white p-4 rounded-2xl border border-[#E8E2D5] flex items-center justify-between shadow-xs gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-20 w-20 bg-[#EFECE6] rounded-xl overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#4B382A] text-sm md:text-base">
                          {lang === 'en' ? (item.nameEn || item.name) : item.name}
                        </h3>
                        <p className="text-[#8C6D53] text-sm font-semibold mt-1">{item.price} EGP</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 cursor-pointer"
                    >
                      {lang === 'en' ? "Remove" : "حذف"}
                    </button>
                  </div>
                ))}
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#E8E2D5] shadow-xs h-fit flex flex-col gap-4">
                <h3 className="font-bold text-[#4B382A] text-lg border-b border-[#E8E2D5] pb-3">
                  {lang === 'en' ? "Order Summary" : "ملخص الطلب"}
                </h3>
                <div className="flex justify-between text-sm text-[#7C6A58]">
                  <span>{lang === 'en' ? "Total Items:" : "إجمالي المنتجات:"}</span>
                  <span className="font-semibold text-[#4B382A]">{totalPrice} EGP</span>
                </div>
                <div className="flex justify-between text-sm text-[#7C6A58]">
                  <span>{lang === 'en' ? "Shipping:" : "الشحن:"}</span>
                  <span className="font-semibold text-[#4B382A]">{lang === 'en' ? "Calculated later" : "يُحدد لاحقاً"}</span>
                </div>
                <div className="border-t border-[#E8E2D5] pt-3 flex justify-between font-bold text-[#4B382A]">
                  <span>{lang === 'en' ? "Grand Total:" : "الإجمالي الكلي:"}</span>
                  <span className="text-[#8C6D53]">{totalPrice} EGP</span>
                </div>

                <button 
                  onClick={handleWhatsAppCheckout}
                  className="w-full bg-[#556B2F] text-white py-3 rounded-full text-sm font-medium hover:bg-[#465926] transition shadow-xs mt-2 text-center cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>💬</span> {lang === 'en' ? "Checkout via WhatsApp" : "إتمام الطلب عبر واتساب"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}