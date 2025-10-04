// models/Message.js
import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";


export default (sequelize, DataTypes) => {
const Message = sequelize.define('Message', {
  id_message: {
    type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  id_group: {
    type: DataTypes.UUID,
    allowNull: true
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});
  return Message;
}