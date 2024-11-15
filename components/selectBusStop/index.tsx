"use client";
import { BusStop } from "@/lib/types";

import { BusStopCombobox } from "./BusStopCombobox";
import { H1 } from "../shared/headers";

export default function SelectBusStops({ selectedBusStop, setSelectedBusStop }: { selectedBusStop: BusStop | undefined, setSelectedBusStop: (busStop: BusStop) => void }) {

    return (
        <div className="space-y-2">
            <H1>2. Select Bus Stop</H1>
            <BusStopCombobox
                onSelect={(busStop) => {
                    setSelectedBusStop(busStop);
                }}
                value={selectedBusStop}
            />
        </div>
    );
}