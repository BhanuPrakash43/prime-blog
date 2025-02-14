import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { useNavigate } from "react-router-dom";

function BlogSlider({ blogs = [] }) {
    const navigate = useNavigate();

    const handleBlog = (id) => {
        navigate(`/blog/${id}`);
    };

    if (!blogs || blogs.length === 0) {
        return (
            <h2 className="text-center text-gray-700 text-xl font-semibold mt-20">
                No blogs to display in the slider.
            </h2>
        );
    }

    const stripHtmlTags = (html) => {
        return html.replace(/<[^>]*>?/gm, "");
    };

    return (
        <div className="relative w-full">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={1500}
                className="w-full h-[400px] sm:h-[500px] md:h-[550px] rounded-xl"
            >
                {blogs.map((blog) => (
                    <SwiperSlide key={blog._id}>
                        <div
                            className="relative w-full h-full bg-cover bg-center"
                            style={{
                                backgroundImage: `url('${blog?.image}')`,
                            }}
                        >
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-8">
                                <h1
                                    className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 cursor-pointer"
                                    onClick={() => handleBlog(blog._id)}
                                >
                                    {blog.heading}
                                </h1>
                                <p
                                    className="text-gray-300 text-lg sm:text-xl max-w-3xl cursor-pointer"
                                    onClick={() => handleBlog(blog._id)}
                                >
                                    {stripHtmlTags(blog.body).slice(0, 100)}
                                    ...
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default BlogSlider;
