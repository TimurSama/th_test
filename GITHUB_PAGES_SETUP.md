# Настройка GitHub Pages для Mini App

## Проблема и решение

Если деплой не прошел, выполните следующие шаги:

### 1. Включить GitHub Pages в настройках репозитория

1. Откройте: https://github.com/TimurSama/th_test/settings/pages
2. В разделе **"Source"** выберите: **"GitHub Actions"**
3. Нажмите **"Save"**

### 2. Проверить, что workflow запустился

1. Откройте: https://github.com/TimurSama/th_test/actions
2. Найдите workflow "Deploy Mini App to GitHub Pages"
3. Если он не запустился автоматически, нажмите "Run workflow" → "Run workflow"

### 3. Проверить статус деплоя

1. В разделе Actions найдите последний запуск workflow
2. Откройте его и проверьте логи
3. Если есть ошибки, они будут показаны в логах

### 4. Ручной запуск деплоя

Если автоматический деплой не сработал:

1. Откройте: https://github.com/TimurSama/th_test/actions/workflows/deploy_miniapp.yml
2. Нажмите **"Run workflow"**
3. Выберите ветку **"main"**
4. Нажмите **"Run workflow"**

### 5. Проверить URL

После успешного деплоя:
- URL будет: `https://timursama.github.io/th_test/`
- Обычно деплой занимает 1-2 минуты

### 6. Если все еще не работает

Проверьте:
- ✅ Репозиторий публичный (или у вас есть GitHub Pro)
- ✅ GitHub Pages включен в настройках
- ✅ Workflow файл существует: `.github/workflows/deploy_miniapp.yml`
- ✅ Файлы в папке `webapp/static/` существуют

### Альтернатива: Ручной деплой через gh-pages ветку

Если GitHub Actions не работает, можно использовать gh-pages ветку:

```bash
# Создать ветку gh-pages
git checkout --orphan gh-pages
git rm -rf .
git add webapp/static/
git commit -m "Deploy static Mini App"
git push origin gh-pages

# Вернуться в main
git checkout main
```

Затем в настройках Pages выбрать ветку `gh-pages` вместо GitHub Actions.

## Структура файлов

Убедитесь, что в `webapp/static/` есть:
- `index.html`
- `js/app.js`
- `style.css`

## Проверка после деплоя

1. Откройте: https://timursama.github.io/th_test/
2. Mini App должен загрузиться
3. Все разделы должны работать (Dashboard, Market, Price Compare и т.д.)

## Подключение в BotFather

После успешного деплоя:
1. Откройте @BotFather
2. `/mybots` → выберите бота
3. "Bot Settings" → "Menu Button"
4. URL: `https://timursama.github.io/th_test/`

