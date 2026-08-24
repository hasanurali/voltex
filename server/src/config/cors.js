import env from "./env.js";

const CORS_CONFIG = {
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type']
};

export default CORS_CONFIG;