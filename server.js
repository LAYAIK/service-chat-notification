// import app from './app.js';
// import dotenv from 'dotenv'; // Si vous utilisez dotenv pour charger les variables d'environnement
// import db from './src/models/index.js'; // Importe l'objet 'db' depuis votre fichier models/index.js (avec l'extension .js)
// dotenv.config();
// const PORT = process.env.PORT || 3003;

// async function runApplication() {
//     try {
//         // Connexion à la base de données (gérée par l'import de db)
//         // Vous pouvez ajouter une vérification de connexion explicite si vous le souhaitez
//         await db.sequelize.authenticate();
//         console.log('Connecté à PostgreSQL avec succès !');

//         // Ordre correct de synchronisation Sequelize
//         // Vérifiez très attentivement ces lignes pour les fautes de frappe ou les noms de modèles incorrects
        
//         await db.Notification.sync({ alter: true });
//         await db.PushSubscription.sync({ alter: true });



//         console.log('Tables synchronisées avec succès.');

        

//         app.listen(PORT, () => {
//             console.log(`Le serveur est démarré sur le port ${PORT}`);
//         });

//     } catch (error) {
//         console.error('Erreur lors de la synchronisation des modèles ou des opérations:', error);
//         // C'est une bonne pratique de quitter le processus si la synchronisation de la base de données échoue de manière critique
//         process.exit(1);
//     }
// }

// runApplication();



import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import dotenv from 'dotenv';
dotenv.config();
import webpush from 'web-push';
import ApiRoutes from './src/routes/index.js'; // importation des routes d'authentification
import db from './src/models/index.js'; // Importe l'objet 'db' depuis votre fichier models/index.js (avec l'extension .js)

const app = express();

export const onlineUsers = new Map();

async function runApplication() {
     try {

         await db.sequelize.authenticate();
         console.log('Connecté à PostgreSQL avec succès !');

         // Ordre correct de synchronisation Sequelize
         // Vérifiez très attentivement ces lignes pour les fautes de frappe ou les noms de modèles incorrects
        
         await db.Notification.sync({ alter: true });
         await db.PushSubscription.sync({ alter: true });
         await db.Group.sync({ alter: true });
         await db.GroupUtilisateur.sync({ alter: true });
         await db.Message.sync({ alter: true });



        console.log('Tables synchronisées avec succès.');

// Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Routes API
// ⚡ Crée le serveur HTTP AVANT socket.io
const server = http.createServer(app);

// ⚡ Instancie Socket.IO avec le serveur HTTP
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
},
});

// --- Gestion socket.io ---
const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("✅ New socket connected:", socket.id);
    
    const userId = socket.handshake.query.userId;
    if (userId) {
        onlineUsers.set(userId, socket.id);
        socket.join(`user:${userId}`);
        //socket.add(socket.id);
    }
    
    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`👥 user ${userId} joined room ${roomId}`);
    });

     socket.on("leaveRoom", (roomId) => {
     socket.leave(roomId);
      });
    
    // Rejoindre une room de courrier
    //   socket.on("joinRoom", (roomId) => {
        //     socket.join(roomId);
        //     console.log(`📂 Socket ${socket.id} a rejoint room ${roomId}`);
        //   });
        
        // Gestion envoi message
     socket.on("sendMessage", async (payload) => {
    // payload: { id_group, senderId, content, attachments: [{id, filename, path}] }
    try {
      const { id_group, senderId, content } = payload;
      const msg = await models.Message.create({ id_group, senderId, content });
      // send to room
      io.to(id_group).emit("receiveMessage", { message: msg.toJSON() });
    } catch (err) {
      console.error("sendMessage err", err);
    }
  });
        
  socket.on("disconnect", () => {
      console.log("❌ Socket disconnected:", socket.id);
      if (userId) onlineUsers.delete(userId);
    });
    
});

// ➡️ On stocke io dans app.locals
app.set("io", io);
app.set("onlineUsers", onlineUsers);

// make io and map available in app.locals for controllers
// app.locals.io = io;
// app.locals.onlineUsers = onlineUsers;

// web-push VAPID setup
webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

// 🚀 Lance le serveur
const PORT = 3003;
server.listen(PORT, () => {
    console.log(`🚀 Backend running on http://localhost:${PORT}`);
});

ApiRoutes(app); // initialisation des routes
// io is exported at module scope (export let io;) and was assigned above
} catch (error) {
        console.error('Erreur lors de la synchronisation des modèles ou des opérations:', error);
        // C'est une bonne pratique de quitter le processus si la synchronisation de la base de données échoue de manière critique
        process.exit(1);
    }
    }
     runApplication();
    