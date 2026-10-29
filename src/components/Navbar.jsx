"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [lang, setLang] = useState('en');
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem("cacto_lang") || 'en';
    setLang(savedLang);

    const savedCart = JSON.parse(localStorage.getItem("cacto_cart")) || [];
    setCartCount(savedCart.length);
  }, []);

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'ar' : 'en';
    setLang(newLang);
    localStorage.setItem("cacto_lang", newLang);
    window.location.reload();
  };

  return (
    <nav className="relative bg-[#F7F4EF] border-b border-[#E8E2D5] shadow-xs">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        
        {/* اللوجو والاسم */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Cacto Club Logo" 
              width={40} 
              height={40} 
              className="rounded-full object-cover shadow-xs border border-[#D4C5B9]"
            />
            <span className="text-lg md:text-xl font-bold tracking-wider text-[#4B382A]">
              Cacto Club
            </span>
          </Link>
        </div>

        {/* الروابط للشاشات الكبيرة (Desktop) */}
        <div className="hidden md:flex gap-6 text-sm font-medium text-[#7C6A58]">
          <Link href="/" className="hover:text-[#4B382A] transition">{lang === 'en' ? 'Home' : 'الرئيسية'}</Link>
          <Link href="/products" className="hover:text-[#4B382A] transition">{lang === 'en' ? 'Products' : 'المنتجات'}</Link>
          <Link href="/about" className="hover:text-[#4B382A] transition">{lang === 'en' ? 'About Us' : 'من نحن'}</Link>
          <Link href="/contact" className="hover:text-[#4B382A] transition">{lang === 'en' ? 'Contact' : 'تواصل معنا'}</Link>
        </div>

        {/* أزرار اللغة والسلة للديسكتوب، وزر القائمة للموبايل */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleLanguage}
            className="bg-[#E8E2D5] text-[#4B382A] px-3 py-1.5 rounded-full text-xs font-bold hover:bg-[#D4C5B9] transition cursor-pointer"
          >
            {lang === 'en' ? 'العربية 🇸🇦' : 'English 🇬🇧'}
          </button>

          <Link 
            href="/cart"
            className="bg-[#4B382A] text-[#F7F4EF] px-4 py-2 rounded-full text-xs md:text-sm font-medium hover:bg-[#38291F] transition shadow-xs inline-block"
          >
            {lang === 'en' ? `Cart (${cartCount})` : `السلة (${cartCount})`}
          </Link>

          {/* زر القائمة للموبايل (Hamburger Button) */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#4B382A] p-1.5 focus:outline-none cursor-pointer"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

      </div>

      {/* القائمة المنسدلة للموبايل (Mobile Menu Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-[#E8E2D5] px-6 py-4 flex flex-col gap-3 shadow-md">
          <Link 
            href="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#4B382A] font-medium py-2 border-b border-[#F7F4EF]"
          >
            {lang === 'en' ? 'Home' : 'الرئيسية'}
          </Link>
          <Link 
            href="/products" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#4B382A] font-medium py-2 border-b border-[#F7F4EF]"
          >
            {lang === 'en' ? 'Products' : 'المنتجات'}
          </Link>
          <Link 
            href="/about" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#4B382A] font-medium py-2 border-b border-[#F7F4EF]"
          >
            {lang === 'en' ? 'About Us' : 'من نحن'}
          </Link>
          <Link 
            href="/contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="text-[#4B382A] font-medium py-2"
          >
            {lang === 'en' ? 'Contact' : 'تواصل معنا'}
          </Link>
        </div>
      )}
    </nav>
  );
}