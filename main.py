import asyncio
import logging
from config import DATABASE_PATH
from database import Database
from bot.bot import main as bot_main
from services.price_monitor import PriceMonitor

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

async def init_database():
    logger.info("Initializing database...")
    db = Database(DATABASE_PATH)
    await db.init_db()
    logger.info("Database initialized")

async def start_price_monitor(bot_instance):
    monitor = PriceMonitor()
    await monitor.start_monitoring(bot_instance)

if __name__ == "__main__":
    asyncio.run(init_database())
    logger.info("Starting TokenHunter bot...")
    
    import threading
    from telegram import Bot
    from config import TELEGRAM_BOT_TOKEN
    
    bot_instance = Bot(token=TELEGRAM_BOT_TOKEN)
    
    def run_monitor():
        asyncio.run(start_price_monitor(bot_instance))
    
    monitor_thread = threading.Thread(target=run_monitor, daemon=True)
    monitor_thread.start()
    
    bot_main()

