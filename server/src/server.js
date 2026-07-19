import app from "./app.js";
import env from "./config/env.js";
import connectMongoDb from "./config/db.js";
import { log } from "./shared/utils/index.js";

const PORT = env.PORT;

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


; (async () => {

    try {

        await connectMongoDb();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        });

    } catch (error) {
        console.error(`Starting server Error: ${error}`);
        process.exit(1);
    };

})();