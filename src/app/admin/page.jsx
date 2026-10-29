"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AdminPage() {
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState("messages");

  // جلب الرسائل المخزنة في localStorage عند تحميل الصفحة
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("cacto_messages") || "[]");
    setMessages(savedMessages);
  }, []);

  // حساب عدد الرسائل التي لم يتم الرد عليها (غير مقروءة)
  const unreadCount = messages.filter((msg) => !msg.isRead).length;

  // دالة لتغيير حالة الرسالة (تم الرد / لم يرد بعد)
  const handleToggleRead = (id) => {
    const updatedMessages = messages.map((msg) => {
      if (msg.id === id) {
        return { ...msg, isRead: !msg.isRead };
      }
      return msg;
    });
    setMessages(updatedMessages);
    localStorage.setItem("cacto_messages", JSON.stringify(updatedMessages));
  };

  // دالة لحذف رسالة معينة
  const handleDeleteMessage = (id) => {
    const updatedMessages = messages.filter((msg) => msg.id !== id);
    setMessages(updatedMessages);
    localStorage.setItem("cacto_messages", JSON.stringify(updatedMessages));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">لوحة التحكم (Admin Panel)</h1>
          
          {/* زرار الرسائل مع مؤشر العدد غير المقروء */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("messages")}
              className={`relative px-4 py-2 rounded-lg font-medium transition flex items-center gap-2 ${
                activeTab === "messages"
                  ? "bg-emerald-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span>✉️ Customer Messages</span>
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* قسم رسائل العملاء */}
        {activeTab === "messages" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">الرسائل الواردة من العملاء</h2>
              <span className="text-sm text-gray-500">إجمالي الرسائل: {messages.length} | غير متردش عليها: {unreadCount}</span>
            </div>

            {messages.length === 0 ? (
              <p className="text-gray-500 text-center py-12">لا توجد رسائل جديدة حتى الآن.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`border rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition ${
                      msg.isRead ? "bg-gray-50/50 border-gray-200" : "bg-emerald-50/30 border-emerald-200"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-bold text-gray-800 text-lg">{msg.name}</span>
                        <span className="text-xs text-gray-400">({msg.date})</span>
                        {!msg.isRead && (
                          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full font-medium">
                            لم يتم الرد
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 whitespace-pre-wrap">{msg.message}</p>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center">
                      {/* زر تغيير حالة الرد */}
                      <button
                        onClick={() => handleToggleRead(msg.id)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                          msg.isRead
                            ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            : "bg-emerald-600 text-white hover:bg-emerald-700"
                        }`}
                      >
                        {msg.isRead ? "تحديد كـ (لم يرد بعد)" : "تحديد كـ (تم الرد)"}
                      </button>

                      {/* زر الحذف */}
                      <button
                        onClick={() => handleDeleteMessage(msg.id)}
                        className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}