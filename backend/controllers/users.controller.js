import UserModel from "../models/User.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import fs from "fs";
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

export { signupUser, loginUser };
