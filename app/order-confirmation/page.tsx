"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface SavedOrder {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  items: string;
  total: number;
  date?: string;
  status?: string;
}

const STORE_WHATSAPP_NUMBER = "201098033103";

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("cacto_last_order");
    if (raw) {
      try {
        setOrder(JSON.parse(raw));
      } catch {
        setOrder(null);
      }
    }
  }, []);

  const whatsappHelpUrl = order
    ? `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(
        `Hello Cacto Club, I have a question about order #${order.orderId} (${order.customerName} - ${Number(order.total).toFixed(2)} EGP).`
      )}`
    : `https://wa.me/${STORE_WHATSAPP_NUMBER}`;

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-4 py-14 text-[#2c2520]">
      <div className="mx-auto max-w-xl rounded-2xl border border-[#e2d9cd] bg-white p-8 shadow-sm">
        <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-lg font-semibold text-emerald-700">
          ✓
        </div>

        <h1 className="mb-2 font-serif text-3xl font-medium">
          Order Confirmed | تم تأكيد طلبك
        </h1>
        <p className="mb-6 text-sm text-[#6b5e54]">
          Your order has been recorded and is now being prepared. You can track its status anytime using your mobile number.
        </p>

        {order ? (
          <div className="mb-6 space-y-2.5 rounded-xl border border-[#efe8de] bg-[#faf7f2] p-5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#7a6d62]">Order ID:</span>
              <span className="font-semibold">{order.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7a6d62]">Customer:</span>
              <span>{order.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7a6d62]">Phone:</span>
              <span>{order.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#7a6d62]">Address:</span>
              <span className="text-right">{order.address}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-[#7a6d62]">Items:</span>
              <span className="text-right">{order.items}</span>
            </div>
            <div className="flex justify-between border-t border-[#e6ddd1] pt-2.5 font-semibold">
              <span>Total:</span>
              <span>{Number(order.total).toFixed(2)} EGP</span>
            </div>
          </div>
        ) : (
          <p className="mb-6 rounded-xl bg-[#faf7f2] p-4 text-xs text-[#6b5e54]">
            Your order is saved in our system. Use your mobile number on the tracking page to check your order status.
          </p>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href="/account"
            className="flex-1 rounded-lg bg-[#231f1d] px-5 py-3 text-center text-xs font-medium text-white transition hover:bg-[#3a3330]"
          >
            Track Order by Phone
          </Link>

          <a
            href={whatsappHelpUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-lg border border-[#d6cbc0] bg-[#faf7f2] px-5 py-3 text-center text-xs font-medium text-[#2c2520] transition hover:bg-[#f1eae0]"
          >
            Optional: Message on WhatsApp
          </a>
        </div>
      </div>
    </main>
  );
}