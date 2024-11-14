import { config } from 'dotenv';
import path from 'path';

// Load .env.local from project root
config({ path: path.resolve(process.cwd(), '.env.local') });

import { MongoClient } from 'mongodb';
import fs from 'fs';

interface BusStopData {
    [code: string]: [number, number, string, string];
}

interface BusStop {
    BusStopCode: string;
    Longitude: number;
    Latitude: number;
    Description: string;
    RoadName: string;
}

async function importBusStops(): Promise<void> {
    let client: MongoClient | undefined;

    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not defined in the environment variables');
        }
        client = new MongoClient(uri);

        await client.connect();
        const db = client.db('when2leave');
        const collection = db.collection<BusStop>('bus_stops');

        // Read and parse the JSON file
        const data: BusStopData = JSON.parse(fs.readFileSync('data/stops.json', 'utf8'));

        // Transform the data
        const busStops: BusStop[] = Object.entries(data).map(([code, details]) => ({
            BusStopCode: code,
            Longitude: details[0],
            Latitude: details[1],
            Description: details[2],
            RoadName: details[3]
        }));

        // Optional: Clear existing data
        await collection.deleteMany({});

        // Insert the documents
        const result = await collection.insertMany(busStops);
        console.log(`Successfully inserted ${result.insertedCount} bus stops`);
    } catch (error) {
        console.error('Error:', error instanceof Error ? error.message : String(error));
    } finally {
        await client?.close();
    }
}

importBusStops(); 