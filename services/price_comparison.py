from typing import List, Dict
from services.market_collector import MarketCollector

async def compare_prices_across_exchanges(collector: MarketCollector, symbols: List[str]) -> Dict[str, Dict]:
    all_data = await collector.collect_all_exchanges(symbols=symbols)
    
    comparison = {}
    
    for symbol in symbols:
        symbol_data = {
            'symbol': symbol,
            'prices': {},
            'best_buy': None,
            'best_sell': None,
            'best_buy_price': float('inf'),
            'best_sell_price': 0
        }
        
        for exchange_name, tickers in all_data.items():
            for ticker in tickers:
                if ticker['symbol'] == symbol:
                    price = ticker.get('price', 0)
                    if price > 0:
                        symbol_data['prices'][exchange_name] = {
                            'price': price,
                            'volume_24h': ticker.get('volume_24h', 0),
                            'change_24h': ticker.get('change_24h', 0)
                        }
                        
                        if price < symbol_data['best_buy_price']:
                            symbol_data['best_buy_price'] = price
                            symbol_data['best_buy'] = exchange_name
                        
                        if price > symbol_data['best_sell_price']:
                            symbol_data['best_sell_price'] = price
                            symbol_data['best_sell'] = exchange_name
                    break
        
        if symbol_data['prices']:
            comparison[symbol] = symbol_data
    
    return comparison

def format_price_table(comparison: Dict[str, Dict], top_symbols: List[str] = None, use_html: bool = True) -> str:
    """Format price comparison table with beautiful structure"""
    if not comparison:
        return "No data available."
    
    if top_symbols is None:
        top_symbols = list(comparison.keys())[:10]
    
    exchanges = set()
    for symbol_data in comparison.values():
        exchanges.update(symbol_data['prices'].keys())
    exchanges = sorted(list(exchanges))
    
    if not exchanges:
        return "No exchange data available."
    
    if use_html:
        return format_price_table_html(comparison, top_symbols, exchanges)
    else:
        return format_price_table_text(comparison, top_symbols, exchanges)


def format_price_table_html(comparison: Dict[str, Dict], top_symbols: List[str], exchanges: List[str]) -> str:
    """Format price table as HTML for Telegram"""
    message = "<b>📊 PRICE COMPARISON</b>\n"
    message += f"<i>{len(exchanges)} Exchanges • Real-time Data</i>\n\n"
    
    # Calculate average price for each symbol
    for symbol in top_symbols[:8]:  # Limit to 8 symbols
        if symbol not in comparison:
            continue
        
        symbol_data = comparison[symbol]
        if not symbol_data['prices']:
            continue
        
        # Calculate average and spread
        prices = [p['price'] for p in symbol_data['prices'].values()]
        avg_price = sum(prices) / len(prices) if prices else 0
        min_price = symbol_data['best_buy_price']
        max_price = symbol_data['best_sell_price']
        spread = ((max_price - min_price) / avg_price * 100) if avg_price > 0 else 0
        
        # Format symbol header
        symbol_short = symbol.replace('/USDT', '')
        message += f"<b>💰 {symbol_short}</b>\n"
        message += f"   Avg: <code>${avg_price:,.2f}</code>\n"
        message += f"   Spread: <code>{spread:.2f}%</code>\n\n"
        
        # Exchange prices in a clean format
        for ex in exchanges:
            if ex in symbol_data['prices']:
                price_data = symbol_data['prices'][ex]
                price = price_data['price']
                change = price_data.get('change_24h', 0)
                is_best = (ex == symbol_data['best_buy'])
                
                # Format change indicator
                change_emoji = "📈" if change >= 0 else "📉"
                change_color = "🟢" if change >= 0 else "🔴"
                
                # Best price indicator
                best_indicator = " ⭐ BEST" if is_best else ""
                
                message += f"   {change_emoji} <b>{ex.upper():<8}</b> "
                message += f"<code>${price:,.2f}</code> "
                message += f"{change_color} {change:+.2f}%{best_indicator}\n"
        
        message += "\n"
    
    message += "<i>⭐ = Best buy price (lowest)</i>\n"
    message += f"<i>Source: {len(exchanges)} exchanges</i>"
    
    if len(message) > 4000:
        message = message[:3900] + "\n\n<i>[Data truncated]</i>"
    
    return message


def format_price_table_text(comparison: Dict[str, Dict], top_symbols: List[str], exchanges: List[str]) -> str:
    """Format price table as plain text (fallback)"""
    message = "📊 PRICE COMPARISON\n"
    message += f"{len(exchanges)} EXCHANGES\n"
    message += "─" * 50 + "\n\n"
    
    symbol_count = 0
    for symbol in top_symbols:
        if symbol not in comparison or symbol_count >= 8:
            break
        
        symbol_data = comparison[symbol]
        if not symbol_data['prices']:
            continue
        
        symbol_short = symbol.replace('/USDT', '')
        message += f"💰 {symbol_short}\n"
        message += "─" * 30 + "\n"
        
        # Calculate average
        prices = [p['price'] for p in symbol_data['prices'].values()]
        avg_price = sum(prices) / len(prices) if prices else 0
        message += f"   Avg: ${avg_price:,.2f}\n\n"
        
        for ex in exchanges:
            if ex in symbol_data['prices']:
                price_data = symbol_data['prices'][ex]
                price = price_data['price']
                change = price_data.get('change_24h', 0)
                is_best = (ex == symbol_data['best_buy'])
                
                best_marker = " ⭐ BEST" if is_best else ""
                change_str = f"{change:+.2f}%" if change != 0 else "0.00%"
                
                message += f"   {ex.upper():<10} ${price:>10,.2f}  {change_str}{best_marker}\n"
        
        message += "\n"
        symbol_count += 1
    
    message += "\n⭐ = Best buy price (lowest)\n"
    message += f"Source: {len(exchanges)} exchanges"
    
    return message

