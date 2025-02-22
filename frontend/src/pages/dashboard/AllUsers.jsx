import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { BASE_URL } from "../../constants";
import { useAuth } from "../../contexts/AuthContextProvider";
import useAxiosGet from "../../hooks/useAxiosGet";
import toast from "react-hot-toast";
import axios from "axios";

function AllUsers() {
    const { auth } = useAuth();
    const { access_token } = auth || {};
    const sendToken = !!auth?.access_token;

    const [users, setUsers] = useState([]);

    const { isLoading, data, error } = useAxiosGet({
        endpoint: `${BASE_URL}/dashboard/users`,
        sendToken,
    });

    useEffect(() => {
        if (data?.success) {
            setUsers(data?.users || []);
        }
    }, [data]);

    const handleDeleteUser = async (userId) => {
        if (!userId) {
            toast.error("Invalid user ID.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to delete this user account? You cannot revert this action."
        );
        if (!confirmed) return;

        try {
            const response = await axios.delete(
                `${BASE_URL}/dashboard/users/delete/${userId}`,
                {
                    headers: { Authorization: `Bearer ${access_token}` },
                }
            );

            if (response.status === 200) {
                toast.success(
                    response.data?.message || "User deleted successfully."
                );
                setUsers((prevUsers) =>
                    prevUsers.filter((user) => user._id !== userId)
                );
            }
        } catch (error) {
            console.error("Error deleting account:", error);
            toast.error(
                error.response?.data?.message || "Error deleting account."
            );
        }
    };

    if (isLoading) {
        return (
            <div className=" md:ml-[20%] w-full md:w-[80%]flex flex-col items-center justify-center min-h-[60vh]">
                <p className="mt-4 text-gray-600">Loading your users...</p>
            </div>
        );
    }

    return (
        <div className="md:ml-[20%] w-full md:w-[80%] px-8 pt-[100px] md:pt-[90px] pb-10 overflow-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">User List</h1>

            {users.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                    No users found.
                </div>
            ) : (
                <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
                    <table className="w-full border-collapse hidden md:table">
                        <thead className="bg-gray-100 text-gray-700 text-sm uppercase font-semibold">
                            <tr>
                                <th className="px-4 py-3 text-center">S.No.</th>
                                <th className="px-4 py-3 text-center">Name</th>
                                <th className="px-4 py-3 text-center">Email</th>
                                <th className="px-4 py-3 text-center">Role</th>
                                <th className="px-8 py-3 text-center">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((user, index) => (
                                <tr key={user._id} className="border-b">
                                    <td className="px-4 py-3 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-3 text-center font-medium text-gray-900">
                                        {user.fullName}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {user.email}
                                    </td>
                                    <td className="px-4 py-3 text-center text-gray-700">
                                        {user.role}
                                    </td>
                                    <td className="px-8 py-3 text-center">
                                        <button
                                            onClick={() => {
                                                handleDeleteUser(user._id);
                                            }}
                                            className="text-red-600 hover:text-red-800 bg-red-100 px-3 py-1 rounded-md flex items-center justify-center mx-auto transition cursor-pointer"
                                        >
                                            <FaTrashAlt className="mr-1" />{" "}
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {users.map((user, index) => (
                            <div
                                key={user._id}
                                className="bg-gray-100 p-4 rounded-lg shadow-md"
                            >
                                <h2 className="text-lg font-semibold text-gray-900">
                                    {index + 1}. {user.fullName}
                                </h2>
                                <p className="text-gray-700 text-sm">
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <p className="text-gray-700 text-sm">
                                    <strong>Role:</strong> {user.role}
                                </p>

                                <button
                                    onClick={() => {
                                        handleDeleteUser(user._id);
                                    }}
                                    className="mt-3 text-red-600 hover:text-red-800 bg-red-100 px-3 py-1 rounded-md flex items-center justify-center transition cursor-pointer w-full"
                                >
                                    <FaTrashAlt className="mr-1" /> Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllUsers;
