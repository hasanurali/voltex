import { QueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { getApiErrorMessage } from '@/utils';
import type { ApiErrorResponse } from './types/api';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            staleTime: 1000 * 60, // 1 minute
            refetchOnWindowFocus: false,
        },
        mutations: {
            onError: (error, _variables, _context, mutation) => {

                if (mutation.meta?.skipGlobalErrorToast) {
                    return;
                };

                const status = isAxiosError(error) ?
                    error.response?.status
                    :
                    null;

                if (mutation.meta?.skip401ErrorToast && status === 401) {
                    return;
                };

                const hasFieldErrors = isAxiosError<ApiErrorResponse>(error) &&
                    Array.isArray(error.response?.data?.errors) &&
                    error.response.data.errors.length > 0;

                if (hasFieldErrors) {
                    return;
                };

                toast.error(getApiErrorMessage(error));
            },
        },
    },
});