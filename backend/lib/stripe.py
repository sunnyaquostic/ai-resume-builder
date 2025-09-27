import stripe
import uuid 
from typing import cast
from core.config import settings
from schema.stripeSchema import CreateSessionSchema

stripe.api_key = settings.STRIPE_API_SECRET_KEY  # type: ignore[attr-defined]

def create_checkout(data: CreateSessionSchema):
    session  = stripe.checkout.Session.create(  # type: ignore[attr-defined]
        payment_method_types=["card"],
        mode="payment",
        client_reference_id=data.user_id,
        success_url="http://localhost:5173/payment/success",
        cancel_url="http://localhost:5173/payment/cancel",
        line_items=[
            {
                "price_data": {
                    "currency": "usd",
                    "product_data": {
                        "name": f"Monthly Subscription to AI Resume Builder - {data.format.value}",
                    },
                    "unit_amount": 1000,
                },
                "quantity": 1,
            }
        ],
        customer_email=data.email,
        created=stripe.util.datetime_to_unix(stripe.util.now()),  # type: ignore[attr-defined]
        idempotency_key=str(uuid.uuid4())
    )

def checkout_lists():
    sessions = stripe.checkout.Session.list(limit=3) # type: ignore[attr-defined]
    return cast(stripe.checkout.SessionList, sessions)  # type: ignore[name-defined]
