"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useStore, formatEGP } from "@/lib/store";

function ShopContent() {
  const { products, loadingProducts, refreshStoreData, addToCart } = useStore();
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") || "All";

  const [category, setCategory] = useState<string>(initialCat);
  const [material, setMaterial] = useState<string>("All");
  const [maxPrice, setMaxPrice] = useState<number>(1000);

  useEffect(() => {
    const catParam = searchParams.get("cat");
    if (catParam) setCategory(catParam);
    else setCategory("All");
  }, [searchParams]);

  useEffect(() => {
    if (products.length > 0) {
      const highestPrice = Math.max(...products.map((p) => p.price), 1000);
      setMaxPrice(highestPrice);
    }
  }, [products]);

  const filtered = products.filter((p) => {
    const matchCat = category === "All" || p.category === category;
    const matchMat = material === "All" || p.material === material;
    const matchPrice = p.price <= maxPrice;
    return matchCat && matchMat && matchPrice;
  });

  return (
    <main className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-serif-title">Shop Cacto Club</h1>
        
      </div>

      <div className="bg-[#FAF8F5] rounded-xl p-6 border border-[#E2DDD5] grid grid-cols-1 md:grid-cols-5 gap-8">
        <aside className="space-y-6 text-xs">
          <div>
            <h3 className="font-semibold text-sm mb-2.5">Category</h3>
            <div className="space-y-2 text-[#6E6A63]">
              {["All", "Mugs", "Jewellery"].map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="cat"
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="accent-[#1E2522]"
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2">Price Range</h3>
            <input
              type="range"
              min="0"
              max={Math.max(1000, ...products.map((p) => p.price))}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#1E2522]"
            />
            <div className="flex justify-between text-[11px] text-[#6E6A63] mt-1">
              <span>0 EGP</span>
              <span>Up to {maxPrice} EGP</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-2.5">Material</h3>
            <div className="space-y-2 text-[#6E6A63]">
              {["All", "Gold-plated", "Ceramic"].map((mat) => (
                <label key={mat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="mat"
                    checked={material === mat}
                    onChange={() => setMaterial(mat)}
                    className="accent-[#1E2522]"
                  />
                  {mat}
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="md:col-span-4">
          {loadingProducts ? (
            <div className="py-12 text-center text-xs text-[#6E6A63]">
              Loading products from Google Sheets...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6E6A63] space-y-2">
              <p>لا توجد منتجات مطابقة للفلاتر الحالية أو لا توجد منتجات في ورقة Products.</p>
              <button
                type="button"
                onClick={() => {
                  setCategory("All");
                  setMaterial("All");
                }}
                className="underline text-[#1E2522]"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg border border-[#E2DDD5] p-2.5 flex flex-col justify-between space-y-2"
                >
                  <Link href={`/product/${item.id}`} className="group block space-y-2">
                    <div className="aspect-square rounded-md overflow-hidden bg-[#EAE5DC]">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-medium text-[#1E2522] truncate">{item.name}</h4>
                      <p className="text-xs text-[#6E6A63]">{formatEGP(item.price)}</p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="w-full bg-[#1E2522] text-white text-[11px] py-1.5 rounded hover:bg-black transition"
                  >
                    Add to Cart
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ShopAllPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs">Loading Shop...</div>}>
      <ShopContent />
    </Suspense>
  );
}