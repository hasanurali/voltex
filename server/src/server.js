import app from "./app.js";
import env from "./config/env.js";
import connectMongoDb from "./config/db.js"

const PORT = env.PORT;

; (async () => {

    try {

        await connectMongoDb();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        });

    } catch (error) {
        console.log(`Starting server Error: ${error}`);
        process.exit(1);
    };

})();