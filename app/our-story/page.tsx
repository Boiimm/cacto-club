export default function OurStoryPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
      <h1 className="text-3xl font-serif-title">Our Story قصة كاكتو</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <p className="text-sm md:text-base leading-relaxed text-[#1E2522]">
          Cacto Club began as a passion project, celebrating the beauty of handmade pottery and unique jewellery. Founded by Cacto Club Artisans, our mission is to bring artisanal craft into your everyday life. Each piece is thoughtfully designed and crafted to add a touch of art to your home and style.
        </p>
        <div className="rounded-xl overflow-hidden shadow-sm">
          <img
            src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=900&q=80"
            alt="Cacto Club Artisans"
            className="w-full h-72 object-cover"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center pt-4">
        <div className="rounded-xl overflow-hidden h-48 bg-[#EAE5DC]">
          <img
            src="https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=800&q=80"
            alt="Ceramic detail"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Our Values:</h2>
          <p className="text-base text-[#3A3834]">Craftsmanship, Community, Individuality.</p>
        </div>
      </div>
    </main>
  );
}