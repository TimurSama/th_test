# Запуск бота TokenHunter

## Проблема: Бот не отвечает в Telegram

Если бот молчит, значит он не запущен. Нужно запустить его локально.

## Быстрый запуск

### Шаг 1: Установите зависимости

```bash
python -m pip install -r requirements.txt
```

### Шаг 2: Проверьте .env файл

Убедитесь, что файл `.env` существует и содержит правильный токен:

```bash
# Токен должен быть в .env файле
TELEGRAM_BOT_TOKEN=8591869020:AAFnlsirUwd3TKMibAWDE209OBwVU40ZEjo
```

Если файла нет, создайте его:
```bash
python scripts/setup_env.py
```

### Шаг 3: Инициализируйте базу данных (первый раз)

```bash
python -c "import asyncio; from database import Database; from config import DATABASE_PATH; asyncio.run(Database(DATABASE_PATH).init_db())"
```

Или просто запустите бота - база создастся автоматически.

### Шаг 4: Запустите бота

```bash
python main.py
```

Бот должен запуститься и показать:
```
INFO - Bot starting...
```

## Проверка работы

1. Откройте Telegram
2. Найдите вашего бота
3. Отправьте команду `/start`
4. Бот должен ответить приветственным сообщением

## Если бот не запускается

### Ошибка: ModuleNotFoundError

Установите зависимости:
```bash
python -m pip install -r requirements.txt
```

### Ошибка: Invalid token

Проверьте токен в `.env` файле:
- Токен должен начинаться с `8591869020:`
- Длина токена должна быть около 46 символов

### Ошибка: Database error

Убедитесь, что папка `data/` существует и доступна для записи:
```bash
mkdir -p data
```

## Запуск в фоне (Windows)

Используйте PowerShell:
```powershell
Start-Process python -ArgumentList "main.py" -WindowStyle Hidden
```

Или создайте `.bat` файл:
```batch
@echo off
python main.py
pause
```

## Запуск на сервере

См. инструкцию в `DEPLOYMENT.md` для запуска на сервере через systemd или Docker.

## Troubleshooting

### Бот запущен, но не отвечает?

1. Проверьте логи - должны быть сообщения о получении обновлений
2. Убедитесь, что используете правильного бота в Telegram
3. Проверьте, что токен правильный

### Как проверить, что бот работает?

В логах должны быть строки типа:
```
INFO - Bot started successfully
INFO - Received update: ...
```

Если таких строк нет - бот не получает обновления от Telegram.

