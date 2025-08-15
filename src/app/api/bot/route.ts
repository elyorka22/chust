import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

// Токен бота
const token = '7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0';

// URL веб-приложения
const WEBAPP_URL = process.env.VERCEL_URL 
  ? `https://${process.env.VERCEL_URL}` 
  : 'http://localhost:3000';

// Создаем бота
const bot = new TelegramBot(token, { polling: false }); // Отключаем polling для Vercel

// Автоматическая регистрация пользователя
async function registerUser(userData: {
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
}) {
  try {
    const response = await fetch(`${WEBAPP_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error registering user:', error);
    return false;
  }
}

// Обработка webhook
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Обработка команды /start
    if (body.message && body.message.text === '/start') {
      const chatId = body.message.chat.id;
      const user = body.message.from;
      
      console.log('Received /start command from:', chatId);
      
      // Автоматическая регистрация пользователя
      const userData = {
        telegram_id: user.id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
      };
      
      console.log('Registering user:', userData);
      
      const registrationSuccess = await registerUser(userData);
      
      if (registrationSuccess) {
        console.log('User registered successfully');
      } else {
        console.log('User registration failed or user already exists');
      }
      
      const message = `👋 Xush kelibs! Chust Real Estate botiga xush kelibsiz!

✅ Siz avtomatik ravishda ro'yxatdan o'tdingiz!

Bu bot orqali siz:
🏠 Ko'chmas mulk e'lonlarini ko'rishingiz
📝 O'zingizning e'lonlaringizni joylashtirishingiz mumkin

Qanday foydalanmoqchisiz?`;

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: '🏠 E\'lonlarni ko\'rish',
              callback_data: 'view_listings'
            }
          ],
          [
            {
              text: '📝 E\'lon qo\'shish',
              callback_data: 'add_listing'
            }
          ],
          [
            {
              text: '👤 Profil',
              callback_data: 'profile'
            }
          ],
          [
            {
              text: 'ℹ️ Bot haqida',
              callback_data: 'bot_info'
            }
          ]
        ]
      };

      await bot.sendMessage(chatId, message, {
        reply_markup: keyboard
      });
    }
    
    // Обработка callback query
    if (body.callback_query) {
      const chatId = body.callback_query.message.chat.id;
      const data = body.callback_query.data;
      
      switch (data) {
        case 'view_listings':
          await bot.sendMessage(chatId, `🌐 Sizni ${WEBAPP_URL}/map saytiga yo'naltiramiz.`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Web-saytga o\'tish',
                    web_app: { url: `${WEBAPP_URL}/map` }
                  }
                ]
              ]
            }
          });
          break;
          
        case 'add_listing':
          await bot.sendMessage(chatId, `🌐 Sizni ${WEBAPP_URL}/add saytiga yo'naltiramiz.`, {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: 'Web-saytga o\'tish',
                    web_app: { url: `${WEBAPP_URL}/add` }
                  }
                ]
              ]
            }
          });
          break;
          
        case 'profile':
          await bot.sendMessage(chatId, `👤 Profil ma'lumotlari

📱 Telegram ID: ${body.callback_query.from.id}
✅ Holat: Ro'yxatdan o'tgan

Siz avtomatik ravishda ro'yxatdan o'tgansiz va e'lonlar qo'shishingiz mumkin.`);
          break;
          
        case 'bot_info':
          await bot.sendMessage(chatId, `ℹ️ Bot haqida

🏠 Chust Real Estate Bot
📍 Chust shahri ko'chmas mulk e'lonlari

Bu bot orqali siz:
• Ko'chmas mulk e'lonlarini ko'rishingiz
• O'zingizning e'lonlaringizni joylashtirishingiz
• Boshqa foydalanuvchilar bilan bog'lanishingiz mumkin

📞 Aloqa: @admin_username`);
          break;
      }
      
      // Отвечаем на callback query
      await bot.answerCallbackQuery(body.callback_query.id);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Bot API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET метод для проверки статуса
export async function GET() {
  return NextResponse.json({ 
    status: 'Bot API is running',
    webapp_url: WEBAPP_URL 
  });
} 