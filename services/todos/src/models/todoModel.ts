import { Sequelize, Model, DataTypes, Optional } from "sequelize";
import { DB_URL } from "../utils/init";

export const sequelize =
  process.env.NODE_ENV === "test"
    ? new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
      })
    : new Sequelize(DB_URL);

const todoSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: "user_id",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "name",
    validate: {
      len: {
        args: [2, 120] as [number, number],
        msg: "Name must be between 2 and 120 characters.",
      },
    },
  },
  urgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    validate: {
      isBoolean(value: any) {
        if (typeof value !== "boolean") {
          throw new Error("Urgent must be a boolean");
        }
      },
    },
  },
  status: {
    type: DataTypes.ENUM("not-started", "in-progress", "finished"),
    defaultValue: "not-started",
    allowNull: false,
  },
};

interface TodoAttributes {
  id: string;
  userId: string;
  name: string;
  urgent: boolean;
  status: "not-started" | "in-progress" | "finished";
  createdAt?: Date;
  updatedAt?: Date;
}

interface TodoCreationAttributes extends Optional<TodoAttributes, "id"> {}

class Todo
  extends Model<TodoAttributes, TodoCreationAttributes>
  implements TodoAttributes
{
  public id!: string;
  public userId!: string;
  public name!: string;
  public urgent!: boolean;
  public status!: "not-started" | "in-progress" | "finished";
  public createdAt!: Date;
  public updatedAt!: Date;
}

Todo.init(todoSchema, {
  sequelize,
  modelName: "Todo",
  tableName: "todos",
  underscored: true,
  timestamps: true,
});

export default Todo;
