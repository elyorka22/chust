import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = '7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Telegram callback received:', body);

    const { callback_query } = body;

    if (!callback_query) {
      return NextResponse.json({ ok: true });
    }

    const { id, data, from, message } = callback_query;

    // Answer the callback query to remove loading state
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        callback_query_id: id
      })
    });

    // Handle different callback data
    switch (data) {
      case 'about_bot':
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: 'ℹ️ **Bot haqida**\n\n🏠 **Chust Real Estate Bot**\n\nBu bot Chust shahridagi ko\'chmas mulk e\'lonlarini ko\'rish uchun yaratilgan.\n\n**Xususiyatlar:**\n• Xaritada e\'lonlarni ko\'rish\n• Ijara va sotish kategoriyalari\n• Batafsil ma\'lumotlar\n• Aloqa ma\'lumotlari\n\n**Dasturchi:** @elyorka22\n**Versiya:** 1.0.0',
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🔙 Orqaga',
                    callback_data: 'back_to_main'
                  }
                ]
              ]
            }
          })
        });
        break;

      case 'profile':
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: `👤 **Profil**\n\n**Foydalanuvchi ma\'lumotlari:**\n\n👤 **Ism:** ${from.first_name || 'Aniqlanmagan'}\n📝 **Username:** ${from.username ? '@' + from.username : 'Yo\'q'}\n🆔 **ID:** \`${from.id}\`\n🌍 **Til:** ${from.language_code || 'Aniqlanmagan'}\n\n**Siz oddiy foydalanuvchisiz.**\nE\'lon qo\'shish uchun administrator bilan bog\'laning.`,
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🔙 Orqaga',
                    callback_data: 'back_to_main'
                  }
                ]
              ]
            }
          })
        });
        break;

      case 'contact':
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: '📞 **Aloqa**\n\n**Biz bilan bog\'lanish:**\n\n👨‍💻 **Dasturchi:** @elyorka22\n📧 **Email:** elyorka22@gmail.com\n🌐 **Website:** https://chust-seven.vercel.app\n\n**Qo\'llab-quvvatlash:**\nAgar savollaringiz bo\'lsa, dasturchi bilan bog\'laning.',
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🔙 Orqaga',
                    callback_data: 'back_to_main'
                  }
                ]
              ]
            }
          })
        });
        break;

      case 'help':
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: '❓ **Yordam**\n\n**Bot qanday ishlaydi:**\n\n1️⃣ **Xaritani ochish** - ko\'chmas mulk e\'lonlarini ko\'rish\n2️⃣ **E\'lon qo\'shish** - yangi e\'lon yaratish\n3️⃣ **Kategoriyalar** - ijara yoki sotish bo\'yicha filtrlash\n4️⃣ **Batafsil ma\'lumot** - e\'lon haqida to\'liq ma\'lumot\n\n**Buyruqlar:**\n/start - asosiy menyu\n/help - yordam\n\n**Muammo bo\'lsa:** @elyorka22 bilan bog\'laning.',
            parse_mode: 'Markdown',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🔙 Orqaga',
                    callback_data: 'back_to_main'
                  }
                ]
              ]
            }
          })
        });
        break;

      case 'back_to_main':
        await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: message.chat.id,
            message_id: message.message_id,
            text: '🏠 Chust shahri ko\'chmas mulk ilovasiga xush kelibsiz!\n\nBu yerda Chust shahridagi ijara va sotish e\'lonlarini topishingiz mumkin.',
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: '🗺️ Xarita',
                    web_app: { url: 'https://chust-seven.vercel.app' }
                  },
                  {
                    text: '📝 E\'lon qo\'shish',
                    web_app: { url: 'https://chust-seven.vercel.app/add' }
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
        break;

      default:
        console.log('Unknown callback data:', data);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing Telegram callback:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Telegram callback endpoint' });
} 