import express from "express";
import { subscribe, unsubscribe, listNotifications, markAsRead ,  notifyUserOnTransfer, testPush, notifyTransfer} from "../controllers/notificationController.js";

const router = express.Router();

/**
 * POST /api/notifications/subscribe
 * body: { subscription, userId, room }
 */
router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);

router.get("/:userId", listNotifications); // list notifications for user
router.post("/:id/read", markAsRead);

router.post("/notifyUser", notifyUserOnTransfer);

router.post("/test-push", testPush);

// Exemple : notifier un user quand un courrier est transféré
router.post("/notify-transfer", notifyTransfer);

const notificationRoutes = router;
export default notificationRoutes;
