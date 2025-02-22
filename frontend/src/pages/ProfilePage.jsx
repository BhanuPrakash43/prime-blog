import React, { useEffect, useState } from "react";
import { FaUser, FaLock, FaCamera } from "react-icons/fa";
import toast from "react-hot-toast";
import Footer from "../components/Footer";
import { useAuth } from "../contexts/AuthContextProvider";
import { BASE_URL } from "../constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
    const navigate = useNavigate();
    const { auth, setAuth } = useAuth() || {};
    const access_token = auth?.access_token;

    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [name, setName] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const user = auth?.user;
    const userId = auth?.user?._id;

    useEffect(() => {
        if (user) {
            setName(user.fullName);
            setImagePreview(user.profile || "");
        }
    }, [user]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullName", name);
        if (oldPassword) formData.append("oldPassword", oldPassword);
        if (newPassword) formData.append("newPassword", newPassword);
        if (profileImage) formData.append("profile", profileImage);

        try {
            const response = await axios.patch(
                `${BASE_URL}/user/profile/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            if (response.status === 200) {
                toast.success(response.data.message);

                setAuth((prev) => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        fullName: response.data.user.fullName,
                        profile: response.data.user.profile,
                    },
                }));

                setOldPassword("");
                setNewPassword("");

                setProfileImage(null);
            }
        } catch (error) {
            console.error(
                "Error updating profile:",
                error.response?.data || error.message
            );
            toast.error("Failed to update the profile.");
        }
    };

    const handleProfileDelete = async (e) => {
        e.preventDefault();

        const confirmed = window.confirm(
            "Are you sure you want to delete your account? You cannot revert this action."
        );
        if (!confirmed) return;

        if (!access_token) {
            toast.error("You must be logged in to delete your account.");
            return;
        }

        try {
            const response = await axios.delete(
                `${BASE_URL}/user/profile/delete/${userId}`,
                {
                    headers: { Authorization: `Bearer ${access_token}` },
                }
            );

            if (response.status === 200) {
                setAuth(null);
                localStorage.removeItem("user");
                navigate("/");

                toast.success(response.data.message);
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error(
                error.response?.data?.message || "Error deleting account."
            );
        }
    };

    return (
        <>
            <div className="flex flex-col min-h-screen bg-gray-900 text-white">
                <div className="w-[90%] sm:w-[80%] md:w-[70%] lg:w-[60%] xl:max-w-2xl mx-auto mt-30 md:mt-[100px] p-4 py-6 md:p-6 rounded-xl shadow-lg flex-1 bg-gray-900">
                    <h1 className="text-3xl font-bold text-center mb-6">
                        Update Your Profile
                    </h1>
                    <form className="space-y-6">
                        <div className="relative w-32 h-32 mx-auto">
                            <label
                                htmlFor="profileImage"
                                className="cursor-pointer group"
                            >
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-600 group-hover:border-blue-500">
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition">
                                        <FaCamera className="text-white text-2xl" />
                                    </div>
                                </div>
                            </label>
                            <input
                                type="file"
                                id="profileImage"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>

                        <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg">
                            <FaUser className="text-gray-400 mr-3" />
                            <input
                                type="text"
                                placeholder="Update Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                            />
                        </div>

                        <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg">
                            <FaLock className="text-gray-400 mr-3" />
                            <input
                                type="password"
                                placeholder="Old Password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                            />
                        </div>

                        <div className="flex items-center bg-gray-800 px-4 py-3 rounded-lg">
                            <FaLock className="text-gray-400 mr-3" />
                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-transparent outline-none text-white placeholder-gray-500"
                            />
                        </div>

                        <div className="w-full flex space-x-4">
                            <button
                                className="w-[50%] py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition cursor-pointer"
                                onClick={handleUpdateProfile}
                            >
                                Update Profile
                            </button>
                            <button
                                className="w-[50%] py-3 text-white font-semibold rounded-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 transition cursor-pointer"
                                onClick={handleProfileDelete}
                            >
                                Delete Account
                            </button>
                        </div>
                    </form>
                </div>

                <div className="w-full mt-10">
                    <Footer />
                </div>
            </div>
        </>
    );
}

export default ProfilePage;
