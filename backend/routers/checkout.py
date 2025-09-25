from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from core.config import settings
from helper.subscription import subscribe_user
from datetime import datetime
import json
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
            payload,
            sig_header=sig_header,
            secret=settings.STRIPE_WEBHOOK_SECRET_KEY   
        )
    except ValueError as e:
        print('Error parsing payload: {}'.format(str(e)))
        return JSONResponse(status_code=400, content={"message": f"Invalid payload {str(e)}"})
    
    except stripe.error.SignatureVerificationError as e:
        print('Error verifying webhook signature: {}'.format(str(e)))
        return JSONResponse(status_code=400, content={"message": f"Invalid signature {str(e)}"})

    if event['type'] == "checkout.session.completed":
        session = event.data.object
        
        # update user subscription status in the database 
        subscribe_user(
            user_id=session.get("client_reference_id"),
            subscription_id=session.get("subscription"),
            sub_date=datetime.fromtimestamp(session.get("created"))
        )
        
        return JSONResponse(status_code=200, content={
            "status": "payment success",
            "user": session.get("client_reference_id"),
            "email": session.get("customer_email"),
            "date": session.get("created")
        })


    return JSONResponse(status_code=204, content={"status": "no event found"})