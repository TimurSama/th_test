# Настройка Mini App на GitHub Pages

## Что сделано:

1. ✅ Создана статическая версия Mini App в `webapp/static/`
2. ✅ Настроен GitHub Actions workflow для деплоя на GitHub Pages
3. ✅ Код загружен в репозиторий https://github.com/TimurSama/th_test

## Следующие шаги:

### 1. Включить GitHub Pages

1. Откройте https://github.com/TimurSama/th_test
2. Settings → Pages
3. Source: "GitHub Actions"
4. Сохраните

### 2. Настроить API сервер

Mini App на GitHub Pages - это статический сайт. Нужен отдельный API сервер.

**Варианты:**

#### A. Railway (рекомендуется)
1. Создайте аккаунт на railway.app
2. New Project → Deploy from GitHub
3. Выберите репозиторий th_test
4. Установите переменные окружения
5. Railway автоматически определит Python проект
6. Скопируйте URL (например: `https://tokenhunter-api.railway.app`)

#### B. Render
1. Создайте аккаунт на render.com
2. New → Web Service
3. Подключите GitHub репозиторий
4. Build: `pip install -r requirements.txt`
5. Start: `python run_webapp.py`
6. Скопируйте URL

#### C. Vercel
1. Установите Vercel CLI: `npm i -g vercel`
2. Создайте `vercel.json`:
```json
{
  "version": 2,
  "builds": [{"src": "webapp/app.py", "use": "@vercel/python"}],
  "routes": [{"src": "/(.*)", "dest": "webapp/app.py"}]
}
```
3. Запустите: `vercel`
4. Скопируйте URL

### 3. Обновить API URL

После получения URL API сервера:

1. Откройте `webapp/static/config.js`
2. Замените `'https://your-api-server.com'` на ваш URL
3. Закоммитьте и запушьте:
```bash
git add webapp/static/config.js
git commit -m "Update API URL"
git push
```

### 4. Настроить в BotFather

1. Дождитесь деплоя GitHub Pages (обычно 1-2 минуты)
2. URL будет: `https://timursama.github.io/th_test/`
3. Откройте @BotFather
4. `/mybots` → выберите бота → "Bot Settings" → "Menu Button"
5. Вставьте URL: `https://timursama.github.io/th_test/`

## Проверка

1. Откройте https://timursama.github.io/th_test/
2. Mini App должен загрузиться
3. Проверьте работу API (должен быть доступен ваш API сервер)

## Важно

- GitHub Pages работает только со статическими файлами
- API должен быть на отдельном сервере (Railway, Render, Vercel)
- Обновите `config.js` с правильным API URL
- Убедитесь, что API сервер имеет CORS настроен для GitHub Pages домена

