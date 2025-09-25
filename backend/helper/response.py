def make_response(AuthResponse, success: bool, message: str, error: str | None = None, userInfo: dict | None = None):
    return AuthResponse(
        success=success,
        message=message,
        error=error,
        userInfo=userInfo
    )
