import express, { Router } from 'express';
import { createServer } from 'http';
import logger from './logger';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';

const app = express();
const server = createServer(app);

// Body Parsing
app.use(express.json())
app.use(express.urlencoded({ limit: "20mb", extended: true }))

const corsOptions: CorsOptions = {
    origin: process.env.ORIGIN,
    credentials: true
}

if (process.env.NODE_ENV === "development") app.use(async (req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    if (req.body) logger.info(req.body)
    return next();
});

// Cookie parser
app.use(cookieParser())

// Cross Origin control
app.use(cors(corsOptions))

// Disable "X-Powered-By: express" header
app.disable("x-powered-by")

const PORT = process.env.PORT || 8882;
const HOST = process.env.HOST || "0.0.0.0";

// Catch everything else and send back a 404 with no body
app.all("*fallback", (req, res) => res.status(404).send())

server.listen(PORT, () => {
    logger.info(`API running on port ${PORT}`);
});