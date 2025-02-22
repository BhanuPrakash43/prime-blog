import React, { useEffect, useState } from "react";
import { BASE_URL } from "../../constants";
import useAxiosGet from "../../hooks/useAxiosGet";
import { useAuth } from "../../contexts/AuthContextProvider";

function DashboardHome() {
    const { auth } = useAuth();
    const sendToken = !!auth?.access_token;

    const [users, setUsers] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [comments, setComments] = useState([]);

    const { data, error } = useAxiosGet({
        endpoint: `${BASE_URL}/dashboard`,
        sendToken,
    });

    useEffect(() => {
        if (data && data.success) {
            setUsers(data?.users || []);
            setBlogs(data?.blogs || []);
            setComments(data?.comments || []);
        }
    }, [data]);

    return (
        <div className="md:ml-[20%] w-full md:w-[80%] px-8 pt-[100px] md:pt-[90px]">
            <h2 className="text-2xl font-bold text-black mb-6">Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-blue-600 text-white p-6 rounded-lg shadow-md">
                    <h5 className="text-lg font-semibold">Total Users</h5>
                    <p className="text-2xl">{users ? users.length : "0"}</p>
                </div>

                <div className="bg-green-600 text-white p-6 rounded-lg shadow-md">
                    <h5 className="text-lg font-semibold">Total Blogs</h5>
                    <p className="text-2xl">{blogs ? blogs.length : "0"}</p>
                </div>

                <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
                    <h5 className="text-lg font-semibold">Total Comments</h5>
                    <p className="text-2xl">
                        {comments ? comments.length : "0"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default DashboardHome;
