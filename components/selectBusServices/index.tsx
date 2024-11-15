import { BusStop, ServiceNo } from "@/lib/types";
import useBusServicesSearch from "@/hooks/useBusServicesSearch";

import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/shadcn/alert";
import { Checkbox } from "@/components/shadcn/checkbox";
import DidNotSelectBusStopWarning from "./didNotSelectBusStopWarning";
import { H1 } from "../shared/headers";
import { Label } from "@/components/shadcn/label";

export default function SelectBusServices({
    selectedBusStop,
    selectedBusServices,
    setSelectedBusServices
}: {
    selectedBusStop: BusStop | undefined,
    selectedBusServices: ServiceNo[] | undefined,
    setSelectedBusServices: (services: ServiceNo[]) => void
}) {
    return (
        <div className="space-y-2">
            <H1>3. Select Bus Services</H1>
            {
                selectedBusStop ? <BusServicesCheckBoxes selectedBusStop={selectedBusStop} /> : <DidNotSelectBusStopWarning />
            }
        </div>
    );
}

const BusServicesCheckBoxes = ({ selectedBusStop }: { selectedBusStop: BusStop }) => {
    const { data: busServices, isLoading, error } = useBusServicesSearch(selectedBusStop) as {
        data: ServiceNo[],
        isLoading: boolean,
        error: unknown
    };
    if (isLoading) return <div>Loading...</div>
    if (error) return <SomethingWentWrong />
    return (<div className="grid grid-cols-4 sm:grid-cols-8 gap-6">
        {busServices.map(service => <div key={service} className="col-span-1 flex items-center gap-2">
            <Checkbox id={`checkbox-${service}`} />
            <Label htmlFor={`checkbox-${service}`}>{service}</Label>
        </div>)}
    </div>)
}

const SomethingWentWrong = () => {
    return (
        <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                Something went wrong while loading bus services. Please try again.
            </AlertDescription>
        </Alert>
    )
}