const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ success: false, message: "Authorization token missing or invalid format." });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
             return res.status(401).json({ success: false, message: "Authorization token missing." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret");
        req.user = decoded; // Contains user ID
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: "Invalid or expired token." });
    }
};

module.exports = { authenticate };
