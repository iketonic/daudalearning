import logger from "@/logger";
import { Request, Response, NextFunction } from "express";
import onFinished from "on-finished";

export async function Logger(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    onFinished(res, (err, msg) => {
        logger.info(`${req.method} ${req.url} ${res.statusCode} in ${Date.now() - start}ms`);
    })    
    next();
}