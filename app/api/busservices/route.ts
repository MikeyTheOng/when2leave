import { getBusArrival } from "@/lib/constants/apis";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ServiceNo } from "@/lib/types";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const busStopCode = searchParams.get('busStopCode');
        
        if (!busStopCode) {
            return NextResponse.json({
                success: false,
                message: "Bus stop code is required",
                data: null
            }, { status: 400 });
        }

        const result = await getBusArrival(busStopCode);
        console.log("Result", result);
        
        if (!result || !result.Services) {
            return NextResponse.json({
                success: false,
                message: "Invalid response from bus service",
                data: null
            }, { status: 500 });
        }

        const busServiceNumbers: ServiceNo[] = result.Services.map(service => service.ServiceNo)
            .sort((a, b) => {
                const numA = parseInt(a.replace(/\D/g, ''));
                const numB = parseInt(b.replace(/\D/g, ''));
                return numA - numB;
            });
        
        return NextResponse.json({
            success: true,
            message: "Bus services fetched successfully",
            data: busServiceNumbers
        });
    } catch (error) {
        console.error("Failed to fetch bus stops", error);
        return NextResponse.json({
            success: false,
            message: "Failed to fetch bus stops",
            data: null
        }, { status: 500 });
    }
}