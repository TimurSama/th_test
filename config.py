import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_WEBAPP_URL = os.getenv("TELEGRAM_WEBAPP_URL", "")
DATABASE_PATH = os.getenv("DATABASE_PATH", str(DATA_DIR / "tokenhunter.db"))
EXCHANGES = os.getenv("EXCHANGES", "binance,okx,bybit,gateio").split(",")
EXCHANGES = [ex.strip() for ex in EXCHANGES]
MARKET_PULSE_INTERVAL_HOURS = int(os.getenv("MARKET_PULSE_INTERVAL_HOURS", "1"))
TOP_PAIRS_COUNT = int(os.getenv("TOP_PAIRS_COUNT", "50"))

SUBSCRIPTION_LEVELS = {
    "free": {
        "name": "FREE ACCESS",
        "pulse_interval_hours": int(os.getenv("FREE_PULSE_INTERVAL_HOURS", "4")),
        "features": [
            "Market pulse every 4 hours",
            "Limited signals",
            "Public data stream"
        ]
    },
    "pro": {
        "name": "PRO ACCESS",
        "pulse_interval_hours": int(os.getenv("PRO_PULSE_INTERVAL_HOURS", "2")),
        "features": [
            "Market pulse every 2 hours",
            "Extended signals",
            "Priority data stream"
        ]
    },
    "premium": {
        "name": "PREMIUM ACCESS",
        "pulse_interval_hours": int(os.getenv("PREMIUM_PULSE_INTERVAL_HOURS", "1")),
        "features": [
            "Market pulse every 1 hour",
            "Full signal feed",
            "Access to private signals chat"
        ]
    }
}

REFERRAL_BONUS_DAYS = int(os.getenv("REFERRAL_BONUS_DAYS", "30"))
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "5000"))
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

if not TELEGRAM_BOT_TOKEN:
    raise ValueError("TELEGRAM_BOT_TOKEN must be set in environment variables")

