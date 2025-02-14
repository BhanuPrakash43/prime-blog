import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContextProvider";
import { GiHamburgerMenu } from "react-icons/gi";
import LoginModal from "../pages/LoginModal";
import RegisterModal from "../pages/RegisterModal";
import { RxCross1 } from "react-icons/rx";

function Navbar() {
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    function toggleMobileMenu() {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    }

    function closeMobileMenu() {
        setIsMobileMenuOpen(false);
    }

    function logout() {
        setAuth({});
        localStorage.removeItem("user");
        navigate("/");
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !event.target.closest(".mobile-menu")
            ) {
                setDropdownOpen(false);
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        setDropdownOpen(false);
    }, [navigate]);

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

                    {/* Desktop Welcome Message */}
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

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white focus:outline-none cursor-pointer"
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? (
                            <RxCross1 className="text-3xl text-black" />
                        ) : (
                            <GiHamburgerMenu className="text-3xl text-black" />
                        )}
                    </button>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {!auth?.access_token ? (
                            <button
                                className="relative px-6 py-2 mx-2 text-white font-semibold rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-cyan-500/50 border border-cyan-400 overflow-hidden cursor-pointer"
                                onClick={() => setLoginOpen(true)}
                            >
                                <span className="absolute inset-0 bg-white opacity-10 rounded-lg"></span>
                                🚀 Sign In
                            </button>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                {auth?.access_token && (
                                    <button
                                        onClick={() =>
                                            setDropdownOpen(!dropdownOpen)
                                        }
                                        className="flex items-center space-x-2 focus:outline-none cursor-pointer"
                                    >
                                        <img
                                            src={auth?.user?.profile}
                                            alt="Profile"
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-400 hover:ring-4 transition-all duration-200"
                                        />
                                    </button>
                                )}

                                {dropdownOpen && (
                                    <ul className="absolute right-0 mt-3 bg-white backdrop-blur-sm text-black shadow-lg rounded-lg w-48 z-50 border border-gray-200">
                                        <li>
                                            <Link
                                                to="/create"
                                                className="text-gray-800 font-medium px-4 py-3 hover:bg-blue-500 hover:text-white transition-all rounded-t-lg flex items-center space-x-2"
                                                onClick={() =>
                                                    setDropdownOpen(false)
                                                }
                                            >
                                                <span>Write Blog</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/my-blogs"
                                                className="text-gray-800 font-medium px-4 py-3 hover:bg-blue-500 hover:text-white transition-all flex items-center space-x-2"
                                                onClick={() =>
                                                    setDropdownOpen(false)
                                                }
                                            >
                                                <span>My Blogs</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <button
                                                onClick={logout}
                                                className="w-full text-gray-800 font-medium text-left px-4 py-3 hover:bg-red-500 hover:text-white transition-all rounded-b-lg cursor-pointer flex items-center space-x-2"
                                            >
                                                <span>Logout</span>
                                            </button>
                                        </li>
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden absolute right-8 mt-3 bg-white backdrop-blur-sm text-black shadow-lg rounded-lg w-48 z-50 border border-gray-200 transition-all duration-300 transform origin-top-right scale-100 mobile-menu">
                        {!auth?.access_token ? (
                            <button
                                className="relative w-[80%] mx-auto my-4 px-6 py-2 text-white text-center font-semibold rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-cyan-500/50 border border-cyan-400 overflow-hidden cursor-pointer flex items-center justify-center"
                                onClick={() => {
                                    setLoginOpen(true);
                                    setIsMobileMenuOpen(false);
                                }}
                            >
                                <span className="absolute inset-0 bg-white opacity-10 rounded-lg"></span>
                                <span className="relative z-10">
                                    🚀 Sign In
                                </span>
                            </button>
                        ) : (
                            <>
                                {/* Mobile Welcome Message */}
                                <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700 text-white font-medium text-center px-6 py-2 rounded-t-lg shadow-lg hover:shadow-xl transition-all duration-300">
                                    <span>Welcome,</span>
                                    <p className="font-semibold text-xl">
                                        {auth?.user?.fullName}
                                    </p>
                                </div>

                                <Link
                                    to="/create"
                                    className="text-gray-800 font-medium px-4 py-3 hover:bg-blue-500 hover:text-white transition-all flex items-center space-x-2"
                                    onClick={closeMobileMenu}
                                >
                                    <span>Write Blog</span>
                                </Link>
                                <Link
                                    to="/my-blogs"
                                    className="text-gray-800 font-medium px-4 py-3 hover:bg-blue-500 hover:text-white transition-all flex items-center space-x-2"
                                    onClick={closeMobileMenu}
                                >
                                    <span>My Blogs</span>
                                </Link>
                                <button
                                    onClick={logout}
                                    className="w-full text-gray-800 font-medium text-left px-4 py-3 hover:bg-red-500 hover:text-white transition-all rounded-b-lg cursor-pointer flex items-center space-x-2"
                                >
                                    <span>Logout</span>
                                </button>
                            </>
                        )}
                    </div>
                )}
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
