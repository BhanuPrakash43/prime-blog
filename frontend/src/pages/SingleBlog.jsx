import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useAxiosGet from "../hooks/useAxiosGet";
import { useAuth } from "../contexts/AuthContextProvider";
import { BASE_URL } from "../constants";
import toast from "react-hot-toast";
import axios from "axios";

function SingleBlog() {
    const { auth } = useAuth();
    const { user } = auth || {};
    const { _id: user_id } = user || {};
    const { id } = useParams();

    const {
        error,
        isLoading,
        data: blogData,
    } = useAxiosGet({
        endpoint: `${BASE_URL}/blog/blog/${id}`,
        sendToken: false,
        dataKey: "blog",
    });

    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [commentsList, setCommentsList] = useState(blogData?.comments || []);

    useEffect(() => {
        if (blogData?.comments) {
            setCommentsList(blogData.comments); // Update comments if blogData changes
        }
    }, [blogData]);

    const onSubmitComment = async (e) => {
        e.preventDefault();

        if (!user_id) {
            toast.error("Please login first to comment.");
            return;
        }

        if (!auth?.access_token) {
            toast.error(
                "Authentication token is missing. Please log in again."
            );
            return;
        }

        try {
            setSubmitting(true);

            const response = await axios.post(
                `${BASE_URL}/comment/addcomment`,
                {
                    comment,
                    postId: id,
                    userId: user_id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${auth.access_token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setComment("");
                setCommentsList([response.data.comment, ...commentsList]);
            }
        } catch (error) {
            console.error("Error submitting comment:", error);
            toast.error(error.response?.data?.message || "An error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center mt-20">
                <span className="loader"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center mt-20 text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    if (!blogData) {
        return <h1 className="text-center mt-20">Blog not found.</h1>;
    }

    const {
        user_id: blogUserID,
        heading,
        body,
        category,
        image,
        createdAt,
    } = blogData;

    function formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));

        if (diffInMinutes < 1) return "Just now";
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date);
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-20 md:mt-16">
            <div className="w-[95%] max-w-[1200px] mx-auto py-8 px-4">
                <h1 className="text-3xl md:text-4xl text-justify font-bold mb-4 text-gray-800">
                    {heading}
                </h1>

                <div className="flex justify-between items-center mb-6">
                    <p className="text-lg text-gray-800 italic">
                        — Written by {blogData?.user_fullName || "Anonymous"}
                    </p>
                    <span className="text-sm text-gray-500 italic bg-gray-100 px-2 py-1 rounded-md">
                        {formatDate(createdAt)}
                    </span>
                </div>

                <div className="relative mb-8">
                    {category && (
                        <div>
                            <span className="absolute top-2 left-2 bg-indigo-200 text-indigo-800 px-4 py-1 text-sm rounded-lg shadow-lg">
                                {category}
                            </span>
                        </div>
                    )}
                    {image && (
                        <img
                            src={image}
                            alt={heading}
                            className="w-full max-h-[450px] object-cover rounded-lg shadow-lg"
                            onError={(e) => {
                                e.target.src = "/placeholder-image.jpg";
                                e.target.onerror = null;
                            }}
                        />
                    )}
                </div>

                <div className="prose max-w-none mt-8 text-justify">
                    <p className="text-xl font-medium text-gray-700 leading-relaxed whitespace-pre-wrap first-letter:text-6xl first-letter:font-bold first-letter:text-gray-900 first-letter:float-left first-letter:mr-3 first-letter:leading-none">
                        {body}
                    </p>
                </div>

                <hr className="my-8 border-gray-300" />

                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Leave a Comment
                </h3>

                <form
                    onSubmit={onSubmitComment}
                    className="bg-gray-100 p-4 rounded-lg shadow-md"
                >
                    <textarea
                        className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="4"
                        placeholder="Write your comment here..."
                        required
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>
                    <button
                        type="submit"
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!user_id || submitting}
                    >
                        {submitting ? "Submitting..." : "Submit Comment"}
                    </button>
                </form>

                <hr className="my-8 border-gray-300" />

                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                    Comments
                </h3>

                {commentsList.length === 0 ? (
                    <p className="text-gray-500 italic">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    <div className="space-y-5">
                        {commentsList.map((comment) => (
                            <div
                                key={comment._id}
                                className="flex items-start bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200"
                            >
                                <img
                                    src={
                                        comment.userId?.profile ||
                                        "/default-avatar.png"
                                    }
                                    alt={comment.userId?.fullName || "User"}
                                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                                />
                                <div className="ml-4 flex justify-between items-start space-x-4">
                                    <div className="flex-1">
                                        <h5 className="font-semibold text-gray-900 text-lg">
                                            {comment.userId?.fullName ||
                                                "Anonymous"}
                                        </h5>
                                        <p className="text-gray-700 text-sm mt-1">
                                            {comment.comment}
                                        </p>
                                    </div>

                                    <div className="flex-shrink-0">
                                        <p className="text-xs text-gray-500 italic mt-1">
                                            {formatDate(comment.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SingleBlog;
