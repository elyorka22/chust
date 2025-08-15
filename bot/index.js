const TelegramBot = require('node-telegram-bot-api');

// Токен бота
const token = '7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0';

// URL веб-приложения
const WEBAPP_URL = 'http://localhost:3000';

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

// Автоматическая регистрация пользователя
async function registerUser(userData) {
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

// Команда /start - автоматическая регистрация
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  
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
bot.onText(/\/menu/, async (msg) => {
  const chatId = msg.chat.id;
  await showMainMenu(chatId);
});

// Команда /help
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  showHelp(chatId);
});

// Команда /profile
bot.onText(/\/profile/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  await showProfile(chatId, userId);
});

// Команда /listings
bot.onText(/\/listings/, async (msg) => {
  const chatId = msg.chat.id;
  await showListings(chatId);
});

// Команда /add
bot.onText(/\/add/, async (msg) => {
  const chatId = msg.chat.id;
  await showAddListing(chatId);
});

// Обработка кнопок
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const userId = query.from.id;
  const data = query.data;

  try {
    switch (data) {
      case 'view_listings':
        await openWebApp(chatId, '/map');
        break;
        
      case 'add_listing':
        await openWebApp(chatId, '/add');
        break;
        
      case 'bot_info':
        await showBotInfo(chatId);
        break;
        
      case 'profile':
        await showProfile(chatId, userId);
        break;
        
      case 'back_to_main':
        await showMainMenu(chatId);
        break;
        
      default:
        bot.sendMessage(chatId, '❌ Noma\'lum buyruq');
    }

    bot.answerCallbackQuery(query.id);
  } catch (error) {
    console.error('Error handling callback:', error);
    bot.sendMessage(chatId, '❌ Xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
  }
});

// Главное меню
async function showMainMenu(chatId) {
  const message = `👋 Xush kelibs! Chust Real Estate botiga xush kelibsiz!

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

  bot.sendMessage(chatId, message, {
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

📞 Aloqa: @admin_username`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🔙 Orqaga qaytish',
          callback_data: 'back_to_main'
        }
      ]
    ]
  };

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Профиль пользователя
async function showProfile(chatId, userId) {
  const message = `👤 Profil ma'lumotlari

📱 Telegram ID: ${userId}
✅ Holat: Ro'yxatdan o'tgan

Siz avtomatik ravishda ro'yxatdan o'tgansiz va e'lonlar qo'shishingiz mumkin.`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🔙 Orqaga qaytish',
          callback_data: 'back_to_main'
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

/start - Botni boshlash va ro'yxatdan o'tish
/menu - Bosh menyu
/help - Yordam
/profile - Profil ma'lumotlari
/listings - E'lonlarni ko'rish
/add - E'lon qo'shish

✅ Barcha foydalanuvchilar e'lonlar qo'shishi mumkin!

❓ Savollaringiz bo'lsa, @admin_username ga murojaat qiling.`;

  bot.sendMessage(chatId, message);
}

// Показать объявления
async function showListings(chatId) {
  const message = `🏠 E'lonlarni ko'rish

E'lonlarni ko'rish uchun veb-ilovani oching:`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🌐 E\'lonlarni ko\'rish',
          web_app: { url: `${WEBAPP_URL}/map` }
        }
      ],
      [
        {
          text: '🔙 Orqaga qaytish',
          callback_data: 'back_to_main'
        }
      ]
    ]
  };

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Добавить объявление
async function showAddListing(chatId) {
  const message = `📝 E'lon qo'shish

E'lon qo'shish uchun veb-ilovani oching:`;

  const keyboard = {
    inline_keyboard: [
      [
        {
          text: '🌐 E\'lon qo\'shish',
          web_app: { url: `${WEBAPP_URL}/add` }
        }
      ],
      [
        {
          text: '🔙 Orqaga qaytish',
          callback_data: 'back_to_main'
        }
      ]
    ]
  };

  bot.sendMessage(chatId, message, {
    reply_markup: keyboard
  });
}

// Открыть веб-приложение
async function openWebApp(chatId, url) {
  const webAppUrl = `${WEBAPP_URL}${url}`;
  bot.sendMessage(chatId, `🌐 Sizni ${webAppUrl} saytiga yo'naltiramiz.`, {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Web-saytga o\'tish',
            web_app: { url: webAppUrl }
          }
        ]
      ]
    }
  });
}

// Обработка ошибок
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
}); 