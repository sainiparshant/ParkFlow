import { Router } from "express";
import { Register, login } from "../controllers/UserControllers.js";

const router = Router();

router.post("/register", Register);
router.post("/login", login);

export default router;