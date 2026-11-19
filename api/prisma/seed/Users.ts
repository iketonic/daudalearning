import { prisma } from "../seeds";
import crypto from 'crypto'

export default async function Users() {
    // Student
    const dummy = await prisma.user.upsert({
        where: { email: "dummy@test.com" },
        update: {},
        create: {
            id: "457e8dc2-f45f-4135-b731-618c32298a9a",
            email: "dummy@test.com",
            name: "Dummy Account",
            password: "$2a$12$M7O0iN8cpt9Xr2xq7C35Lu2EcV6M9P6cd73MDFwdNeYJGwogLo4qW",
            disabled: false,
            emailVerified: new Date(),
            lastLogin: new Date(),
        }
    })

    await prisma.profile.upsert({
        where: { id: dummy.id },
        update: {},
        create: {
            id: dummy.id,
            type: "student",
            username: "student",
            image: ""
        }
    })
}