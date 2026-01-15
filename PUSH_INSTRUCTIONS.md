# Инструкция по отправке кода в Unclekentuki/th_demo

## Проблема

Git пытается использовать учетные данные от `TimurSama`, но репозиторий принадлежит `Unclekentuki`.

## Решение: Использовать Personal Access Token

### Шаг 1: Создайте токен

1. Войдите в GitHub под аккаунтом **Unclekentuki**
2. Откройте: https://github.com/settings/tokens
3. Нажмите **Generate new token** → **Generate new token (classic)**
4. Название: `TokenHunter Deploy`
5. Выберите scope: **repo** (полный доступ к репозиториям)
6. Нажмите **Generate token**
7. ⚠️ **ВАЖНО**: Скопируйте токен сразу (показан только один раз!)

### Шаг 2: Используйте токен для push

Выполните команду (замените `<ВАШ_ТОКЕН>` на реальный токен):

```bash
git remote set-url origin https://<ВАШ_ТОКЕН>@github.com/Unclekentuki/th_demo.git
git push -u origin main
```

**Пример:**
```bash
git remote set-url origin https://ghp_xxxxxxxxxxxxxxxxxxxx@github.com/Unclekentuki/th_demo.git
git push -u origin main
```

## Альтернатива: Через GitHub веб-интерфейс

Если не хотите использовать токен, можно загрузить код через веб-интерфейс:

1. Откройте: https://github.com/Unclekentuki/th_demo
2. GitHub покажет инструкции для первого push
3. Или используйте GitHub Desktop

## После успешного push

1. **Добавьте секрет для GitHub Actions:**
   - https://github.com/Unclekentuki/th_demo/settings/secrets/actions
   - New repository secret
   - Name: `TELEGRAM_BOT_TOKEN`
   - Value: `8591869020:AAFnlsirUwd3TKMibAWDE209OBwVU40ZEjo`

2. **Проверьте GitHub Actions:**
   - https://github.com/Unclekentuki/th_demo/actions
   - Запустите workflow вручную

## Текущий статус

- ✅ Remote настроен: `https://github.com/Unclekentuki/th_demo.git`
- ✅ 3 коммита готовы к отправке
- ⏳ Ожидается push (нужна аутентификация)

