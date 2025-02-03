import { sequelize } from "../models/userModel";

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
