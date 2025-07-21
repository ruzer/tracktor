import bcrypt from "bcrypt";
import User from "../models/User.js";
export const authenticatePin = async (req, res, next) => {
    const pin = req.headers["x-user-pin"];
    if (!pin) {
        return res
            .status(401)
            .json({ message: "PIN is required in X-User-PIN header." });
    }
    try {
        const user = await User.findByPk(1);
        if (!user) {
            return res.status(401).json({ message: "PIN not set." });
        }
        if (!user.hash) {
            console.error("User found but hash is missing. Data integrity issue.");
            return res
                .status(500)
                .json({ message: "Server error: User hash not found." });
        }
        const match = await bcrypt.compare(pin, user.hash);
        if (match) {
            next();
        }
        else {
            res.status(401).json({ message: "Invalid PIN." });
        }
    }
    catch (error) {
        res
            .status(500)
            .json({ message: "Error authenticating PIN.", error: error.message });
    }
};
//# sourceMappingURL=auth.js.map