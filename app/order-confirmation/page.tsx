"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useStore, formatEGP } from "@/lib/store";

function OrderSuccessBody() {
  const params = useSearchParams();
  const orderId = params.get("id") || "";
  const { orders } = useStore();

  const matchedOrder = orders.find((o) => String(o.orderId) === String(orderId)) || orders[0];

  return (
    <main className="max-w-3xl mx-auto px-4 py-12 text-center space-y-5">
      <h2 className="text-2xl md:text-3xl font-serif-title">شكراً لطلبك</h2>
      <h1 className="text-3xl md:text-4xl font-serif-title">
        Order Confirmed! {matchedOrder?.orderId ? `#${matchedOrder.orderId}` : ""}
      </h1>
      <p className="text-xs md:text-sm text-[#6E6A63] max-w-lg mx-auto leading-relaxed">
        Your order is being processed and recorded in Google Sheets. Estimated Delivery: 3-5 business days.
      </p>

      {matchedOrder && (
        <div className="bg-[#FAF8F5] max-w-md mx-auto rounded-xl p-6 border border-[#E2DDD5] text-left space-y-4 shadow-sm">
          <h3 className="font-semibold text-sm border-b border-[#E2DDD5] pb-2">Order Summary</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#6E6A63]">Customer</span>
              <span>{matchedOrder.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6E6A63]">Items</span>
              <span className="text-right">{matchedOrder.itemsSummary}</span>
            </div>
          </div>

          <div className="border-t border-[#E2DDD5] pt-3 space-y-1.5 text-xs">
            <div className="flex justify-between font-semibold text-sm pt-1">
              <span>Total Paid</span>
              <span>{formatEGP(matchedOrder.total)}</span>
            </div>
          </div>

          <Link
            href="/shop"
            className="block w-full text-center bg-[#1E2522] text-white py-2.5 rounded text-xs font-medium hover:bg-black transition"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      <p className="text-xs text-[#6E6A63] pt-2">
        Need Help? <Link href="/contact" className="underline">Contact Us</Link>
      </p>
    </main>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading...</div>}>
      <OrderSuccessBody />
    </Suspense>
  );
}