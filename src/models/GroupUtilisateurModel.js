import { DataTypes } from "sequelize";

export default (sequelize) => {
  const GroupUtilisateur = sequelize.define("GroupUtilisateur", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    id_group: { type: DataTypes.UUID, allowNull: false },
    id_utilisateur: { type: DataTypes.UUID, allowNull: false },
    role: { type: DataTypes.STRING, defaultValue: "member" } // admin/member
  }, { tableName: "group_utilisateurs", timestamps: true });

//    GroupUtilisateur.associate= (model) =>{

//    }
  return GroupUtilisateur
};