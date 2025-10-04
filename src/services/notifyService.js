import db from "../models/index.js";
import webpush from "web-push";

const { PushSubscription, Notification } = db;

// envoi notification push & socket
export async function notifyUserOnTransfer({ io, toUserId, titre, message, url, meta }) {
  // 1. Save notification in DB
  const notif = await Notification.create({
    titre,
    message,
    url,
    id_utilisateur: toUserId,
    meta,
  });

  // 2. Emit Socket.IO event to online sockets (if present)
  // on server: io available; we store onlineUsers map in server or pass socket ids.
  // Here we broadcast to a user-specific room "user:{id}"
  try {
    io.to(`user:${toUserId}`).emit("newNotification", { notif: notif.toJSON() });
  } catch (err) {
    console.warn("socket emit error", err);
  }

  // 3. Send web-push to subscriptions for that user (or by room/structure)
  const subs = await PushSubscription.findAll({ where: { id_utilisateur: toUserId } });

  const payload = JSON.stringify({
    title: titre,
    body: message,
    url,
    tag: `notif-user-${toUserId}`,
  });

  for (const s of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: s.endpoint, keys: s.keys },
        payload
      );
    } catch (err) {
      console.error("webpush failed: ", err);
      // cleanup stale subs (404/410)
      if (err.statusCode && (err.statusCode === 404 || err.statusCode === 410)) {
        await s.destroy();
      }
    }
  }

  return notif;
}
