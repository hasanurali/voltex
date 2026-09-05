export const ROUTES = {
    home: '/',
    register: '/auth/register',
    login: '/auth/login',
    verifyEmail: '/auth/verify-email',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    notFound: '*',
} as const;