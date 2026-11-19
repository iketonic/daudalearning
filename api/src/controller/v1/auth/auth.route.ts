import { Router } from "express";
import session from "../session.controller";
import loginController from "./login.controller";

const route = Router()

route.post("/login", loginController)

export default route;