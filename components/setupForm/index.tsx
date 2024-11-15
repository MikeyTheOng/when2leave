"use client";

import { useState } from "react";
import { BusStop, ServiceNo } from "@/lib/types";

import { Button } from "../shadcn/button";
import SetWalkingTime from "../setWalkingTime";
import SelectBusStops from "../selectBusStop";
import SelectBusServices from "../selectBusServices";

export default function SetupForm() {
    const [selectedBusStop, setSelectedBusStop] = useState<BusStop | undefined>(undefined);
    const [selectedBusServices, setSelectedBusServices] = useState<ServiceNo[] | undefined>(undefined);

    return (
        <form className="space-y-2">
            <SetWalkingTime />
            <SelectBusStops selectedBusStop={selectedBusStop} setSelectedBusStop={setSelectedBusStop} />
            <SelectBusServices selectedBusStop={selectedBusStop} selectedBusServices={selectedBusServices} setSelectedBusServices={setSelectedBusServices} />
            <Button type="submit" className="w-full text-white font-bold">Catch The Bus!</Button>
        </form>
    )
}
