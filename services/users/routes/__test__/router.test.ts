import { restoreAWSMocks } from "../../test/__mocks__/awsMock";

import request from "supertest";
import { app } from "../../app";
import AWS from "aws-sdk";
import { sequelize } from "../../models/userModel";

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterEach(() => {
  restoreAWSMocks();
});

it("should send a message to SQS", async () => {
  const sqs = new AWS.SQS();
  const result = await sqs
    .sendMessage({
      QueueUrl: "https://sqs.us-east-1.amazonaws.com/123456789012/test-queue",
      MessageBody: JSON.stringify({ key: "value" }),
    })
    .promise();

  expect(result).toEqual({ MessageId: "mock-message-id" });
});

///////////////////////////
// SIGN UP
///////////////////////////
it("returns 201 on successful signup", async () => {
  await request(app)
    .post("/api/users/signup/")
    .send({
      userId: "test-user-id",
      name: "User",
      email: "user@test.com",
      password: "12341234",
      confirmPassword: "12341234",
    })
    .expect(201);
});
it("disallows duplicate emails", async () => {
  return await request(app)
    .post("/api/users/signup")
    .send({
      userId: "test-user-id",
      name: "User",
      email: "user@test.com",
      password: "12341234",
      confirmPassword: "12341234",
    })
    .expect(400);
});

it("sets a cookie after successful signup", async () => {
  const response = await request(app)
    .post("/api/users/signup/")
    .send({
      userId: "test-auth-user-id",
      name: "Auth User",
      email: "auth-user@test.com",
      password: "12341234",
      confirmPassword: "12341234",
    })
    .expect(201);
  expect(response.get("Set-Cookie")).toBeDefined();
});
it("fails if email is invalid", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      userId: "test-user",
      name: "Test User",
      email: "invalid-email",
      password: "12341234",
      confirmPassword: "12341234",
    })
    .expect(400);
});

it("fails if passwords do not match", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      userId: "test-user",
      name: "Test User",
      email: "user@test.com",
      password: "12341234",
      confirmPassword: "wrongpassword",
    })
    .expect(400);
});

///////////////////////////
// SIGN IN
///////////////////////////
it("should set a cookie after successful login", async () => {
  const response = await request(app)
    .post("/api/users/login/")
    .send({
      email: "auth-user@test.com",
      password: "12341234",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
it("should throw an error on failed signin", async () => {
  const response = await request(app)
    .post("/api/users/login/")
    .send({
      email: "auth-user@test.com",
      password: "12341222",
    })
    .expect(400);
});
it("fails if email does not exist", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: "nonexistent@test.com",
      password: "12341234",
    })
    .expect(400);
});
it("fails if email or password is missing", async () => {
  await request(app)
    .post("/api/users/login")
    .send({
      email: "",
      password: "",
    })
    .expect(400);
});

///////////////////////////
// LOGOUT
///////////////////////////
it("clears the cookie after logout", async () => {
  const response = await request(app)
    .post("/api/users/logout")
    .send({})
    .expect(200);
  const cookies = response.get("Set-Cookie");
  if (cookies) expect(cookies[0]).toMatch(/jwt=loggedout;/);
});
