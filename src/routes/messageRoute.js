// // routes/messages.js
// import express from 'express';
// import Message from '../models/MessageModel.js';

// export default function messageRoutes(io) {
//   const router = express.Router();

//   router.post('/api/messages', async (req, res) => {
//     try {
//       const { senderId, receiverId, content } = req.body;
//       const message = await Message.create({ senderId, receiverId, content });

//       // Émettre le message via Socket.io
//       io.emit('newMessage', message);

//       res.status(201).json(message);
//     } catch (err) {
//       console.error(err);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });

//   /**
//    * @swagger
//    *
//    * components:
//    *   schemas:
//    *     Message:
//    *       type: object
//    *       properties:
//    *         senderId:
//    *           type: integer
//    *           description: The ID of the sender
//    *           example: 1
//    *         receiverId:
//    *           type: integer
//    *           description: The ID of the receiver
//    *           example: 2
//    *         content:
//    *           type: string
//    *           description: The content of the message
//    *           example: "Hello, world!"
//    *         timestamp:
//    *           type: string
//    *           format: date-time
//    *           description: The timestamp of the message
//    *           example: "2021-09-29T10:30:00.000Z"
//    *
//    * /api/messages:
//    *   post:
//    *     summary: Create a new message
//    *     requestBody:
//    *       required: true
//    *       content:
//    *         application/json:
//    *           schema:
//    *             $ref: '#/components/schemas/Message'
//    *     responses:
//    *       201:
//    *         description: Message created
//    *         content:
//    *           application/json:
//    *             schema:
//    *               $ref: '#/components/schemas/Message'
//    *       400:
//    *         description: Bad request
//    *       500:
//    *         description: Internal server error
//    */
//   return router;
// }


import express from "express";
import { listMessagesForGroup, createMessage } from "../controllers/messageController.js";
const router = express.Router();

router.get("/list_messages_for_group/:id_group", listMessagesForGroup);
router.post("/create_message", createMessage); // also used by socket fallback for REST


const messageRoutes =  router;
export default messageRoutes
