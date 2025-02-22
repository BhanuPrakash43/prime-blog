import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../constants";
import { useAuth } from "../contexts/AuthContextProvider";
import toast from "react-hot-toast";

function LoginModal({ isOpen, onClose, onOpenRegister }) {
    const navigate = useNavigate();
    const { setAuth } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [value, setValue] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setValue({ ...value, [e.target.name]: e.target.value.trim() });
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const response = await axios.post(
                `${BASE_URL}/user/login`,
                { email: value.email, password: value.password },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            setAuth(response.data);
            localStorage.setItem("user", JSON.stringify(response.data));

            setValue({ email: "", password: "" });

            toast.success("Login successful!");
            onClose();
            navigate("/");
        } catch (error) {
            const errorMessage =
                error?.response?.data?.message ||
                error?.response?.data?.error ||
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
                    Welcome Back 👋
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="name@company.com"
                            required
                            value={value.email}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="••••••••"
                            required
                            value={value.password}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 text-gray-900 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-indigo-600 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition cursor-pointer"
                        disabled={isLoading}
                    >
                        {isLoading ? "Logging in..." : "Sign In"}
                    </button>
                </form>

                <p className="mt-5 text-center text-gray-600 text-sm">
                    Don’t have an account?{" "}
                    <button
                        onClick={() => {
                            onClose();
                            onOpenRegister();
                        }}
                        className="text-indigo-500 font-medium hover:underline cursor-pointer"
                    >
                        Sign Up
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginModal;
