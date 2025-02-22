import { Link } from "react-router-dom";

function Blog({ _id: id, heading, category, body, image, createdAt }) {
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

            <div className="p-5 flex flex-col justify-between min-h-[200px]">
                <h5 className="text-lg font-semibold text-gray-900 h-[30px] line-clamp-1">
                    {heading}
                </h5>

                <p
                    className="text-gray-600 text-sm h-[60px] overflow-hidden line-clamp-3"
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
        </div>
    );
}

export default Blog;
