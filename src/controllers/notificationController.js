import webpush from "web-push";
import db from "../models/index.js"; // Notification, PushSubscription, User
const { PushSubscription, Notification } = db;

// petite regex UUID v4
const isUUID = (val) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

export const subscribe = async (req, res) => {
  try {
    const { subscription, userId, room } = req.body;
    if (!subscription) return res.status(400).json({ error: "subscription required" });

    const [record] = await PushSubscription.findOrCreate({
      where: { endpoint: subscription.endpoint },
      defaults: {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        id_utilisateur: isUUID(userId) ? userId : null,
        room: room || null,
        user_agent: req.headers["user-agent"],
      },
    });

    // update keys/user
    if (record) {
      await record.update({
        keys: subscription.keys,
        id_utilisateur: isUUID(userId) ? userId : record.id_utilisateur,
        room: room || record.room,
      });
    }

    return res.status(201).json({ ok: true });
  } catch (err) {
    console.error("subscribe err", err);
    return res.status(500).json({ error: "server error" });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const { endpoint } = req.body;
    if (!endpoint) return res.status(400).json({ error: "endpoint required" });
    await PushSubscription.destroy({ where: { endpoint } });
    return res.json({ ok: true });
  } catch (err) {
    console.error("unsubscribe err", err);
    return res.status(500).json({ error: "server error" });
  }
};

export const listNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isUUID(userId)) return res.status(400).json({ error: "invalid userId" });

    console.log("Listing notifications for user:", userId);
    const list = await Notification.findAll({
      where: { id_utilisateur: userId },
      order: [["createdAt", "DESC"]],
    });
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUUID(id)) return res.status(400).json({ error: "invalid notif id" });

    await Notification.update({ lu: true }, { where: { id_notification: id } });
    return res.json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "server error" });
  }
};

// envoi notification push & socket
export const notifyUserOnTransfer = async (req, res) => {
  let notif;

  try {
    const { toUserId, titre, message, url, meta } = req.body;
    if (!isUUID(toUserId) || !titre || !message) {
      return res.status(400).json({ error: "toUserId (UUID), titre, message are required" });
    }

    // 1. Save notification in DB
    notif = await Notification.create({
      titre,
      message,
      url,
      id_utilisateur: toUserId,
      meta,
    });

    // 2. Emit Socket.IO event (io stocké dans app.locals)
    const io = req.app.get("io");
    io.to(`user:${toUserId}`).emit("newNotification", { notif: notif.toJSON() });

    // 3. Send web-push to all user subscriptions
    const subs = await PushSubscription.findAll({ where: { id_utilisateur: toUserId } });
    const payload = JSON.stringify({
      title: titre,
      body: message,
      url,
      tag: `notif-user-${toUserId}`,
    });

    for (const s of subs) {
      try {
        await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, payload);
      } catch (err) {
        console.error("webpush failed: ", err);
        if (err.statusCode && (err.statusCode === 404 || err.statusCode === 410)) {
          await s.destroy(); // nettoyer les anciennes subs
        }
      }
    }

    return res.status(201).json({ ok: true, notif: notif.toJSON() });
  } catch (err) {
    console.error("notifyUserOnTransfer err", err);
    return res.status(500).json({ error: "server error" });
  }
};

export const testPush = async (req, res) => {
  try {
    const { userId, title, body, url } = req.body;

    const subs = await PushSubscription.findAll({
      where: { id_utilisateur: userId },
    });

    if (!subs.length) {
      return res.status(404).json({ error: "No subscriptions found for user" });
    }

    const payload = JSON.stringify({
      title: title || "🔔 Test Notification",
      body: body || "Ceci est une notif de test",
      url: url || "/",
    });

    for (const s of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: s.endpoint, keys: s.keys },
          payload
        );
      } catch (err) {
        console.error("webpush error:", err.statusCode);
        if (err.statusCode === 404 || err.statusCode === 410) {
          await s.destroy(); // clean invalid subscription
        }
      }
    }

    return res.json({ ok: true, count: subs.length });
  } catch (err) {
    console.error("testPush err", err);
    return res.status(500).json({ error: "server error" });
  }
};

export const notifyTransfer = async (req, res) => {
  
  const { userId, titre, message, url } = req.body;

  if (!userId || !message) {
    return res.status(400).json({ error: "userId et message requis" });
  }
  const onlineUsers = req.app.get("onlineUsers");
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit("notification", {
      title: titre || "Nouveau courrier",
      message,
      url: url || "/courriers",
      timestamp: Date.now(),
    });
    console.log(`🔔 Notification envoyée à user ${userId}`);
  }

  res.json({ success: true });
}
