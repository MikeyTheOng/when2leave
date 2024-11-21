import { getBusArrival } from "@/lib/constants/apis";
import { NextResponse } from "next/server";

// Add this interface before the GET function
interface BusService {
    ServiceNo: string;
    NextBus: { EstimatedArrival: string } | null;
    NextBus2: { EstimatedArrival: string } | null;
    NextBus3: { EstimatedArrival: string } | null;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const busStopCode = searchParams.get('busStopCode');
    
    if (!busStopCode) {
        return NextResponse.json({ error: "Bus stop code is required" }, { status: 400 });
    }
    
    try {
        const busArrivals = await getBusArrival(busStopCode);
        
        if (!busArrivals?.Services) {
            return NextResponse.json({ error: "No bus services found" }, { status: 404 });
        }

        // Transform bus arrivals into a map of service numbers to arrival times
        const formattedArrivals = busArrivals.Services.reduce((acc: Record<string, number[]>, service: BusService) => {
            const now = new Date();
            
            // Extract arrival times from the next 3 buses
            const times = [service.NextBus, service.NextBus2, service.NextBus3]
                // Get estimated arrival time for each bus
                .map(bus => bus?.EstimatedArrival)
                // Remove any null/undefined values
                .filter((time): time is string => Boolean(time))
                // Convert arrival times to minutes from now
                .map(time => {
                    const arrivalTime = new Date(time);
                    return Math.round((arrivalTime.getTime() - now.getTime()) / 60000);
                });
            
            // Example: { "123": [5, 15, 25] } means bus 123 arriving in 5, 15, and 25 minutes
            acc[service.ServiceNo] = times;
            return acc;
        }, {});

        return NextResponse.json(formattedArrivals);
    } catch (error) {
        console.error("Error fetching bus arrivals:", error);
        return NextResponse.json(
            { error: "Failed to fetch bus arrivals" },
            { status: 500 }
        );
    }
}
