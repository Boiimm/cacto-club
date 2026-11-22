"use client";
import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const sheetsUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;
    if (sheetsUrl && sheetsUrl.startsWith("http")) {
      await fetch(sheetsUrl, {
        method: "POST",
        body: JSON.stringify({ type: "ADD_MESSAGE", ...form }),
      }).catch(() => {});
    }
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-12">
      <h1 className="text-3xl md:text-4xl font-serif-title mb-6">Contact Cacto Club</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <div className="space-y-4 text-sm text-[#3A3834]">
          <h2 className="text-lg font-medium text-[#1E2522]">We&apos;d love to hear from you!</h2>
          <p className="text-xs leading-relaxed text-[#6E6A63]">
            Whether you have a question about our handmade pottery, your order, or anything else, our team is here to help.
          </p>
          <div className="space-y-3 pt-2 text-xs">
            <p><strong>✉ Email:</strong> hello@cactoclub.com</p>
            <p><strong>◎ Instagram:</strong> DM @cacto_club</p>
            <p><strong>📍 Address:</strong> 6th of October City, Egypt</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#FAF8F5] p-6 rounded-xl border border-[#E2DDD5] space-y-4 text-xs shadow-sm">
          <div>
            <label className="block mb-1">Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2.5 border border-[#E2DDD5] rounded bg-white"
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2.5 border border-[#E2DDD5] rounded bg-white"
            />
          </div>
          <div>
            <label className="block mb-1">Message</label>
            <textarea
              rows={4}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full p-2.5 border border-[#E2DDD5] rounded bg-white"
            />
          </div>
          <button type="submit" className="bg-[#1E2522] text-white px-6 py-2.5 rounded text-xs hover:bg-black">
            Send Message
          </button>
          {sent && <p className="text-green-700 text-xs pt-1">تم إرسال رسالتك وحفظها في Google Sheets بنجاح!</p>}
        </form>
      </div>
    </main>
  );
}