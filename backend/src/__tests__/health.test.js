const request = require("supertest");
const app = require("../app");

// Confirms the Express app boots and responds without needing a real Mongo
// connection or a listening port — proves the app.js/server.js split works.
describe("GET /api/health", () => {
  test("responds with 200 and an ok status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: "ok" });
  });
});

describe("unknown route", () => {
  test("responds with 404 via the notFound handler", async () => {
    const res = await request(app).get("/api/this-route-does-not-exist");
    expect(res.status).toBe(404);
  });
});