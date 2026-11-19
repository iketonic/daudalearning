import { UserRole } from '../generated/prisma/client'
import crypto from 'crypto';
import Redis, { db } from './cache';
import { Request, Response } from 'express';
import { OrganisationGroupPoliciesModel } from '../generated/prisma/models';

// General Auth
const secret = process.env.AUTH_SECRET!
const hash_dig: crypto.BinaryToTextEncoding = "hex"
const hash_alg = "sha256"
const hmac_dig: crypto.BinaryToTextEncoding = "hex"
const hmac_alg = "sha512"

// session cookies
export const cookieName = "session-token";
const sessionCookieAge = 60 * 60 * 2; // 2 hours

// Remove ID att from org table
export const getPolices = async ({ id, ...rest }: OrganisationGroupPoliciesModel) => rest

// Returns the user
type user = {
    id: string,
    name: string,
    username: string,
    role: UserRole,
    image: string,
    organisation?: {
        org: string,
        group: string,
        policies: Awaited<ReturnType<typeof getPolices>>
    };
};

// Verify token against HMAC
function verifyHMAC(payload: string) {
    // Verify integrity //

    // Tokens are stored in the format UUID.UNIX_TIMESTAMP.HMAC, all seperated with   //
    // periods (.) and with the parts UUID, and UNIX_TIMESTAMP being in the base46    //
    // format as how Discord does. (I ripped this entire architecture off of discord) //
    // If you feel you can write this system better, be my guest                      //

    // Disect payload into UUID, UNIX_TIMESTAMP, and HMAC parts
    const parts = payload.split(".")

    // The payload is invalid (does not contain all the correct parts)
    if (parts.length !== 3) return false;

    // Connect the parts UUID, and UNIX_TIMESTAMP and create a hash and compare to HMAC
    const uuid_time_hash = crypto.createHash(hash_alg).update(`${parts[0]}.${parts[1]}`).digest(hash_dig)
    const hmac = crypto.createHmac(hmac_alg, secret).update(uuid_time_hash).digest(hmac_dig)

    // Return whether or not they are same -> data has been altered
    return hmac === parts[2]
}

// Generate cryptographically strong session token
function createKey(uuid: string) {
    const uuid_base64 = Buffer.from(uuid, "utf-8").toString("base64")
    const time_base64 = Buffer.from(Date.now().toString(), "utf-8").toString("base64");
    const ut_hash =     crypto.createHash(hash_alg).update(`${uuid_base64}.${time_base64}`).digest("hex")
    const hmac =        crypto.createHmac(hmac_alg, secret).update(ut_hash).digest("hex");

    return {
        token: `${uuid_base64}.${time_base64}.${hmac}`,
        parts: {
            uuid: uuid_base64,
            time: time_base64,
            hash: ut_hash,
            hmac
        }
    }
}

// TODO: Add code to set as cookie when setting cookie

// Create a session
export async function createSession(user: user) {
    const redis = new Redis(db.SESSION_MANAGEMENT)

    // Generate session keys and generate hmac
    const { token, parts } = createKey(user.id)
    
    // Clear old sessions
    await redis.del(parts.uuid)

    // Add token and session data to Redis Cache
    await redis.hset(parts.uuid, parts.time, JSON.stringify(user))

    return { token };
}

// Log out
export async function destroySession(req: Request, res: Response) {
    // Deletes sessionid from cache
    await new Redis(db.SESSION_MANAGEMENT).del(req.cookies[cookieName]);

    // Deletes session cookie
    return res.clearCookie(cookieName)
}

// Get sessions
export async function getSession(req: Request) {
    // Gets the session cookie
    const session = req.cookies[cookieName];

    // If theres no session cookie, return
    if (!session) return;

    // Get session payload from cache
    const redis = new Redis(db.SESSION_MANAGEMENT)

    // Disect session
    const parts = session.split(".")

    // Verify HMAC
    if (!verifyHMAC(session)) return;

    // Get session from cache
    const payload = await redis.hget(parts[0], parts[1])

    // Return if cache comes up empty
    if (!payload) return;
    
    // Return session data from session store
    return JSON.parse(payload) as user;
}