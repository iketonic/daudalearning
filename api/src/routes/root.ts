import { Router } from "express";

import auth from './auth'
import session from "../controllers/session";

const route = Router()

route.use("/auth", auth)

route.get("/session", session)

export default route;