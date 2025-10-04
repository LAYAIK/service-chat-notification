import { Sequelize,DataTypes } from 'sequelize'; // Importe Sequelize et DataTypes directement
import sequelize from '../config/sequelizeInstance.js'; // Import the Sequelize instance
import Notification from './NotificationModel.js';
import PushSubscription from './PushSubscriptionModel.js';
import Message from './MessageModel.js';
import  Group from './GroupModel.js';
import GroupUtilisateur from './GroupUtilisateurModel.js';

const db = {};

// Initialisez les modèles avec la connexion Sequelize et DataType

db.Notification = Notification(sequelize, DataTypes);
db.PushSubscription = PushSubscription(sequelize, DataTypes);
db.Message = Message(sequelize, DataTypes);
db.Group = Group(sequelize, DataTypes);
db.GroupUtilisateur = GroupUtilisateur(sequelize, DataTypes);

// Définissez les associations après que tous les modèles ont été chargés
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Sequelize = Sequelize; // Sequelize est déjà importé en tant que classe
db.sequelize = sequelize; // La connexion est déjà importé

export default db; // L'exportation par défaut est déjà en place