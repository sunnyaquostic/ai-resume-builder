from datetime import datetime
from models.userModel import update_users
from core.config import settings
from datetime import datetime, timezone

def subscribe_user(user_id: str, subscription_id: str, sub_date: datetime, expiry_date: datetime) -> None:
    try:
        data = {
            "subscription_id": subscription_id,
            "subscription_date": sub_date.isoformat(),
            "subscription_expiry_date": expiry_date.isoformat()
        }

        res = update_users(
            settings.APPWRITE_DATABASE_ID,
            settings.APPWRITE_USER_COLLECTION_ID,
            user_id,
            data
        )
        print(f"✅ User {user_id} subscribed successfully: {res}")

    except Exception as e:
        print(f"❌ Error subscribing user {user_id}: {str(e)}")
