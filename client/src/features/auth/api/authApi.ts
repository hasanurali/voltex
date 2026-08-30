import { api } from '@/lib';
import type { LoginFormValues, RegisterFormValues, ForgotPasswordFormValues } from '../schemas/authSchema';
import type * as authTypes from '../types';
import { AUTH_ENDPOINTS } from "./authEndpoints";


export const registerUser = async (payload: RegisterFormValues): Promise<authTypes.RegisterResponse['data']> => {

    const { confirmPassword, ...body } = payload;

    const res = await api.post<authTypes.RegisterResponse>(AUTH_ENDPOINTS.register, body);

    return res.data.data;
};

export const verifyEmail = async (payload: authTypes.VerifyEmailPayload): Promise<authTypes.AuthUser> => {

    const res = await api.post<authTypes.VerifyEmailResponse>(AUTH_ENDPOINTS.verifyEmail, payload);

    return res.data.data;
};

export const resendOtp = async (payload: authTypes.ResendOtpPayload): Promise<void> => {

    await api.post<authTypes.ResendOtpResponse>(AUTH_ENDPOINTS.resendOtp, payload);
};

export const loginUser = async (payload: LoginFormValues): Promise<authTypes.AuthUser> => {

    const res = await api.post<authTypes.LoginResponse>(AUTH_ENDPOINTS.login, payload);

    return res.data.data;
};

export const logoutUser = async (): Promise<void> => {

    await api.post<authTypes.LogoutResponse>(AUTH_ENDPOINTS.logout);
};

export const forgotPassword = async (payload: ForgotPasswordFormValues): Promise<void> => {

    await api.post<authTypes.ForgotPasswordResponse>(AUTH_ENDPOINTS.forgotPassword, payload);
};

export const resetPassword = async (payload: authTypes.ResetPasswordPayload): Promise<void> => {

    await api.post<authTypes.ResetPasswordResponse>(AUTH_ENDPOINTS.resetPassword, payload);
};

export const refreshToken = async (): Promise<void> => {

    await api.post<authTypes.RefreshTokenResponse>(AUTH_ENDPOINTS.refreshToken);
};

export const currentUser = async (): Promise<authTypes.AuthUser> => {

    const res = await api.get<authTypes.AuthUserResponse>(AUTH_ENDPOINTS.me);

    return res.data.data;
};