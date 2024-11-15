import getBusStops from "@/lib/db/queries/getBusStops";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const search = searchParams.get('search');
        
        if (!search) {
            return NextResponse.json({
                success: false,
                message: "Search parameter is required",
                data: null
            }, { status: 400 });
        }

        const busStops = await getBusStops(search);
        
        return NextResponse.json({
            success: true,
            message: "Bus stops fetched successfully",
            data: busStops || []
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