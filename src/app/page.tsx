'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramApp } from '@/hooks/useTelegramApp';
import { Loader2 } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isReady, expand, isTelegramApp } = useTelegramApp();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isReady) {
      // Расширяем приложение на весь экран
      expand();
      // Перенаправляем на карту
      setRedirecting(true);
      router.push('/map');
    }
  }, [isReady, expand, router]);

  // Если это не Telegram приложение, показываем информацию
  if (!isTelegramApp) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-blue-900 mb-4">
              Chust Real Estate
            </h1>
            <p className="text-blue-700 mb-4">
              Bu ilova faqat Telegram orqali ishlaydi. Iltimos, Telegram ilovasida oching.
            </p>
            <p className="text-sm text-blue-600">
              This application only works in Telegram. Please open it in the Telegram app.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Показываем состояние загрузки
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">
          {redirecting ? 'Qayta yo\'naltirilmoqda...' : 'Yuklanmoqda...'}
        </p>
      </div>
    </div>
  );
}
