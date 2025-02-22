import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import UserRoutes from "./routes/users.route.js";
import BlogRoutes from "./routes/blogs.route.js";
import CommentRoutes from "./routes/comments.route.js";
import DashboardRoutes from "./routes/dashboard.route.js";

dotenv.config();
const app = express();

const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/user", UserRoutes);
app.use("/api/v1/blog", BlogRoutes);
app.use("/api/v1/comment", CommentRoutes);
app.use("/api/v1/dashboard", DashboardRoutes);

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server is running on: http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log("MongoDB connection failed!", err);
    });

app.get("/", (req, res) => {
    res.send("Server is live");
});
