import express from "express";
import { loginController } from "../controllers";

const router = express.Router();

router.use("/login", loginController);
export default router;