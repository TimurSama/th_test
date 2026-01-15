@echo off
echo ========================================
echo Push to Unclekentuki/th_demo
echo ========================================
echo.
echo ВАЖНО: Нужен Personal Access Token от аккаунта Unclekentuki
echo.
echo 1. Создайте токен: https://github.com/settings/tokens
echo 2. Выберите scope: repo
echo 3. Скопируйте токен
echo.
set /p TOKEN="Вставьте токен: "
echo.
echo Настраиваю remote...
git remote set-url origin https://%TOKEN%@github.com/Unclekentuki/th_demo.git
echo.
echo Отправляю код...
git push -u origin main
echo.
echo Готово!
pause

