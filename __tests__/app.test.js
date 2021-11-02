require("dotenv").config();

// const { execSync } = require("child_process");

const fakeRequest = require("supertest");
const app = require("../lib/app");
const client = require("../lib/client");

// const categories = require("../data/categories");

describe("app routes", () => {
    describe.skip("routes", () => {
        let token;

        beforeAll(async () => {
            // execSync("npm run setup-db");

            await client.connect();
            const signInData = await fakeRequest(app)
                .post("/auth/signin")
                .send({
                    email: "john@arbuckle.com",
                    password: "1234",
                });

            token = signInData.body.token; // eslint-disable-line
        }, 10000);

        test("GET /purchases returns list of purchases", async () => {
            const data = await fakeRequest(app)
                .get("/api/purchases")
                .set("Authorization", token)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(data.body).toEqual(
                expect.arrayContaining([
                    {
                        id: expect.any(Number),
                        user_id: expect.any(Number),
                        description: expect.any(String),
                        category_id: expect.any(Number),
                        timestamp: expect.any(String),
                        cost: expect.any(Number),
                    },
                ])
            );
        });

        test("GET /categories for John", async () => {
            // const expectation = categories;
            const data = await fakeRequest(app)
                .get("/api/categories")
                .set("Authorization", token)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(data.body).toEqual(
                expect.arrayContaining([
                    {
                        id: expect.any(Number),
                        parent_id: expect.any(Number),
                        description: expect.any(String),
                        user_id: expect.any(Number),
                    },
                ])
            );
        });

        const newPurchase = {
            user_id: 1,
            description: "Hungry man TV dinner x 4",
            category_id: 2,
            timestamp: "1630297328170",
            cost: 1996,
        };

        test("POST /purchases to authorized user list", async () => {
            const data = await fakeRequest(app)
                .post("/api/purchases")
                .send(newPurchase)
                .set("Authorization", token)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(data.body).toEqual({
                id: expect.any(Number),
                user_id: expect.any(Number),
                description: expect.any(String),
                category_id: expect.any(Number),
                timestamp: expect.any(String),
                cost: expect.any(Number),
            });
        });

        const newCategory = {
            parent_id: 4,
            description: "dog food",
            user_id: 1,
        };

        test("POST /categories for John", async () => {
            const data = await fakeRequest(app)
                .post("/api/categories")
                .send(newCategory)
                .set("Authorization", token)
                .expect("Content-Type", /json/)
                .expect(200);
            const { id, ...rest } = data.body;
            expect(rest).toEqual(newCategory);
            expect(id).toBeGreaterThan(0);
        });

        test.skip("GET /api/recurring route for John", async () => {
            const data = await fakeRequest(app)
                .get("/api/recurring")
                .set("Authorization", token)
                .expect("Content-Type", /json/)
                .expect(200);
            a;

            expect(data.body).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        user_id: expect.any(Number),
                        description: expect.any(String),
                        cost: expect.any(Number),
                        category_id: expect.any(Number),
                        // frequency: expect.anything(),
                        start_timestamp: expect.any(Number),
                    }),
                ])
            );
        });

        test("POST /recurring new subscription for john", async () => {
            const expectation = {
                id: 3,
                user_id: 1,
                description: "Mens health magazine",
                cost: 3996,
                category_id: 9,
                frequency: 2628000000,
                start_timestamp: "1630297328170",
                stop_timestamp: "1630297328170",
            };
            const newRecurringPurchase = {
                user_id: 1,
                description: "Mens health magazine",
                cost: 3996,
                category_id: 9,
                frequency: 2628000000,
                start_timestamp: 1630297328170,
                stop_timestamp: 1630297328170,
            };

            const data = await fakeRequest(app)
                .post("/api/recurring")
                .send(newRecurringPurchase)
                .set("Authorization", token)
                .expect("Content-Type", /json/)
                .expect(200);

            expect(data.body).toEqual(expectation);
        });

        test("PUT /recurring updates scientific american cost", async () => {
            const updatedRecurringPurchase = {
                user_id: 1,
                description: "Scientific American",
                cost: 4.0,
                category_id: 9,
                frequency: "monthly",
                start_timestamp: 1630297328170,
                stop_timestamp: 1630297328170,
            };
            const expectation = {
                id: 2,
                user_id: 1,
                description: "Scientific American",
                cost: 400,
                category_id: 9,
                frequency: "monthly",
                start_timestamp: "1630297328170",
                stop_timestamp: "1630297328170",
            };

            const data = await fakeRequest(app)
                .put("/api/recurring/2")
                .send(updatedRecurringPurchase)
                .set("Authorization", token)
                .expect("Content-Type", /json/)
                .expect(200);
            expect(data.body).toEqual(expectation);
        });

        test("DELETE /purchases deletes an object in the purchase array by query id", async () => {
            const data = await fakeRequest(app)
                .delete("/api/purchases/8")
                .set("Authorization", token)
                .expect(200)
                .expect("Content-Type", /json/);

            expect(data.body).toEqual({ ...newPurchase, id: 8 });
            expect(data.body.id).toBeGreaterThan(0);
        });

        test("DELETE /categories deletes a category from the category array", async () => {
            const data = await fakeRequest(app)
                .delete("/api/categories/11")
                .set("Authorization", token)
                .expect(200)
                .expect("Content-Type", /json/);
            expect(data.body).toEqual({ ...newCategory, id: 11 });
            expect(data.body.id).toBeGreaterThan(0);
        });

        afterAll((done) => {
            return client.end(done);
        });
    });
});
