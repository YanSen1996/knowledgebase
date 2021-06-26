import { Model, DataTypes } from "sequelize";
import sequelize from "./sequelize";

class PasswordResetToken extends Model {}

PasswordResetToken.init(
  {
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    token: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: true,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    dueAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "password_reset_token",
    modeleName: "passwordResetToken",
    timestamps: true,
    underscored: true,
  }
);

export default PasswordResetToken;
