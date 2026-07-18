import express from "express";
import cors from "cors";


const app = express();


// Define middlewares
app.use(cors());
app.use(express.json());


// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "API Running"
    })
});


// Not Found Route
app.use((req, res) => {
    return res.status(404).json({
        success: false,
        message: "Route not found"
    })
});

export default app;