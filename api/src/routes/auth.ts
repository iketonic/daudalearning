import { Router } from "express";
import loginController from "../controllers/auth/login";

const route = Router()

route.post("/login", loginController)

export default route;