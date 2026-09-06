export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
};

export interface ApiFieldError {
    type: string;
    value: string;
    msg: string;
    path: string;
    location: string;
};

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: ApiFieldError[];
};