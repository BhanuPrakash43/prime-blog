import React, { useState, useEffect } from "react";
import { FaHome, FaPlusSquare, FaUsers, FaFileAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

function SideNavigation() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isMobile) {
        return (
            <div className="fixed bottom-0 left-0 w-full bg-gray-900 text-white font-medium flex justify-around py-4 shadow-md z-50">
                <Link to="/dashboard" className="flex flex-col items-center">
                    <FaHome className="text-xl" />
                    <span className="text-xs">Dashboard</span>
                </Link>
                <Link
                    to="/dashboard/all-users"
                    className="flex flex-col items-center"
                >
                    <FaUsers className="text-xl" />
                    <span className="text-xs">All Users</span>
                </Link>
                <Link
                    to="/dashboard/all-posts"
                    className="flex flex-col items-center"
                >
                    <FaFileAlt className="text-xl" />
                    <span className="text-xs">All Posts</span>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-gray-900 fixed w-1/5 text-md font-medium text-white h-screen p-5 pt-[80px] md:pt-[100px]">
            <ul className="space-y-4">
                <li>
                    <Link
                        className="flex items-center text-white hover:bg-gray-700 p-2 rounded-md"
                        to="/dashboard"
                    >
                        <FaHome className="mr-3" /> Dashboard
                    </Link>
                </li>
                <li>
                    <Link
                        className="flex items-center text-white hover:bg-gray-700 p-2 rounded-md"
                        to="/dashboard/all-users"
                    >
                        <FaUsers className="mr-3" /> All Users
                    </Link>
                </li>
                <li>
                    <Link
                        className="flex items-center text-white hover:bg-gray-700 p-2 rounded-md"
                        to="/dashboard/all-posts"
                    >
                        <FaFileAlt className="mr-3" /> All Posts
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default SideNavigation;
