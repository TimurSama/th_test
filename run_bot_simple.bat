@echo off
echo Starting TokenHunter Bot...
echo.
if not exist .env (
    echo Creating .env file...
    python scripts/setup_env.py
    echo.
)
python main.py
pause


