import express from "express";
import { signupUser, loginUser } from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const UserRoutes = express.Router();

UserRoutes.post("/signup", upload.single("profile"), signupUser);
UserRoutes.post("/login", loginUser);

export default UserRoutes;
