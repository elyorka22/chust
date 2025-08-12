import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = '7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0';
const WEBAPP_URL = 'https://chust-seven.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Telegram webhook received:', body);

    const { message } = body;

    if (message?.text === '/start') {
      // Отправляем приветственное сообщение с кнопкой для открытия веб-приложения
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: '🏠 Добро пожаловать в приложение недвижимости Чуста!\n\nЗдесь вы можете найти объявления об аренде и продаже недвижимости в городе Чуст.',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🗺️ Открыть карту недвижимости',
                  web_app: { url: WEBAPP_URL }
                }
              ],
              [
                {
                  text: '📋 Обычный пользователь',
                  callback_data: 'regular_user'
                },
                {
                  text: '📝 Разместить объявление',
                  callback_data: 'post_ad'
                }
              ]
            ]
          }
        })
      });

      if (!response.ok) {
        console.error('Failed to send message to Telegram');
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing Telegram webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook endpoint' });
} 