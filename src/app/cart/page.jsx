"use client";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cacto_cart") || "[]");
    const formatted = savedCart.map(item => ({ ...item, quantity: item.quantity || 1 }));
    setCart(formatted);
  }, []);

  const updateCartStorage = (updated) => {
    setCart(updated);
    localStorage.setItem("cacto_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleIncrease = (id) => {
    const updated = cart.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
    updateCartStorage(updated);
  };

  const handleDecrease = (id) => {
    const updated = cart.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item);
    updateCartStorage(updated);
  };

  const handleRemove = (id) => {
    const updated = cart.filter(item => item.id !== id);
    updateCartStorage(updated);
  };

  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleCheckout = (e) => {
    e.preventDefault();
    if (cart.length === 0) return;

    // حفظ الطلب
    const orders = JSON.parse(localStorage.getItem("cacto_orders") || "[]");
    orders.push({
      id: Date.now(),
      name,
      phone,
      address,
      paymentMethod: paymentMethod === "visa" ? "الدفع الإلكتروني بالفيزا (Visa)" : "الدفع عند الاستلام (Cash)",
      items: cart,
      total: totalPrice
    });
    localStorage.setItem("cacto_orders", JSON.stringify(orders));

    // تفريغ السلة وتحديث الناف بار والانتقال لصفحة المنتجات
    localStorage.removeItem("cacto_cart");
    window.dispatchEvent(new Event("cartUpdated"));
    router.push("/products");
  };

  return (
    <div className="min-h-screen bg-[#F7F4EF] flex flex-col justify-between" dir="rtl">
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex-grow max-w-4xl space-y-8">
        <h1 className="text-3xl font-bold text-[#4B382A] text-center">سلة المشتريات 🛒</h1>

        {cart.length === 0 ? (
          <div className="bg-white p-10 rounded-2xl text-center shadow-sm">
            <p className="text-gray-600 mb-4">السلة فارغة حالياً.</p>
            <button onClick={() => router.push("/products")} className="bg-[#4B382A] text-white px-6 py-2 rounded-xl">تصفح المنتجات</button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center border-b pb-4">
                  <div>
                    <h3 className="font-bold text-[#4B382A]">{item.name}</h3>
                    <p className="text-[#8C6D53]">{item.price} ج.م</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex border rounded-xl overflow-hidden">
                      <button onClick={() => handleDecrease(item.id)} className="px-3 bg-gray-50">-</button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button onClick={() => handleIncrease(item.id)} className="px-3 bg-gray-50">+</button>
                    </div>
                    <button onClick={() => handleRemove(item.id)} className="text-red-500 text-sm">حذف</button>
                  </div>
                </div>
              ))}
              <div className="flex justify-between pt-4 font-bold text-lg">
                <span>المجموع الكلي:</span>
                <span className="text-[#8C6D53]">{totalPrice} ج.م</span>
              </div>
            </div>

            {/* نموذج إتمام الطلب وطرق الدفع */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h2 className="text-xl font-bold text-[#4B382A] mb-4">بيانات الشحن وطريقة الدفع</h2>
              <form onSubmit={handleCheckout} className="space-y-4">
                <input type="text" placeholder="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} className="w-full border p-3 rounded-xl" required />
                <input type="tel" placeholder="رقم الهاتف" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border p-3 rounded-xl" required />
                <textarea placeholder="عنوان التوصيل بالتفصيل" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border p-3 rounded-xl" rows="2" required></textarea>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">اختر طريقة الدفع:</label>
                  <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full border p-3 rounded-xl bg-white">
                    <option value="cash">الدفع عند الاستلام (Cash)</option>
                    <option value="visa">الدفع بالفيزا (Visa)</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-[#4B382A] text-white py-3.5 rounded-xl font-medium hover:bg-[#38291F] transition">
                  تأكيد وإتمام الطلب
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}