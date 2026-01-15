import asyncio
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import aiosqlite

from config import DATABASE_PATH, SUBSCRIPTION_LEVELS, EXCHANGES
from services.market_collector import MarketCollector
from services.price_comparison import compare_prices_across_exchanges, format_price_table
from database import User, MarketSnapshot

logger = logging.getLogger(__name__)

class PriceMonitor:
    def __init__(self):
        self.collector = MarketCollector(EXCHANGES)
        self.running = False
        self.top_symbols = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT", "ADA/USDT", "DOGE/USDT", "AVAX/USDT"]
    
    async def collect_and_store_prices(self):
        try:
            comparison = await compare_prices_across_exchanges(self.collector, self.top_symbols)
            
            async with aiosqlite.connect(DATABASE_PATH) as db:
                for symbol, symbol_data in comparison.items():
                    for exchange_name, price_data in symbol_data['prices'].items():
                        await MarketSnapshot.save_snapshot(
                            db,
                            exchange_name,
                            symbol,
                            price_data['price'],
                            price_data.get('volume_24h', 0),
                            price_data.get('change_24h', 0)
                        )
            
            logger.info(f"Collected prices for {len(comparison)} symbols")
            return comparison
        except Exception as e:
            logger.error(f"Error collecting prices: {e}", exc_info=True)
            return None
    
    async def get_users_for_notification(self, level: str) -> List[Dict]:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            try:
                cursor = await db.execute("""
                    SELECT user_id, subscription_level, last_notification_time
                    FROM users
                    WHERE subscription_level = ?
                """, (level,))
                rows = await cursor.fetchall()
                return [
                    {
                        'user_id': row[0],
                        'subscription_level': row[1],
                        'last_notification_time': row[2] if len(row) > 2 else None
                    }
                    for row in rows
                ]
            except Exception as e:
                logger.error(f"Error getting users for notification: {e}")
                return []
    
    async def should_send_notification(self, user_id: int, level: str) -> bool:
        async with aiosqlite.connect(DATABASE_PATH) as db:
            try:
                cursor = await db.execute("""
                    SELECT last_notification_time FROM users WHERE user_id = ?
                """, (user_id,))
                row = await cursor.fetchone()
                if not row or not row[0]:
                    return True
                
                last_notification = datetime.fromisoformat(row[0])
                interval_hours = SUBSCRIPTION_LEVELS[level]['pulse_interval_hours']
                next_notification = last_notification + timedelta(hours=interval_hours)
                
                return datetime.utcnow() >= next_notification
            except Exception as e:
                logger.error(f"Error checking notification time: {e}")
                return True
    
    async def update_notification_time(self, user_id: int):
        async with aiosqlite.connect(DATABASE_PATH) as db:
            await db.execute("""
                UPDATE users 
                SET last_notification_time = ?
                WHERE user_id = ?
            """, (datetime.utcnow().isoformat(), user_id))
            await db.commit()
    
    async def start_monitoring(self, bot_instance=None):
        self.running = True
        logger.info("Price monitoring started")
        
        while self.running:
            try:
                comparison = await self.collect_and_store_prices()
                
                if comparison and bot_instance:
                    await self.send_notifications(bot_instance, comparison)
                
                await asyncio.sleep(60)
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}", exc_info=True)
                await asyncio.sleep(60)
    
    async def send_notifications(self, bot, comparison: Dict):
        for level in ['free', 'pro', 'premium']:
            users = await self.get_users_for_notification(level)
            
            for user_data in users:
                user_id = user_data['user_id']
                
                if await self.should_send_notification(user_id, level):
                    try:
                        message = format_price_table(comparison, self.top_symbols)
                        message += f"\n\nAccess: {SUBSCRIPTION_LEVELS[level]['name']}"
                        
                        await bot.send_message(
                            chat_id=user_id,
                            text=message
                        )
                        
                        await self.update_notification_time(user_id)
                        logger.info(f"Sent notification to user {user_id} ({level})")
                    except Exception as e:
                        logger.error(f"Error sending notification to user {user_id}: {e}")

