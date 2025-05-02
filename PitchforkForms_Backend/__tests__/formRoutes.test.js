const request = require("supertest");
const express = require("express");
const formRoutes = require("../routes/formRoutes");
const dbQuery = require("../utils/queryHelper");
const db = require("../config/database");
const jwt = require("jsonwebtoken");

jest.mock("../utils/queryHelper", () => jest.fn());
jest.mock("../config/database", () => ({
  beginTransaction: jest.fn(),
  commit: jest.fn(),
  rollback: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn((token, secret, callback) => {
    callback(null, { id: 1, email: "test@example.com", role: "user" });
  }),
  sign: jest.fn(() => "fake-token")
}));

const app = express();
app.use(express.json());
app.use("/form", formRoutes);

describe("Form actions",()=>{
    describe("POST /form/save-forms", () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });
      
        it("should return 201 and formId on successful save", async () => {
          db.beginTransaction.mockImplementation((cb) => cb(null));
          db.commit.mockImplementation((cb) => cb(null));
      
          dbQuery
            .mockResolvedValueOnce({ insertId: 123 }) // insert form
            .mockResolvedValueOnce({ insertId: 456 }) // insert question
            .mockResolvedValueOnce({}) // insert answer 1
            .mockResolvedValueOnce({}); // insert answer 2
      
          const res = await request(app)
            .post("/form/save-forms")
            .set("Authorization", "Bearer valid-token")
            .send({
              name: "Teszt űrlap",
              questions: [
                {
                  text: "Mi a kedvenc színed?",
                  type: "radio",
                  score: 10,
                  answers: [
                    { text: "Kék", is_right: true },
                    { text: "Piros", is_right: false },
                  ],
                },
              ],
            });
      
          expect(res.statusCode).toBe(201);
          expect(res.body).toEqual({
            message: "Űrlap sikeresen létrehozva!",
            formId: 123,
          });
          expect(db.commit).toHaveBeenCalled();
        });
      
        it("should return 400 if name or questions are missing", async () => {
          const res = await request(app)
            .post("/form/save-forms")
            .set("Authorization", "Bearer valid-token")
            .send({}); // missing data
      
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual({ message: "Hiányzó vagy hibás adatok!" });
        });
      
        it("should return 500 if beginTransaction fails", async () => {
          db.beginTransaction.mockImplementation((cb) =>
            cb(new Error("beginTransaction error"))
          );
      
          const res = await request(app)
            .post("/form/save-forms")
            .set("Authorization", "Bearer valid-token")
            .send({
              name: "Teszt űrlap",
              questions: [],
            });
      
          expect(res.statusCode).toBe(500);
          expect(res.body).toEqual({ message: "Szerverhiba!" });
        });
      });
      describe("PUT /form/update-form/:id", () => {
        beforeEach(() => {
          jest.clearAllMocks();
        });
      
        it("should return 200 if form is successfully updated", async () => {
          db.beginTransaction.mockImplementation((cb) => cb(null));
          db.commit.mockImplementation((cb) => cb(null));
      
          // 1. UPDATE forms
          dbQuery
            .mockResolvedValueOnce({}) // update form
            .mockResolvedValueOnce({}) // update question
            .mockResolvedValueOnce({}) // delete old answers
            .mockResolvedValueOnce({}) // insert answer 1
            .mockResolvedValueOnce({}); // insert answer 2
      
          const res = await request(app)
            .put("/form/update-form/1")
            .set("Authorization", "Bearer valid-token")
            .send({
              name: "Frissített űrlap",
              questions: [
                {
                  id: 10,
                  text: "Frissített kérdés?",
                  type: "radio",
                  score: 5,
                  answers: [
                    { text: "Igen", is_right: true },
                    { text: "Nem", is_right: false },
                  ],
                },
              ],
            });
      
          expect(res.statusCode).toBe(200);
          expect(res.body).toEqual({ message: "Űrlap sikeresen frissítve!" });
          expect(db.commit).toHaveBeenCalled();
        });
      
        it("should return 400 if request body is invalid", async () => {
          const res = await request(app)
            .put("/form/update-form/1")
            .set("Authorization", "Bearer valid-token")
            .send({
              name: "",
              questions: [],
            });
      
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual({ message: "Hiányzó vagy hibás adatok!" });
        });
      
        it("should rollback and return 500 if dbQuery fails during question update", async () => {
          db.beginTransaction.mockImplementation((cb) => cb(null));
          dbQuery
            .mockResolvedValueOnce({}) // update form
            .mockRejectedValueOnce(new Error("Update kérdés hiba")); // question update
      
          db.rollback.mockImplementation((cb) => cb && cb());
      
          const res = await request(app)
            .put("/form/update-form/1")
            .set("Authorization", "Bearer valid-token")
            .send({
              name: "Frissített űrlap",
              questions: [
                {
                  id: 10,
                  text: "Frissített kérdés?",
                  type: "radio",
                  score: 5,
                  answers: [{ text: "Igen", is_right: true }],
                },
              ],
            });
      
          expect(res.statusCode).toBe(500);
          expect(res.body).toHaveProperty("message", "Szerverhiba!");
          expect(db.rollback).toHaveBeenCalled();
        });
      });
})