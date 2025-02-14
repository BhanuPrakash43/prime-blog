import jwt from "jsonwebtoken";
import User from "../models/User.model.js";

async function requireAuth(req, res, next) {
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

        const user = await User.findById(decoded._id).select("_id");
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: "You are not authorized." });
    }
}

export default requireAuth;
