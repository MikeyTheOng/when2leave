import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'

// Load .env.local file
config({ path: '.env.local' })

const prismaClientSingleton = () => {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    // Ensure the MongoDB URI contains a database name
    const uri = process.env.MONGODB_URI;
    if (!uri.includes('/?') && !uri.split('/').slice(-1)[0]) {
        throw new Error('MongoDB URI must include a database name');
    }
    
    return new PrismaClient({
        log: ['error', 'warn'],
        datasources: {
            db: {
                url: uri
            }
        }
    })
}

declare global {
    // eslint-disable-next-line no-var
    var prisma: undefined | ReturnType<typeof prismaClientSingleton>
}

const prisma = globalThis.prisma ?? prismaClientSingleton()

export { prisma }

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma