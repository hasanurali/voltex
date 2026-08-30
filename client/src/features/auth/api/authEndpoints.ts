export const AUTH_ENDPOINTS = {
    register: '/auth/register',
    verifyEmail: '/auth/verify-email',
    resendOtp: '/auth/resend-otp',
    login: '/auth/login',
    logout: '/auth/logout',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    refreshToken: '/auth/refresh-token',
    me: '/auth/me'
} as const;