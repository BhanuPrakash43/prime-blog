import { BASE_URL } from "../constants.js";
import Blog from "../components/Blog.jsx";
import BlogSlider from "../components/BlogSlider.jsx";
import Footer from "../components/Footer.jsx";
import useAxiosGet from "../hooks/useAxiosGet.jsx";

function Home() {
    const {
        isLoading,
        error,
        data: blogs,
    } = useAxiosGet({
        endpoint: `${BASE_URL}/blog`,
        sendToken: false,
        dataKey: "blogs",
    });

    if (isLoading) {
        return (
            <h1 className="text-center text-lg text-gray-600 mt-25">
                Loading...
            </h1>
        );
    }

    if (error) {
        return (
            <h1 className="text-center text-lg text-gray-600 mt-25">{error}</h1>
        );
    }

    if (!Array.isArray(blogs)) {
        return (
            <h1 className="text-center text-lg text-gray-600">
                Invalid data format
            </h1>
        );
    }

    // Sort the posts in descending order based on the createdAt field
    const sortedPosts = blogs.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Separate the blogs for the slider and recent posts
    const sliderBlogs = sortedPosts.slice(0, 4); // Select the top 4 blogs for the slider
    const recentBlogs = sortedPosts.slice(4);

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <div className="w-full max-w-[1440px] mx-auto px-4 pt-[80px] md:pt-[75px] flex-1">
                    <div className="mt-8 md:mt-5">
                        <BlogSlider blogs={sliderBlogs} />
                    </div>

                    <h2 className="text-2xl font-bold my-6 text-gray-800">
                        Recent Blogs
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recentBlogs.length === 0 ? (
                            <p className=" w-full text-gray-500">
                                No blogs found
                            </p>
                        ) : (
                            recentBlogs.map((blog) => (
                                <Blog key={blog._id} {...blog} />
                            ))
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-8">
                <Footer />
            </div>
        </>
    );
}

export default Home;
