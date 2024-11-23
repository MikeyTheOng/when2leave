"use client";
import { useFormContext } from "react-hook-form";
import { BusStop } from "@/lib/types";
import { BusStopCombobox } from "./BusStopCombobox";
import { H2 } from "../shared/headers";

export default function SelectBusStops() {
    const { setValue, watch } = useFormContext();
    const selectedBusStop = watch("busStop");

    return (
        <div className="space-y-2">
            <H2>2. Select Bus Stop</H2>
            <BusStopCombobox
                onSelect={(busStop: BusStop) => {
                    setValue("busStop", busStop);
                    setValue("busServices", []);
                }}
                value={selectedBusStop}
            />
        </div>
    );
}