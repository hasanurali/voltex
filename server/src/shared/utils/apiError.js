class ApiError extends Error {
    constructor(status, message, errors = []) {

        super(message);

        this.status = status;
        this.message = message;
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
};

export default ApiError;