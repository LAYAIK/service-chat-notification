import db from "../models/index.js"; // Message, Group
const { Message } = db;

export const listMessagesForGroup = async (req, res) => {
  try { 
  const { id_group } = req.params;
  console.log("Listing messages for group:", id_group);
  const messages = await Message.findAll({ where: { id_group }, order: [["createdAt","ASC"]] });
  res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};

export const createMessage = async (req, res) => {
  try {
    const { id_group, senderId, content } = req.body;
    const msg = await Message.create({ id_group, senderId, content,});

    // broadcast via io
    const io = req.app.get('io');
    io.to(id_group).emit("receiveMessage", { message: msg.toJSON() });
    res.status(201).json(msg);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
};
export const listMessagesForUser = async (req, res) => {
  const { userId } = req.params;
  const messages = await Message.findAll({ where: { senderId: userId }, order: [["createdAt","ASC"]] });
  res.json(messages);
};  