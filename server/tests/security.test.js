import request from "supertest";

import app from "../src/app.js";
import env from "../src/config/env.js";


describe("API Security Hardening Tests", () => {

  // Check Security Headers
  it("should enforce robust HTTP security headers via Helmet", async () => {
    const response = await request(app).get("/");

    expect(response.headers["x-content-type-options"]).toBe("nosniff");
    expect(response.headers["x-frame-options"]).toBe("SAMEORIGIN");
    expect(response.headers["x-dns-prefetch-control"]).toBe("off");
  });

  // Check CORS Rules
  it("should permit requests from configured origins with credential support", async () => {
    const targetOrigin = env.CLIENT_URL;

    const response = await request(app).get("/").set("Origin", targetOrigin);

    expect(response.headers["access-control-allow-credentials"]).toBe("true");
    expect(response.headers["access-control-allow-origin"]).toBe(targetOrigin);
  });

  // Check Input Protection and Sanitization
  it("should intercept and safely sanitize malicious NoSQL injection payloads", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: { "$gt": "" },
      password: "password123"
    });

    expect(response.status).toBe(400);
  });

  // Check Strict Rate Limiting
  it("should throttle rapid authentication requests and enforce a 429 restriction tier", async () => {
    const maxRequests = 5;
    const loginPayload = {
      email: "test@voltex.com",
      password: "wrong_passwordkjdbH*"
    };

    for (let i = 0; i < maxRequests; i++) {
      await request(app).post("/api/v1/auth/login").send(loginPayload);
    }

    const blockedResponse = await request(app).post("/api/v1/auth/login").send(loginPayload);
    console.log("SERVER RESPONSE STATUS:", blockedResponse.status, blockedResponse.body);

    expect(blockedResponse.status).toBe(429);
    expect(blockedResponse.body.message).toBe("Too many authentication attempts. Please try again after 15 minutes");
  });
});