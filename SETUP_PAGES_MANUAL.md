# Ручная настройка GitHub Pages

## Ошибка:
```
Error: Resource not accessible by integration
```

Это означает, что GitHub Actions не может автоматически включить Pages. Нужно включить вручную.

## Решение:

### Шаг 1: Включить GitHub Pages вручную

1. **Откройте настройки репозитория:**
   - https://github.com/TimurSama/th_test/settings/pages

2. **В разделе "Source":**
   - Выберите: **"GitHub Actions"**
   - Нажмите **"Save"**

3. **Важно:**
   - Репозиторий должен быть **публичным** (или у вас должен быть GitHub Pro/Team)
   - После включения GitHub Actions сможет деплоить

### Шаг 2: Запустить деплой

После включения Pages:

1. **Откройте Actions:**
   - https://github.com/TimurSama/th_test/actions

2. **Найдите workflow:**
   - "Deploy Mini App to GitHub Pages"

3. **Запустите вручную:**
   - Нажмите "Run workflow"
   - Выберите ветку "main"
   - Нажмите "Run workflow"

### Шаг 3: Проверить деплой

1. **Проверьте статус:**
   - Должен быть зеленый статус ✅
   - Обычно занимает 1-2 минуты

2. **Проверьте сайт:**
   - URL: `https://timursama.github.io/th_test/`
   - Должен открываться Mini App

## Альтернатива: Использовать ветку gh-pages

Если GitHub Actions не работает, используйте скрипт:

### Windows:
```bash
deploy_gh_pages.bat
```

### Или вручную:
```bash
git checkout --orphan gh-pages
git rm -rf .
xcopy /E /I /Y webapp\static\* .
git add .
git commit -m "Deploy Mini App"
git push origin gh-pages --force
git checkout main
```

Затем в настройках Pages:
- Source: ветка `gh-pages`
- Folder: `/ (root)`

## Проверка:

После успешного деплоя:
- ✅ Сайт доступен: `https://timursama.github.io/th_test/`
- ✅ Все файлы загружаются (CSS, JS)
- ✅ Mini App работает

## Если все еще не работает:

1. **Проверьте права репозитория:**
   - Settings → General → Danger Zone
   - Убедитесь, что репозиторий публичный

2. **Проверьте настройки Pages:**
   - Settings → Pages
   - Должен быть выбран "GitHub Actions" или "gh-pages"

3. **Подождите несколько минут:**
   - GitHub Pages может обновляться с задержкой

