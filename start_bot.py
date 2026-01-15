"""
Quick start script for TokenHunter bot
Checks configuration and starts the bot
"""
import sys
import os
from pathlib import Path

# Check if .env exists
env_path = Path(".env")
if not env_path.exists():
    print("❌ Error: .env file not found!")
    print("Run: python scripts/setup_env.py")
    sys.exit(1)

# Check if token is set
from dotenv import load_dotenv
load_dotenv()

token = os.getenv("TELEGRAM_BOT_TOKEN", "")
if not token:
    print("❌ Error: TELEGRAM_BOT_TOKEN not set in .env file!")
    sys.exit(1)

if len(token) < 40:
    print(f"⚠️  Warning: Token seems too short ({len(token)} chars)")
    print("Please check your .env file")

print("✅ Configuration OK")
print(f"✅ Token loaded: {token[:10]}...{token[-10:]}")
print("\n🚀 Starting bot...\n")

# Start the bot
from main import *
if __name__ == "__main__":
    pass

