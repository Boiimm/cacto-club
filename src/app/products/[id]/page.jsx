export const dynamic = 'force-dynamic';

"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    
    // استرجاع المنتجات من الـ localStorage أو البيانات المتاحة
    try {
      const savedProducts = localStorage.getItem("cacto_products");
      if (savedProducts) {
        const productsList = JSON.parse(savedProducts);
        const found = productsList.find((p) => String(p.id) === String(id));
        setProduct(found || null);
      }
    } catch (error) {
      console.error("Error loading product:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p className="text-xl text-gray-600">جاري تحميل تفاصيل المنتج...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">عذراً، المنتج غير موجود</h2>
          <p className="text-gray-600 mb-6">لم نتمكن من العثور على المنتج المطلوب.</p>
          <a href="/" className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition">
            العودة للرئيسية
          </a>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* صورة المنتج */}
            <div className="relative h-80 md:h-96 rounded-xl overflow-hidden bg-gray-100">
              <img
                src={product.image || "/placeholder.jpg"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* تفاصيل المنتج */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
                <p className="text-2xl font-semibold text-emerald-600 mb-4">{product.price} ج.م</p>
                <p className="text-gray-600 leading-relaxed mb-6">{product.description || "لا يوجد وصف متاح لهذا المنتج."}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    // منطق إضافة المنتج للسلة
                    alert("تم إضافة المنتج إلى السلة بنجاح!");
                  }}
                  className="flex-grow bg-emerald-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-emerald-700 transition text-center"
                >
                  إضافة إلى السلة
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}