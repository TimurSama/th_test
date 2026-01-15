@echo off
echo Deploying Mini App to GitHub Pages via gh-pages branch...

REM Create orphan branch gh-pages
git checkout --orphan gh-pages

REM Remove all files
git rm -rf .

REM Copy static files to root
xcopy /E /I /Y webapp\static\* .

REM Add all files
git add .

REM Commit
git commit -m "Deploy Mini App to GitHub Pages"

REM Push to gh-pages branch
git push origin gh-pages --force

REM Return to main branch
git checkout main

echo.
echo Deployment complete!
echo.
echo Now go to: https://github.com/TimurSama/th_test/settings/pages
echo Select branch: gh-pages
echo Select folder: / (root)
echo Click Save
echo.
echo Your site will be available at: https://timursama.github.io/th_test/
pause

