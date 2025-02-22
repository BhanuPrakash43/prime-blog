import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
    {
        heading: {
            type: String,
            required: true,
        },
        body: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        user_id: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment",
            },
        ],
    },
    { timestamps: true }
);

const blogModel = mongoose.model("Blog", BlogSchema);

export default blogModel;
