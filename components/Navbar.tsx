"use client";
import Link from "next/link";
import { useStore, formatEGP } from "@/lib/store";
import { useState } from "react";
import { Search, ShoppingBag, Menu, X, ShieldCheck, Truck } from "lucide-react";

export default function Navbar() {
  const { cart, subtotal, isCartDrawerOpen, setIsCartDrawerOpen, updateQty } = useStore();
  const [mobileMenu, setMobileMenu] = useState(false);
  const totalCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <header className="w-full pt-5 pb-4 px-5 md:px-14 border-b border-[#E2DDD5] bg-[#EFECE6]/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5 text-xs md:text-sm text-[#1E2522]">
            <button
              type="button"
              onClick={() => setMobileMenu(!mobileMenu)}
              className="flex items-center gap-1.5 hover:opacity-70 font-medium"
            >
              <Menu className="w-4 h-4 md:hidden" />
              <span>Menu</span>
            </button>
            <Link href="/account" className="hidden sm:inline text-[#6E6A63] hover:text-black">
              My Account
            </Link>
          </div>

          <Link href="/" className="text-2xl md:text-3xl font-serif-title tracking-wide text-[#1E2522]">
            Cacto <span className="font-light text-[#9E988E]">|</span>{" "}
            <span className="font-sans font-normal text-xl md:text-2xl">كاكتو</span>
          </Link>

          <div className="flex items-center gap-4 text-[#1E2522]">
            <Link href="/shop" aria-label="Search" className="hover:opacity-70">
              <Search className="w-4 h-4 md:w-5 md:h-5 stroke-[1.6]" />
            </Link>
            <button
              type="button"
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative hover:opacity-70 flex items-center"
              aria-label="Open Cart"
            >
              <ShoppingBag className="w-4 h-4 md:w-5 md:h-5 stroke-[1.6]" />
              {totalCount > 0 && (
                <span className="-top-1.5 -right-2 bg-[#1E2522] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCount}
                </span>
              )}
            </button>
          </div>
        </div>

        <nav className="max-w-7xl mx-auto mt-3 flex flex-wrap justify-center gap-5 md:gap-8 text-xs md:text-sm text-[#3A3834]">
          <Link href="/shop" className="hover:text-black transition">Shop All</Link>
          <Link href="/shop?cat=Mugs" className="hover:text-black transition">Mugs</Link>
          <Link href="/shop?cat=Jewellery" className="hover:text-black transition">Jewellery</Link>
          <Link href="/our-story" className="hover:text-black transition">Our Story</Link>
          <Link href="/contact" className="hover:text-black transition">Contact Us</Link>
        </nav>

        {mobileMenu && (
          <div className="mt-3 pt-3 border-t border-[#E2DDD5] flex flex-wrap justify-center gap-6 text-xs text-[#6E6A63]">
            <Link href="/" onClick={() => setMobileMenu(false)}>Home</Link>
            <Link href="/cart" onClick={() => setMobileMenu(false)}>Full Cart Page</Link>
            <Link href="/account" onClick={() => setMobileMenu(false)}>My Account (حسابي)</Link>
            <Link href="/admin" onClick={() => setMobileMenu(false)}>Cacto Club Admin</Link>
          </div>
        )}
      </header>

      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[1px]">
          <div className="w-full max-w-sm bg-[#FAF8F5] h-full p-6 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between border-b border-[#E2DDD5] pb-4">
                <h2 className="text-xl font-serif-title">My Cart</h2>
                <button type="button" onClick={() => setIsCartDrawerOpen(false)}>
                  <X className="w-5 h-5 text-[#6E6A63]" />
                </button>
              </div>

              <div className="mt-4 space-y-4 max-h-[55vh] overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-xs text-[#6E6A63] py-6 text-center">السلة فارغة حالياً.</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3 border-b border-[#E2DDD5] pb-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded object-cover" />
                      )}
                      <div className="flex-1 text-xs">
                        <h4 className="font-medium text-[#1E2522]">{item.name}</h4>
                        <p className="text-[#6E6A63] text-[11px]">{item.selectedSize}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <button type="button" onClick={() => updateQty(item.id, -1)} className="px-1.5 border rounded">-</button>
                          <span>{item.quantity}</span>
                          <button type="button" onClick={() => updateQty(item.id, 1)} className="px-1.5 border rounded">+</button>
                        </div>
                      </div>
                      <span className="text-xs font-semibold">{formatEGP(item.price * item.quantity)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-[#E2DDD5] pt-4 space-y-3 text-xs">
              <div className="flex justify-between text-[#6E6A63]">
                <span>Subtotal</span>
                <span>{formatEGP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>{formatEGP(subtotal)}</span>
              </div>
              <Link
                href="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="block w-full text-center bg-[#1E2522] text-white py-3 rounded font-medium hover:bg-black transition"
              >
                Checkout
              </Link>
              <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-[#6E6A63]">
                <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5" /> Secure Payments</span>
                <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5" /> Quality Delivery</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}