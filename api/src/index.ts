import express from 'express';
import { createServer } from 'http';
import logger from './logger';
import cors, { CorsOptions } from 'cors';
import cookieParser from 'cookie-parser';

import root from './routes/root'
import { Logger } from './middlewares/logging';
import { GeneralError } from './middlewares/errors';

const app = express();
const server = createServer(app);

// Body Parsing
app.use(express.json())
app.use(express.urlencoded({ limit: "20mb", extended: true }))

// Debug logging
app.use(Logger);

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
app.use("/", root)

// Catch everything else and send back a 404 with no body
app.all("*fallback", (req, res) => res.status(404).send())

// Error handler middleware
app.use(GeneralError)

const PORT = process.env.PORT || 8882;
const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, () => {
    logger.info(`API running on port ${PORT}`);
});