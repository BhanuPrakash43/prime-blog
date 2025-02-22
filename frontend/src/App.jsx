import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import UserLayout from "./components/UserLayout";
import AdminLayout from "./components/dashboard/AdminLayout";
import Home from "./pages/Home";
import MyBlogs from "./pages/MyBlogs";
import SingleBlog from "./pages/SingleBlog";
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./pages/UpdateBlog";
import ProfilePage from "./pages/ProfilePage";
import AuthContextProvider from "./contexts/AuthContextProvider";
import { Toaster } from "react-hot-toast";
import DashboardHome from "./pages/dashboard/DashboardHome";
import AllPosts from "./pages/dashboard/AllPosts";
import AllUsers from "./pages/dashboard/AllUsers";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route path="/" element={<UserLayout />}>
                <Route index element={<Home />} />
                <Route path="create" element={<CreateBlog />} />
                <Route path="my-blogs" element={<MyBlogs />} />
                <Route path="blog/:id" element={<SingleBlog />} />
                <Route path="/update/:id" element={<UpdateBlog />} />
                <Route path="/profile/update" element={<ProfilePage />} />
            </Route>
            <Route path="/dashboard" element={<AdminLayout />}>
                <Route index element={<DashboardHome />} />
                <Route path="all-users" element={<AllUsers />} />
                <Route path="all-posts" element={<AllPosts />} />
            </Route>
        </Route>
    )
);

function App() {
    return (
        <AuthContextProvider>
            <Toaster />
            <RouterProvider router={router} />
        </AuthContextProvider>
    );
}
export default App;
