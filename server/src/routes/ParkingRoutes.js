import { Router } from "express";
import { authorizeRoles } from "../middleware/AuthMiddleware.js";
import { parkings } from "../controllers/ParkingControllers.js";
import rateLimiter from "../middleware/rateLimiter.js";


const router = Router();

router.get("/parkings",rateLimiter(30,300), parkings);

export default router;