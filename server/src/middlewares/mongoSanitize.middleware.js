import mongoSanitizer from "express-mongo-sanitize";

const mongoSanitizeMiddleware = (req, res, next) => {

    const sanitizedBody = mongoSanitizer.sanitize(req.body || {});
    const sanitizedParams = mongoSanitizer.sanitize(req.params || {});
    const sanitizedQuery = mongoSanitizer.sanitize(req.query || {});

    req.body = sanitizedBody;
    req.params = sanitizedParams;

    Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        configurable: true,
        enumerable: true
    });

    next();
};

export default mongoSanitizeMiddleware;