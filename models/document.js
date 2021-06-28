import { Model, DataTypes } from 'sequelize'
import sequelize from './sequelize'
import User from './user'

class Document extends Model {}

Document.init(
  {
    topic: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.TEXT),
      allowNull: false,
      defaultValue: [],
    },
    content: {
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
    tableName: 'document',
    timestamps: true,
    underscored: true,
  }
)

Document.User = Document.belongsTo(User, {
  foreignKey: {
    name: 'userId',
    field: 'user_id',
    allowNull: false,
  },
})

export default Document
