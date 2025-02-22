import SideNavigation from "./SideNavigation";
import Navbar from "../Navbar";
import { useAuth } from "../../contexts/AuthContextProvider";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminLayout() {
    const navigate = useNavigate();
    const { auth } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) return;

        const user = auth?.user;
        if (!user) {
            navigate("/");
        } else if (user?.role !== "admin") {
            navigate("/");
        }

        setLoading(false);
    }, [auth, navigate]);

    if (loading) return <div>Loading...</div>;

    return (
        <>
            <Navbar />
            <div className="flex">
                <SideNavigation />
                <div className="flex-grow">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default AdminLayout;
