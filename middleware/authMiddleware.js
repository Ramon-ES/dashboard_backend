// middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
	const token = req.headers.authorization?.split(" ")[1];
	if (!token) return res.status(401).json({ message: "Unauthorized" });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = {
			id: decoded.id, // user ID
			company: decoded.company, // <- make sure this is present in token!
			role: decoded.role, // ✅ add this line!
		};
		next();
	} catch (err) {
		return res.status(401).json({ message: "Invalid token" });
	}
};

export const requireAdmin = (req, res, next) => {
	if (req.user?.role !== "admin") {
		return res.status(403).json({ error: "Admin access required" });
	}
	next();
};
