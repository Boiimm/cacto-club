import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#EFECE6] border-t border-[#E8E2D5] py-8 px-6 text-center text-xs text-[#7C6A58]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p>© 2026 Cacto Club. All rights reserved. 🌵</p>
        
        {/* زرار الأدمن الخفي: رابط سري وصغير جداً في أقصى اليمين أو اليسار */}
        <div className="flex items-center gap-4">
          <span>Designed with 🤍 for unique taste</span>
          <Link 
            href="/admin" 
            className="text-[10px] text-[#D4C5B9] hover:text-[#4B382A] transition opacity-40 hover:opacity-100"
            title="Admin Dashboard"
          >
            ⚙️ Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}