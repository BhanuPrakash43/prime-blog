import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ error: "Auth token missing" });
    }

    const [bearerString, token] = authorization.split(" ");

    if (bearerString !== "Bearer") {
        return res.status(401).json({ error: "Bearer token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        if (!decoded || !decoded._id) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const user = await User.findById(decoded._id).select("_id role");
        if (!user) {
            return res
                .status(401)
                .json({ error: "Unauthorized: User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "You are not authorized." });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        await requireAuth(req, res, async () => {
            if (!req.user || req.user.role !== "admin") {
                return res
                    .status(403)
                    .json({ message: "Unauthorized: User is not and admin" });
            }
            next();
        });
    } catch (error) {
        return res.status(error.status || 500).json({ message: error.message });
    }
};

export { requireAuth, isAdmin };
