"use client";
import { Suspense, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useStore, formatEGP } from "@/lib/store";
import Link from "next/link";

function ProductDetailContent() {
  const { id } = useParams();
  const { products, loadingProducts, addToCart } = useStore();
  const product = products.find((p) => String(p.id) === String(id));
  const [size, setSize] = useState("Large");
  const [selectedImage, setSelectedImage] = useState<string>("");

  const gallery =
    product?.images && product.images.length > 0
      ? product.images
      : product?.image
      ? [product.image]
      : [];

  useEffect(() => {
    if (gallery.length > 0) {
      setSelectedImage(gallery[0]);
    }
  }, [product?.id]);

  if (loadingProducts) {
    return (
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 text-center text-xs text-[#6E6A63]">
        Loading product...
      </main>
    );
  }

  if (!product) {
    return (
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 text-center space-y-4">
        <p className="text-sm text-[#6E6A63]">المنتج غير موجود أو تم حذفه من Google Sheets.</p>
        <Link href="/shop" className="inline-block bg-[#1E2522] text-white text-xs px-5 py-2.5 rounded">
          Back to Shop
        </Link>
      </main>
    );
  }

  const activeImg = selectedImage || gallery[0] || "";
  const styleWithItems = products.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-8">
      <p className="text-xs text-[#6E6A63] mb-4">Home &gt; {product.name}</p>

      <div className="bg-[#FAF8F5] rounded-xl p-6 md:p-10 border border-[#E2DDD5] grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-3">
          <div className="aspect-square rounded-lg overflow-hidden bg-[#EAE5DC] relative">
            {activeImg && (
              <img src={activeImg} alt={product.name} className="w-full h-full object-cover transition duration-300" />
            )}
          </div>

          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {gallery.map((imgUrl, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`w-20 h-20 rounded-md overflow-hidden shrink-0 border-2 transition ${
                    activeImg === imgUrl ? "border-[#1E2522]" : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={imgUrl} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-5">
          <h1 className="text-2xl md:text-3xl font-serif-title">{product.name}</h1>
          <p className="text-lg font-semibold">{formatEGP(product.price)}</p>

          <div>
            <span className="text-xs text-[#6E6A63] block mb-2">Size</span>
            <div className="flex gap-2">
              {["Large", "Small"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`px-5 py-1.5 rounded-full text-xs border transition ${
                    size === s
                      ? "bg-[#1E2522] text-white border-[#1E2522]"
                      : "border-[#D5CFC4] text-[#1E2522] bg-white"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {product.description && (
            <p className="text-xs text-[#6E6A63] leading-relaxed">{product.description}</p>
          )}

          <button
            type="button"
            onClick={() => addToCart(product, size)}
            className="w-full bg-[#1E2522] text-white py-3 rounded text-xs font-medium hover:bg-black transition"
          >
            Add to Cart
          </button>

          {styleWithItems.length > 0 && (
            <div className="pt-4 border-t border-[#E2DDD5] space-y-2">
              <h3 className="text-xs font-semibold">Style With</h3>
              <div className="grid grid-cols-3 gap-3">
                {styleWithItems.map((sw) => (
                  <Link key={sw.id} href={`/product/${sw.id}`} className="block aspect-square rounded overflow-hidden bg-[#EAE5DC]">
                    {sw.image && (
                      <img src={sw.image} alt={sw.name} className="w-full h-full object-cover hover:scale-105 transition" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading product...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}