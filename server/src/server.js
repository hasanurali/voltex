import http from "http";

import app from "./app.js";
import env from "./config/env.js";
import connectMongoDb from "./config/db.js";
import { log } from "./shared/utils/index.js";
import { initializeSocket } from "./shared/socket/socket.js";


// Crash Handler
const handleCrash = (err) => {

    const errorObj = err instanceof Error ? err : new Error(err);

    log(`Application Crashed!
        Message: ${errorObj.message}
        Time: ${new Date().toISOString()}
        Stack Trace: ${errorObj.stack}`);

    process.exit(1);
};

// Listen both types of crashes
process.on('uncaughtException', handleCrash);
process.on('unhandledRejection', handleCrash);


// Create server
const server = http.createServer(app);

// Initialize Socket
initializeSocket(server);

const PORT = env.PORT;

; (async () => {

    try {

        await connectMongoDb();

        server.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        });

    } catch (error) {
        console.error(`Starting server Error: ${error}`);
        process.exit(1);
    };

})();