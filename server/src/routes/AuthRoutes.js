import { Router } from "express";
import { Register, login } from "../controllers/AuthControllers.js";
import rateLimiter from "../middleware/rateLimiter.js";

const router = Router();

router.post("/register", rateLimiter(5, 15 * 15 * 1000),Register);
router.post("/login", rateLimiter(5, 15 * 15 * 1000), login);

export default router;