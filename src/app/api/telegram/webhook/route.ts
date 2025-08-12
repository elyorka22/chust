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
          text: '🏠 Chust shahri ko\'chmas mulk ilovasiga xush kelibsiz!\n\nBu yerda Chust shahridagi ijara va sotish e\'lonlarini topishingiz mumkin.',
          reply_markup: {
            keyboard: [
              [
                {
                  text: '📝 E\'lon qo\'shish'
                }
              ],
              [
                {
                  text: 'ℹ️ Bot haqida'
                },
                {
                  text: '👤 Profil'
                }
              ],
              [
                {
                  text: '❓ Yordam'
                }
              ]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          }
        })
      });

      if (!response.ok) {
        console.error('Failed to send message to Telegram');
      }
    } else if (message?.text) {
      // Handle button clicks
      let responseText = '';
      let keyboard = null;
      let shouldSendResponse = true;

      switch (message.text) {
        case '📝 E\'lon qo\'shish':
          // Эта кнопка обрабатывается отдельно и отправляет ответ напрямую
          shouldSendResponse = false;
          break;

        case 'ℹ️ Bot haqida':
          responseText = 'ℹ️ **Bot haqida**\n\n🏠 **Chust Real Estate Bot**\n\nBu bot Chust shahridagi ko\'chmas mulk e\'lonlarini ko\'rish uchun yaratilgan.\n\n**Xususiyatlar:**\n• Xaritada e\'lonlarni ko\'rish\n• Ijara va sotish kategoriyalari\n• Batafsil ma\'lumotlar\n• Aloqa ma\'lumotlari\n\n**Dasturchi:** @elyorka22\n**Versiya:** 1.0.0';
          break;

        case '👤 Profil':
          responseText = `👤 **Profil**\n\n**Foydalanuvchi ma'lumotlari:**\n\n👤 **Ism:** ${message.from.first_name || 'Aniqlanmagan'}\n📝 **Username:** ${message.from.username ? '@' + message.from.username : 'Yo\'q'}\n🆔 **ID:** \`${message.from.id}\`\n🌍 **Til:** ${message.from.language_code || 'Aniqlanmagan'}\n\n**Siz oddiy foydalanuvchisiz.**\nE'lon qo'shish uchun administrator bilan bog'laning.`;
          break;

        case '❓ Yordam':
          responseText = '❓ **Yordam**\n\n**Bot qanday ishlaydi:**\n\n1️⃣ **E\'lon qo\'shish** - yangi e\'lon yaratish\n2️⃣ **Kategoriyalar** - ijara yoki sotish bo\'yicha filtrlash\n3️⃣ **Batafsil ma\'lumot** - e\'lon haqida to\'liq ma\'lumot\n\n**Buyruqlar:**\n/start - asosiy menyu\n/help - yordam\n\n**Muammo bo\'lsa:** @elyorka22 bilan bog\'laning.';
          break;

        default:
          responseText = 'Iltimos, quyidagi tugmalardan birini tanlang:';
          keyboard = {
            keyboard: [
              [
                { text: '📝 E\'lon qo\'shish' }
              ],
              [
                { text: 'ℹ️ Bot haqida' },
                { text: '👤 Profil' }
              ],
              [
                { text: '❓ Yordam' }
              ]
            ],
            resize_keyboard: true,
            one_time_keyboard: false
          };
      }

      // Send response only if needed
      if (shouldSendResponse) {
        const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: message.chat.id,
            text: responseText,
            parse_mode: 'Markdown',
            reply_markup: keyboard || {
              keyboard: [
                [
                  { text: '📝 E\'lon qo\'shish' }
                ],
                [
                  { text: 'ℹ️ Bot haqida' },
                  { text: '👤 Profil' }
                ],
                [
                  { text: '❓ Yordam' }
                ]
              ],
              resize_keyboard: true,
              one_time_keyboard: false
            }
          })
        });

        if (!response.ok) {
          console.error('Failed to send response to Telegram');
        }
      } else {
        // Handle web app buttons separately
        if (message.text === '📝 E\'lon qo\'shish') {
          const webAppResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              chat_id: message.chat.id,
              text: '📝 Yangi e\'lon qo\'shish uchun quyidagi tugmani bosing:',
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: '🌐 E\'lon qo\'shish',
                      web_app: {
                        url: `${WEBAPP_URL}/add`
                      }
                    }
                  ]
                ]
              }
            })
          });
          
          if (!webAppResponse.ok) {
            console.error('Failed to send web app button');
          }
        }
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