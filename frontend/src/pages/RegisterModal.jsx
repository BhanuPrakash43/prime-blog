import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../constants";
import toast from "react-hot-toast";
import { FiUser } from "react-icons/fi";

function RegisterModal({ isOpen, onClose, onOpenLogin }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [value, setValue] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        image: null,
        imagePreview: null,
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
            if (!allowedTypes.includes(file.type)) {
                return toast.error(
                    "Please upload a valid image (JPG, PNG, or GIF)."
                );
            }

            if (value.imagePreview) {
                URL.revokeObjectURL(value.imagePreview);
            }

            setValue({
                ...value,
                image: file,
                imagePreview: URL.createObjectURL(file),
            });
        }
    };

    const handleImageClick = () => {
        document.getElementById("image").click();
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!value.fullName || !value.email || !value.password) {
            setIsLoading(false);
            return toast.error("All fields are required.");
        }

        if (value.password !== value.confirmPassword) {
            setIsLoading(false);
            return toast.error("Passwords must match.");
        }

        if (!value.image) {
            setIsLoading(false);
            return toast.error("Please upload a profile image.");
        }

        const formData = new FormData();
        formData.append("fullName", value.fullName);
        formData.append("email", value.email);
        formData.append("password", value.password);
        formData.append("profile", value.image);

        try {
            const response = await axios.post(`${BASE_URL}/user/signup`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            const data = response.data;

            if (data.success) {
                toast.success(data.message);

                if (value.imagePreview) {
                    URL.revokeObjectURL(value.imagePreview);
                }

                setValue({
                    fullName: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                    image: null,
                    imagePreview: null,
                });

                onClose();

                setTimeout(() => {
                    onOpenLogin();
                }, 500);
            }
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                "An unexpected error occurred.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white bg-opacity-95 backdrop-blur-xl shadow-2xl rounded-lg mx-4 p-8 w-full max-w-md relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-5 text-gray-500 hover:text-gray-900 text-3xl cursor-pointer"
                >
                    &times;
                </button>
                <h1 className="text-2xl font-bold text-gray-900 text-center mb-6">
                    Create an Account 🚀
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="flex flex-col items-center">
                        <div
                            className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden cursor-pointer hover:border-indigo-500 transition"
                            onClick={handleImageClick}
                        >
                            {value.imagePreview ? (
                                <img
                                    src={value.imagePreview}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            ) : (
                                <FiUser className="text-gray-400 text-5xl" />
                            )}
                        </div>
                        <input
                            type="file"
                            id="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        <p className="text-sm text-gray-600 mt-2 cursor-pointer hover:text-indigo-500">
                            Click to upload a profile picture
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        value={value.fullName}
                        onChange={(e) =>
                            setValue({ ...value, fullName: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        required
                        value={value.email}
                        onChange={(e) =>
                            setValue({ ...value, email: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={value.password}
                        onChange={(e) =>
                            setValue({ ...value, password: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        required
                        value={value.confirmPassword}
                        onChange={(e) =>
                            setValue({
                                ...value,
                                confirmPassword: e.target.value,
                            })
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />

                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? "Signing Up..." : "Sign Up"}
                    </button>
                </form>

                <p className="mt-5 text-center text-gray-600 text-sm">
                    Already have an account?{" "}
                    <button
                        onClick={() => {
                            onClose();
                            onOpenLogin();
                        }}
                        className="text-indigo-500 font-medium hover:underline cursor-pointer"
                    >
                        Sign In
                    </button>
                </p>
            </div>
        </div>
    );
}

export default RegisterModal;
