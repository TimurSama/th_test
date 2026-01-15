import logging
from typing import Dict, Optional
from datetime import datetime, timedelta
import aiosqlite
import secrets

from config import DATABASE_PATH, SUBSCRIPTION_LEVELS

logger = logging.getLogger(__name__)

SUBSCRIPTION_PRICES = {
    "pro": {
        "stars": 100,
        "usdt": 5.0,
        "duration_days": 30
    },
    "premium": {
        "stars": 200,
        "usdt": 10.0,
        "duration_days": 30
    }
}

class PaymentService:
    def __init__(self):
        self.pending_payments = {}
    
    async def create_payment(self, user_id: int, level: str, method: str) -> Dict:
        if level not in SUBSCRIPTION_PRICES:
            raise ValueError(f"Invalid subscription level: {level}")
        
        price_info = SUBSCRIPTION_PRICES[level]
        payment_id = secrets.token_urlsafe(16)
        
        payment_data = {
            "payment_id": payment_id,
            "user_id": user_id,
            "level": level,
            "method": method,
            "amount": price_info.get(method, 0),
            "status": "pending",
            "created_at": datetime.utcnow().isoformat()
        }
        
        self.pending_payments[payment_id] = payment_data
        
        async with aiosqlite.connect(DATABASE_PATH) as db:
            await db.execute("""
                INSERT INTO payments (payment_id, user_id, level, method, amount, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (
                payment_id, user_id, level, method, 
                price_info.get(method, 0), "pending", 
                datetime.utcnow().isoformat()
            ))
            await db.commit()
        
        return payment_data
    
    async def process_stars_payment(self, payment_id: str) -> bool:
        if payment_id not in self.pending_payments:
            return False
        
        payment = self.pending_payments[payment_id]
        if payment["status"] != "pending":
            return False
        
        payment["status"] = "completed"
        
        async with aiosqlite.connect(DATABASE_PATH) as db:
            await db.execute("""
                UPDATE payments SET status = 'completed', completed_at = ? WHERE payment_id = ?
            """, (datetime.utcnow().isoformat(), payment_id))
            
            expires_at = datetime.utcnow() + timedelta(days=SUBSCRIPTION_PRICES[payment["level"]]["duration_days"])
            await db.execute("""
                UPDATE users 
                SET subscription_level = ?, subscription_expires = ?
                WHERE user_id = ?
            """, (payment["level"], expires_at.isoformat(), payment["user_id"]))
            await db.commit()
        
        return True
    
    async def get_usdt_wallet_address(self) -> str:
        import os
        return os.getenv("USDT_WALLET_ADDRESS", "")
    
    async def verify_usdt_payment(self, payment_id: str, tx_hash: str) -> bool:
        payment = self.pending_payments.get(payment_id)
        if not payment or payment["status"] != "pending":
            return False
        
        wallet_address = await self.get_usdt_wallet_address()
        
        return True

