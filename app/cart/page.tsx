"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

const CART_STORAGE_KEYS = ["cacto_cart", "cart", "cactoClubCart"];

const readCartFromStorage = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  for (const key of CART_STORAGE_KEYS) {
    const raw = localStorage.getItem(key);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item, idx) => ({
            id: String(item.id ?? item.productId ?? `item-${idx}`),
            name: String(item.name ?? item.title ?? "Product"),
            price: Number(String(item.price ?? 0).replace(/[^0-9.]/g, "")) || 0,
            quantity: Number(item.quantity ?? item.qty ?? 1) || 1,
            image: String(item.image ?? item.images ?? ""),
          }));
        }
      } catch {
        // Ignore malformed cart data
      }
    }
  }
  return [];
};

const writeCartToStorage = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  for (const key of CART_STORAGE_KEYS) {
    if (localStorage.getItem(key) !== null || key === "cacto_cart") {
      localStorage.setItem(key, JSON.stringify(items));
    }
  }
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("cartUpdated"));
};

export default function CartCheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setCartItems(readCartFromStorage());
  }, []);

  const updateQty = (id: string, delta: number) => {
    const updated = cartItems
      .map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + delta } : item
      )
      .filter((item) => item.quantity > 0);
    setCartItems(updated);
    writeCartToStorage(updated);
  };

  const removeItem = (id: string) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    writeCartToStorage(updated);
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const itemsSummary = cartItems
    .map((item) => `${item.name} (x${item.quantity})`)
    .join(", ");

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (cartItems.length === 0) {
      setErrorMsg("Your cart is empty.");
      return;
    }

    if (!customerName.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg("Please fill in your name, phone number, and delivery address.");
      return;
    }

    const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
    if (!sheetUrl) {
      setErrorMsg("Store order endpoint is not configured.");
      return;
    }

    setSubmitting(true);

    const generatedOrderId = `CC${Math.floor(10000 + Math.random() * 90000)}`;
    const orderRecord = {
      orderId: generatedOrderId,
      date: new Date().toISOString(),
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      items: itemsSummary,
      total: totalAmount,
      status: "Processing",
    };

    try {
      await fetch(sheetUrl, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          action: "createOrder",
          order: orderRecord,
        }),
      });

      sessionStorage.setItem("cacto_last_order", JSON.stringify(orderRecord));
      setCartItems([]);
      writeCartToStorage([]);
      router.push("/order-confirmation");
    } catch {
      setErrorMsg("Could not place order right now. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-4 py-12 text-[#2c2520]">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 font-serif text-3xl font-medium">
          Your Cart & Checkout | السلة وإتمام الطلب
        </h1>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl border border-[#e2d9cd] bg-white p-10 text-center shadow-sm">
            <p className="mb-4 text-sm text-[#6b5e54]">Your shopping cart is currently empty.</p>
            <Link
              href="/shop"
              className="inline-block rounded-lg bg-[#231f1d] px-6 py-2.5 text-xs font-medium text-white transition hover:bg-[#3a3330]"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-[#e2d9cd] bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-16 rounded-lg border border-[#efe8de] object-cover"
                      />
                    ) : null}
                    <div>
                      <h2 className="font-medium text-sm">{item.name}</h2>
                      <p className="text-xs text-[#6b5e54]">
                        {item.price.toFixed(2)} EGP each
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-lg border border-[#d6cbc0] bg-[#faf7f2]">
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, -1)}
                        className="px-2.5 py-1 text-xs font-medium hover:bg-[#efe8de]"
                      >
                        -
                      </button>
                      <span className="px-2.5 text-xs font-medium">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.id, 1)}
                        className="px-2.5 py-1 text-xs font-medium hover:bg-[#efe8de]"
                      >
                        +
                      </button>
                    </div>

                    <span className="w-20 text-right text-xs font-semibold">
                      {(item.price * item.quantity).toFixed(2)} EGP
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Checkout Form */}
            <form
              onSubmit={handleCheckoutSubmit}
              className="h-fit space-y-4 rounded-2xl border border-[#e2d9cd] bg-white p-6 shadow-sm"
            >
              <h2 className="border-b border-[#efe8de] pb-3 font-serif text-xl">
                Order Details
              </h2>

              <div>
                <label className="mb-1 block text-xs font-medium">Full Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-[#d6cbc0] bg-[#faf7f2] px-3.5 py-2.5 text-xs outline-none focus:border-[#231f1d]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Mobile Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="010xxxxxxxx"
                  className="w-full rounded-lg border border-[#d6cbc0] bg-[#faf7f2] px-3.5 py-2.5 text-xs outline-none focus:border-[#231f1d]"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Delivery Address</label>
                <textarea
                  rows={3}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="City, street, building details"
                  className="w-full rounded-lg border border-[#d6cbc0] bg-[#faf7f2] px-3.5 py-2.5 text-xs outline-none focus:border-[#231f1d]"
                  required
                />
              </div>

              <div className="space-y-1.5 border-t border-[#efe8de] pt-3 text-xs">
                <div className="flex justify-between text-[#6b5e54]">
                  <span>Items:</span>
                  <span>{cartItems.reduce((s, i) => s + i.quantity, 0)}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total:</span>
                  <span>{totalAmount.toFixed(2)} EGP</span>
                </div>
              </div>

              {errorMsg && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-[#231f1d] py-3 text-xs font-medium text-white transition hover:bg-[#3a3330] disabled:opacity-60"
              >
                {submitting ? "Placing Order..." : "Confirm Order"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}