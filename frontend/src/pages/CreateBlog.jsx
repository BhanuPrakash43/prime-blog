import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useAuth } from "../contexts/AuthContextProvider";
import { useNavigate } from "react-router-dom";
import { FaImage, FaPen, FaFileAlt } from "react-icons/fa";
import toast from "react-hot-toast";

function CreateBlog() {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [heading, setHeading] = useState("");
    const [body, setBody] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    // Clean up object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    if (!auth || !auth.access_token) {
        return <div>Loading...</div>;
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("heading", heading);
            formData.append("body", body);
            formData.append("category", category);
            if (image) {
                formData.append("image", image);
            }

            const response = await axios.post(
                `${BASE_URL}/blog/user/create`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${auth.access_token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.data.success) {
                toast.success(response.data.message);
                setHeading("");
                setBody("");
                setCategory("");
                setImage(null);
                setPreview(null);
                navigate("/my-blogs");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex justify-center items-center px-4 mb-10 pt-[120px] md:pt-[100px] overflow-auto">
            <div className="max-w-4xl w-full bg-gray-900 text-white p-8 md:p-8 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center mb-6">
                    Create Your Blog Post
                </h1>
                <form className="space-y-6" onSubmit={handleSubmit}>
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
                        {isLoading ? "Creating..." : "Create Blog"}
                    </button>

                    {error && (
                        <p className="text-red-500 text-center">{error}</p>
                    )}
                </form>
            </div>
        </div>
    );
}

export default CreateBlog;
