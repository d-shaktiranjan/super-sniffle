import { Router } from "express";

const router = Router();

const SUPER_SECRET_TOKEN = "lord_js_block_the_main_thread";
const COOKIES_OPTIONS = {
    httpOnly: true,
};

router
    .route("/")
    .post((req, res) => {
        res.cookie("token", SUPER_SECRET_TOKEN, COOKIES_OPTIONS).json({
            success: true,
            message: "Hey lord js, cookie set",
        });
    })
    .get((req, res) => {
        const token = req.cookies.token;
        if (!token) {
            return res
                .status(400)
                .json({ success: false, message: "token not found" });
        }

        if (token != SUPER_SECRET_TOKEN) {
            return res
                .status(400)
                .json({ success: false, message: "Invalid token" });
        }

        res.json({
            success: true,
            message: "Hello Lord JS",
            token,
        });
    });

export default router;
