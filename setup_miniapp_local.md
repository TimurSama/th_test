# Локальный запуск Mini App

## Быстрый старт

### Вариант 1: С ngrok (рекомендуется)

1. **Установите ngrok:**
   - Скачайте с https://ngrok.com/download
   - Или через chocolatey: `choco install ngrok`

2. **Запустите Mini App:**
   ```bash
   python run_webapp.py
   ```
   Или используйте: `start_miniapp.bat`

3. **В другом терминале запустите ngrok:**
   ```bash
   ngrok http 5000
   ```

4. **Настройте URL в BotFather:**
   - Скопируйте HTTPS URL из ngrok (например: `https://abc123.ngrok.io`)
   - Откройте @BotFather в Telegram
   - Отправьте: `/mybots` → выберите бота → "Bot Settings" → "Menu Button"
   - Установите URL: `https://abc123.ngrok.io`

### Вариант 2: С localtunnel (без установки)

1. **Запустите Mini App:**
   ```bash
   python run_webapp.py
   ```

2. **В другом терминале запустите localtunnel:**
   ```bash
   npx localtunnel --port 5000
   ```

3. **Настройте URL в BotFather** (как в варианте 1)

### Вариант 3: С Cloudflare Tunnel

1. **Установите cloudflared:**
   ```bash
   choco install cloudflared
   ```

2. **Запустите Mini App и туннель:**
   ```bash
   python run_webapp.py
   cloudflared tunnel --url http://localhost:5000
   ```

## Проверка работы

1. ✅ Запустите бота: `python main.py`
2. ✅ Запустите webapp: `python run_webapp.py`
3. ✅ Запустите туннель (ngrok/localtunnel/cloudflared)
4. ✅ Настройте URL в BotFather
5. ✅ Откройте бота в Telegram и нажмите кнопку "Application"

## Важно

- Mini App должен быть доступен по HTTPS (не HTTP)
- URL должен быть публично доступен
- После перезапуска ngrok URL изменится - нужно обновить в BotFather

