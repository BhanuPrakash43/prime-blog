import express from "express";
import { AddComment } from "../controllers/comments.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const CommentRoutes = express.Router();

CommentRoutes.post("/addcomment", requireAuth, AddComment);

export default CommentRoutes;
