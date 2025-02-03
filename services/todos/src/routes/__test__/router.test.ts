import request from "supertest";
import { app } from "../../../app";

import Todo from "../../models/todoModel";
import { generateTestToken } from "../../test/utils/jwt";

describe("Todo Routes", () => {
  let token: string;

  beforeEach(() => {
    token = generateTestToken();
  });

  describe("POST /api/todos", () => {
    it("should create a new todo successfully", async () => {
      const newTodo = {
        name: "Buy groceries",
        urgent: true,
        userId: "user-id",
      };
      try {
        const res = await request(app)
          .post("/api/todos")
          .set("Authorization", token)
          .send(newTodo);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("status", "success");
        expect(res.body.data).toHaveProperty("doc");
        expect(res.body.data.doc).toMatchObject(newTodo);
      } catch (error) {
        console.error("Test failed due to an error:", error);
        throw error;
      }
    });

    it("should return an error if name is missing", async () => {
      const createMock = jest.spyOn(Todo, "create").mockImplementation(() => {
        throw new Error("notNull Violation: Todo.name cannot be null");
      });

      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", token)
        .send({
          urgent: true,
          userId: "user-id",
        })
        .expect(400);

      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe(
        "notNull Violation: Todo.name cannot be null"
      );

      createMock.mockRestore();
    });

    it("should return an error if urgent is not a boolean", async () => {
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", token)
        .send({
          name: "Test Todo",
          urgent: "not-a-boolean",
          userId: "user-id",
        })
        .expect(400);

      expect(res.body.status).toBe("fail");
    });

    it("should return an error if name is too short", async () => {
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", token)
        .send({
          name: "A",
          urgent: true,
          userId: "user-id",
        })
        .expect(400);

      expect(res.body.status).toBe("fail");
      expect(res.body.message).toContain(
        "Validation error: Name must be between 2 and 120 characters."
      );
    });

    it("should return an error if name is too long", async () => {
      const longName = "A".repeat(122);
      const res = await request(app)
        .post("/api/todos")
        .set("Authorization", token)
        .send({
          name: longName,
          urgent: true,
          userId: "user-id",
        })
        .expect(400);

      expect(res.body.status).toBe("fail");
      expect(res.body.message).toContain(
        "Validation error: Name must be between 2 and 120 characters."
      );
    });
  });

  describe("GET /api/todos", () => {
    it("should retrieve all todos successfully", async () => {
      const res = await request(app)
        .get("/api/todos")
        .set("Authorization", token)
        .expect(200);

      expect(res.body).toHaveProperty("status", "success");
      expect(res.body.data).toHaveProperty("docs");
      expect(Array.isArray(res.body.data.docs)).toBe(true);
    });
  });

  describe("DELETE /api/todos/:id", () => {
    it("should delete a todo by ID successfully if it exists", async () => {
      const res = await request(app)
        .delete("/api/todos/1")
        .set("Authorization", token)
        .expect(200);

      expect(res.body).toHaveProperty("status", "success");
      expect(res.body.message).toBe("Todo deleted successfully");
    });

    it("should return an error if the todo does not exist", async () => {
      const res = await request(app)
        .delete("/api/todos/999")
        .set("Authorization", token)
        .expect(404);

      expect(res.body.status).toBe("fail");
      expect(res.body.message).toBe("Todo not found");
    });
  });
});
