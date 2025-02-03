import "./__mocks__/tasklySharedMock";
import "./__mocks__/aws-sdk";

import dotenv from "dotenv";
import { sequelize } from "../models/todoModel";

dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  console.log("Starting DB sync...");
  await sequelize.sync({ force: true });
});

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => jest.clearAllMocks());
afterAll(async () => {
  await sequelize.close();
});
