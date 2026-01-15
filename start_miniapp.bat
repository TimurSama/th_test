@echo off
echo ========================================
echo TokenHunter Mini App - Local Setup
echo ========================================
echo.
echo Step 1: Starting Flask webapp on port 5000...
echo.
start "TokenHunter WebApp" cmd /k "python run_webapp.py"
timeout /t 3 /nobreak >nul
echo.
echo Step 2: WebApp should be running at http://localhost:5000
echo.
echo Step 3: Now you need to create a public tunnel
echo.
echo Option A - Using ngrok:
echo   1. Download ngrok from https://ngrok.com/download
echo   2. Run: ngrok http 5000
echo   3. Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
echo   4. Configure it in BotFather: /mybots -^> Your Bot -^> Menu Button
echo.
echo Option B - Using localtunnel (no install needed):
echo   1. Run: npx localtunnel --port 5000
echo   2. Copy the HTTPS URL
echo   3. Configure it in BotFather
echo.
echo ========================================
echo WebApp is starting in a new window...
echo ========================================
pause

