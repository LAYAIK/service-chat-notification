// import express from "express";
// import bodyParser from 'body-parser';
// import pino from 'pino';
// import { pinoHttp } from 'pino-http';
// import 'dotenv/config'; // charge les variables d'environnement à partir du fichier .env
// import swaggerSetup from './swagger.js';
// import ApiRoutes from './src/routes/index.js'; // importation des routes d'authentification
// import cors from 'cors';
// import webpush from 'web-push';
// import http from 'http';
// import { Server } from 'socket.io';


// const app = express(); // création de l'application express
// //Configuration de CORS pour autoriser les requêtes depuis le frontend
// const corsOptions = {
//   origin: 'http://localhost:5173', // Your frontend's origin
//   credentials: true, // Allow cookies and authentication headers
// };
// app.use(cors(corsOptions));
// app.use(bodyParser.json()); // pour parser le corps des requêtes JSON

// // ⚡ Crée le serveur HTTP AVANT socket.io
// const server = http.createServer(app);

// // socket.io
// const io = new Server(server, {
//      cors: {
//     origin: "http://localhost:5173",  // ton frontend
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

//   io.on("connection", (socket) => {
//     console.log("✅ Nouveau client connecté:", socket.id);
//     // Associer un userId avec un socket
//     socket.on("joinUser", ({ userId }) => {
//       if (userId) {
//         connectedUsers.set(userId, socket.id);
//         console.log(`🔗 User ${userId} connecté via socket ${socket.id}`);
//       }
//     });

//     // web-push VAPID setup
//     webpush.setVapidDetails(
//   process.env.VAPID_SUBJECT,
//   process.env.VAPID_PUBLIC_KEY,
//   process.env.VAPID_PRIVATE_KEY
// );
// app.set("io", io); // 👈 permet d'accéder à io dans tous les controllers

// // Optional: map for rooms (if needed)
// const connectedUsers = new Map(); // userId => socketId

//   // Rejoindre une room de courrier
//   socket.on("joinRoom", (roomId) => {
//     socket.join(roomId);
//     console.log(`📂 Socket ${socket.id} a rejoint room ${roomId}`);
//   });

//   // Gestion envoi message
//   socket.on("sendMessage", (msg) => {
//     console.log("💬 Message reçu:", msg);
//     io.to(msg.room).emit("receiveMessage", msg); // Broadcast dans la room
//   });

//   // Déconnexion
//   socket.on("disconnect", () => {
//     console.log(`❌ Socket ${socket.id} déconnecté`);
//     for (let [userId, sId] of connectedUsers.entries()) {
//       if (sId === socket.id) {
//         connectedUsers.delete(userId);
//         break;
//       }
//     }
//   });
// });

// // make io available to controllers via app.locals
// app.locals.io = io;

// const logger = pino({ 
//     level: process.env.LOG_LEVEL || 'info',  // niveau de log, par défaut 'info'
//     transport: {
//         target: 'pino-pretty', // pour formater les logs de manière lisible
//         options: {
            
//             ignore: 'pid,hostname', // ignorer les informations de processus et d'hôte
//             translateTime: 'SYS:standard', // pour afficher l'heure dans un format standard
//             colorize: true  // pour colorer les logs dans la console
//         }
//     }
// });
// app.use(pinoHttp({ logger })); // middleware pour logger les requêtes HTTP

// swaggerSetup(app); // initialisation de swagger

// ApiRoutes(app); // initialisation des routes

// // Servir les fichiers statiques du dossier 'public' (pour le formulaire HTML)
// app.use(express.static('public'));


// export default app; // exporte l'application express