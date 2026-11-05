import { hostname } from 'node:os';
import pino from 'pino';

const logger = pino({
    level: "info",
    timestamp: pino.stdTimeFunctions.isoTime,
    base: { pid: process.pid, hostname: hostname() }
})

export default logger;