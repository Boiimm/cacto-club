"use client";

import React, { useState } from "react";

interface Order {
  id: string;
  date: string;
  customerName?: string;
  phone?: string;
  status: string;
  total: string | number;
  items?: string;
}

export default function AccountTrackPage() {
  const [phoneInput, setPhoneInput] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizePhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    return digits.startsWith("20") && digits.length > 10
      ? "0" + digits.slice(2)
      : digits;
  };

  const formatDate = (rawDate: string) => {
    if (!rawDate) return "-";
    const parsed = new Date(rawDate);
    if (isNaN(parsed.getTime())) return rawDate;
    return parsed.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleTrackOrders = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = normalizePhone(phoneInput);

    if (cleaned.length < 10) {
      setError("Please enter a valid 11-digit mobile number.");
      return;
    }

    setError("");
    setLoading(true);
    setSearched(false);

    try {
      const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
      if (!sheetUrl) {
        throw new Error("Store connection is not configured.");
      }

      const res = await fetch(`${sheetUrl}?action=getOrders`, {
        cache: "no-store",
      });
      const data = await res.json();
      const allOrders: any[] = Array.isArray(data)
        ? data
        : data.orders || data.data || [];

      const matched = allOrders
        .filter((o) => {
          const orderPhone = normalizePhone(
            String(o.phone || o.Phone || o.mobile || o.Mobile || "")
          );
          return orderPhone && orderPhone === cleaned;
        })
        .map((o) => ({
          id: String(o.id || o.orderId || o["Order ID"] || "-"),
          date: String(o.date || o.Date || o.createdAt || ""),
          customerName: String(
            o.customerName || o.name || o.Name || o["Customer Name"] || ""
          ),
          status: String(o.status || o.Status || "Processing"),
          total: o.total || o.Total || 0,
        }));

      setOrders(matched);
      setSearched(true);
    } catch (err) {
      setError("Could not load orders right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const customerName = orders[0]?.customerName;

  return (
    <main className="min-h-screen bg-[#f5f0e8] px-4 py-12 text-[#2c2520]">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-2 text-center font-serif text-3xl font-medium">
          Track Your Order | تتبع طلبك
        </h1>
        <p className="mb-8 text-center text-sm text-[#6b5e54]">
          Enter the mobile number used during checkout to view your order status.
        </p>

        <form
          onSubmit={handleTrackOrders}
          className="mb-8 flex flex-col gap-3 rounded-xl border border-[#e2d9cd] bg-white p-6 shadow-sm sm:flex-row"
        >
          <input
            type="tel"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            placeholder="010xxxxxxxx"
            className="flex-1 rounded-lg border border-[#d6cbc0] bg-[#faf7f2] px-4 py-3 text-sm outline-none focus:border-[#2c2520]"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-[#231f1d] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#3a3330] disabled:opacity-60"
          >
            {loading ? "Searching..." : "Track Orders"}
          </button>
        </form>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {searched && (
          <div className="rounded-xl border border-[#e2d9cd] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between border-b border-[#efe8de] pb-3">
              <h2 className="font-serif text-xl">
                {customerName ? `Welcome, ${customerName}` : "Your Orders"}
              </h2>
              <span className="rounded-full bg-[#f5f0e8] px-3 py-1 text-xs font-medium text-[#5c5046]">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            {orders.length === 0 ? (
              <p className="py-6 text-center text-sm text-[#6b5e54]">
                No orders found for this mobile number.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#efe8de] text-xs uppercase text-[#7a6d62]">
                      <th className="py-3 pr-4">Order ID</th>
                      <th className="py-3 pr-4">Date</th>
                      <th className="py-3 pr-4">Status</th>
                      <th className="py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f3ede4]">
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td className="py-3.5 pr-4 font-medium">{order.id}</td>
                        <td className="py-3.5 pr-4 text-[#6b5e54]">
                          {formatDate(order.date)}
                        </td>
                        <td className="py-3.5 pr-4">
                          <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-medium">
                          {Number(order.total).toFixed(2)} EGP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}