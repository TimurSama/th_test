"""
Service for automatic price update news generation and publishing
"""
import logging
from datetime import datetime
from typing import Dict, List, Optional
import aiosqlite

from config import DATABASE_PATH
from database import News, MarketSnapshot

logger = logging.getLogger(__name__)


class PriceNewsService:
    """Service for creating and publishing price update news"""
    
    def __init__(self):
        self.price_history: Dict[str, Dict[str, float]] = {}  # symbol -> exchange -> price
    
    async def detect_significant_changes(self, current_prices: Dict[str, Dict]) -> List[Dict]:
        """
        Detect significant price changes and return news items to publish
        
        Args:
            current_prices: Current price comparison data from compare_prices_across_exchanges
            
        Returns:
            List of news items to publish
        """
        news_items = []
        significant_change_threshold = 2.0  # 2% change threshold
        
        for symbol, symbol_data in current_prices.items():
            symbol_short = symbol.replace('/USDT', '')
            
            # Check for best price changes
            best_buy = symbol_data.get('best_buy')
            best_buy_price = symbol_data.get('best_buy_price', 0)
            best_sell = symbol_data.get('best_sell')
            best_sell_price = symbol_data.get('best_sell_price', 0)
            
            # Calculate average price
            prices = [p['price'] for p in symbol_data['prices'].values()]
            if not prices:
                continue
            
            avg_price = sum(prices) / len(prices)
            spread = ((best_sell_price - best_buy_price) / avg_price * 100) if avg_price > 0 else 0
            
            # Check historical prices
            if symbol not in self.price_history:
                self.price_history[symbol] = {}
            
            # Detect significant changes per exchange
            for exchange, price_data in symbol_data['prices'].items():
                current_price = price_data['price']
                change_24h = price_data.get('change_24h', 0)
                
                # Check if this is a significant change
                if abs(change_24h) >= significant_change_threshold:
                    # Check if we've already published about this
                    key = f"{symbol}_{exchange}"
                    last_price = self.price_history[symbol].get(exchange, current_price)
                    
                    # Update history
                    self.price_history[symbol][exchange] = current_price
                    
                    # Create news item for significant changes
                    if abs(change_24h) >= 5.0:  # Major change (5%+)
                        title = f"🚨 {symbol_short} Major Price Movement"
                        direction = "surge" if change_24h > 0 else "drop"
                        content = (
                            f"<b>{symbol_short}</b> on <b>{exchange.upper()}</b> shows "
                            f"<b>{change_24h:+.2f}%</b> change in 24h.\n\n"
                            f"Current: <code>${current_price:,.2f}</code>\n"
                            f"Best buy: <code>${best_buy_price:,.2f}</code> on {best_buy.upper()}\n"
                            f"Spread: <code>{spread:.2f}%</code>"
                        )
                        news_items.append({
                            'title': title,
                            'content': content,
                            'category': 'price_alert',
                            'symbol': symbol,
                            'exchange': exchange,
                            'change': change_24h
                        })
            
            # Create summary news for best opportunities
            if spread >= 1.0:  # Significant spread (1%+)
                title = f"💎 {symbol_short} Arbitrage Opportunity"
                content = (
                    f"<b>{symbol_short}</b> shows significant price spread across exchanges.\n\n"
                    f"Best buy: <code>${best_buy_price:,.2f}</code> on <b>{best_buy.upper()}</b>\n"
                    f"Best sell: <code>${best_sell_price:,.2f}</code> on <b>{best_sell.upper()}</b>\n"
                    f"Spread: <code>{spread:.2f}%</code>\n"
                    f"Average: <code>${avg_price:,.2f}</code>"
                )
                news_items.append({
                    'title': title,
                    'content': content,
                    'category': 'arbitrage',
                    'symbol': symbol,
                    'spread': spread
                })
        
        return news_items
    
    async def publish_price_news(self, news_items: List[Dict], published_by: Optional[int] = None):
        """Publish price news items to database"""
        if not news_items:
            return
        
        async with aiosqlite.connect(DATABASE_PATH) as db:
            for item in news_items:
                try:
                    await News.create(
                        db,
                        title=item['title'],
                        content=item['content'],
                        category=item.get('category', 'price_update'),
                        published_by=published_by
                    )
                    logger.info(f"Published price news: {item['title']}")
                except Exception as e:
                    logger.error(f"Error publishing news item: {e}", exc_info=True)
    
    async def get_recent_price_changes(self, hours: int = 24) -> List[Dict]:
        """Get recent price changes from market snapshots"""
        async with aiosqlite.connect(DATABASE_PATH) as db:
            cursor = await db.execute("""
                SELECT 
                    symbol,
                    exchange,
                    price,
                    change_24h,
                    timestamp
                FROM market_snapshots
                WHERE timestamp >= datetime('now', '-' || ? || ' hours')
                ORDER BY timestamp DESC
                LIMIT 100
            """, (hours,))
            
            rows = await cursor.fetchall()
            return [
                {
                    'symbol': row[0],
                    'exchange': row[1],
                    'price': row[2],
                    'change_24h': row[3],
                    'timestamp': row[4]
                }
                for row in rows
            ]

