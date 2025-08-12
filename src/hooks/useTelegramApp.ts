'use client';

import { useEffect, useState } from 'react';
import { TelegramWebApp } from '@/types';

export function useTelegramApp() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if we're in Telegram Web App
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp;
      
      // Initialize the Web App
      tg.ready();
      
      // Set theme
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
      document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
      document.documentElement.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color || '#999999');
      document.documentElement.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color || '#2481cc');
      document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc');
      document.documentElement.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color || '#ffffff');
      
      setWebApp(tg);
      setIsReady(true);
    } else {
      // Not in Telegram Web App, but still ready
      setIsReady(true);
    }
  }, []);

  const expand = () => {
    if (webApp) {
      webApp.expand();
    }
  };

  const close = () => {
    if (webApp) {
      webApp.close();
    }
  };

  const showAlert = (message: string) => {
    if (webApp) {
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed) => {
          resolve(confirmed);
        });
      } else {
        const confirmed = window.confirm(message);
        resolve(confirmed);
      }
    });
  };

  const getUser = () => {
    return webApp?.initDataUnsafe.user;
  };

  const getChat = () => {
    return webApp?.initDataUnsafe.chat;
  };

  const getStartParam = () => {
    return webApp?.initDataUnsafe.start_param;
  };

  return {
    webApp,
    isReady,
    expand,
    close,
    showAlert,
    showConfirm,
    getUser,
    getChat,
    getStartParam,
    isTelegramApp: !!webApp,
  };
} 