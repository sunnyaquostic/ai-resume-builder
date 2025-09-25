from enum import Enum

class FormatEnum(Enum):
    FORMAT_1 = "format-1"
    FORMAT_2 = "format-2"
    FORMAT_3 = "format-3"
    
class webhookEventEnum(Enum):
    CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed'
    PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded'
    PAYMENT_INTENT_PAYMENT_FAILED = 'payment_intent.payment_failed'

    
    