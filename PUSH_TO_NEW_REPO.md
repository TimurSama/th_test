# Инструкция по отправке в новый репозиторий

## Текущая ситуация

Remote изменен на: `https://github.com/Unclekentuki/th_demo.git`

## Проблема с доступом

Если при `git push` возникает ошибка 403, нужно настроить аутентификацию.

## Решение

### Вариант 1: Использовать Personal Access Token

1. Создайте токен на GitHub:
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Выберите scope: `repo`
   - Скопируйте токен

2. Используйте токен для push:
```bash
git remote set-url origin https://<ВАШ_ТОКЕН>@github.com/Unclekentuki/th_demo.git
git push -u origin main
```

### Вариант 2: Использовать SSH

1. Настройте SSH ключ (если еще не настроен):
```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

2. Добавьте ключ в GitHub:
   - Скопируйте содержимое `~/.ssh/id_rsa.pub`
   - GitHub → Settings → SSH and GPG keys → New SSH key

3. Используйте SSH URL:
```bash
git remote set-url origin git@github.com:Unclekentuki/th_demo.git
git push -u origin main
```

### Вариант 3: Через GitHub Desktop или веб-интерфейс

1. Откройте репозиторий: https://github.com/Unclekentuki/th_demo
2. Если репозиторий пустой, GitHub покажет инструкции
3. Следуйте инструкциям для первого push

## После успешного push

1. Обновите секрет `TELEGRAM_BOT_TOKEN` в новом репозитории:
   - https://github.com/Unclekentuki/th_demo/settings/secrets/actions
   - Добавьте секрет: `8591869020:AAFnlsirUwd3TKMibAWDE209OBwVU40ZEjo`

2. Проверьте GitHub Actions:
   - https://github.com/Unclekentuki/th_demo/actions
   - Запустите workflow вручную для проверки

