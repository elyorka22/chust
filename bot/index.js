const TelegramBot = require('node-telegram-bot-api');

// ВАЖНО: Замените на ваш токен бота от @BotFather
const token = '7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0';

// URL вашего веб-приложения (замените на ваш домен)
const WEBAPP_URL = 'http://localhost:3000'; // Для разработки

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Состояния пользователей
const userStates = new Map();

// Команда /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Сбрасываем состояние пользователя
  userStates.set(userId, 'main_menu');
  
  const welcomeMessage = `👋 Xush kelibs! Chust Real Estate botiga xush kelibsiz!

Bu bot orqali siz:
🏠 Ko'chmas mulk e'lonlarini ko'rishingiz
📝 O'zingizning e'lonlaringizni joylashtirishingiz mumkin

Qanday foydalanmoqchisiz?`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '👤 Oddiy foydalanuvchi',
          callback_data: 'user_mode'
        }
      ],
      [
        {
          text: '📝 E\'lon joylash',
          callback_data: 'add_listing'
        }
      ]
    ]
  };

  await bot.sendMessage(chatId, welcomeMessage, {
    reply_markup: keyboard
  });
});

// Обработка callback запросов
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  try {
    // Проверяем, зарегистрирован ли пользователь
    const isRegistered = await checkUserRegistration(userId);

    switch (data) {
      case 'user_mode':
        if (isRegistered) {
          await showRegisteredUserMenu(chatId);
        } else {
          await showUnregisteredUserMenu(chatId);
        }
        break;

      case 'add_listing':
        if (isRegistered) {
          await showRegisteredUserMenu(chatId);
        } else {
          await showRegistrationPrompt(chatId);
        }
        break;

      case 'bot_info':
        await showBotInfo(chatId);
        break;

      case 'profile':
        await showProfile(chatId, userId);
        break;

      case 'add_listing_registered':
        await openWebApp(chatId, '/add');
        break;

      case 'register':
        await openWebApp(chatId, '/register');
        break;

      case 'view_listings':
        await openWebApp(chatId, '/map');
        break;

      default:
        await bot.sendMessage(chatId, '❌ Noma\'lum buyruq');
    }

    // Отвечаем на callback query
    await bot.answerCallbackQuery(query.id);

  } catch (error) {
    console.error('Error handling callback:', error);
    await bot.sendMessage(chatId, '❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

// Проверка регистрации пользователя
async function checkUserRegistration(telegramId) {
  try {
    const response = await fetch(`${WEBAPP_URL}/api/auth/me?telegram_id=${telegramId}`);
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error checking user registration:', error);
    return false;
  }
}

// Меню для незарегистрированных пользователей
async function showUnregisteredUserMenu(chatId) {
  const message = `👤 Oddiy foydalanuvchi rejimi

Siz hozircha ro'yxatdan o'tmagansiz. Quyidagi imkoniyatlar mavjud:`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: 'ℹ️ Bot haqida',
          callback_data: 'bot_info'
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
          text: '🔙 Bosh menyuga qaytish',
          callback_data: 'back_to_main'
        }
      ]
    ]
  };

  await bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Меню для зарегистрированных пользователей
async function showRegisteredUserMenu(chatId) {
  const message = `✅ Ro'yxatdan o'tgan foydalanuvchi

Siz muvaffaqiyatli ro'yxatdan o'tgansiz! Quyidagi imkoniyatlar mavjud:`;

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
          text: '📝 E\'lon joylash',
          callback_data: 'add_listing_registered'
        }
      ],
      [
        {
          text: 'ℹ️ Bot haqida',
          callback_data: 'bot_info'
        }
      ],
      [
        {
          text: '👤 Profil',
          callback_data: 'profile'
        }
      ]
    ]
  };

  await bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Запрос на регистрацию
async function showRegistrationPrompt(chatId) {
  const message = `📝 E'lon joylash uchun ro'yxatdan o'tish kerak

E'lon joylash uchun avval ro'yxatdan o'tishingiz kerak.`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '✅ Ro\'yxatdan o\'tish',
          callback_data: 'register'
        }
      ],
      [
        {
          text: '🔙 Bosh menyuga qaytish',
          callback_data: 'back_to_main'
        }
      ]
    ]
  };

  await bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Информация о боте
async function showBotInfo(chatId) {
  const message = `ℹ️ Bot haqida

🏠 Chust Real Estate Bot
📍 Chust shahri ko'chmas mulk e'lonlari

Bu bot orqali siz:
• Ko'chmas mulk e'lonlarini ko'rishingiz
• O'zingizning e'lonlaringizni joylashtirishingiz
• Boshqa foydalanuvchilar bilan bog'lanishingiz mumkin

📞 Aloqa: @admin_username
🌐 Veb-sayt: ${WEBAPP_URL}`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🔙 Orqaga qaytish',
          callback_data: 'back_to_menu'
        }
      ]
    ]
  };

  await bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Профиль пользователя
async function showProfile(chatId, userId) {
  try {
    const response = await fetch(`${WEBAPP_URL}/api/auth/me?telegram_id=${userId}`);
    const data = await response.json();

    if (data.success) {
      const user = data.user;
      const message = `👤 Profil ma'lumotlari

📝 Ism: ${user.first_name}
${user.last_name ? `📝 Familiya: ${user.last_name}\n` : ''}
${user.username ? `🔗 Username: @${user.username}\n` : ''}
📱 Telegram ID: ${user.telegram_id}
📅 Ro'yxatdan o'tgan: ${new Date(user.created_at).toLocaleDateString('uz-UZ')}
✅ Holat: ${user.is_verified ? 'Tasdiqlangan' : 'Tasdiqlanmagan'}`;

      const keyboard = {
        inline_keyboard: [
          [
            {
              text: '🔙 Orqaga qaytish',
              callback_data: 'back_to_menu'
            }
          ]
        ]
      };

      await bot.sendMessage(chatId, message, {
        reply_markup: keyboard
      });
    } else {
      await bot.sendMessage(chatId, '❌ Profil ma\'lumotlari topilmadi. Iltimos, ro\'yxatdan o\'ting.');
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    await bot.sendMessage(chatId, '❌ Profil ma\'lumotlarini yuklashda xatolik yuz berdi.');
  }
}

// Открытие веб-приложения
async function openWebApp(chatId, path) {
  const webAppUrl = `${WEBAPP_URL}${path}`;
  
  const message = `🌐 Veb-ilovani ochish

Quyidagi tugmani bosing va veb-ilovani oching:`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🌐 Veb-ilovani ochish',
          web_app: { url: webAppUrl }
        }
      ],
      [
        {
          text: '🔙 Orqaga qaytish',
          callback_data: 'back_to_menu'
        }
      ]
    ]
  };

  await bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Обработка возврата в главное меню
bot.onText(/\/menu/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  const isRegistered = await checkUserRegistration(userId);
  
  if (isRegistered) {
    await showRegisteredUserMenu(chatId);
  } else {
    await showUnregisteredUserMenu(chatId);
  }
});

// Обработка ошибок
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});

console.log('Bot is running...');

module.exports = bot; 