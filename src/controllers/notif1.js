const { NotificationSubscription } = require("../models");
const { webpush } = require("../config/webpush");

/**
 * POST /api/notifications/subscribe
 * Enregistre une subscription
 */
exports.subscribe = async (req, res) => {
  try {
    const { subscription, userId, room } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Subscription invalide" });
    }

    // Vérifie si cette subscription existe déjà
    let sub = await NotificationSubscription.findOne({
      where: { endpoint: subscription.endpoint },
    });

    if (sub) {
      // met à jour userId/room si changé
      await sub.update({
        userId: userId || sub.userId,
        room: room || sub.room,
        keys: subscription.keys,
        expirationTime: subscription.expirationTime || null,
      });
    } else {
      // nouvelle subscription
      sub = await NotificationSubscription.create({
        userId: userId || null,
        room: room || null,
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        expirationTime: subscription.expirationTime || null,
      });
    }

    return res.status(201).json({ success: true, sub });
  } catch (err) {
    console.error("Erreur subscribe:", err);
    res.status(500).json({ error: "Erreur interne" });
  }
};

/**
 * POST /api/notifications/unsubscribe
 * Supprime une subscription
 */
exports.unsubscribe = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: "Subscription invalide" });
    }

    const sub = await NotificationSubscription.findOne({
      where: { endpoint: subscription.endpoint },
    });

    if (sub) {
      await sub.destroy();
      return res.json({ success: true, message: "Unsubscribed" });
    } else {
      return res.status(404).json({ error: "Subscription non trouvée" });
    }
  } catch (err) {
    console.error("Erreur unsubscribe:", err);
    res.status(500).json({ error: "Erreur interne" });
  }
};

/**
 * Exemple : envoyer une notification push à un utilisateur
 */
exports.sendNotificationToUser = async (userId, payload) => {
  try {
    const subs = await NotificationSubscription.findAll({ where: { userId } });

    for (const sub of subs) {
      try {
        await webpush.sendNotification(sub, JSON.stringify(payload));
      } catch (error) {
        // si endpoint invalide, supprime
        if (error.statusCode === 404 || error.statusCode === 410) {
          await sub.destroy();
        } else {
          console.warn("Erreur push:", error.message);
        }
      }
    }
  } catch (err) {
    console.error("Erreur sendNotificationToUser:", err);
  }
};


// s'ecrire dans le controller de transfere courrier 


// const { sendNotificationToUser } = require("./controllers/notificationController");

// // ...
// await sendNotificationToUser(id_destinataire, {
//   title: "📬 Nouveau courrier transféré",
//   body: `Un courrier vous a été transféré par ${nom_service}`,
//   url: `/courriers/${id_courrier}`, // lien ouvert si l’utilisateur clique
//});
