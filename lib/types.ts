import { BusStop as PrismaBusStop } from '@prisma/client'

export type BusStop = PrismaBusStop

export interface BusArrivalResponse {
    BusStopCode: string
    Services: BusService[]
}

export type ServiceNo = string

export interface BusService {
    ServiceNo: ServiceNo
    Operator: string
    NextBus: BusArrivalInfo
    NextBus2: BusArrivalInfo
    NextBus3: BusArrivalInfo
}

export interface BusArrivalInfo {
    OriginCode: string
    DestinationCode: string
    EstimatedArrival: string
    Monitored: number
    Latitude: string
    Longitude: string
    VisitNumber: string
    Load: string
    Feature: string
    Type: string
}

export interface SetupFormData {
    walkingTime: number;
    busStop: BusStop;
    busServices: ServiceNo[];
}
