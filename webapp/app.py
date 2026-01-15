"""
Flask application for Telegram Mini App
Modern Matrix-style web interface
"""
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import aiosqlite
import asyncio
from datetime import datetime

from config import DATABASE_PATH, SUBSCRIPTION_LEVELS
from database import User, MarketSnapshot, Signal, Giveaway, News, Referral

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)


def run_async(coro):
    """Run async function in sync context"""
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    try:
        return loop.run_until_complete(coro)
    finally:
        loop.close()


@app.route('/')
def index():
    """Main Mini App page"""
    return render_template('index.html')


@app.route('/api/user/<int:user_id>')
def get_user(user_id):
    """Get user data"""
    async def fetch_user():
        async with aiosqlite.connect(DATABASE_PATH) as db:
            user_data = await User.get_or_create(db, user_id)
            referral_count = await Referral.get_referral_count(db, user_id)
            
            return {
                "user_id": user_data["user_id"],
                "username": user_data.get("username"),
                "first_name": user_data.get("first_name"),
                "subscription_level": user_data.get("subscription_level", "free"),
                "referral_count": referral_count,
                "join_date": user_data.get("join_date"),
                "referral_code": user_data.get("referral_code")
            }
    
    return jsonify(run_async(fetch_user()))


@app.route('/api/dashboard/<int:user_id>')
def get_dashboard(user_id):
    """Get dashboard data"""
    async def fetch_dashboard():
        async with aiosqlite.connect(DATABASE_PATH) as db:
            user_data = await User.get_or_create(db, user_id)
            subscription_level = user_data.get("subscription_level", "free")
            
            # Get subscription info
            sub_info = SUBSCRIPTION_LEVELS.get(subscription_level, SUBSCRIPTION_LEVELS["free"])
            
            # Get signal count for today
            cursor = await db.execute("""
                SELECT COUNT(*) FROM signals
                WHERE status = 'active'
                AND date(created_at) = date('now')
            """)
            signals_today = (await cursor.fetchone())[0]
            
            # Get referral count
            referral_count = await Referral.get_referral_count(db, user_id)
            
            return {
                "subscription_level": subscription_level,
                "subscription_name": sub_info["name"],
                "signals_today": signals_today,
                "referral_count": referral_count,
                "data_stream_status": "STABLE"
            }
    
    return jsonify(run_async(fetch_dashboard()))


@app.route('/api/market-pulse')
def get_market_pulse():
    """Get market pulse data"""
    async def fetch_pulse():
        async with aiosqlite.connect(DATABASE_PATH) as db:
            snapshots = await MarketSnapshot.get_latest_snapshots(db, limit=50)
            return snapshots
    
    return jsonify(run_async(fetch_pulse()))


@app.route('/api/signals')
def get_signals():
    """Get signals"""
    exchange = request.args.get('exchange')
    limit = int(request.args.get('limit', 20))
    
    async def fetch_signals():
        async with aiosqlite.connect(DATABASE_PATH) as db:
            if exchange:
                cursor = await db.execute("""
                    SELECT * FROM signals
                    WHERE status = 'active' AND exchange = ?
                    ORDER BY created_at DESC
                    LIMIT ?
                """, (exchange, limit))
            else:
                cursor = await db.execute("""
                    SELECT * FROM signals
                    WHERE status = 'active'
                    ORDER BY created_at DESC
                    LIMIT ?
                """, (limit,))
            
            rows = await cursor.fetchall()
            columns = [col[0] for col in cursor.description]
            return [dict(zip(columns, row)) for row in rows]
    
    return jsonify(run_async(fetch_signals()))


@app.route('/api/giveaways')
def get_giveaways():
    """Get giveaways"""
    status = request.args.get('status', 'active')
    
    async def fetch_giveaways():
        async with aiosqlite.connect(DATABASE_PATH) as db:
            if status == 'active':
                giveaways = await Giveaway.get_active(db)
            else:
                cursor = await db.execute("""
                    SELECT * FROM giveaways
                    WHERE status = ?
                    ORDER BY created_at DESC
                """, (status,))
                rows = await cursor.fetchall()
                columns = [col[0] for col in cursor.description]
                giveaways = [dict(zip(columns, row)) for row in rows]
            
            return giveaways
    
    return jsonify(run_async(fetch_giveaways()))


@app.route('/api/news')
def get_news():
    """Get news/updates"""
    limit = int(request.args.get('limit', 10))
    
    async def fetch_news():
        async with aiosqlite.connect(DATABASE_PATH) as db:
            news = await News.get_recent(db, limit=limit)
            return news
    
    return jsonify(run_async(fetch_news()))


@app.route('/api/referral/<int:user_id>')
def get_referral_info(user_id):
    """Get referral information"""
    async def fetch_referral():
        async with aiosqlite.connect(DATABASE_PATH) as db:
            user_data = await User.get_or_create(db, user_id)
            referral_code = user_data.get("referral_code")
            referral_count = await Referral.get_referral_count(db, user_id)
            
            from config import TELEGRAM_BOT_TOKEN
            import requests
            bot_info = requests.get(f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getMe").json()
            bot_username = bot_info.get("result", {}).get("username", "your_bot")
            
            return {
                "referral_code": referral_code,
                "referral_count": referral_count,
                "referral_link": f"https://t.me/{bot_username}?start=ref_{referral_code}"
            }
    
    return jsonify(run_async(fetch_referral()))

@app.route('/api/price-comparison')
def get_price_comparison():
    """Get price comparison across 8 exchanges"""
    from services.market_collector import MarketCollector
    from services.price_comparison import compare_prices_across_exchanges
    from config import EXCHANGES
    
    top_symbols = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT", "ADA/USDT", "DOGE/USDT", "AVAX/USDT", "DOT/USDT", "MATIC/USDT"]
    
    async def fetch_comparison():
        collector = MarketCollector(EXCHANGES)
        comparison = await compare_prices_across_exchanges(collector, top_symbols)
        return comparison
    
    return jsonify(run_async(fetch_comparison()))

@app.route('/api/subscription/upgrade', methods=['POST'])
def upgrade_subscription():
    """Upgrade user subscription"""
    data = request.json
    user_id = data.get('user_id')
    level = data.get('level')
    
    if not user_id or not level:
        return jsonify({"success": False, "error": "Missing user_id or level"}), 400
    
    async def do_upgrade():
        async with aiosqlite.connect(DATABASE_PATH) as db:
            await User.update_subscription(db, user_id, level)
        return {"success": True}
    
    return jsonify(run_async(do_upgrade()))


if __name__ == '__main__':
    from config import HOST, PORT, DEBUG
    app.run(host=HOST, port=PORT, debug=DEBUG)

