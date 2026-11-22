"use client";
import Link from "next/link";
import { useStore, formatEGP } from "@/lib/store";
import { useState } from "react";

export default function HomePage() {
  const { products, loadingProducts, addToCart } = useStore();
  const [subTypeFilter, setSubTypeFilter] = useState<string>("All");
  const [materialFilter, setMaterialFilter] = useState<string>("All");

  const featuredProducts = products.slice(0, 6);
  const heroProduct = products[0];

  const jewelleryList = products.filter((p) => {
    const matchType = subTypeFilter === "All" || p.subType === subTypeFilter;
    const matchMat = materialFilter === "All" || p.material === materialFilter;
    return matchType && matchMat;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-10">
      <section className="relative rounded-xl overflow-hidden bg-[#D9CFC3] min-h-[340px] md:min-h-[410px] flex items-center px-7 md:px-14 py-10 shadow-sm">
        {heroProduct?.image && (
          <img
            src={heroProduct.image}
            alt={heroProduct.name}
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-[#EFECE6]/95 via-[#EFECE6]/75 to-transparent" />
        <div className="relative z-10 max-w-md space-y-5">
          <h1 className="text-3xl md:text-4xl font-serif-title leading-tight text-[#1E2522]">
            Cacto Club: Handmade Pottery & Unique Jewellery. Elevate Your Everyday.
          </h1>
          <Link
            href="/shop"
            className="inline-block bg-[#1E2522] text-white text-xs md:text-sm px-6 py-2.5 rounded hover:bg-black transition"
          >
            Shop Now
          </Link>
        </div>
      </section>

      <section>
        {loadingProducts ? (
          <div className="text-center py-8 text-xs text-[#6E6A63]">Loading products from Google Sheets...</div>
        ) : featuredProducts.length === 0 ? (
          <div className="bg-[#FAF8F5] rounded-xl p-8 border border-[#E2DDD5] text-center text-xs text-[#6E6A63]">
            لا توجد منتجات في Google Sheets حالياً. أضف منتجاتك في ورقة <strong>Products</strong> أو من صفحة <strong>Admin</strong>.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredProducts.map((item) => (
              <div
                key={item.id}
                className="bg-[#FAF8F5] p-2.5 rounded-lg border border-[#E2DDD5] flex flex-col justify-between shadow-sm"
              >
                <Link href={`/product/${item.id}`} className="relative block aspect-square rounded overflow-hidden mb-2 bg-[#EAE5DC]">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition duration-300"
                    />
                  )}
                </Link>
                <div>
                  <h3 className="text-[11px] font-semibold text-[#1E2522] truncate">{item.name}</h3>
                  <p className="text-[10px] text-[#6E6A63] truncate mb-2">{item.subtitle || item.material}</p>
                  <div className="flex items-center justify-between pt-1 gap-1">
                    <span className="text-[11px] font-semibold truncate">{formatEGP(item.price)}</span>
                    <button
                      type="button"
                      onClick={() => addToCart(item)}
                      className="bg-[#1E2522] text-white text-[10px] px-2 py-1 rounded hover:bg-black transition shrink-0"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="bg-[#FAF8F5] rounded-xl p-6 md:p-8 border border-[#E2DDD5]">
        <h2 className="text-2xl md:text-3xl font-serif-title mb-6">Collection</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <aside className="space-y-6 text-xs text-[#3A3834]">
            <div>
              <h4 className="font-semibold mb-2.5 text-sm">Type</h4>
              <div className="space-y-2 text-[#6E6A63]">
                {["All", "Rings", "Necklaces", "Earrings"].map((t) => (
                  <label key={t} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jType"
                      checked={subTypeFilter === t}
                      onChange={() => setSubTypeFilter(t)}
                      className="accent-[#1E2522]"
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2.5 text-sm">Material</h4>
              <div className="space-y-2 text-[#6E6A63]">
                {["All", "Gold-plated", "Ceramic"].map((m) => (
                  <label key={m} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jMat"
                      checked={materialFilter === m}
                      onChange={() => setMaterialFilter(m)}
                      className="accent-[#1E2522]"
                    />
                    {m}
                  </label>
                ))}
              </div>
            </div>
          </aside>

          <div className="md:col-span-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {jewelleryList.map((product) => (
              <Link key={product.id} href={`/product/${product.id}`} className="group space-y-2">
                <div className="aspect-square rounded-lg overflow-hidden bg-[#EAE5DC]">
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-medium text-[#1E2522] truncate">{product.name}</h3>
                  <p className="text-xs text-[#6E6A63]">{formatEGP(product.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}