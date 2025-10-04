import db from "../models/index.js";
const { Group, GroupUtilisateur, Message } = db;


// Exemple temporaire (mock data)
const fakeGroups = [
  { id_group: "a342bc27-db38-4b6a-b4fd-dd29f258cf89", nom: "Direction Générale", description: "Messages DG" },
  { id_group: "a342bc27-db38-4b6a-b4fd-dd29f258cf87", nom: "Service Courrier", description: "Équipe du courrier" },
  { id_group: "a342bc27-db38-4b6a-b4fd-dd29f258cf83", nom: "Informatique", description: "Support technique" },
];

export const createGroup = async (req, res) => {
  try {
    const { nom, description, createdBy, members = [] } = req.body;
    const group = await Group.create({ nom, description, createdBy });
    // add members
    if (Array.isArray(members) && members.length > 0) {
      for (const userId of members) {
        await GroupUtilisateur.create({ id_group: group.id_group, userId });
      }
    }
    return res.status(201).json(group);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};

export const listGroups = async (req, res) => {
  const groups = await Group.findAll();
  res.status(200).json(groups);
};

export const getGroup = async (req, res) => {

  // liste des utilisateurs
  const { utilisateurs } = req.body;

  const group = await Group.findByPk(req.params.id_group, {
    include: [{ utilisateurs, through: { attributes: [] }}, Message]
  });
  res.json(group);
};

export const addUserToGroup = async (req, res) => {
  const { id_group } = req.params;
  const { userId } = req.body;
  try {
    await GroupUtilisateur.create({ id_group: id_group, userId });
    // notify via socket to user
    const io = req.app.locals.io;
    io.to(`user:${userId}`).emit("groupInvited", { id_group: id_group });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: "server error" });
  }
};

export const removeUserFromGroup = async (req, res) => {
  const { id_group } = req.params;
  const { userId } = req.body;
  await GroupUtilisateur.destroy({ where: { id_group: id_group, userId } });
  res.json({ ok: true });
};
