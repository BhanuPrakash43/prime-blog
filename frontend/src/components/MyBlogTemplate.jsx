import { Link } from "react-router-dom";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../contexts/AuthContextProvider";
import { BASE_URL } from "../constants";

function MyBlogTemplate({
    _id: id,
    heading,
    category,
    body,
    image,
    createdAt,
    onDelete,
}) {
    const { auth } = useAuth();
    const { access_token } = auth || {};

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

    async function deleteBlog() {
        const confirmed = window.confirm(
            "Are you sure you want to delete this post?"
        );
        if (!confirmed) return;

        try {
            if (!access_token) {
                toast.error("You must be logged in to delete a post.");
                return;
            }

            const response = await axios.delete(
                `${BASE_URL}/blog/user/blog/${id}`,
                {
                    headers: { Authorization: `Bearer ${access_token}` },
                }
            );

            if (response.status == 200) {
                toast.success(response.data.message);
                onDelete(id);
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message || "Error deleting post.";
            toast.error(errorMessage);
        }
    }

    const truncateText = (text, wordLimit) => {
        if (!text) return "";
        const words = text.split(" ");
        return words.length > wordLimit
            ? words.slice(0, wordLimit).join(" ") + "..."
            : text;
    };

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 transition-transform duration-300 hover:scale-[1.03]">
            <div className="relative">
                {category && (
                    <span className="absolute top-2 left-2 bg-indigo-200 text-indigo-800 px-3 py-1 text-xs rounded-md shadow-md">
                        {category}
                    </span>
                )}

                <img
                    src={image}
                    alt={heading || "Blog post"}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                        e.target.src = "/placeholder-image.jpg";
                        e.target.onerror = null;
                    }}
                />
            </div>

            <div className="p-5 flex flex-col justify-between min-h-[150px]">
                <h5 className="text-lg font-semibold text-gray-900 h-[30px] line-clamp-1">
                    {heading}
                </h5>

                <p
                    className="text-gray-600 text-sm mt-2 h-[45px] overflow-hidden line-clamp-2"
                    dangerouslySetInnerHTML={{
                        __html: truncateText(body, 100),
                    }}
                />

                <div className="flex justify-between items-center mt-2">
                    <Link
                        to={`/blog/${id}`}
                        className="text-blue-600 hover:underline mt-auto"
                    >
                        Read more →
                    </Link>
                    <span className="text-xs text-gray-500 italic bg-gray-100 px-2 py-1 rounded-md">
                        {formatDate(createdAt)}
                    </span>
                </div>
            </div>
            <div className="flex justify-between items-center mt-2">
                <Link
                    to={`/update/${id}`}
                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg hover:bg-yellow-600 transition cursor-pointer"
                >
                    <FaEdit /> Update
                </Link>
                <button
                    onClick={deleteBlog}
                    className="flex items-center gap-2 bg-red-500 text-white px-4 py-1 rounded-br-lg rounded-tl-lg hover:bg-red-600 transition cursor-pointer"
                >
                    <FaTrashAlt /> Delete
                </button>
            </div>
        </div>
    );
}

export default MyBlogTemplate;
