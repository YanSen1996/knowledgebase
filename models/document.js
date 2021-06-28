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
  },
  {
    sequelize,
    tableName: 'knowledgebase',
    timestamps: true,
    uderscored: true,
  }
)

Document.User = Document.belongsTo(User, {
  foreignKey: {
    name: 'userID',
    field: 'user_id',
    allowNull: false,
  },
})
