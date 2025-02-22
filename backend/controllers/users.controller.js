import UserModel from "../models/User.model.js";
import BlogModel from "../models/Blog.model.js";
import CommentModel from "../models/Comment.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { uploadOnCloudinary } from "../utils/Cloudinary.js";

function createToken(id) {
    return jwt.sign({ _id: id }, process.env.SECRET, { expiresIn: "7d" });
}

const signupUser = async (req, res) => {
    try {
        const { fullName, email, password, role } = req.body;

        if (!fullName || !email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required." });
        }

        if (!validator.isEmail(email)) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid email format." });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long.",
            });
        }

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists. Please log in.",
            });
        }

        let profileImage = "";
        if (req.file) {
            try {
                const imagePath = req.file.path;
                const cloudinaryResult = await uploadOnCloudinary(
                    imagePath,
                    "user_profiles"
                );

                if (cloudinaryResult?.secure_url) {
                    profileImage = cloudinaryResult.secure_url;
                }

                // Delete local file after uploading to Cloudinary
                fs.unlinkSync(imagePath);
            } catch (error) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to upload profile image.",
                });
            }
        }

        // Hash password securely using bcrypt
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create and save new user
        const newUser = new UserModel({
            fullName,
            email,
            password: hashedPassword,
            profile: profileImage,
            role: role || "user",
        });

        await newUser.save();

        // Generate JWT token
        const token = createToken(newUser._id);

        res.status(201).json({
            success: true,
            message: "User registered successfully!",
            user: {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profile: newUser.profile,
                role: newUser.role,
            },
            access_token: token,
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({
            success: false,
            message: "Error during registration",
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ success: false, message: "All fields are required." });
        }

        const findUser = await UserModel.findOne({ email }).select("+password");
        if (!findUser) {
            return res
                .status(404)
                .json({ success: false, message: "Account not found." });
        }

        // Check password
        const match = await bcrypt.compare(password, findUser.password);
        if (!match) {
            return res
                .status(401)
                .json({ success: false, message: "Incorrect password." });
        }

        // Generate JWT token
        const token = createToken(findUser._id);

        res.status(200).json({
            success: true,
            message: "Login successful!",
            user: {
                _id: findUser._id,
                fullName: findUser.fullName,
                email: findUser.email,
                profile: findUser.profile,
                role: findUser.role,
            },
            access_token: token,
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Error during login" });
    }
};

const updateProfile = async (req, res) => {
    const userId = req.params.id;
    try {
        const { fullName, oldPassword, newPassword } = req.body;

        const existUser = await UserModel.findById(userId);
        if (!existUser) {
            return res
                .status(404)
                .json({ success: false, message: "Account not found." });
        }

        if (oldPassword) {
            const comparePassword = await bcrypt.compare(
                oldPassword,
                existUser.password
            );
            if (!comparePassword) {
                return res.status(401).json({
                    success: false,
                    message: "Old password is incorrect.",
                });
            }
        }

        if (fullName) {
            existUser.fullName = fullName;
        }

        if (oldPassword && newPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            existUser.password = hashedPassword;
        } else if (oldPassword && !newPassword) {
            return res.status(400).json({
                success: false,
                message:
                    "New password is required when old password is provided.",
            });
        }

        if (req.file) {
            try {
                if (existUser.profile) {
                    const oldImagePublicId = existUser.profile
                        .split("/")
                        .pop()
                        .split(".")[0];
                    await cloudinary.uploader.destroy(oldImagePublicId);
                }

                const cloudinaryResult = await uploadOnCloudinary(
                    req.file.path,
                    "profile_images"
                );

                if (!cloudinaryResult.secure_url) {
                    return res.status(500).json({
                        success: false,
                        message: "Failed to upload image",
                    });
                }

                existUser.profile = cloudinaryResult.secure_url;

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

        await existUser.save();

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: {
                _id: existUser._id,
                fullName: existUser.fullName,
                email: existUser.email,
                profile: existUser.profile,
                role: existUser.role,
            },
        });
    } catch (error) {
        console.error("Error updating profile: ", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
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

        if (
            user._id.toString() !== req.user._id.toString() ||
            req.user.role !== "admin"
        ) {
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
                "Your account, blogs, comments, and all related data have been deleted successfully.",
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting your account.",
        });
    }
};

export { signupUser, loginUser, updateProfile, deleteUser };
