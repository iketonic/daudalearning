import { cookieName, createSession, getPolices } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { compareSync } from 'bcrypt-ts';
import { Request, Response } from 'express';
import { z } from 'zod';

export default async function(req: Request, res: Response) {
    const zod = z.object({
        email: z.email().toLowerCase(),
        password: z.string()
    }).safeParse(req.body)

    // Type check user input, return 400 if invalid
    if (!zod.success) return res.status(400).json({ message: "Bad Request" })

    // Extract email and password from input
    const { email, password } = zod.data;

    // Fetch user from database
    const user = await prisma.user.findUnique({ where: { email },
        select: {
            name: true,
            password: true,
            id: true,
            role: true,
            disabled: true,
            profile: {
                select: {
                    image: true,
                    username: true
                }
            }, organisation: {
                include: {
                    policy: true
                }
            }
        }
    })

    // Set status to 403 by default
    res.status(403)

    // Return 403 if the user does not exist
    if (!user) return res.json({ message: "Invalid Email or Password." })

    // Return 403 if the user account is disabled
    if (user.disabled) return res.json({ message: "This account has been disabled." })

    // Return 403 if the account does not use credential-based sign in
    if (!user.password) return res.json({ message: "This account does not use credential-based login in." })
    
    // Check the password to stored hash
    if (!compareSync(password, user.password)) return res.json({ messaeg: "Invalid Email or Password." })

    // Update the users last login time
    await prisma.user.update({
        where: { email },
        data: { lastLogin: new Date() }
    })

    // Create Profile record if there one does not already exist
    if (!user.profile) throw new Error(`User ${user.id} has a User record with no `)

    // Create a session
    const { token } = await createSession({
        id: user.id,
        name: user.name,
        username: user.profile.username,
        role: user.role,
        image: user.profile.image,
        organisation: user.organisation ? {
            org: user.organisation.organisationId,
            group: user.organisation.id,
            policies: await getPolices(user.organisation.policy)
        } : undefined
    })

    // Set response to 200
    res.status(200);

    // Add cookie to response
    res.cookie(cookieName, token)
    res.json({ message: "" })
}