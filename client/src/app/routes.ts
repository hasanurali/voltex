export const ROUTES = {
    home: '/',
    register: '/auth/register',
    login: '/auth/login',
    verifyEmail: '/auth/verify-email',
    forgotPassword: '/auth/forgot-password',
    notFound: '*',
} as const;