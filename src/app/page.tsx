'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramApp } from '@/hooks/useTelegramApp';

export default function HomePage() {
  const router = useRouter();
  const { isReady, expand } = useTelegramApp();

  useEffect(() => {
    if (isReady) {
      // Расширяем приложение на весь экран
      expand();
      // Перенаправляем на карту
      router.push('/map');
    }
  }, [isReady, expand, router]);

  return null;
}
