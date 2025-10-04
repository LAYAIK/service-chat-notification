import notificationRoutes from "./NotificationRoute.js";
import groupeRoutes from "./GroupRoute.js";
import messageRoutes from "./messageRoute.js";

const ApiRoutes = (app) => {

    app.use("/api/notifications",notificationRoutes); 
    app.use("/api/groups", groupeRoutes);
    app.use("/api/messages", messageRoutes);
};

export default ApiRoutes