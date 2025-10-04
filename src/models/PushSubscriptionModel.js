// models/pushSubscription.js
export default (sequelize, DataTypes) => {
  const PushSubscription = sequelize.define("PushSubscription", {
    id_subscription: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    endpoint: { type: DataTypes.TEXT, allowNull: false },
    keys: { type: DataTypes.JSONB, allowNull: false }, // {p256dh, auth}
    vapidKeys: { type: DataTypes.JSONB, allowNull: true }, 
    user_agent: { type: DataTypes.STRING, allowNull: true }, 
    room: { type: DataTypes.STRING, allowNull: true }, // e.g. roomId or id_structure
    id_utilisateur: { type: DataTypes.UUID, allowNull: true }, // nullable for anonymous
  }, {
    tableName: "push_subscriptions",
    timestamps: true,
  });

  PushSubscription.associate = (models) => {
    //PushSubscription.belongsTo(models.Utilisateur, { foreignKey: "id_utilisateur" });
  };

  return PushSubscription;
};
