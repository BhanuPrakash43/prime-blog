import express from "express";
import { isAdmin } from "../middlewares/requireAuth.js";
import {
    totalUsersBlogsAndComments,
    getAllUsers,
    getAllBlogs,
    deleteUser,
} from "../controllers/dashboard.controller.js";

import { deleteBlog } from "../controllers/blogs.controller.js";

const DashboardRoutes = express.Router();

DashboardRoutes.get("/", isAdmin, totalUsersBlogsAndComments);

DashboardRoutes.get("/users", isAdmin, getAllUsers);

DashboardRoutes.delete("/users/delete/:id", isAdmin, deleteUser);

DashboardRoutes.get("/blogs", isAdmin, getAllBlogs);

DashboardRoutes.delete("/blogs/delete/:id", isAdmin, deleteBlog);

export default DashboardRoutes;
