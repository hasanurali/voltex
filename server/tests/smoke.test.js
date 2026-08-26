import request from "supertest";

import app from "../src/app.js";


describe("API Smoke Tests", () => {

    it("should return API running", async () => {

        const response = await request(app).get("/");

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            success: true,
            message: "API Running"
        });
    });
});