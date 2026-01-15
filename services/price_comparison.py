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

def format_price_table(comparison: Dict[str, Dict], top_symbols: List[str] = None) -> str:
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
    
    message = "PRICE COMPARISON\n"
    message += f"{len(exchanges)} EXCHANGES\n\n"
    
    header = "Symbol      "
    for ex in exchanges:
        header += f"{ex[:7]:<8}"
    message += header + "\n"
    separator = "-" * min(70, len(header))
    message += separator + "\n"
    
    symbol_count = 0
    for symbol in top_symbols:
        if symbol not in comparison or symbol_count >= 6:
            break
        
        symbol_data = comparison[symbol]
        row = f"{symbol[:10]:<12}"
        
        for ex in exchanges:
            if ex in symbol_data['prices']:
                price = symbol_data['prices'][ex]['price']
                is_best = (ex == symbol_data['best_buy'])
                
                if is_best:
                    row += f"🟢{price:>6.0f} "
                else:
                    row += f"{price:>7.0f} "
            else:
                row += f"{'—':>8}"
        
        message += row + "\n"
        symbol_count += 1
    
    message += "\n🟢 = Best buy price\n"
    message += f"Source: {len(exchanges)} exchanges"
    
    if len(message) > 4000:
        message = message[:3900] + "\n\n[Truncated]"
    
    return message

