import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '@/lib';

const getApiErrorMessage = (error: unknown): string => {

    if (isAxiosError<ApiErrorResponse>(error)) {
        return error.response?.data?.message ?? 'Something went wrong';
    };

    return 'Something went wrong';
};

export default getApiErrorMessage;