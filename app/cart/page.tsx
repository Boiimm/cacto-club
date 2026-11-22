"use client";
import { useStore, formatEGP } from "@/lib/store";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CartPage() {
  const { cart, updateQty, subtotal, clearCart, addNewOrder } = useStore();
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);
    const orderId = "CC" + Math.floor(10000 + Math.random() * 90000);
    const itemsSummary = cart.map((i) => `${i.name} (x${i.quantity})`).join(", ");
    const totalCount = cart.reduce((s, i) => s + i.quantity, 0);

    await addNewOrder({
      orderId,
      customerName,
      phone,
      address,
      date: new Date().toLocaleDateString("en-GB"),
      itemsCount: totalCount,
      itemsSummary,
      total: subtotal,
      status: "Processing",
    });

    const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "201098033103";
    const waText = encodeURIComponent(
      `*طلب جديد - Cacto | كاكتو* 🌵\n` +
        `*رقم الطلب:* #${orderId}\n` +
        `*الاسم:* ${customerName}\n` +
        `*الهاتف:* ${phone}\n` +
        `*العنوان:* ${address}\n` +
        `*المنتجات:* ${itemsSummary}\n` +
        `*الإجمالي:* ${formatEGP(subtotal)}`
    );
    window.open(`https://wa.me/${waNumber}?text=${waText}`, "_blank");

    clearCart();
    router.push(`/order-confirmation?id=${orderId}`);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <h1 className="text-3xl font-serif-title mb-6">Your Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-[#FAF8F5] rounded-xl p-10 border border-[#E2DDD5] text-center space-y-4">
          <p className="text-sm text-[#6E6A63]">السلة فارغة حالياً.</p>
          <Link href="/shop" className="inline-block bg-[#1E2522] text-white text-xs px-6 py-2.5 rounded">
            Go to Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-[#FAF8F5] rounded-xl p-6 border border-[#E2DDD5] space-y-4">
            <div className="grid grid-cols-5 text-xs text-[#6E6A63] pb-3 border-b border-[#E2DDD5]">
              <span className="col-span-2">Name</span>
              <span>Price</span>
              <span>Quantity</span>
              <span className="text-right">Subtotal</span>
            </div>

            {cart.map((item) => (
              <div key={item.id} className="grid grid-cols-5 items-center py-4 border-b border-[#E2DDD5] text-xs gap-2">
                <div className="col-span-2 flex items-center gap-3">
                  {item.image && (
                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded object-cover shrink-0" />
                  )}
                  <div className="space-y-0.5 min-w-0">
                    <h3 className="font-medium text-sm text-[#1E2522] truncate">{item.name}</h3>
                    <p className="text-[#6E6A63]">Size: {item.selectedSize}</p>
                    <p className="text-[#6E6A63]">Material: {item.material}</p>
                  </div>
                </div>
                <span>{formatEGP(item.price)}</span>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => updateQty(item.id, -1)} className="px-2 py-0.5 border rounded">-</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => updateQty(item.id, 1)} className="px-2 py-0.5 border rounded">+</button>
                </div>
                <span className="text-right font-semibold">{formatEGP(item.price * item.quantity)}</span>
              </div>
            ))}

            <div className="flex justify-end gap-8 pt-2 text-xs font-semibold">
              <span>Subtotal</span>
              <span>{formatEGP(subtotal)}</span>
            </div>
          </div>

          <form onSubmit={handleCheckout} className="bg-[#FAF8F5] rounded-xl p-6 border border-[#E2DDD5] space-y-4 h-fit">
            <h2 className="text-lg font-serif-title">Order Summary</h2>
            <div className="text-xs space-y-2 border-b border-[#E2DDD5] pb-4">
              <div className="flex justify-between">
                <span className="text-[#6E6A63]">Subtotal</span>
                <span>{formatEGP(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6E6A63]">Shipping</span>
                <span className="text-[#6E6A63]">Calculated at checkout</span>
              </div>
              <div className="flex justify-between font-semibold text-sm pt-2">
                <span>Estimated Total:</span>
                <span>{formatEGP(subtotal)}</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <input
                type="text"
                placeholder="Customer Name (الاسم بالكامل)"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full p-2.5 rounded border border-[#E2DDD5] bg-white"
              />
              <input
                type="tel"
                placeholder="WhatsApp Phone (رقم الواتساب)"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded border border-[#E2DDD5] bg-white"
              />
              <input
                type="text"
                placeholder="Shipping Address (العنوان بالتفصيل)"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2.5 rounded border border-[#E2DDD5] bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#1E2522] text-white py-3 rounded text-xs font-medium hover:bg-black transition"
            >
              {submitting ? "Processing..." : "Proceed to Checkout"}
            </button>

            <Link href="/shop" className="block text-center text-xs underline text-[#6E6A63]">
              Continue Shopping
            </Link>

            <div className="pt-3 border-t border-[#E2DDD5] space-y-1.5 text-xs">
              <label className="block text-[#6E6A63]">Discount Code</label>
              <input
                type="text"
                placeholder="Discount Code"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
                className="w-full p-2 rounded border border-[#E2DDD5] bg-white"
              />
            </div>
          </form>
        </div>
      )}
    </main>
  );
}