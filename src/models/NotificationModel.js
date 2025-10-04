// models/notification.js
export default (sequelize, DataTypes) => {
  const Notification = sequelize.define("Notification", {
    id_notification: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    titre: { type: DataTypes.STRING, allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    url: { type: DataTypes.STRING, allowNull: true },
    lu: { type: DataTypes.BOOLEAN, defaultValue: false },
    meta: { type: DataTypes.JSONB, allowNull: true },
    id_utilisateur: { type: DataTypes.UUID, allowNull: false },
  }, {
    tableName: "notifications",
    timestamps: true,
  });

  Notification.associate = (models) => {
   // Notification.belongsTo(models.Utilisateur, { foreignKey: "id_utilisateur" });
  };

  return Notification;
};
