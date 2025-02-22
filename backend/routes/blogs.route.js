import express from "express";
import multer from "multer";
import {
    getAllBlogs,
    createBlog,
    getSingleBlog,
    updateBlog,
    deleteBlog,
    getMyBlogs,
} from "../controllers/blogs.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 },
});

const BlogRoutes = express.Router();

// Public routes for reading blogs - these should be first
BlogRoutes.get("/", getAllBlogs);
BlogRoutes.get("/blog/:id", getSingleBlog);

// Protected routes for user operations
BlogRoutes.use("/user", requireAuth);
BlogRoutes.get("/user/my-blogs", getMyBlogs);
BlogRoutes.post("/user/create", upload.single("image"), createBlog);
BlogRoutes.delete("/user/blog/:id", deleteBlog);
BlogRoutes.patch(
    "/user/blog/:id",
    upload.single("image"),
    (req, res, next) => {
        console.log("File received in update route:", req.file);
        next();
    },
    updateBlog
);

export default BlogRoutes;
