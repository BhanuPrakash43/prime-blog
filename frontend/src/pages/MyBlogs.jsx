import { BASE_URL } from "../constants";
import MyBlogTemplate from "../components/MyBlogTemplate";
import Footer from "../components/Footer";
import useAxiosGet from "../hooks/useAxiosGet";
import { useAuth } from "../contexts/AuthContextProvider";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function MyBlogs() {
    const { auth } = useAuth();
    const sendToken = !!auth?.access_token;

    const { isLoading, data: response } = useAxiosGet({
        endpoint: `${BASE_URL}/blog/user/my-blogs`,
        sendToken,
        dataKey: "myBlogs",
    });

    const [myBlogs, setMyBlogs] = useState([]);

    // Fetch and set blogs after the response is ready
    useEffect(() => {
        if (response) {
            // Sort the posts in descending order based on the createdAt field
            const sortedPosts = response.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            setMyBlogs(sortedPosts);
        }
    }, [response]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <p className="mt-4 text-gray-600">Loading your blogs...</p>
            </div>
        );
    }

    if (myBlogs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center mt-[250px] ">
                <p className="text-gray-500 text-lg mb-4">
                    You haven't created any blogs yet
                </p>
                <Link
                    to="/create"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                    Create Your First Blog
                </Link>
            </div>
        );
    }

    const handleDelete = (id) => {
        // Remove the deleted blog from the state instantly
        setMyBlogs((prevBlogs) => prevBlogs.filter((blog) => blog._id !== id));
    };

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-grow w-full max-w-[1440px] mx-auto px-4 pt-[100px]">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        My Blogs
                    </h1>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {myBlogs.map((blog) => (
                        <MyBlogTemplate
                            key={blog._id}
                            {...blog}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            </main>

            <div className="mt-8">
                <Footer />
            </div>
        </div>
    );
}

export default MyBlogs;
