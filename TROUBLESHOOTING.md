# Устранение проблем с деплоем GitHub Pages

## Все workflow падают с ошибкой

### Проблема 1: GitHub Pages не включен

**Симптомы:**
- Ошибка: "Get Pages site failed" или "Resource not accessible by integration"

**Решение:**
1. Откройте: https://github.com/TimurSama/th_test/settings/pages
2. В разделе "Source" выберите: **"GitHub Actions"**
3. Нажмите **"Save"**
4. **ВАЖНО:** Репозиторий должен быть **публичным** (или у вас должен быть GitHub Pro)

### Проблема 2: Файлы не найдены

**Симптомы:**
- Ошибка: "No such file or directory" или "cp: cannot stat"

**Решение:**
Проверьте структуру файлов:
```
webapp/static/
  ├── index.html
  ├── style.css
  └── js/
      └── app.js
```

### Проблема 3: Права доступа

**Симптомы:**
- Ошибка: "Permission denied" или "Resource not accessible"

**Решение:**
1. Проверьте настройки репозитория:
   - Settings → Actions → General
   - "Workflow permissions" → выберите "Read and write permissions"
   - Сохраните

2. Проверьте, что репозиторий публичный:
   - Settings → General → Danger Zone
   - Если приватный, сделайте публичным (или купите GitHub Pro)

### Проблема 4: Environment не настроен

**Симптомы:**
- Ошибка: "Environment 'github-pages' not found"

**Решение:**
1. GitHub Pages должен быть включен в настройках (см. Проблема 1)
2. После включения Pages, environment создастся автоматически

## Пошаговая инструкция для исправления:

### Шаг 1: Включить GitHub Pages
1. https://github.com/TimurSama/th_test/settings/pages
2. Source: **"GitHub Actions"**
3. **Save**

### Шаг 2: Проверить права Actions
1. https://github.com/TimurSama/th_test/settings/actions
2. "Workflow permissions" → **"Read and write permissions"**
3. **Save**

### Шаг 3: Убедиться, что репозиторий публичный
1. https://github.com/TimurSama/th_test/settings
2. Если репозиторий приватный → сделайте публичным

### Шаг 4: Запустить workflow
1. https://github.com/TimurSama/th_test/actions
2. "Deploy Mini App to GitHub Pages"
3. "Run workflow" → "Run workflow"

## Альтернативное решение: Использовать ветку gh-pages

Если GitHub Actions не работает, используйте старый метод:

```bash
# Запустите скрипт
deploy_gh_pages.bat

# Или вручную:
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

## Проверка после исправления:

1. ✅ GitHub Pages включен в настройках
2. ✅ Workflow запускается без ошибок
3. ✅ Сайт доступен: `https://timursama.github.io/th_test/`
4. ✅ Все файлы загружаются (CSS, JS работают)

## Если ничего не помогает:

1. Проверьте логи конкретного workflow run:
   - Откройте failed run
   - Посмотрите, на каком шаге ошибка
   - Скопируйте текст ошибки

2. Попробуйте использовать альтернативный метод (gh-pages ветка)

3. Убедитесь, что:
   - Репозиторий публичный
   - GitHub Pages включен
   - Права Actions настроены правильно

