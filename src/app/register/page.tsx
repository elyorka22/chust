'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramApp } from '@/hooks/useTelegramApp';
import { ArrowLeft, User, CheckCircle, AlertCircle } from 'lucide-react';

interface UserData {
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  phone?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { showAlert, getUser, isReady } = useTelegramApp();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [registrationStatus, setRegistrationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isReady) {
      const telegramUser = getUser();
      if (telegramUser) {
        setUserData({
          telegram_id: telegramUser.id,
          username: telegramUser.username,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
        });
      }
    }
  }, [isReady, getUser]);

  const handleRegister = async () => {
    if (!userData) {
      showAlert('Telegram ma\'lumotlari topilmadi');
      return;
    }

    setLoading(true);
    setRegistrationStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
      }

      setRegistrationStatus('success');
      showAlert('Muvaffaqiyatli ro\'yxatdan o\'tildi!');
      
      // Redirect to map after 2 seconds
      setTimeout(() => {
        router.push('/map');
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Ro\'yxatdan o\'tishda xatolik yuz berdi');
      setRegistrationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push('/map');
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center p-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 mr-3"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Ro&apos;yxatdan o&apos;tish
            </h1>
            <p className="text-sm text-gray-600">
              Chust Real Estate ilovasida ro&apos;yxatdan o&apos;ting
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-8">
        <div className="max-w-md mx-auto">
          {/* User Info Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <div className="flex items-center mb-4">
              <User className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">
                Telegram ma&apos;lumotlari
              </h2>
            </div>

            {userData ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ism:</span>
                  <span className="font-medium">{userData.first_name}</span>
                </div>
                {userData.last_name && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Familiya:</span>
                    <span className="font-medium">{userData.last_name}</span>
                  </div>
                )}
                {userData.username && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Username:</span>
                    <span className="font-medium">@{userData.username}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Telegram ID:</span>
                  <span className="font-medium text-sm">{userData.telegram_id}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-600">Telegram ma&apos;lumotlari topilmadi</p>
              </div>
            )}
          </div>

          {/* Registration Status */}
          {registrationStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                <div>
                  <h3 className="text-green-800 font-medium">Muvaffaqiyatli ro&apos;yxatdan o&apos;tildi!</h3>
                  <p className="text-green-700 text-sm">Siz avtomatik ravishda xaritaga yo&apos;naltirilasiz...</p>
                </div>
              </div>
            </div>
          )}

          {registrationStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                <div>
                  <h3 className="text-red-800 font-medium">Xatolik yuz berdi</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRegister}
              disabled={loading || !userData || registrationStatus === 'success'}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Ro\'yxatdan o\'tilmoqda...' : 'Ro\'yxatdan o\'tish'}
            </button>

            <button
              onClick={handleSkip}
              disabled={loading}
              className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              O&apos;tib ketish
            </button>
          </div>

          {/* Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Ro&apos;yxatdan o&apos;tish orqali siz e&apos;lonlar qo&apos;shishingiz va boshqarishingiz mumkin
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 