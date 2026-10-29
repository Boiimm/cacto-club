import { NextResponse } from 'next/server';

export function proxy(request) {
  // لو المستخدم بيحاول يدخل على صفحة الـ admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // مخصص للأمان الإضافي؛ لو حبيت تمنع الدخول المباشر، 
    // السيرفر هنا بيراقب الطلب (يمكنك تطويره لاحقاً للتحقق من الـ Cookies)
  }
  
  return NextResponse.next();
}

// تحديد المسارات اللي هيطبق عليها الميديلوير
export const config = {
  matcher: ['/admin/:path*'],
};