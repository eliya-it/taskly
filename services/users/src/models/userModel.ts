import { Model, DataTypes, Optional, Sequelize } from "sequelize";
import { DB_URL } from "../utils/init";
export const sequelize =
  process.env.NODE_ENV === "test"
    ? new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
      })
    : new Sequelize(DB_URL);

const userSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "name",
    validate: {
      len: {
        args: [2, 50] as [number, number],
        msg: "Name must be between 2 and 50 characters.",
      },
    },
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    field: "email",
    validate: {
      isEmail: {
        msg: "Must be a valid email address",
      },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "password",
    validate: {
      len: {
        args: [8, 120] as [number, number],
        msg: "Password should be between 8 and 120 characters",
      },
    },
  },
  confirmPassword: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "confirm_password",
    validate: {
      len: {
        args: [8, 120] as [number, number],
        msg: "Confirm Password should be between 8 and 120 characters",
      },
    },
  },
  passwordResetToken: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "password_reset_token",
  },
  passwordResetExpires: {
    type: DataTypes.DATE,
    allowNull: true,
    field: "password_reset_expires",
  },
};

interface UserAttributes {
  id: number;

  name: string;
  email: string;
  password: string | undefined;
  confirmPassword?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, "id"> {}

class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  public id!: number;

  public name!: string;
  public email!: string;
  public password!: string | undefined;
  public confirmPassword?: string;
  public passwordResetToken?: string;
  public passwordResetExpires?: Date;
}

User.init(userSchema, {
  sequelize,
  modelName: "User",
  tableName: "users",
  underscored: true,
  timestamps: false,
});

export default User;
