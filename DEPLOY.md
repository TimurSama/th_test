# Деплой TokenHunter

## Быстрый деплой

1. Создайте Personal Access Token на GitHub
2. Выполните:
```bash
git remote set-url origin https://<ТОКЕН>@github.com/Unclekentuki/th_demo.git
git push -u origin main
```

3. Добавьте секрет `TELEGRAM_BOT_TOKEN` в GitHub Secrets
4. Запустите бота на сервере: `python main.py`

## Запуск бота

### Локально
```bash
pip install -r requirements.txt
python main.py
```

### На сервере
Используйте systemd, Docker или облачные платформы (Railway, Render, Heroku)

## GitHub Actions

Автоматически собирает данные рынка каждый час. Требует секрет `TELEGRAM_BOT_TOKEN`.

