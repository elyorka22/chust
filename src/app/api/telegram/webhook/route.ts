import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = '7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0';
const WEBAPP_URL = 'https://chust-seven.vercel.app';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Telegram webhook received:', body);

    const { message, callback_query } = body;

    // Handle callback queries
    if (callback_query) {
      // Forward to callback handler
      const callbackResponse = await fetch(`${request.nextUrl.origin}/api/telegram/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      
      return callbackResponse;
    }

    // Handle regular messages
    if (message?.text === '/start') {
      // Отправляем приветственное сообщение с кнопкой для открытия веб-приложения
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: message.chat.id,
          text: '🏠 Chust shahri ko\'chmas mulk ilovasiga xush kelibsiz!\n\nBu yerda Chust shahridagi ijara va sotish e\'lonlarini topishingiz mumkin.\n\nXaritani ko\'rish uchun quyidagi havolani bosing:\nhttps://chust-seven.vercel.app',
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: '🗺️ Xarita',
                  web_app: { url: WEBAPP_URL }
                },
                {
                  text: '📝 E\'lon qo\'shish',
                  web_app: { url: `${WEBAPP_URL}/add` }
                }
              ],
              [
                {
                  text: 'ℹ️ Bot haqida',
                  callback_data: 'about_bot'
                },
                {
                  text: '👤 Profil',
                  callback_data: 'profile'
                }
              ],
              [
                {
                  text: '📞 Aloqa',
                  callback_data: 'contact'
                },
                {
                  text: '❓ Yordam',
                  callback_data: 'help'
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