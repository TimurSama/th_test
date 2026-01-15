# Деплой Mini App через GitHub

## Вариант 1: GitHub Pages (статический фронтенд)

GitHub Pages поддерживает только статические файлы. Для Mini App нужен бэкенд API.

## Вариант 2: Vercel (рекомендуется)

1. Установите Vercel CLI: `npm i -g vercel`
2. В корне проекта: `vercel`
3. Настройте `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "webapp/app.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "webapp/app.py"
    }
  ]
}
```

## Вариант 3: Railway

1. Создайте аккаунт на railway.app
2. Подключите GitHub репозиторий
3. Railway автоматически определит Python проект
4. Установите переменные окружения
5. Деплой автоматический

## Вариант 4: Render

1. Создайте аккаунт на render.com
2. New → Web Service
3. Подключите GitHub репозиторий
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `python run_webapp.py`
6. Установите переменные окружения

## Настройка URL в BotFather

После деплоя:
1. Скопируйте URL вашего приложения
2. Откройте @BotFather
3. `/mybots` → выберите бота → "Bot Settings" → "Menu Button"
4. Вставьте URL

## Локальный тест

```bash
python run_webapp.py
```

Откройте http://localhost:5000

