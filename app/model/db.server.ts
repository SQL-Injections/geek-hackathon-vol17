import { PrismaClient } from '@prisma/client'
// import dotenv from 'dotenv'

// if (process.env.NODE_ENV !== 'production') {
//     dotenv.config({ path: '.env.develop' })
// } else {
//     dotenv.config()
// }

declare global {
    var __prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient()
} else {
    if (!globalThis.__prisma) {
        globalThis.__prisma = new PrismaClient()
    }
    prisma = globalThis.__prisma
}

export { prisma }
