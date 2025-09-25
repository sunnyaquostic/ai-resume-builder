from datetime import datetime
from models.userModel import update_users
from core.config import settings

def subscribe_user(user_id: str, subscription_id: str, sub_date: datetime) -> None:
    try:
        data = {
            "subscription_date": sub_date,
            "subscription_expiry_date": sub_date.replace(month=sub_date.month + 1)
        }

        res = update_users(
            settings.APPWRITE_DATABASE_ID,
            settings.APPWRITE_USER_COLLECTION_ID,
            user_id,
            data
        )
        print(f"User {user_id} subscribed successfully: {res}")

    except Exception as e:
        print(f"Error subscribing user {user_id}: {str(e)}")