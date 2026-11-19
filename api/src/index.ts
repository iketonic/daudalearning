import express, { Router } from 'express';
import { createServer } from 'http';
import logger from './logger';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';
import onFinished from "on-finished";

const app = express();
const server = createServer(app);

// Body Parsing
app.use(express.json())
app.use(express.urlencoded({ limit: "20mb", extended: true }))

const corsOptions: CorsOptions = {
    origin: process.env.ORIGIN,
    credentials: true
}

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