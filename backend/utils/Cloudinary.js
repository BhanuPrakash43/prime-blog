import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filepath, folderName = "images") => {
    if (!filepath) throw new Error("File path is required for upload.");

    try {
        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(filepath, {
            folder: folderName,
            resource_type: "image",
        });

        // Delete the local file after successful upload
        fs.unlink(filepath, (err) => {
            if (err) console.error("Error deleting local file:", err);
        });

        return {
            public_id: result.public_id,
            secure_url: result.secure_url,
        };
    } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);

        // Ensure local file is deleted even if upload fails
        fs.unlink(filepath, (err) => {
            if (err)
                console.error(
                    "Error deleting local file after failed upload:",
                    err
                );
        });

        throw new Error("Error uploading image to Cloudinary");
    }
};

export { uploadOnCloudinary };
