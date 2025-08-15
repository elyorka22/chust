const TelegramBot = require('node-telegram-bot-api');

// Токен бота
const token = '7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0';

// Создаем бота
const bot = new TelegramBot(token, { polling: true });

console.log('Bot started...');

// Устанавливаем команды бота
bot.setMyCommands([
  { command: '/start', description: 'Boshlash' },
  { command: '/menu', description: 'Bosh menyu' },
  { command: '/help', description: 'Yordam' },
  { command: '/profile', description: 'Profil' },
  { command: '/listings', description: 'E\'lonlarni ko\'rish' },
  { command: '/add', description: 'E\'lon qo\'shish' }
]);

// Команда /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  console.log('Received /start command from:', chatId);
  
  const message = `👋 Xush kelibs! Chust Real Estate botiga xush kelibsiz!

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

  console.log('Sending message with keyboard...');
  
  bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  }).then(() => {
    console.log('Message sent successfully');
  }).catch((error) => {
    console.error('Error sending message:', error);
  });
});

// Команда /menu
bot.onText(/\/menu/, (msg) => {
  const chatId = msg.chat.id;
  showMainMenu(chatId);
});

// Команда /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  showHelp(chatId);
});

// Команда /profile
bot.onText(/\/profile/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  showProfile(chatId, userId);
});

// Команда /listings (только для зарегистрированных)
bot.onText(/\/listings/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Проверяем регистрацию (пока всегда false для демо)
  const isRegistered = false; // Здесь будет проверка из базы данных
  
  if (isRegistered) {
    showListings(chatId);
  } else {
    bot.sendMessage(chatId, '❌ Bu buyruq faqat ro\'yxatdan o\'tgan foydalanuvchilar uchun mavjud.');
  }
});

// Команда /add (только для зарегистрированных)
bot.onText(/\/add/, (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  
  // Проверяем регистрацию (пока всегда false для демо)
  const isRegistered = false; // Здесь будет проверка из базы данных
  
  if (isRegistered) {
    showAddListing(chatId);
  } else {
    bot.sendMessage(chatId, '❌ Bu buyruq faqat ro\'yxatdan o\'tgan foydalanuvchilar uchun mavjud.\n\nRo\'yxatdan o\'tish uchun /start buyrug\'ini bosing.');
  }
});

// Обработка кнопок
bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  switch (data) {
    case 'user_mode':
      showUserMenu(chatId);
      break;
      
    case 'add_listing':
      showRegistrationPrompt(chatId);
      break;
      
    case 'bot_info':
      showBotInfo(chatId);
      break;
      
    case 'profile':
      showProfile(chatId, query.from.id);
      break;
      
    case 'back_to_main':
      showMainMenu(chatId);
      break;
      
    default:
      bot.sendMessage(chatId, '❌ Noma\'lum buyruq');
  }

  bot.answerCallbackQuery(query.id);
});

// Меню обычного пользователя
function showUserMenu(chatId) {
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

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Запрос регистрации
function showRegistrationPrompt(chatId) {
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

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Информация о боте
function showBotInfo(chatId) {
  const message = `ℹ️ Bot haqida

🏠 Chust Real Estate Bot
📍 Chust shahri ko'chmas mulk e'lonlari

Bu bot orqali siz:
• Ko'chmas mulk e'lonlarini ko'rishingiz
• O'zingizning e'lonlaringizni joylashtirishingiz
• Boshqa foydalanuvchilar bilan bog'lanishingiz mumkin

📞 Aloqa: @admin_username`;

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

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Профиль пользователя
function showProfile(chatId, userId) {
  const message = `👤 Profil ma'lumotlari

📱 Telegram ID: ${userId}
📅 Holat: Ro'yxatdan o'tilmagan

Ro'yxatdan o'tish uchun "E'lon joylash" tugmasini bosing.`;

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

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Главное меню
function showMainMenu(chatId) {
  const message = `👋 Xush kelibs! Chust Real Estate botiga xush kelibsiz!

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

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Помощь
function showHelp(chatId) {
  const message = `🆘 Yordam

📋 Mavjud buyruqlar:

/start - Botni boshlash
/menu - Bosh menyu
/help - Yordam
/profile - Profil ma'lumotlari

👤 Ro'yxatdan o'tgan foydalanuvchilar uchun:
/listings - E'lonlarni ko'rish
/add - E'lon qo'shish

❓ Savollaringiz bo'lsa, @admin_username ga murojaat qiling.`;

  bot.sendMessage(chatId, message);
}

// Показать объявления
function showListings(chatId) {
  const message = `🏠 E'lonlarni ko'rish

Hozircha e'lonlar mavjud emas.

E'lon qo'shish uchun /add buyrug\'ini bosing.`;

  bot.sendMessage(chatId, message);
}

// Добавить объявление
function showAddListing(chatId) {
  const message = `📝 E'lon qo'shish

E'lon qo'shish uchun veb-ilovani oching:

🌐 https://your-domain.com/add

Yoki bosh menyuga qayting va "E'lon joylash" tugmasini bosing.`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🔙 Bosh menyuga qaytish',
          callback_data: 'back_to_main'
        }
      ]
    ]
  };

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Обработка ошибок
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
}); 