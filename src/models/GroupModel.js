import { time } from "console";
import { DataTypes } from "sequelize";
import { v4 as uuidv4 } from "uuid";


export default (sequelize) => {
    const Group = sequelize.define("Group", {
    id_group: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false },
    nom: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT , allowNull: true },
    createdBy: { type: DataTypes.UUID, allowNull: true  }
  }, { 
        tableName: "groups",
        timestamps: true
   });

   Group.associate = (models) => {
      Group.hasMany(models.Message, { foreignKey: "id_group" });
   }
    return Group;
};