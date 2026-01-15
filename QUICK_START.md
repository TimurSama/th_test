# TokenHunter - Быстрый старт

## Бот перезапущен ✅

Бот работает с новыми функциями:
- ✅ Автоматическая проверка цен каждую минуту
- ✅ Отправка уведомлений по уровню подписки
- ✅ Оплата через Telegram Stars, Wallet и USDT
- ✅ Сравнение цен на 8 биржах

## Mini App на GitHub ✅

Код загружен в: https://github.com/TimurSama/th_test

### Следующие шаги для Mini App:

1. **Включить GitHub Pages:**
   - Откройте https://github.com/TimurSama/th_test/settings/pages
   - Source: "GitHub Actions"
   - Сохраните

2. **Настроить API сервер:**
   - Mini App на GitHub Pages - статический сайт
   - Нужен отдельный API сервер (Railway, Render, Vercel)
   - После получения URL API, обновите `webapp/static/config.js`

3. **Подключить в BotFather:**
   - URL будет: `https://timursama.github.io/th_test/`
   - @BotFather → /mybots → Bot Settings → Menu Button
   - Вставьте URL

## Проверка работы

- Бот: отправьте `/start` в Telegram
- Mini App: откройте через кнопку "Application" в боте

