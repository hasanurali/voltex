import type { UseFormSetError, FieldValues } from 'react-hook-form';
import { isAxiosError } from 'axios';
import type { ApiErrorResponse } from '@/lib';

const fieldApiError = <T extends FieldValues>(error: unknown, setError: UseFormSetError<T>) => {

    if (!isAxiosError<ApiErrorResponse>(error)) {
        return;
    };

    const errors = error.response?.data?.errors;

    if (!Array.isArray(errors) || !errors.length) {
        return;
    };

    const groupedErrors = errors.reduce<Record<string, string>>((acc, { path, msg }) => {

        if (path && !acc[path]) {
            acc[path] = msg;
        };

        return acc;

    }, {});

    Object.entries(groupedErrors).forEach(([path, msg]) => {
        setError(path as any, {
            type: 'server',
            message: msg
        });
    });
};

export default fieldApiError;