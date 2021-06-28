import { Model, DataTypes } from 'sequelize'
import sequelize from './sequelize'

class User extends Model {}

User.init(
  {
    nickname: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    tableName: 'user',
    modelName: 'user',
    timestamps: true,
    underscored: true,
  }
)

export default User
