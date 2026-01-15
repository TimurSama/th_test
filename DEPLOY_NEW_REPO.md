# Деплой в новый репозиторий Unclekentuki/th_demo

## ✅ Что уже сделано

1. ✅ Remote изменен на: `https://github.com/Unclekentuki/th_demo.git`
2. ✅ Все ссылки в документации обновлены
3. ✅ Коммиты готовы к отправке

## 🚀 Как отправить код

### Способ 1: Через GitHub веб-интерфейс (самый простой)

1. Откройте репозиторий: https://github.com/Unclekentuki/th_demo
2. Если репозиторий пустой, GitHub покажет инструкции
3. Выполните команды (GitHub покажет их):

```bash
git remote add origin https://github.com/Unclekentuki/th_demo.git
git branch -M main
git push -u origin main
```

**Но у вас уже настроен remote**, поэтому просто:
```bash
git push -u origin main
```

### Способ 2: Использовать Personal Access Token

1. Создайте токен:
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Scope: `repo` (полный доступ)
   - Скопируйте токен

2. Используйте токен:
```bash
git remote set-url origin https://<ВАШ_ТОКЕН>@github.com/Unclekentuki/th_demo.git
git push -u origin main
```

### Способ 3: GitHub Desktop

1. Откройте GitHub Desktop
2. File → Clone repository
3. URL: `https://github.com/Unclekentuki/th_demo.git`
4. Выберите локальную папку проекта
5. Нажмите Publish repository

## 📋 После успешного push

### 1. Добавьте секрет для GitHub Actions

1. Откройте: https://github.com/Unclekentuki/th_demo/settings/secrets/actions
2. New repository secret
3. Name: `TELEGRAM_BOT_TOKEN`
4. Value: `8591869020:AAFnlsirUwd3TKMibAWDE209OBwVU40ZEjo`
5. Add secret

### 2. Проверьте GitHub Actions

1. Откройте: https://github.com/Unclekentuki/th_demo/actions
2. Запустите workflow вручную: **Collect Market Data** → **Run workflow**

## ✅ Текущий статус

- ✅ Код готов
- ✅ Remote настроен
- ⏳ Ожидается push (нужна аутентификация)

## 🔧 Если возникают проблемы

См. файл `PUSH_TO_NEW_REPO.md` для подробных инструкций по решению проблем с доступом.

