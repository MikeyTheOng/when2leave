"use client";

import { useForm, FormProvider } from "react-hook-form";
import { UserTransitConfig } from "@/lib/types";
import { Button } from "../shadcn/button";
import SetWalkingTime from "../setWalkingTime";
import SelectBusStops from "../selectBusStop";
import SelectBusServices from "../selectBusServices";

export default function UserTransitConfigForm() {
    const methods = useForm<UserTransitConfig>({
        defaultValues: {
            walkingTime: 5,
            busStop: undefined,
            busServices: [],
        },
        resolver: (values) => {
            const errors: Record<string, { type: string; message: string }> = {};

            if (!values.busStop) {
                errors.busStop = {
                    type: 'required',
                    message: 'Please select a bus stop'
                };
            }

            if (values.busServices.length === 0) {
                errors.busServices = {
                    type: 'required',
                    message: 'Please select at least 1 bus service'
                };
            }

            return {
                values,
                errors,
            };
        },
    });

    const onSubmit = (data: UserTransitConfig) => {
        localStorage.setItem('userTransitConfig', JSON.stringify(data));
        console.log('Saved transit config to localStorage:', data);
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-2">
                <SetWalkingTime />
                <SelectBusStops />
                <SelectBusServices />
                <Button type="submit" className="w-full text-white font-bold">
                    Catch The Bus!
                </Button>
            </form>
        </FormProvider>
    );
}