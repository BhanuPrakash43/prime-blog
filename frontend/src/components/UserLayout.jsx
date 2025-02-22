import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

function UserLayout() {
    return (
        <>
            <Navbar />
            <main>
                <Outlet />
            </main>
        </>
    );
}
export default UserLayout;
