const AUTH_MESSAGES = Object.freeze({
    REGISTER_SUCCESS: "Registration successful",
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",
    TOKEN_REFRESH_SUCCESS: "Token refreshed successfully",

    UNABLE_TO_SEND_OTP: "Unable to send OTP Please try again later",
    VERIFICATION_SESSION_EXPIRED: "Verification session expired Please login again",
    EMAIL_VERIFIED: "Email verified successfully",
    EMAIL_ALREADY_VERIFIED: "Email already verified",
    OTP_SENT_SUCCESS: "Otp sent successfully",
    VERIFY_YOUR_EMAIL: "Verify your email",

    UNAUTHORIZED: "You are not authorized",

    INVALID_CREDENTIALS: "Invalid email or password",
    INVALID_OTP: "Invalid OTP",

    PASSWORD_RESET: "Successfully sent a password reset link to email, if it exists"
});

export default AUTH_MESSAGES;