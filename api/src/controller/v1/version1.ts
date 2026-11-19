import { Router } from "express";

import auth from './auth/auth.route'
import session from "./session.controller";

const route = Router()

route.use("/auth", auth)

route.get("/session", session)

export default route;