import { BusArrivalResponse } from "../types";

// Next.js Route Handlers
export const getBusStops = async (search: string) => {
    const response = await fetch(`/api/busstops?search=${search}`);
    return response.json();
}

export const getBusServices = async (busStopCode: string) => {
    const response = await fetch(`/api/busservices?busStopCode=${busStopCode}`);
    return response.json();
}

// External APIs
export const getBusArrival = async (busStopCode: string): Promise<BusArrivalResponse> => {
    if (!process.env.AccountKey) {
        console.error("ACCOUNT_KEY is not set");
        throw new Error("Internal Server Error");
    }
    const response = await fetch(`https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${busStopCode}`, {
        headers: {
            "AccountKey": process.env.AccountKey
        }
    });
    return response.json();
}