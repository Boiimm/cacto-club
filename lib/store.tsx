"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  subtitle?: string;
  price: number;
  category: "Mugs" | "Jewellery";
  subType?: "Rings" | "Necklaces" | "Earrings";
  material: "Gold-plated" | "Ceramic";
  image: string;
  images: string[];
  description?: string;
}

export interface Order {
  orderId: string;
  customerName: string;
  phone: string;
  address: string;
  date: string;
  itemsCount: number;
  itemsSummary: string;
  total: number;
  status: "Processing" | "Shipped";
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize: string;
}

export function formatEGP(amount: number): string {
  const safe = Number.isFinite(amount) ? amount : 0;
  return `${safe.toFixed(2)} EGP`;
}

interface StoreContextType {
  products: Product[];
  orders: Order[];
  cart: CartItem[];
  loadingProducts: boolean;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (v: boolean) => void;
  addToCart: (product: Product, size?: string) => void;
  updateQty: (id: string, delta: number) => void;
  clearCart: () => void;
  addNewOrder: (order: Order) => Promise<void>;
  updateOrderStatus: (orderId: string, status: "Processing" | "Shipped") => Promise<void>;
  addNewProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  refreshStoreData: () => Promise<void>;
  subtotal: number;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function formatSingleDriveUrl(rawUrl: string): string {
  const trimmed = (rawUrl || "").trim();
  if (!trimmed) return "";
  const fileMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileMatch && fileMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileMatch[1]}`;
  }
  const openIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openIdMatch && openIdMatch[1] && trimmed.includes("drive.google.com")) {
    return `https://lh3.googleusercontent.com/d/${openIdMatch[1]}`;
  }
  return trimmed;
}

export function parseProductImages(raw: string | string[]): string[] {
  if (Array.isArray(raw)) {
    return raw.map(formatSingleDriveUrl).filter(Boolean);
  }
  if (!raw) return [];
  if (raw.startsWith("data:image")) return [raw];
  return raw
    .split(/[\n,]+/)
    .map(formatSingleDriveUrl)
    .filter(Boolean);
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  const sheetsUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

  const refreshStoreData = async () => {
    if (!sheetsUrl || !sheetsUrl.startsWith("http")) {
      setLoadingProducts(false);
      return;
    }
    setLoadingProducts(true);
    try {
      const res = await fetch(`${sheetsUrl}?action=getAll`, { cache: "no-store" });
      const data = await res.json();

      if (Array.isArray(data.products)) {
        const mapped: Product[] = data.products
          .filter((p: Record<string, unknown>) => p.id || p.name)
          .map((p: Record<string, unknown>, idx: number) => {
            const parsedImgs = parseProductImages(String(p.image || ""));
            return {
              id: String(p.id || `prod-${idx}`),
              name: String(p.name || "Untitled Product"),
              subtitle: String(p.subtitle || p.material || ""),
              price: Number(String(p.price || 0).replace(/[^0-9.]/g, "")) || 0,
              category: p.category === "Jewellery" ? "Jewellery" : "Mugs",
              subType:
                p.subType === "Necklaces" || p.subType === "Earrings" || p.subType === "Rings"
                  ? p.subType
                  : "Rings",
              material: p.material === "Gold-plated" ? "Gold-plated" : "Ceramic",
              image: parsedImgs[0] || "",
              images: parsedImgs,
              description: String(p.description || ""),
            };
          });
        setProducts(mapped);
      } else {
        setProducts([]);
      }

      if (Array.isArray(data.orders)) {
        const mappedOrders: Order[] = [...data.orders]
          .reverse()
          .filter((o: Record<string, unknown>) => o.OrderId || o.OrderID || o.CustomerName)
          .map((o: Record<string, unknown>, idx: number) => {
            const itemsText = String(o.Items || o.Item || "");
            const totalNum =
              Number(String(o.Total || 0).replace(/[^0-9.]/g, "")) || 0;
            return {
              orderId: String(o.OrderId || o.OrderID || `ORD-${idx + 1}`),
              date: String(o.Date || ""),
              customerName: String(o.CustomerName || ""),
              phone: String(o.Phone || ""),
              address: String(o.Address || ""),
              itemsSummary: itemsText,
              itemsCount: itemsText ? itemsText.split(",").length : 1,
              total: totalNum,
              status: o.Status === "Shipped" ? "Shipped" : "Processing",
            };
          });
        setOrders(mappedOrders);
      } else {
        setOrders([]);
      }
    } catch {
      // Handle silently
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("cacto_cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cacto_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    refreshStoreData();
  }, [sheetsUrl]);

  const addToCart = (product: Product, selectedSize = "Standard") => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === product.id);
      if (exists) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setCart([]);

  const addNewOrder = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    if (sheetsUrl && sheetsUrl.startsWith("http")) {
      await fetch(sheetsUrl, {
        method: "POST",
        body: JSON.stringify({
          type: "ADD_ORDER",
          orderId: newOrder.orderId,
          date: newOrder.date,
          customerName: newOrder.customerName,
          phone: newOrder.phone,
          address: newOrder.address,
          items: newOrder.itemsSummary,
          total: formatEGP(newOrder.total),
        }),
      }).catch(() => {});
    }
  };

  const updateOrderStatus = async (orderId: string, status: "Processing" | "Shipped") => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );
    if (sheetsUrl && sheetsUrl.startsWith("http")) {
      await fetch(sheetsUrl, {
        method: "POST",
        body: JSON.stringify({ type: "UPDATE_ORDER_STATUS", orderId, status }),
      }).catch(() => {});
    }
  };

  const addNewProduct = async (newProd: Product) => {
    const cleanImages =
      newProd.images && newProd.images.length > 0
        ? newProd.images.map(formatSingleDriveUrl).filter(Boolean)
        : parseProductImages(newProd.image);

    const formatted: Product = {
      ...newProd,
      image: cleanImages[0] || "",
      images: cleanImages,
    };

    setProducts((prev) => [formatted, ...prev]);

    if (sheetsUrl && sheetsUrl.startsWith("http")) {
      await fetch(sheetsUrl, {
        method: "POST",
        body: JSON.stringify({
          type: "ADD_PRODUCT",
          ...formatted,
          image: cleanImages.join(", "),
        }),
      }).catch(() => {});
    }
  };

  const deleteProduct = async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (sheetsUrl && sheetsUrl.startsWith("http")) {
      await fetch(sheetsUrl, {
        method: "POST",
        body: JSON.stringify({ type: "DELETE_PRODUCT", id }),
      }).catch(() => {});
    }
  };

  const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <StoreContext.Provider
      value={{
        products,
        orders,
        cart,
        loadingProducts,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        addToCart,
        updateQty,
        clearCart,
        addNewOrder,
        updateOrderStatus,
        addNewProduct,
        deleteProduct,
        refreshStoreData,
        subtotal,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
};