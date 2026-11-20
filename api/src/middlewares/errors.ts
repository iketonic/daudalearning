import logger from "@/logger";
import { Request, Response, NextFunction } from "express";
import onFinished from "on-finished";

// Catch errors, display Internal Server Error, and log stack trace
export function GeneralError(err: Error, req: Request, res: Response, next: NextFunction)  {
    if (res.headersSent) return;
    logger.error(err.stack)
    res.status(500).json({ message: "Internal Server Error" })
};