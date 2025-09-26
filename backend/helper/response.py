def make_response(AuthResponse, success: bool, message: str, error: str | None = None, userInfo: dict | None = None):
    return AuthResponse(
        success=success,
        message=message,
        error=error,
        userInfo=userInfo
    )
    
    
def admin_response(success: bool, message: str, error: str | None = None, data: dict | None = None):
    return {
        "success": success,
        "message": message,
        "error": error,
        "data": data
    }
