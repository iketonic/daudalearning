import { Request, Response } from 'express';
import { getSession } from '@/lib/auth'

export default async function session(req: Request, res: Response) {
    const session = await getSession(req)

    if (!session) res.status(401).json({ message: "Unauthorized" })

    return res.json(session)
}