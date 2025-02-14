import BlogModel from "../models/Blog.model.js";
import UserModel from "../models/User.model.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

const getAllBlogs = async (req, res) => {
    try {
        const blogs = await BlogModel.find({});
        res.status(200).json({
            success: true,
            message: "Blogs fetched successfully",
            blogs,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
};

const getSingleBlog = async (req, res) => {
    const id = req.params.id;
    try {
        // Fetch the blog and populate comments with user details
        const blog = await BlogModel.findOne({ _id: id }).populate({
            path: "comments",
            populate: {
                path: "userId",
                select: "fullName profile",
            },
        });

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: `No blog found with id ${id}`,
            });
        }

        const user = await UserModel.findById(blog.user_id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `No user found with id ${blog.user_id}`,
            });
        }

        // Attach the user fullName to the blog object
        const blogWithUser = {
            ...blog.toObject(),
            user_fullName: user.fullName,
        };

        // Send the blog with user fullName and populated comments with user info
        res.status(200).json({
            success: true,
            message: "Blog fetched successfully",
            blog: blogWithUser,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

// Get blogs for the current user
const getMyBlogs = async (req, res) => {
    const user_id = req.user._id;
    try {
        const myBlogs = await BlogModel.find({ user_id });
        res.status(200).json({
            success: true,
            message: "My blogs fetched successfully",
            myBlogs,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const createBlog = async (req, res) => {
    try {
        req.body.user_id = req.user._id;

        if (req.file) {
            const imagePath = req.file.path;

            const cloudinaryResult = await uploadOnCloudinary(
                imagePath,
                "blog_images"
            );

            // Store Cloudinary URL in the database
            req.body.image = cloudinaryResult.secure_url;

            fs.unlinkSync(imagePath);
        }

        // Create the blog post with the uploaded image URL
        const blog = await BlogModel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            blog,
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

const updateBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await BlogModel.findOne({ _id: id });
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: `No blog found with id ${id}`,
            });
        }

        if (blog.user_id == req.user._id) {
            if (req.body.heading) blog.heading = req.body.heading;
            if (req.body.body) blog.body = req.body.body;
            if (req.body.category) blog.category = req.body.category;

            if (req.file) {
                try {
                    // Delete old image if exists
                    if (blog.image) {
                        const oldImagePublicId = blog.image
                            .split("/")
                            .pop()
                            .split(".")[0];
                        await cloudinary.uploader.destroy(oldImagePublicId);
                    }

                    // Upload new image
                    const cloudinaryResult = await uploadOnCloudinary(
                        req.file.path,
                        "blog_images"
                    );
                    console.log(
                        "Cloudinary Upload Response:",
                        cloudinaryResult
                    );
                    if (!cloudinaryResult.secure_url) {
                        return res.status(500).json({
                            success: false,
                            message: "Failed to upload image",
                        });
                    }

                    blog.image = cloudinaryResult.secure_url;

                    if (fs.existsSync(req.file.path)) {
                        fs.unlinkSync(req.file.path);
                    }
                } catch (error) {
                    console.error("Error uploading to Cloudinary:", error);
                    return res.status(500).json({
                        success: false,
                        message: "Failed to upload image",
                    });
                }
            }

            const updatedBlog = await blog.save();
            return res.status(200).json({
                success: true,
                message: "Blog updated successfully",
                blog: updatedBlog,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to update this blog",
            });
        }
    } catch (error) {
        console.error("Update Blog Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const deleteBlog = async (req, res) => {
    const id = req.params.id;
    try {
        const blog = await BlogModel.findOne({ _id: id });
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: `No blog found with id ${id}`,
            });
        }

        if (blog.user_id == req.user._id) {
            // Delete image from Cloudinary if exists
            if (blog.image) {
                const imagePublicId = blog.image.split("/").pop().split(".")[0]; // Extract public ID
                await cloudinary.uploader.destroy(imagePublicId); // Delete image from Cloudinary
            }

            const deletedBlog = await BlogModel.findOneAndDelete({ _id: id });
            res.status(200).json({
                success: true,
                message: "Blog deleted successfully",
                blog: deletedBlog,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: "You are not authorized to delete this blog",
            });
        }
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export {
    getAllBlogs,
    createBlog,
    getSingleBlog,
    updateBlog,
    deleteBlog,
    getMyBlogs,
};
