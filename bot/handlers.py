"""
Telegram Bot handlers
Command and callback handlers with Matrix-style tone
"""
import logging
from typing import Optional
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import ContextTypes
import aiosqlite

from config import DATABASE_PATH, SUBSCRIPTION_LEVELS, TELEGRAM_BOT_TOKEN
from database import Database, User, MarketSnapshot, Referral
from services.subscription_service import SubscriptionService
from services.referral_service import ReferralService
from services.market_collector import MarketCollector
from services.price_comparison import compare_prices_across_exchanges, format_price_table
from config import EXCHANGES

logger = logging.getLogger(__name__)

# Initialize services
subscription_service = SubscriptionService(DATABASE_PATH)
referral_service = ReferralService(DATABASE_PATH)
market_collector = MarketCollector(EXCHANGES)


async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle /start command with referral support"""
    user = update.effective_user
    user_id = user.id
    
    # Check for referral code
    referral_code = None
    if context.args and len(context.args) > 0:
        ref_arg = context.args[0]
        if ref_arg.startswith("ref_"):
            referral_code = ref_arg[4:]
    
    async with aiosqlite.connect(DATABASE_PATH) as db:
        # Get or create user
        user_data = await User.get_or_create(
            db, user_id, user.username, user.first_name, user.last_name
        )
        
        # Process referral if present
        if referral_code:
            await referral_service.process_referral(referral_code, user_id)
        
        await User.update_last_active(db, user_id)
    
    # Welcome message in Matrix style
    username = user.first_name or user.username or "node"
    message = f"Knock knock, {username}.\n\n"
    message += "The network has detected your signal.\n"
    message += "Market streams are active.\n\n"
    message += "Choose your next move."
    
    keyboard = [
        [InlineKeyboardButton("GET THE PULSE", callback_data="get_pulse")],
        [
            InlineKeyboardButton("Subscription Level", callback_data="subscription"),
            InlineKeyboardButton("Referral System", callback_data="referral")
        ],
        [
            InlineKeyboardButton("Giveaways", callback_data="giveaways"),
            InlineKeyboardButton("Application", url=f"https://t.me/{context.bot.username}?startapp=main")
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(message, reply_markup=reply_markup)


async def get_pulse_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle GET THE PULSE button"""
    query = update.callback_query
    await query.answer("Collecting market data...")
    
    user_id = update.effective_user.id
    
    async with aiosqlite.connect(DATABASE_PATH) as db:
        subscription = await subscription_service.get_user_subscription(user_id)
        level = subscription["level"]
    
    top_symbols = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "BNB/USDT", "XRP/USDT", "ADA/USDT", "DOGE/USDT", "AVAX/USDT"]
    
    try:
        comparison = await compare_prices_across_exchanges(market_collector, top_symbols)
        if comparison:
            message = format_price_table(comparison, top_symbols, use_html=True)
            message += f"\n\n<b>Access:</b> {SUBSCRIPTION_LEVELS[level]['name']}"
            parse_mode = 'HTML'
        else:
            raise Exception("No comparison data")
    except Exception as e:
        logger.error(f"Error getting price comparison: {e}", exc_info=True)
        message = "<b>MARKET PULSE</b>\n\n"
        message += "Collecting data from exchanges...\n"
        message += "Please try again in a moment.\n\n"
        message += f"<b>Access:</b> {SUBSCRIPTION_LEVELS[level]['name']}"
        parse_mode = 'HTML'
    
    keyboard = [
        [InlineKeyboardButton("GET THE PULSE", callback_data="get_pulse")],
        [
            InlineKeyboardButton("Subscription Level", callback_data="subscription"),
            InlineKeyboardButton("Referral System", callback_data="referral")
        ],
        [
            InlineKeyboardButton("Giveaways", callback_data="giveaways"),
            InlineKeyboardButton("Application", url=f"https://t.me/{context.bot.username}?startapp=main")
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    try:
        await query.edit_message_text(message, reply_markup=reply_markup, parse_mode=parse_mode)
    except Exception as e:
        logger.warning(f"Failed to edit message with HTML, trying plain text: {e}", exc_info=True)
        try:
            # Fallback to plain text
            if comparison:
                message = format_price_table(comparison, top_symbols, use_html=False)
                message += f"\n\nAccess: {SUBSCRIPTION_LEVELS[level]['name']}"
            await query.edit_message_text(message, reply_markup=reply_markup)
        except Exception as e2:
            logger.error(f"Error editing message: {e2}", exc_info=True)
            await query.message.reply_text(message, reply_markup=reply_markup, parse_mode=parse_mode if 'parse_mode' in locals() else None)


async def subscription_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle Subscription Level menu"""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    subscription = await subscription_service.get_user_subscription(user_id)
    current_level = subscription["level"]
    
    message = "SUBSCRIPTION LEVELS\n\n"
    message += "Choose your level of access.\n\n"
    
    for level_key, level_data in SUBSCRIPTION_LEVELS.items():
        marker = "✓" if level_key == current_level else "○"
        message += f"{marker} {level_key.upper()}\n"
        message += f"  {level_data['name']}\n"
        for feature in level_data['features']:
            message += f"  • {feature}\n"
        message += "\n"
    
    keyboard = []
    if current_level != "pro":
        keyboard.append([InlineKeyboardButton("🔄 Upgrade to PRO", callback_data="buy_pro")])
    if current_level != "premium":
        keyboard.append([InlineKeyboardButton("⭐ Upgrade to PREMIUM", callback_data="buy_premium")])
    keyboard.append([InlineKeyboardButton("← Back", callback_data="main_menu")])
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(message, reply_markup=reply_markup)


async def referral_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle Referral System menu"""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    
    # Get referral stats
    stats = await referral_service.get_referral_stats(user_id)
    referral_code = await referral_service.get_referral_link(user_id)
    bot_username = context.bot.username or "your_bot"
    referral_link = f"https://t.me/{bot_username}?start=ref_{referral_code}"
    
    message = "REFERRAL SYSTEM\n\n"
    message += "Invite new nodes into the network.\n\n"
    message += "Earn bonuses for every active referral.\n"
    message += "The deeper your network — the higher your influence.\n\n"
    message += f"Your referrals: {stats['referral_count']}\n\n"
    message += f"Invite link:\n{referral_link}"
    
    keyboard = [
        [InlineKeyboardButton("COPY INVITE LINK", callback_data=f"copy_link_{user_id}")],
        [InlineKeyboardButton("SEND INVITATION", callback_data=f"send_invite_{user_id}")],
        [InlineKeyboardButton("← Back", callback_data="main_menu")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(message, reply_markup=reply_markup)


async def giveaways_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle Giveaways menu"""
    query = update.callback_query
    await query.answer()
    
    from database import Giveaway
    
    async with aiosqlite.connect(DATABASE_PATH) as db:
        giveaways = await Giveaway.get_active(db)
    
    if not giveaways:
        message = "GIVEAWAYS\n\n"
        message += "No active giveaways at the moment.\n\n"
        message += "The network is preparing new opportunities."
    else:
        message = "GIVEAWAYS\n\n"
        for giveaway in giveaways:
            message += f"ACTIVE GIVEAWAY\n"
            message += f"Prize: {giveaway['prize']}\n"
            message += f"Ends in: {giveaway['end_date']}\n\n"
    
    keyboard = [
        [InlineKeyboardButton("← Back", callback_data="main_menu")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(message, reply_markup=reply_markup)


async def main_menu_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Return to main menu"""
    query = update.callback_query
    await query.answer()
    
    user = update.effective_user
    username = user.first_name or user.username or "node"
    
    message = f"Knock knock, {username}.\n\n"
    message += "The network has detected your signal.\n"
    message += "Market streams are active.\n\n"
    message += "Choose your next move."
    
    keyboard = [
        [InlineKeyboardButton("GET THE PULSE", callback_data="get_pulse")],
        [
            InlineKeyboardButton("Subscription Level", callback_data="subscription"),
            InlineKeyboardButton("Referral System", callback_data="referral")
        ],
        [
            InlineKeyboardButton("Giveaways", callback_data="giveaways"),
            InlineKeyboardButton("Application", url=f"https://t.me/{context.bot.username}?startapp=main")
        ]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(message, reply_markup=reply_markup)


async def buy_pro_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle PRO subscription purchase"""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    
    from services.payment_service import PaymentService, SUBSCRIPTION_PRICES
    
    payment_service = PaymentService()
    price_info = SUBSCRIPTION_PRICES["pro"]
    
    message = "PRO SUBSCRIPTION\n\n"
    message += "Choose payment method:\n\n"
    message += f"⭐ Telegram Stars: {price_info['stars']} stars\n"
    message += f"💳 Telegram Wallet: ${price_info['usdt']} USDT\n"
    message += f"🔷 USDT Wallet: {price_info['usdt']} USDT\n\n"
    message += "Duration: 30 days"
    
    keyboard = [
        [InlineKeyboardButton(f"⭐ Pay {price_info['stars']} Stars", callback_data="pay_stars_pro")],
        [InlineKeyboardButton(f"💳 Pay ${price_info['usdt']} USDT (Wallet)", callback_data="pay_wallet_pro")],
        [InlineKeyboardButton(f"🔷 Pay {price_info['usdt']} USDT (Manual)", callback_data="pay_usdt_pro")],
        [InlineKeyboardButton("← Back", callback_data="subscription")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(message, reply_markup=reply_markup)

async def buy_premium_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle PREMIUM subscription purchase"""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    
    from services.payment_service import PaymentService, SUBSCRIPTION_PRICES
    
    payment_service = PaymentService()
    price_info = SUBSCRIPTION_PRICES["premium"]
    
    message = "PREMIUM SUBSCRIPTION\n\n"
    message += "Choose payment method:\n\n"
    message += f"⭐ Telegram Stars: {price_info['stars']} stars\n"
    message += f"💳 Telegram Wallet: ${price_info['usdt']} USDT\n"
    message += f"🔷 USDT Wallet: {price_info['usdt']} USDT\n\n"
    message += "Duration: 30 days"
    
    keyboard = [
        [InlineKeyboardButton(f"⭐ Pay {price_info['stars']} Stars", callback_data="pay_stars_premium")],
        [InlineKeyboardButton(f"💳 Pay ${price_info['usdt']} USDT (Wallet)", callback_data="pay_wallet_premium")],
        [InlineKeyboardButton(f"🔷 Pay {price_info['usdt']} USDT (Manual)", callback_data="pay_usdt_premium")],
        [InlineKeyboardButton("← Back", callback_data="subscription")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(message, reply_markup=reply_markup)

async def pay_stars_pro_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle Stars payment for PRO"""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    from services.payment_service import PaymentService, SUBSCRIPTION_PRICES
    
    payment_service = PaymentService()
    price_info = SUBSCRIPTION_PRICES["pro"]
    
    try:
        payment_data = await payment_service.create_payment(user_id, "pro", "stars")
        
        await query.message.reply_invoice(
            title="PRO Subscription - 30 days",
            description="TokenHunter PRO Access",
            payload=payment_data["payment_id"],
            provider_token="",
            currency="XTR",
            prices=[LabeledPrice("PRO Subscription", price_info["stars"])],
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("⭐ Pay with Stars", pay=True)
            ]])
        )
    except Exception as e:
        logger.error(f"Error creating Stars payment: {e}", exc_info=True)
        await query.answer("Payment error. Please try again.", show_alert=True)

async def pay_stars_premium_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle Stars payment for PREMIUM"""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    from services.payment_service import PaymentService, SUBSCRIPTION_PRICES
    
    payment_service = PaymentService()
    price_info = SUBSCRIPTION_PRICES["premium"]
    
    try:
        payment_data = await payment_service.create_payment(user_id, "premium", "stars")
        
        await query.message.reply_invoice(
            title="PREMIUM Subscription - 30 days",
            description="TokenHunter PREMIUM Access",
            payload=payment_data["payment_id"],
            provider_token="",
            currency="XTR",
            prices=[LabeledPrice("PREMIUM Subscription", price_info["stars"])],
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("⭐ Pay with Stars", pay=True)
            ]])
        )
    except Exception as e:
        logger.error(f"Error creating Stars payment: {e}", exc_info=True)
        await query.answer("Payment error. Please try again.", show_alert=True)

async def pay_wallet_pro_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle Wallet payment for PRO"""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    from services.payment_service import PaymentService, SUBSCRIPTION_PRICES
    
    payment_service = PaymentService()
    price_info = SUBSCRIPTION_PRICES["pro"]
    
    try:
        payment_data = await payment_service.create_payment(user_id, "pro", "wallet")
        
        await query.message.reply_invoice(
            title="PRO Subscription - 30 days",
            description="TokenHunter PRO Access",
            payload=payment_data["payment_id"],
            provider_token="",
            currency="USD",
            prices=[LabeledPrice("PRO Subscription", int(price_info["usdt"] * 100))],
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("💳 Pay with Wallet", pay=True)
            ]])
        )
    except Exception as e:
        logger.error(f"Error creating Wallet payment: {e}", exc_info=True)
        await query.answer("Payment error. Please try again.", show_alert=True)

async def pay_wallet_premium_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle Wallet payment for PREMIUM"""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    from services.payment_service import PaymentService, SUBSCRIPTION_PRICES
    
    payment_service = PaymentService()
    price_info = SUBSCRIPTION_PRICES["premium"]
    
    try:
        payment_data = await payment_service.create_payment(user_id, "premium", "wallet")
        
        await query.message.reply_invoice(
            title="PREMIUM Subscription - 30 days",
            description="TokenHunter PREMIUM Access",
            payload=payment_data["payment_id"],
            provider_token="",
            currency="USD",
            prices=[LabeledPrice("PREMIUM Subscription", int(price_info["usdt"] * 100))],
            reply_markup=InlineKeyboardMarkup([[
                InlineKeyboardButton("💳 Pay with Wallet", pay=True)
            ]])
        )
    except Exception as e:
        logger.error(f"Error creating Wallet payment: {e}", exc_info=True)
        await query.answer("Payment error. Please try again.", show_alert=True)

async def pay_usdt_pro_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle USDT manual payment for PRO"""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    from services.payment_service import PaymentService, SUBSCRIPTION_PRICES
    import os
    
    payment_service = PaymentService()
    price_info = SUBSCRIPTION_PRICES["pro"]
    wallet_address = await payment_service.get_usdt_wallet_address()
    
    if not wallet_address:
        wallet_address = os.getenv("USDT_WALLET_ADDRESS", "YOUR_WALLET_ADDRESS")
    
    payment_data = await payment_service.create_payment(user_id, "pro", "usdt")
    
    message = "USDT PAYMENT — PRO\n\n"
    message += f"Amount: {price_info['usdt']} USDT\n"
    message += f"Network: TRC20 (Tron)\n\n"
    message += f"Send to:\n`{wallet_address}`\n\n"
    message += f"Payment ID: `{payment_data['payment_id']}`\n\n"
    message += "After payment, send transaction hash to verify."
    
    keyboard = [
        [InlineKeyboardButton("✅ Verify Payment", callback_data=f"verify_usdt_{payment_data['payment_id']}")],
        [InlineKeyboardButton("← Back", callback_data="subscription")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(message, reply_markup=reply_markup, parse_mode='Markdown')

async def pay_usdt_premium_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle USDT manual payment for PREMIUM"""
    query = update.callback_query
    await query.answer()
    
    user_id = update.effective_user.id
    from services.payment_service import PaymentService, SUBSCRIPTION_PRICES
    import os
    
    payment_service = PaymentService()
    price_info = SUBSCRIPTION_PRICES["premium"]
    wallet_address = await payment_service.get_usdt_wallet_address()
    
    if not wallet_address:
        wallet_address = os.getenv("USDT_WALLET_ADDRESS", "YOUR_WALLET_ADDRESS")
    
    payment_data = await payment_service.create_payment(user_id, "premium", "usdt")
    
    message = "USDT PAYMENT — PREMIUM\n\n"
    message += f"Amount: {price_info['usdt']} USDT\n"
    message += f"Network: TRC20 (Tron)\n\n"
    message += f"Send to:\n`{wallet_address}`\n\n"
    message += f"Payment ID: `{payment_data['payment_id']}`\n\n"
    message += "After payment, send transaction hash to verify."
    
    keyboard = [
        [InlineKeyboardButton("✅ Verify Payment", callback_data=f"verify_usdt_{payment_data['payment_id']}")],
        [InlineKeyboardButton("← Back", callback_data="subscription")]
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await query.edit_message_text(message, reply_markup=reply_markup, parse_mode='Markdown')

async def precheckout_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle pre-checkout query"""
    query = update.pre_checkout_query
    await query.answer(ok=True)

async def successful_payment_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle successful payment"""
    payment = update.message.successful_payment
    payment_id = payment.invoice_payload
    
    from services.payment_service import PaymentService
    
    payment_service = PaymentService()
    success = await payment_service.process_stars_payment(payment_id)
    
    if success:
        payment_data = payment_service.pending_payments.get(payment_id, {})
        level = payment_data.get("level", "pro")
        
        message = f"{level.upper()} ACCESS ACTIVATED\n\n"
        message += "Payment successful!\n"
        message += "Your subscription has been activated."
        
        await update.message.reply_text(message)
    else:
        await update.message.reply_text("Payment processing error. Please contact support.")

def format_volume(volume: float) -> str:
    """Format volume for display"""
    if volume >= 1_000_000_000:
        return f"{volume / 1_000_000_000:.2f}B"
    elif volume >= 1_000_000:
        return f"{volume / 1_000_000:.2f}M"
    elif volume >= 1_000:
        return f"{volume / 1_000:.2f}K"
    else:
        return f"{volume:.2f}"

