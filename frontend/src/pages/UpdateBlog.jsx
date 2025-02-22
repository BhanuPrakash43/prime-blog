import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../constants";
import { useAuth } from "../contexts/AuthContextProvider";
import useAxiosGet from "../hooks/useAxiosGet";
import { FaImage, FaPen, FaFileAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function UpdateBlog() {
    const navigate = useNavigate();
    const {
        auth: { access_token },
    } = useAuth();
    const { id } = useParams();
    const [heading, setHeading] = useState("");
    const [category, setCategory] = useState("");
    const [body, setBody] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const {
        error,
        isLoading,
        data: blog,
    } = useAxiosGet({
        endpoint: `${BASE_URL}/blog/blog/${id}`,
        sendToken: true,
        dataKey: "blog",
    });

    useEffect(() => {
        if (blog) {
            setHeading(blog.heading || "");
            setCategory(blog.category || "");
            setBody(blog.body || "");
            setPreview(blog.image || null);
        }
    }, [blog]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    async function updateBlog(e) {
        e.preventDefault();

        if (!access_token) {
            toast.error("You need to be logged in to update a blog post.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("heading", heading);
            formData.append("category", category);
            formData.append("body", body);
            if (image) {
                formData.append("image", image);
            }

            for (let pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            const response = await axios.patch(
                `${BASE_URL}/blog/user/blog/${id}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            const data = response.data;
            if (response.status === 200) {
                toast.success(data.message);
                navigate("/my-blogs");
            }
        } catch (error) {
            console.error(
                "Error updating blog:",
                error.response?.data || error.message
            );
            toast.error("Failed to update the blog.");
        }
    }

    if (isLoading) return <h1>Loading...</h1>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="w-full flex justify-center items-center px-4 mb-10 pt-[120px] md:pt-[100px] overflow-auto">
            <div className="max-w-4xl w-full bg-gray-900 text-white p-8 md:p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Update Your Blog
                </h1>
                <form className="space-y-6" onSubmit={updateBlog}>
                    <div className="relative w-full h-52 border-2 border-dashed border-gray-500 rounded-lg flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:border-blue-500 transition">
                        <label
                            htmlFor="postImage"
                            className="w-full h-full flex flex-col items-center justify-center"
                        >
                            {preview ? (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                                />
                            ) : (
                                <div className="flex flex-col items-center">
                                    <FaImage className="text-4xl mb-2" />
                                    <p className="text-sm">
                                        Click to upload image
                                    </p>
                                </div>
                            )}
                        </label>
                        <input
                            type="file"
                            id="postImage"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg">
                        <FaPen className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Blog Heading"
                            value={heading}
                            onChange={(e) => setHeading(e.target.value)}
                            required
                            className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                        />
                    </div>

                    <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg">
                        <FaPen className="text-gray-400 mr-3" />
                        <input
                            type="text"
                            placeholder="Blog Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                            className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                        />
                    </div>

                    <div className="flex items-start bg-gray-800 px-4 py-3 rounded-lg">
                        <FaFileAlt className="text-gray-400 mt-1 mr-3" />
                        <textarea
                            rows="5"
                            placeholder="Write your blog post here..."
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            className="w-full bg-transparent outline-none text-white placeholder-gray-500 resize-none"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? "Updating..." : "Update Blog"}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UpdateBlog;
