"use client";
import { useStore, formatEGP } from "@/lib/store";
import { User } from "lucide-react";

export default function CustomerAccountPage() {
  const { orders } = useStore();

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <div className="text-center mb-6">
        <h1 className="text-xl md:text-2xl font-serif-title">My Account | حسابي</h1>
      </div>

      <div className="bg-[#FAF8F5] rounded-xl border border-[#E2DDD5] p-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="space-y-2 text-xs border-r border-[#E2DDD5] pr-4">
          <div className="bg-[#EAE5DC] px-3 py-2 rounded font-medium">⌂ Dashboard</div>
          <div className="px-3 py-2 text-[#6E6A63] flex justify-between items-center">
            <span>🛒 Orders</span>
            <span className="bg-[#1E2522] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
              {orders.length}
            </span>
          </div>
        </aside>

        <div className="md:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif-title">Welcome, Ibrahim!</h2>
            <div className="w-12 h-12 rounded-full bg-[#EAE5DC] flex items-center justify-center text-[#6E6A63]">
              <User className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-[#E2DDD5] p-4 overflow-x-auto">
            <h3 className="text-sm font-semibold mb-3">Orders History (From Google Sheets)</h3>
            {orders.length === 0 ? (
              <p className="text-xs text-[#6E6A63] py-4">لا توجد طلبات مسجلة في Google Sheets حتى الآن.</p>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="text-[#6E6A63] border-b border-[#E2DDD5]">
                  <tr>
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2DDD5]">
                  {orders.map((o) => (
                    <tr key={o.orderId}>
                      <td className="py-2.5">{o.orderId}</td>
                      <td className="py-2.5 text-[#6E6A63]">{o.date}</td>
                      <td className="py-2.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] ${
                            o.status === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-2.5 font-medium">{formatEGP(o.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}