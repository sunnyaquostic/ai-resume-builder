from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse
from api.auth import authenticate_user
from core.config import settings
from helper.subscription import subscribe_user
from datetime import datetime, timezone
from lib.stripe import create_checkout
import stripe 

router = APIRouter(
    prefix="/checkout",
    tags=["checkout"],  
)

@router.post("/webhook")
def stripe_webhook(request: Request):
    payload = request.body()
    sig_header = request.headers.get("stripe-signature")
    event = None

    try:
        event = stripe.Webhook.construct_event(
            payload=payload,
            sig_header=sig_header,
            secret=settings.STRIPE_WEBHOOK_SECRET_KEY
        )
    except ValueError as e:
        return JSONResponse(status_code=400, content={"error": f"Invalid payload: {str(e)}"})
    except stripe.error.SignatureVerificationError as e:
        return JSONResponse(status_code=400, content={"error": f"Invalid signature: {str(e)}"})

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]

        user_id = session.get("client_reference_id")
        subscription_id = session.get("subscription")
        created_ts = session.get("created")

        if not user_id:
            return JSONResponse(status_code=400, content={"message": "Missing user_id in session"})

        sub_date = datetime.fromtimestamp(created_ts, tz=timezone.utc)

        subscription = stripe.Subscription.retrieve(subscription_id)
        expiry_ts = subscription["current_period_end"] 
        expiry_date = datetime.fromtimestamp(expiry_ts, tz=timezone.utc)

        subscribe_user(user_id, subscription_id, sub_date, expiry_date)

        return JSONResponse(status_code=200, content={
            "status": "payment success",
            "user": user_id,
            "email": session.get("customer_email"),
            "subscription_id": subscription_id,
            "subscription_date": sub_date.isoformat(),
            "expiry_date": expiry_date.isoformat()
        })

    return JSONResponse(status_code=204, content={"status": "no event found"})

@router.post("/create-checkout-session")
def create_checkout_session(data: str, current_user: dict = Depends(authenticate_user)):
    try:
        user_id = current_user.get("userId")
        email = current_user.get("email")
        name = current_user.get("name", "Valued Customer")
        format = data

        if not user_id or not email:
            return JSONResponse(status_code=400, content={"error": "User not authenticated"})
        
        create_checkout_session = create_checkout(
            data = {   
                "format": format,    
                "user_id": user_id,
                "email": email,
                "name": name
            }
        )

        return JSONResponse(status_code=200, content={"checkout_url": create_checkout_session.url})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
