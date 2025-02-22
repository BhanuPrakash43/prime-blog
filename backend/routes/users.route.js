import express from "express";
import {
    signupUser,
    loginUser,
    updateProfile,
    deleteUser,
} from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const UserRoutes = express.Router();

UserRoutes.post("/signup", upload.single("profile"), signupUser);
UserRoutes.post("/login", loginUser);

UserRoutes.patch(
    "/profile/:id",
    requireAuth,
    upload.single("profile"),
    updateProfile
);

UserRoutes.delete("/profile/delete/:id", requireAuth, deleteUser);

export default UserRoutes;
