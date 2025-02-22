import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import LoginModal from "../pages/LoginModal";
import RegisterModal from "../pages/RegisterModal";
import { useAuth } from "../contexts/AuthContextProvider";
import toast from "react-hot-toast";

function Navbar() {
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [mobileMenu, setMobileMenu] = useState(false);

    function logout() {
        setAuth({});
        localStorage.removeItem("user");
        navigate("/");
        toast.success("Logged out successfully!");
    }

    return (
        <>
            <nav className="bg-gradient-to-r from-teal-800 via-gray-800 to-charcoal-800 text-white px-6 py-5 sm:py-3 md:py-3 shadow-xl fixed top-0 w-full z-50">
                <div className="w-full max-w-[1400px] mx-auto flex justify-between items-center">
                    <Link
                        to="/"
                        className="text-4xl py-1 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-cyan-600 to-blue-500 tracking-wide hover:text-gray-200 transition-all duration-300 ease-in-out"
                    >
                        <span>PrimeBlog</span>
                    </Link>

                    {auth?.access_token && (
                        <div className="font-medium italic text-white md:flex hidden items-center space-x-3 bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 p-1 rounded-lg shadow-lg">
                            <div className="flex items-center space-x-2">
                                <p className="text-xl font-semibold">
                                    Welcome,
                                </p>
                                <p className="text-lg font-bold">
                                    {auth?.user?.fullName}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="md:flex items-center space-x-6">
                        {!auth?.access_token ? (
                            <>
                                <div className="relative">
                                    <button
                                        className="hidden md:block px-6 py-2 mx-2 text-black font-semibold rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-cyan-500/50 border border-cyan-400 overflow-hidden cursor-pointer"
                                        onClick={() => setLoginOpen(true)}
                                    >
                                        <span className="absolute inset-0 bg-white opacity-10 rounded-lg"></span>
                                        🚀 Sign In
                                    </button>

                                    <button
                                        className="md:hidden mt-2 cursor-pointer"
                                        onClick={() =>
                                            setMobileMenu(!mobileMenu)
                                        }
                                    >
                                        <GiHamburgerMenu className="text-3xl text-black" />
                                    </button>

                                    {mobileMenu && (
                                        <div className="absolute top-full right-0 mt-2 w-40 bg-white shadow-md rounded-lg p-3 md:hidden">
                                            <button
                                                className="w-full text-black font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 transition-all duration-300 cursor-pointer"
                                                onClick={() => {
                                                    setLoginOpen(true);
                                                    setMobileMenu(false);
                                                }}
                                            >
                                                🚀 Sign In
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="relative">
                                {auth?.access_token && (
                                    <div className="h-full">
                                        <button
                                            className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                                            onClick={() => setShowMenu(true)}
                                        >
                                            <img
                                                src={auth?.user?.profile}
                                                alt="Profile"
                                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-400 hover:ring-4 transition-all duration-200"
                                            />
                                        </button>

                                        <div
                                            className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-500 ${
                                                showMenu
                                                    ? "opacity-100 visible"
                                                    : "opacity-0 invisible"
                                            }`}
                                            onClick={() => setShowMenu(false)}
                                        >
                                            <div
                                                className={`fixed top-0 
                                                    ${showMenu ? "translate-x-0" : "md:-translate-x-0 md:translate-x-full -translate-x-full"}
                                                        md:right-0 left-0 md:left-auto
                                                        md:w-[80%] w-[75%] max-w-sm h-screen
                                                      bg-gray-900/90 backdrop-blur-lg p-5
                                                        z-50 shadow-lg transition-transform duration-500 ease-in-out
                                                        overflow-y-auto`}
                                                onClick={(e) =>
                                                    e.stopPropagation()
                                                }
                                            >
                                                <button
                                                    className="absolute top-4 right-4 text-gray-300 hover:text-white transition-all duration-300 text-2xl cursor-pointer"
                                                    onClick={() =>
                                                        setShowMenu(false)
                                                    }
                                                >
                                                    ✕
                                                </button>

                                                <span className="flex items-center justify-center mt-15 space-x-2 focus:outline-none">
                                                    <img
                                                        src={
                                                            auth?.user?.profile
                                                        }
                                                        alt="Profile"
                                                        className="w-32 h-32 rounded-full object-cover ring-2 ring-gray-400 hover:ring-4 transition-all duration-200"
                                                    />
                                                </span>

                                                <div className="w-full text-xl text-center py-4 font-medium">
                                                    <p>
                                                        {auth?.user?.fullName}
                                                    </p>
                                                </div>

                                                <div className="flex flex-col">
                                                    <ul className="mt-3 space-y-3 mb-10">
                                                        {auth?.user?.role ===
                                                            "admin" && (
                                                            <li>
                                                                <Link
                                                                    to="/dashboard"
                                                                    className="text-gray-300 font-medium px-4 py-3 hover:bg-blue-500 hover:text-white transition-all rounded-lg flex items-center space-x-2"
                                                                    onClick={() =>
                                                                        setShowMenu(
                                                                            false
                                                                        )
                                                                    }
                                                                >
                                                                    📊{" "}
                                                                    <span>
                                                                        Dashboard
                                                                    </span>
                                                                </Link>
                                                            </li>
                                                        )}
                                                        <li>
                                                            <Link
                                                                to="/my-blogs"
                                                                className="text-gray-300 font-medium px-4 py-3 hover:bg-blue-500 hover:text-white transition-all rounded-lg flex items-center space-x-2"
                                                                onClick={() =>
                                                                    setShowMenu(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                📜{" "}
                                                                <span>
                                                                    My Blogs
                                                                </span>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                to="/create"
                                                                className="text-gray-300 font-medium px-4 py-3 hover:bg-blue-500 hover:text-white transition-all rounded-lg flex items-center space-x-2"
                                                                onClick={() =>
                                                                    setShowMenu(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                ✏️{" "}
                                                                <span>
                                                                    Write Blog
                                                                </span>
                                                            </Link>
                                                        </li>
                                                        <li>
                                                            <Link
                                                                to="/profile/update"
                                                                className="text-gray-300 font-medium px-4 py-3 hover:bg-blue-500 hover:text-white transition-all rounded-lg flex items-center space-x-2"
                                                                onClick={() =>
                                                                    setShowMenu(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                📝{" "}
                                                                <span>
                                                                    Update
                                                                    Profile
                                                                </span>
                                                            </Link>
                                                        </li>
                                                    </ul>

                                                    <button
                                                        onClick={logout}
                                                        className="w-full text-gray-300 font-medium text-center px-4 py-3 bg-red-500 hover:bg-red-600 hover:text-gray-200 transition-all rounded-lg cursor-pointer space-x-2"
                                                    >
                                                        🔒 <span>Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setLoginOpen(false)}
                onOpenRegister={() => setRegisterOpen(true)}
            />

            <RegisterModal
                isOpen={isRegisterOpen}
                onClose={() => setRegisterOpen(false)}
                onOpenLogin={() => setLoginOpen(true)}
            />
        </>
    );
}

export default Navbar;
