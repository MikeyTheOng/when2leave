import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export default async function getBusStops(search: string) {
    try {
        const result = await prisma.busStop.findMany({
            where: {
                OR: [
                    { BusStopCode: { contains: search, mode: 'insensitive' } },
                    { Description: { contains: search, mode: 'insensitive' } },
                    // { RoadName: { contains: search, mode: 'insensitive' } }
                ]
            },
            take: 15
        });
        return result;
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            console.error("Error details:", {
                message: error.message,
                code: error.code,
                meta: error.meta
            });
        } else {
            console.error("Error fetching bus stops:", error);
        }
        return [];
    }
}
