import BlogModel from "../models/Blog.model.js";
import CommentModel from "../models/Comment.model.js";

const AddComment = async (req, res) => {
    try {
        const { postId, userId, comment } = req.body;

        if (!postId || !userId || !comment) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        // Create a new comment
        const newComment = new CommentModel({ postId, userId, comment });
        await newComment.save();

        // Find the blog post and add the comment reference
        const blogPost = await BlogModel.findByIdAndUpdate(
            postId,
            { $push: { comments: newComment._id } },
            { new: true }
        );

        if (!blogPost) {
            return res.status(404).json({
                success: false,
                message: "Blog post not found",
            });
        }

        // Fetch user info along with the comment
        const commentWithUserInfo = await CommentModel.findById(newComment._id)
            .populate("userId", "fullName profile")
            .exec();

        res.status(201).json({
            success: true,
            message: "Comment added successfully",
            comment: commentWithUserInfo,
        });
    } catch (error) {
        console.error("Error adding comment:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export { AddComment };
