import express from "express";
import {createGroup, listGroups, getGroup, addUserToGroup, removeUserFromGroup} from "../controllers/groupController.js";

const router = express.Router();


router.post("/create_group", createGroup);
router.get("/listeGroups", listGroups);
router.get("/get_group/:id_group", getGroup);
router.post("/add_user_to_group/:id_group", addUserToGroup);
router.post("/remove_user_from_group/:id_group",removeUserFromGroup);

const groupeRoutes =  router;
export default groupeRoutes