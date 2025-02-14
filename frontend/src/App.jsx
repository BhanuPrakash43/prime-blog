import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import Layout from "./components/Layout";
import MyBlogs from "./pages/MyBlogs";
import SingleBlog from "./pages/SingleBlog";
import Home from "./pages/Home";
import CreateBlog from "./pages/CreateBlog";
import UpdateBlog from "./pages/UpdateBlog";
import AuthContextProvider from "./contexts/AuthContextProvider";

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="create" element={<CreateBlog />} />
            <Route path="my-blogs" element={<MyBlogs />} />
            <Route path="blog/:id" element={<SingleBlog />} />
            <Route path="/update/:id" element={<UpdateBlog />} />
        </Route>
    )
);

function App() {
    return (
        <AuthContextProvider>
            <RouterProvider router={router} />
        </AuthContextProvider>
    );
}
export default App;
