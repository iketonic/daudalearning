import express, { NextFunction, Router, Request, Response } from 'express';
import { createServer } from 'http';
import logger from './logger';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import onFinished from "on-finished";

import version1 from './controller/v1/version1'

const app = express();
const server = createServer(app);

// Body Parsing
app.use(express.json())
app.use(express.urlencoded({ limit: "20mb", extended: true }))

// Debug logging
app.use(async (req, res, next) => {
    const start = Date.now();
    onFinished(res, (err, msg) => {
        logger.info(`${req.method} ${req.url} ${res.statusCode} in ${Date.now() - start}ms`);
    })    
    next();
});

// Cookie parser
app.use(cookieParser())

// Cross Origin control
app.use(cors({
    origin: process.env.ORIGIN,
    credentials: true
}))

// Disable "X-Powered-By: express" header
app.disable("x-powered-by")

// API Versions
app.use("/v1", version1)

// Catch everything else and send back a 404 with no body
app.all("*fallback", (req, res) => res.status(404).send())

// Catch errors, display Internal Server Error, and log stack trace
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.error(err.stack)
    res.status(500).json({ message: "Internal Server Error" })
});

const PORT = process.env.PORT || 8882;
const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, () => {
    logger.info(`API running on port ${PORT}`);
});