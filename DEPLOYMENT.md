# 🚀 Инструкции по деплою

## 📋 Предварительные требования

1. **GitHub аккаунт** - для хранения кода
2. **Vercel аккаунт** - для деплоя
3. **Supabase аккаунт** - для базы данных
4. **Telegram Bot** - уже настроен

## 🔧 Настройка Supabase

### 1. Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите "New Project"
3. Выберите организацию или создайте новую
4. Введите название проекта: `chust-real-estate`
5. Введите пароль для базы данных
6. Выберите регион (ближайший к Узбекистану)
7. Нажмите "Create new project"

### 2. Настройка базы данных

1. В проекте Supabase перейдите в **SQL Editor**
2. Скопируйте содержимое файла `supabase/migrations/001_initial_schema.sql`
3. Вставьте в SQL Editor и нажмите "Run"

### 3. Получение ключей API

1. Перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** (например: `https://your-project.supabase.co`)
   - **anon public** ключ

## 🚀 Деплой на Vercel

### 1. Подготовка репозитория

1. Создайте репозиторий на GitHub
2. Загрузите код в репозиторий:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/chust-real-estate.git
git push -u origin main
```

### 2. Деплой на Vercel

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Подключите ваш GitHub репозиторий
4. Нажмите "Import"

### 3. Настройка переменных окружения

В настройках проекта Vercel добавьте переменные окружения:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0
TELEGRAM_WEBAPP_URL=https://your-project.vercel.app
```

### 4. Настройка домена

1. В настройках Vercel перейдите в **Domains**
2. Добавьте ваш домен или используйте `.vercel.app` домен
3. Скопируйте URL для настройки Telegram Bot

## 🤖 Настройка Telegram Bot

### 1. Настройка Webhook

1. Откройте браузер и перейдите по ссылке:
```
https://api.telegram.org/bot7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0/setWebhook?url=https://your-project.vercel.app/api/telegram/webhook
```

2. Замените `your-project.vercel.app` на ваш домен

### 2. Настройка Web App

1. Откройте браузер и перейдите по ссылке:
```
https://api.telegram.org/bot7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0/setChatMenuButton
```

2. Отправьте POST запрос с телом:
```json
{
  "menu_button": {
    "type": "web_app",
    "text": "🗺️ Карта недвижимости",
    "web_app": {
      "url": "https://your-project.vercel.app"
    }
  }
}
```

## 🧪 Тестирование

### 1. Тест веб-приложения

1. Откройте ваш домен в браузере
2. Проверьте, что карта загружается
3. Проверьте переключатель тем
4. Проверьте фильтрацию по категориям

### 2. Тест Telegram Bot

1. Найдите вашего бота в Telegram
2. Отправьте `/start`
3. Проверьте, что появляется кнопка "Открыть карту недвижимости"
4. Нажмите на кнопку и проверьте, что открывается веб-приложение

## 🔧 Локальная разработка

### 1. Настройка переменных окружения

Создайте файл `.env.local`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=7648916394:AAHgHed2H1J3qpK01RCujmEhNlzbkQty1F0
TELEGRAM_WEBAPP_URL=http://localhost:3000
```

### 2. Запуск локально

```bash
npm install
npm run dev
```

### 3. Тест локального webhook

Используйте ngrok для тестирования webhook:

```bash
npx ngrok http 3000
```

Затем настройте webhook на ngrok URL.

## 📊 Мониторинг

### 1. Vercel Analytics

1. В настройках Vercel включите Analytics
2. Отслеживайте производительность и ошибки

### 2. Supabase Monitoring

1. В Supabase перейдите в **Logs**
2. Отслеживайте запросы к базе данных
3. Проверяйте ошибки

### 3. Telegram Bot Logs

1. Проверяйте логи в Vercel Functions
2. Отслеживайте webhook запросы

## 🔒 Безопасность

### 1. Row Level Security (RLS)

RLS уже настроен в миграции. Проверьте политики в Supabase:

1. Перейдите в **Authentication** → **Policies**
2. Убедитесь, что политики активны

### 2. CORS

CORS настроен в `vercel.json`. Проверьте заголовки в браузере.

### 3. Rate Limiting

Добавьте rate limiting для API маршрутов при необходимости.

## 🚨 Устранение неполадок

### Проблема: Карта не загружается
- Проверьте переменные окружения
- Проверьте консоль браузера на ошибки
- Убедитесь, что Leaflet загружается

### Проблема: Telegram Bot не отвечает
- Проверьте webhook URL
- Проверьте логи в Vercel Functions
- Убедитесь, что токен бота правильный

### Проблема: База данных не работает
- Проверьте Supabase URL и ключ
- Проверьте миграции
- Проверьте RLS политики

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи в Vercel
2. Проверьте логи в Supabase
3. Проверьте консоль браузера
4. Обратитесь к документации

---

**Удачного деплоя! 🚀** 