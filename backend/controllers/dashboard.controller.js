import UserModel from "../models/User.model.js";
import BlogModel from "../models/Blog.model.js";
import CommentModel from "../models/Comment.model.js";
import { v2 as cloudinary } from "cloudinary";

const totalUsersBlogsAndComments = async (req, res) => {
    try {
        const users = await UserModel.find();
        const blogs = await BlogModel.find();
        const comments = await CommentModel.find();

        if (!users.length && !blogs.length && !comments.length) {
            return res
                .status(404)
                .json({ success: false, message: "Data not found" });
        }

        return res.status(200).json({
            success: true,
            users,
            blogs,
            comments,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Internal server error", error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        if (users.length === 0) {
            res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            users,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.find();
        if (blogs.length === 0) {
            res.status(404).json({ success: false, message: "Data not found" });
        }
        res.status(200).json({
            success: true,
            blogs,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
    }
};

const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "No user account found with this ID.",
            });
        }

        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this account.",
            });
        }

        if (user.profile) {
            try {
                const imagePublicId = user.profile
                    .split("/")
                    .pop()
                    .split(".")[0];
                await cloudinary.uploader.destroy(imagePublicId);
            } catch (error) {
                console.error(
                    "Error deleting profile image from Cloudinary:",
                    error
                );
                return res.status(500).json({
                    success: false,
                    message: "Error deleting profile image.",
                });
            }
        }

        const blogs = await BlogModel.find({ user_id: userId });

        await Promise.all(
            blogs.map(async (blog) => {
                if (blog.image) {
                    try {
                        const imagePublicId = blog.image
                            .split("/")
                            .pop()
                            .split(".")[0];
                        await cloudinary.uploader.destroy(imagePublicId);
                    } catch (error) {
                        console.error(
                            `Error deleting image for blog ${blog._id}:`,
                            error
                        );
                    }
                }
            })
        );

        await BlogModel.deleteMany({ user_id: userId });

        await CommentModel.deleteMany({ userId: userId });

        await UserModel.findByIdAndDelete(userId);

        return res.status(200).json({
            success: true,
            message:
                "User account, blogs, comments, and all related data have been deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting your account.",
        });
    }
};

export { totalUsersBlogsAndComments, getAllUsers, getAllBlogs, deleteUser };
