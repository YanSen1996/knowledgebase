import { Model, DataTypes } from 'sequelize'

import sequelize from './sequelize'
import User from './user'

class UserToken extends Model {}

UserToken.init(
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'user_token',
    modeleName: 'userToken',
    timestamps: true,
    underscored: true,
  }
)

UserToken.User = UserToken.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id',
    allowNull: false,
  },
})

export default UserToken
