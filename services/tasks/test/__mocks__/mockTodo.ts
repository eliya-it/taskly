import SequelizeMock from "sequelize-mock";

// Create a mock database connection
const DBConnectionMock = new SequelizeMock();

// Define your mock model
const MockTodoModel = DBConnectionMock.define("Todo", {
  id: {
    type: "INTEGER",
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: "STRING",
    allowNull: false,
  },
  urgent: {
    type: "BOOLEAN",
    defaultValue: false,
  },
  user_id: {
    type: "INTEGER",
    allowNull: false,
  },
});

export default MockTodoModel;
