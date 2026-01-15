# Исправление ошибки GitHub Pages

## Ошибка:
```
Error: Get Pages site failed. Please verify that the repository has Pages enabled and configured to build using GitHub Actions
```

## Решение:

### Вариант 1: Автоматическое включение (обновлено в workflow)

Workflow теперь автоматически включает GitHub Pages. Просто запустите его снова:

1. Откройте: https://github.com/TimurSama/th_test/actions
2. Найдите "Deploy Mini App to GitHub Pages"
3. Нажмите "Run workflow" → "Run workflow"

### Вариант 2: Ручное включение (если автоматическое не сработало)

1. **Включить GitHub Pages:**
   - Откройте: https://github.com/TimurSama/th_test/settings/pages
   - В разделе "Source" выберите: **"GitHub Actions"**
   - Нажмите **"Save"**

2. **Запустить workflow:**
   - Откройте: https://github.com/TimurSama/th_test/actions
   - Найдите "Deploy Mini App to GitHub Pages"
   - Нажмите "Run workflow" → "Run workflow"

### Вариант 3: Использовать ветку gh-pages (альтернатива)

Если GitHub Actions не работает, можно использовать старый метод:

```bash
# Создать ветку gh-pages из содержимого webapp/static
git checkout --orphan gh-pages
git rm -rf .
cp -r webapp/static/* .
git add .
git commit -m "Deploy Mini App to GitHub Pages"
git push origin gh-pages

# Вернуться в main
git checkout main
```

Затем в настройках Pages выбрать ветку `gh-pages` и папку `/ (root)`.

## Проверка:

После успешного деплоя:
- URL будет: `https://timursama.github.io/th_test/`
- Обычно деплой занимает 1-2 минуты

## Важно:

- Репозиторий должен быть **публичным** (или у вас должен быть GitHub Pro/Team)
- GitHub Pages должен быть включен в настройках репозитория
- Workflow должен иметь права на запись в Pages

