import "./globals.css";

export const metadata = {
  title: "Cacto Club - إكسسوارات البنات",
  description: "وجهتك الأولى لأرقى إكسسوارات البنات والمنتجات العصرية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}