import Redis from 'ioredis';

export default class redis extends Redis {
    constructor(db: number) {
        super({
            host: process.env.CACHE_HOST,
            port: 6379,
            db,
        })
    }
}

export enum db {
    SESSION_MANAGEMENT
}

/**
 * DB Number:
 *  - 0: Session Management
 */