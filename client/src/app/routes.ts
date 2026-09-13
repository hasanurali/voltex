export const ROUTES = {
    register: '/auth/register',
    login: '/auth/login',
    verifyEmail: '/auth/verify-email',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',

    home: '/',
    profile: '/profile/:username',

    notFound: '*',
} as const;