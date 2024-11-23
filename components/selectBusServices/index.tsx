import { useFormContext } from "react-hook-form";
import { BusStop, ServiceNo } from "@/lib/types";
import useBusServicesSearch from "@/hooks/useBusServicesSearch";

import { AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/shadcn/alert";
import { Checkbox } from "@/components/shadcn/checkbox";
import DidNotSelectBusStopWarning from "./didNotSelectBusStopWarning";
import { H2 } from "../shared/headers";
import { Label } from "@/components/shadcn/label";

interface FormValues {
    busStop: BusStop;
    busServices: ServiceNo[];
}

export default function SelectBusServices() {
    const { watch, formState: { errors } } = useFormContext<FormValues>();
    const selectedBusStop = watch("busStop");

    return (
        <div className="space-y-2">
            <H2>3. Select Bus Services</H2>
            {selectedBusStop ? (
                <>
                    <BusServicesCheckBoxes selectedBusStop={selectedBusStop} />
                    {errors.busServices && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.busServices.message as string}
                        </p>
                    )}
                </>
            ) : (
                <DidNotSelectBusStopWarning />
            )}
        </div>
    );
}

const BusServicesCheckBoxes = ({ selectedBusStop }: { selectedBusStop: BusStop }) => {
    const { setValue, watch } = useFormContext<FormValues>();
    const selectedBusServices = watch("busServices") || [];

    const { data: busServices, isLoading, error } = useBusServicesSearch(selectedBusStop) as {
        data: ServiceNo[];
        isLoading: boolean;
        error: unknown;
    };

    const handleCheckboxChange = (service: ServiceNo, checked: boolean) => {
        if (checked) {
            setValue("busServices", [...selectedBusServices, service], {
                shouldValidate: true,
                shouldDirty: true,
            });
        } else {
            setValue(
                "busServices",
                selectedBusServices.filter((s) => s !== service),
                {
                    shouldValidate: true,
                    shouldDirty: true,
                }
            );
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <SomethingWentWrong />;

    return (
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-6">
            {busServices.map((service) => (
                <div key={service} className="col-span-1 flex items-center gap-2">
                    <Checkbox
                        id={`checkbox-${service}`}
                        checked={selectedBusServices.includes(service)}
                        onCheckedChange={(checked) => handleCheckboxChange(service, checked as boolean)}
                    />
                    <Label htmlFor={`checkbox-${service}`}>{service}</Label>
                </div>
            ))}
        </div>
    );
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
    );
};