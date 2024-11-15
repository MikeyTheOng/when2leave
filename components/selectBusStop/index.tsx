"use client";
import { useFormContext } from "react-hook-form";
import { BusStop } from "@/lib/types";
import { BusStopCombobox } from "./BusStopCombobox";
import { H1 } from "../shared/headers";

export default function SelectBusStops() {
    const { setValue, watch } = useFormContext();
    const selectedBusStop = watch("busStop");

    return (
        <div className="space-y-2">
            <H1>2. Select Bus Stop</H1>
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