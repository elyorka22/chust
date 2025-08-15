'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramApp } from '@/hooks/useTelegramApp';
import { useUser } from '@/hooks/useUser';
import { Loader2, User, Map, Home, Plus } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { isReady, expand, isTelegramApp } = useTelegramApp();
  const { user, loading: userLoading, isAuthenticated } = useUser();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isReady && isTelegramApp) {
      expand();
    }
  }, [isReady, isTelegramApp, expand]);

  const handleGoToMap = () => {
    setRedirecting(true);
    router.push('/map');
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleAddListing = () => {
    router.push('/add');
  };

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

  if (!isReady || userLoading) {
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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <Home className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Chust Real Estate
            </h1>
            <p className="text-gray-600">
              Chust shahri ko&apos;chmas mulk e&apos;lonlari
            </p>
          </div>

          {isAuthenticated ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <div className="flex items-center">
                  <User className="w-5 h-5 text-green-600 mr-2" />
                  <div className="text-left">
                    <p className="text-green-800 font-medium">Xush kelibs!</p>
                    <p className="text-green-700 text-sm">{user?.first_name}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleGoToMap}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Map className="w-5 h-5 mr-2" />
                E&apos;lonlarni ko&apos;rish
              </button>

              <button
                onClick={handleAddListing}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                E&apos;lon joylash
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <button
                onClick={handleGoToMap}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Map className="w-5 h-5 mr-2" />
                E&apos;lonlarni ko&apos;rish
              </button>

              <button
                onClick={handleRegister}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
              >
                <User className="w-5 h-5 mr-2" />
                Ro&apos;yxatdan o&apos;tish
              </button>

              <div className="text-sm text-gray-500 mt-4">
                <p>E&apos;lonlar qo&apos;shish uchun ro&apos;yxatdan o&apos;ting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
