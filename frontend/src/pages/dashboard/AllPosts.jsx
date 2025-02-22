import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useAuth } from "../../contexts/AuthContextProvider";
import useAxiosGet from "../../hooks/useAxiosGet";
import { BASE_URL } from "../../constants";
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

function AllPosts() {
    const { auth } = useAuth();
    const { access_token } = auth || {};
    const sendToken = !!auth?.access_token;

    const [blogs, setBlogs] = useState([]);

    const { isLoading, data: response } = useAxiosGet({
        endpoint: `${BASE_URL}/dashboard/blogs`,
        sendToken,
    });

    useEffect(() => {
        if (response && response.success) {
            const sortedBlogs = response?.blogs.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setBlogs(sortedBlogs || []);
        }
    }, [response]);

    const handleDeleteBlog = async (blogId) => {
        if (!blogId) {
            toast.error("Invalid blog ID.");
            return;
        }
        const confirmed = window.confirm(
            "Are you sure, You want to delete this blog?"
        );
        if (!confirmed) return;

        try {
            const response = await axios.delete(
                `${BASE_URL}/dashboard/blogs/delete/${blogId}`,
                {
                    headers: { Authorization: `Bearer ${access_token}` },
                }
            );

            if (response.status == 200) {
                toast.success(response.data.message);
                setBlogs(blogs.filter((blog) => blog._id !== blogId));
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Error deleting post.";
            toast.error(errorMessage);
        }
    };

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

    const truncateText = (text, wordLimit) => {
        if (!text) return "";
        const words = text.split(" ");
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ") + "..."
            : text;
    };

    return (
        <div className="md:ml-[20%] w-full md:w-[80%] px-8 pt-[100px] md:pt-[90px] pb-10 overflow-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">All Posts</h1>

            {isLoading ? (
                <div className="flex justify-center items-center h-40 text-gray-600 text-lg">
                    Loading posts...
                </div>
            ) : blogs.length === 0 ? (
                <div className="text-center text-gray-500 mt-15 text-xl">
                    No posts available.
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <div
                            key={blog._id}
                            className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-transform duration-300 hover:scale-[1.03]"
                        >
                            <div className="relative">
                                <span className="absolute top-2 left-2 bg-indigo-200 text-indigo-800 px-3 py-1 text-xs rounded-md shadow-md">
                                    {blog?.category}
                                </span>

                                <img
                                    src={blog?.image}
                                    alt={blog.title}
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.target.src = "/placeholder-image.jpg";
                                        e.target.onerror = null;
                                    }}
                                />
                            </div>

                            <div className="p-5 flex flex-col justify-between min-h-[150px]">
                                <h5 className="text-lg font-semibold text-gray-900 h-[30px] line-clamp-1">
                                    {blog?.heading}
                                </h5>

                                <p
                                    className="text-gray-600 text-sm mt-2 h-[45px] overflow-hidden line-clamp-2"
                                    dangerouslySetInnerHTML={{
                                        __html: truncateText(blog?.body, 100),
                                    }}
                                />

                                <div className="flex justify-between items-center mt-2">
                                    <Link
                                        to={`/blog/${blog._id}`}
                                        className="text-blue-600 hover:underline mt-auto"
                                    >
                                        Read more →
                                    </Link>
                                    <span className="text-xs text-gray-500 italic bg-gray-100 px-2 py-1 rounded-md">
                                        {formatDate(blog?.createdAt)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-end items-center mt-2">
                                <button
                                    onClick={() => {
                                        handleDeleteBlog(blog._id);
                                    }}
                                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-1 rounded-br-lg rounded-tl-lg hover:bg-red-600 transition cursor-pointer"
                                >
                                    <FaTrashAlt /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default AllPosts;
